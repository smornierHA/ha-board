// Browser-level, fictitious comparison. It does not connect to Home Assistant.
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const output = path.resolve(process.env.GARAGE_BROWSER_OUTPUT || "artifacts/garage-browser");
fs.mkdirSync(output, { recursive: true });
for (const [source, target] of [
  ["src/garage-control-card.js", "artifacts/garage-original-test.js"],
  ["src/candidate/garage-control-card.js", "artifacts/garage-source-test.js"],
]) {
  execFileSync(process.execPath, ["scripts/build_garage.mjs"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, GARAGE_BUILD_SOURCE: path.resolve(source), GARAGE_BUILD_OUTPUT: path.resolve(target) },
  });
}

let chrome = process.env.CHROME_BIN;
if (!chrome) for (const name of ["google-chrome", "chromium", "chromium-browser"]) {
  try { chrome = execFileSync("which", [name], { encoding: "utf8" }).trim(); break; } catch {}
}
if (!chrome) throw Error("No Chrome/Chromium executable available; Garage browser verification not performed.");

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(`${root}${path.sep}`)) { response.writeHead(403).end(); return; }
  try {
    response.setHeader("Content-Type", file.endsWith(".html") ? "text/html; charset=utf-8" : file.endsWith(".js") ? "text/javascript; charset=utf-8" : file.endsWith(".svg") ? "image/svg+xml" : "text/plain");
    response.end(fs.readFileSync(file));
  } catch { response.writeHead(404).end(); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "garage-chrome-"));
const chromeProcess = spawn(chrome, ["--headless=new", "--no-sandbox", "--disable-gpu", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { stdio: ["ignore", "ignore", "pipe"], detached: process.platform !== "win32" });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => reject(Error("Chrome startup timeout")), 20000);
    chromeProcess.on("error", reject);
    chromeProcess.stderr.on("data", (data) => {
      buffer += data;
      const match = buffer.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let serial = 0;
  const pending = new Map();
  const errors = [];
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const item = pending.get(message.id); pending.delete(message.id);
      if (!item) return;
      if (message.error) item.reject(Error(JSON.stringify(message.error))); else item.resolve(message.result);
    } else if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++serial; pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);
  await call("Runtime.enable"); await call("Page.enable");
  await call("Emulation.setDeviceMetricsOverride", { width: 1000, height: 900, deviceScaleFactor: 1, mobile: false });
  const evaluate = async (expression) => {
    const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const waitFor = async (expression) => {
    for (let index = 0; index < 120; index += 1) {
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw Error(`Timeout: ${expression}`);
  };
  const proofs = [];
  const screenshots = new Map();
  for (const source of ["original", "candidate", "bundle"]) {
    await call("Page.navigate", { url: `http://127.0.0.1:${server.address().port}/examples/garage-demo.html?source=${source}` });
    await waitFor("window.demoReady === true");
    await waitFor("Boolean(demo.card.shadowRoot.querySelector('.dialog'))");
    await waitFor("demo.card.shadowRoot.querySelectorAll('picture-entity-demo').length === 1");
    assert.equal(await evaluate("demo.card._config.show_motion_badge"), false);
    assert.equal(await evaluate("demo.card.shadowRoot.querySelectorAll('.camera-tab').length"), 2);
    assert.equal(await evaluate("demo.card.shadowRoot.querySelectorAll('.camera-live-badge').length"), 1);
    assert.equal(await evaluate("demo.card.shadowRoot.querySelectorAll('.snapshot').length"), 2);
    assert.equal(await evaluate("demo.card.shadowRoot.textContent.includes('Allée')"), true);
    assert.equal(await evaluate("demo.card.shadowRoot.textContent.includes('Dernière personne')"), true);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
    const { data } = await call("Page.captureScreenshot", { format: "png" });
    const png = Buffer.from(data, "base64");
    fs.writeFileSync(path.join(output, `${source}-desktop-dark.png`), png);
    screenshots.set(source, png);

    let asyncLifecycle = "historical baseline only";
    let cameraLifecycle = "historical baseline retains the inherited reconnect defect";
    let editor = "historical baseline has no native editor";
    if (source !== "original") {
      const cameraResult = await evaluate(`(async()=>{
        const card=demo.card;
        card._setActiveCamera(1);
        for(let i=0;i<40 && card._cameraCardEntity!=='camera.example_driveway';i++) await new Promise(r=>setTimeout(r,10));
        const before={dialog:card._dialogOpen,entity:card._cameraCardEntity,index:card._activeCameraIndex,hash:location.hash,visible:card.shadowRoot.querySelectorAll('picture-entity-demo').length,creates:cameraCreates.length};
        card.remove();
        const detached={dialog:card._dialogOpen,card:card._cameraCard,entity:card._cameraCardEntity,hash:location.hash};
        document.querySelector('#host').append(card); await card.updateComplete;
        for(let i=0;i<40 && card._cameraCardEntity!=='camera.example_driveway';i++) await new Promise(r=>setTimeout(r,10));
        await card.updateComplete;
        const reconnected={dialog:card._dialogOpen,entity:card._cameraCardEntity,index:card._activeCameraIndex,hash:location.hash,visible:card.shadowRoot.querySelectorAll('picture-entity-demo').length,creates:cameraCreates.length};

        deferCameraCreates=true;
        const stale=card._ensureCameraCard(true);
        for(let i=0;i<40 && pendingCameraCreates.length<1;i++) await Promise.resolve();
        const createsBeforeConfig=cameraCreates.length;
        card.setConfig({...demo.config,name:'Garage reconfiguré',show_motion_badge:false});
        card.remove();
        await Promise.resolve(); await Promise.resolve();
        const afterImmediateDetach={attached:card._attached,dialog:card._dialogOpen,card:card._cameraCard,entity:card._cameraCardEntity,error:card._error,newCreates:cameraCreates.length-createsBeforeConfig,pending:pendingCameraCreates.length};
        pendingCameraCreates.shift().reject(new Error('obsolete camera failure')); await stale;
        const afterLateFailure={attached:card._attached,card:card._cameraCard,entity:card._cameraCardEntity,error:card._error};
        deferCameraCreates=false;
        document.querySelector('#host').append(card); await card.updateComplete;
        for(let i=0;i<40 && card._cameraCardEntity!=='camera.example_driveway';i++) await new Promise(r=>setTimeout(r,10));
        await card.updateComplete;
        const finalReconnect={dialog:card._dialogOpen,entity:card._cameraCardEntity,index:card._activeCameraIndex,hash:location.hash,visible:card.shadowRoot.querySelectorAll('picture-entity-demo').length};
        return {before,detached,reconnected,afterImmediateDetach,afterLateFailure,finalReconnect};
      })()`);
      assert.equal(cameraResult.before.dialog, true); assert.equal(cameraResult.before.entity, "camera.example_driveway");
      assert.equal(cameraResult.before.index, 1); assert.equal(cameraResult.before.hash, "#example-garage");
      assert.equal(cameraResult.before.visible, 1); assert(cameraResult.before.creates >= 2);
      assert.deepEqual(cameraResult.detached, { dialog: true, card: null, entity: null, hash: "#example-garage" });
      assert.equal(cameraResult.reconnected.dialog, true); assert.equal(cameraResult.reconnected.entity, "camera.example_driveway");
      assert.equal(cameraResult.reconnected.index, 1); assert.equal(cameraResult.reconnected.hash, "#example-garage");
      assert.equal(cameraResult.reconnected.visible, 1); assert.equal(cameraResult.reconnected.creates, cameraResult.before.creates + 1);
      assert.deepEqual(cameraResult.afterImmediateDetach, { attached: false, dialog: true, card: null, entity: null, error: "", newCreates: 0, pending: 1 });
      assert.deepEqual(cameraResult.afterLateFailure, { attached: false, card: null, entity: null, error: "" });
      assert.deepEqual(cameraResult.finalReconnect, { dialog: true, entity: "camera.example_driveway", index: 1, hash: "#example-garage", visible: 1 });
      cameraLifecycle = "open-dialog reconnect restores one selected camera; detached/reconfigured stale work ignored";

      const result = await evaluate(`(async()=>{
        const card=demo.card; card._closeDialog(false);
        const pending=card._runGarageAction();
        card.remove();
        const detached={busy:card._garageBusy,pending:card._pendingAction,busyTimer:card._busyTimer,confirmationTimer:card._confirmationTimer};
        pendingServices[0].resolve(); await pending;
        document.querySelector('#host').append(card); await card.updateComplete;
        const reconnected={busy:card._garageBusy,pending:card._pendingAction,busyTimer:card._busyTimer,confirmationTimer:card._confirmationTimer,calls:serviceCalls.length};
        const Editor=customElements.get('garage-control-card-editor'); const e=new Editor(); e._form={};
        e.setConfig({...demo.config,show_motion_badge:false,action_lock_ms:0,unknown:{keep:true}});
        const value=structuredClone(e._formData); value.name='Garage fictif';
        e._valueChanged({stopPropagation(){},detail:{value}});
        const saved=e.events?e.events.at(-1)?.detail?.config:null;
        const event=e.dispatchEvent;
        return {detached,reconnected,formFalse:e._formData.show_motion_badge,formZero:e._formData.action_lock_ms,unknown:e._config.unknown,name:e._config.name};
      })()`);
      assert.deepEqual(result.detached, { busy: false, pending: null, busyTimer: null, confirmationTimer: null });
      assert.deepEqual(result.reconnected, { busy: false, pending: null, busyTimer: null, confirmationTimer: null, calls: 1 });
      assert.equal(result.formFalse, false); assert.equal(result.formZero, 0); assert.deepEqual(result.unknown, { keep: true }); assert.equal(result.name, "Garage fictif");
      asyncLifecycle = "late mocked service ignored after detach; reconnect idle";
      editor = "native ha-form contract exercised with false/0/unknown preservation";
    }
    assert.equal(await evaluate(`history.replaceState(null,'','#other');dispatchEvent(new HashChangeEvent('hashchange'));demo.card._dialogOpen`), false);
    assert.equal(await evaluate(`history.replaceState(null,'','#example-garage');dispatchEvent(new HashChangeEvent('hashchange'));demo.card._dialogOpen`), true);
    assert.equal(await evaluate(`dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));demo.card._dialogOpen`), false);
    proofs.push({ source, render: true, visual: "fictitious desktop dark", asyncLifecycle, cameraLifecycle, editor, services: source === "original" ? 0 : 1 });
  }
  assert(screenshots.get("original").equals(screenshots.get("candidate")), "candidate visual rendering drifted from the expurgated original");
  assert(screenshots.get("candidate").equals(screenshots.get("bundle")), "built Garage module drifted from candidate rendering");
  assert.deepEqual(errors, []);
  const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");
  const result = {
    chrome: execFileSync(chrome, ["--version"], { encoding: "utf8" }).trim(),
    proofs,
    screenshot_sha256: Object.fromEntries([...screenshots].map(([name, png]) => [name, digest(png)])),
    visual_match: true,
    services: "mocked only",
    ha_acceptance: false,
  };
  fs.writeFileSync(path.join(output, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result));
} finally {
  try { socket?.send(JSON.stringify({ id: 2147483647, method: "Browser.close" })); } catch {}
  await new Promise((resolve) => {
    if (chromeProcess.exitCode !== null) { resolve(); return; }
    const force = setTimeout(() => { try { process.platform !== "win32" ? process.kill(-chromeProcess.pid, "SIGKILL") : chromeProcess.kill("SIGKILL"); } catch {} }, 4000);
    const giveUp = setTimeout(resolve, 6000);
    chromeProcess.once("exit", () => { clearTimeout(force); clearTimeout(giveUp); resolve(); });
  });
  socket?.close(); server.close();
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
