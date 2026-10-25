/* HA-BOARD Home Plan 0.1.0-rc.2 | Lit incorporated | see THIRD-PARTY-NOTICES.md
BSD 3-Clause License

Copyright (c) 2017 Google LLC. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

// ../ha-board-weather/node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t6, e6, o7) {
    if (this._$cssResult$ = true, o7 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t6, this.t = e6;
  }
  get styleSheet() {
    let t6 = this.o;
    const s5 = this.t;
    if (e && void 0 === t6) {
      const e6 = void 0 !== s5 && 1 === s5.length;
      e6 && (t6 = o.get(s5)), void 0 === t6 && ((this.o = t6 = new CSSStyleSheet()).replaceSync(this.cssText), e6 && o.set(s5, t6));
    }
    return t6;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t6) => new n("string" == typeof t6 ? t6 : t6 + "", void 0, s);
var i = (t6, ...e6) => {
  const o7 = 1 === t6.length ? t6[0] : e6.reduce((e7, s5, o8) => e7 + ((t7) => {
    if (true === t7._$cssResult$) return t7.cssText;
    if ("number" == typeof t7) return t7;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t7 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s5) + t6[o8 + 1], t6[0]);
  return new n(o7, t6, s);
};
var S = (s5, o7) => {
  if (e) s5.adoptedStyleSheets = o7.map((t6) => t6 instanceof CSSStyleSheet ? t6 : t6.styleSheet);
  else for (const e6 of o7) {
    const o8 = document.createElement("style"), n5 = t.litNonce;
    void 0 !== n5 && o8.setAttribute("nonce", n5), o8.textContent = e6.cssText, s5.appendChild(o8);
  }
};
var c = e ? (t6) => t6 : (t6) => t6 instanceof CSSStyleSheet ? ((t7) => {
  let e6 = "";
  for (const s5 of t7.cssRules) e6 += s5.cssText;
  return r(e6);
})(t6) : t6;

// ../ha-board-weather/node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t6, s5) => t6;
var u = { toAttribute(t6, s5) {
  switch (s5) {
    case Boolean:
      t6 = t6 ? l : null;
      break;
    case Object:
    case Array:
      t6 = null == t6 ? t6 : JSON.stringify(t6);
  }
  return t6;
}, fromAttribute(t6, s5) {
  let i7 = t6;
  switch (s5) {
    case Boolean:
      i7 = null !== t6;
      break;
    case Number:
      i7 = null === t6 ? null : Number(t6);
      break;
    case Object:
    case Array:
      try {
        i7 = JSON.parse(t6);
      } catch (t7) {
        i7 = null;
      }
  }
  return i7;
} };
var f = (t6, s5) => !i2(t6, s5);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
  static addInitializer(t6) {
    this._$Ei(), (this.l ??= []).push(t6);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t6, s5 = b) {
    if (s5.state && (s5.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t6) && ((s5 = Object.create(s5)).wrapped = true), this.elementProperties.set(t6, s5), !s5.noAccessor) {
      const i7 = Symbol(), h4 = this.getPropertyDescriptor(t6, i7, s5);
      void 0 !== h4 && e2(this.prototype, t6, h4);
    }
  }
  static getPropertyDescriptor(t6, s5, i7) {
    const { get: e6, set: r4 } = h(this.prototype, t6) ?? { get() {
      return this[s5];
    }, set(t7) {
      this[s5] = t7;
    } };
    return { get: e6, set(s6) {
      const h4 = e6?.call(this);
      r4?.call(this, s6), this.requestUpdate(t6, h4, i7);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t6) {
    return this.elementProperties.get(t6) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t6 = n2(this);
    t6.finalize(), void 0 !== t6.l && (this.l = [...t6.l]), this.elementProperties = new Map(t6.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t7 = this.properties, s5 = [...r2(t7), ...o2(t7)];
      for (const i7 of s5) this.createProperty(i7, t7[i7]);
    }
    const t6 = this[Symbol.metadata];
    if (null !== t6) {
      const s5 = litPropertyMetadata.get(t6);
      if (void 0 !== s5) for (const [t7, i7] of s5) this.elementProperties.set(t7, i7);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t7, s5] of this.elementProperties) {
      const i7 = this._$Eu(t7, s5);
      void 0 !== i7 && this._$Eh.set(i7, t7);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s5) {
    const i7 = [];
    if (Array.isArray(s5)) {
      const e6 = new Set(s5.flat(1 / 0).reverse());
      for (const s6 of e6) i7.unshift(c(s6));
    } else void 0 !== s5 && i7.push(c(s5));
    return i7;
  }
  static _$Eu(t6, s5) {
    const i7 = s5.attribute;
    return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t6 ? t6.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t6) => this.enableUpdating = t6), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t6) => t6(this));
  }
  addController(t6) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t6), void 0 !== this.renderRoot && this.isConnected && t6.hostConnected?.();
  }
  removeController(t6) {
    this._$EO?.delete(t6);
  }
  _$E_() {
    const t6 = /* @__PURE__ */ new Map(), s5 = this.constructor.elementProperties;
    for (const i7 of s5.keys()) this.hasOwnProperty(i7) && (t6.set(i7, this[i7]), delete this[i7]);
    t6.size > 0 && (this._$Ep = t6);
  }
  createRenderRoot() {
    const t6 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t6, this.constructor.elementStyles), t6;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t6) => t6.hostConnected?.());
  }
  enableUpdating(t6) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t6) => t6.hostDisconnected?.());
  }
  attributeChangedCallback(t6, s5, i7) {
    this._$AK(t6, i7);
  }
  _$ET(t6, s5) {
    const i7 = this.constructor.elementProperties.get(t6), e6 = this.constructor._$Eu(t6, i7);
    if (void 0 !== e6 && true === i7.reflect) {
      const h4 = (void 0 !== i7.converter?.toAttribute ? i7.converter : u).toAttribute(s5, i7.type);
      this._$Em = t6, null == h4 ? this.removeAttribute(e6) : this.setAttribute(e6, h4), this._$Em = null;
    }
  }
  _$AK(t6, s5) {
    const i7 = this.constructor, e6 = i7._$Eh.get(t6);
    if (void 0 !== e6 && this._$Em !== e6) {
      const t7 = i7.getPropertyOptions(e6), h4 = "function" == typeof t7.converter ? { fromAttribute: t7.converter } : void 0 !== t7.converter?.fromAttribute ? t7.converter : u;
      this._$Em = e6;
      const r4 = h4.fromAttribute(s5, t7.type);
      this[e6] = r4 ?? this._$Ej?.get(e6) ?? r4, this._$Em = null;
    }
  }
  requestUpdate(t6, s5, i7, e6 = false, h4) {
    if (void 0 !== t6) {
      const r4 = this.constructor;
      if (false === e6 && (h4 = this[t6]), i7 ??= r4.getPropertyOptions(t6), !((i7.hasChanged ?? f)(h4, s5) || i7.useDefault && i7.reflect && h4 === this._$Ej?.get(t6) && !this.hasAttribute(r4._$Eu(t6, i7)))) return;
      this.C(t6, s5, i7);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t6, s5, { useDefault: i7, reflect: e6, wrapped: h4 }, r4) {
    i7 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t6) && (this._$Ej.set(t6, r4 ?? s5 ?? this[t6]), true !== h4 || void 0 !== r4) || (this._$AL.has(t6) || (this.hasUpdated || i7 || (s5 = void 0), this._$AL.set(t6, s5)), true === e6 && this._$Em !== t6 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t6));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t7) {
      Promise.reject(t7);
    }
    const t6 = this.scheduleUpdate();
    return null != t6 && await t6, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t8, s6] of this._$Ep) this[t8] = s6;
        this._$Ep = void 0;
      }
      const t7 = this.constructor.elementProperties;
      if (t7.size > 0) for (const [s6, i7] of t7) {
        const { wrapped: t8 } = i7, e6 = this[s6];
        true !== t8 || this._$AL.has(s6) || void 0 === e6 || this.C(s6, void 0, i7, e6);
      }
    }
    let t6 = false;
    const s5 = this._$AL;
    try {
      t6 = this.shouldUpdate(s5), t6 ? (this.willUpdate(s5), this._$EO?.forEach((t7) => t7.hostUpdate?.()), this.update(s5)) : this._$EM();
    } catch (s6) {
      throw t6 = false, this._$EM(), s6;
    }
    t6 && this._$AE(s5);
  }
  willUpdate(t6) {
  }
  _$AE(t6) {
    this._$EO?.forEach((t7) => t7.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t6)), this.updated(t6);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t6) {
    return true;
  }
  update(t6) {
    this._$Eq &&= this._$Eq.forEach((t7) => this._$ET(t7, this[t7])), this._$EM();
  }
  updated(t6) {
  }
  firstUpdated(t6) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");

// ../ha-board-weather/node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = (t6) => t6;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t6) => t6 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t6) => null === t6 || "object" != typeof t6 && "function" != typeof t6;
var u2 = Array.isArray;
var d2 = (t6) => u2(t6) || "function" == typeof t6?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t6) => (i7, ...s5) => ({ _$litType$: t6, strings: i7, values: s5 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t6, i7) {
  if (!u2(t6) || !t6.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i7) : i7;
}
var N = (t6, i7) => {
  const s5 = t6.length - 1, e6 = [];
  let n5, l3 = 2 === i7 ? "<svg>" : 3 === i7 ? "<math>" : "", c5 = v;
  for (let i8 = 0; i8 < s5; i8++) {
    const s6 = t6[i8];
    let a3, u5, d3 = -1, f3 = 0;
    for (; f3 < s6.length && (c5.lastIndex = f3, u5 = c5.exec(s6), null !== u5); ) f3 = c5.lastIndex, c5 === v ? "!--" === u5[1] ? c5 = _ : void 0 !== u5[1] ? c5 = m : void 0 !== u5[2] ? (y2.test(u5[2]) && (n5 = RegExp("</" + u5[2], "g")), c5 = p2) : void 0 !== u5[3] && (c5 = p2) : c5 === p2 ? ">" === u5[0] ? (c5 = n5 ?? v, d3 = -1) : void 0 === u5[1] ? d3 = -2 : (d3 = c5.lastIndex - u5[2].length, a3 = u5[1], c5 = void 0 === u5[3] ? p2 : '"' === u5[3] ? $ : g) : c5 === $ || c5 === g ? c5 = p2 : c5 === _ || c5 === m ? c5 = v : (c5 = p2, n5 = void 0);
    const x2 = c5 === p2 && t6[i8 + 1].startsWith("/>") ? " " : "";
    l3 += c5 === v ? s6 + r3 : d3 >= 0 ? (e6.push(a3), s6.slice(0, d3) + h2 + s6.slice(d3) + o3 + x2) : s6 + o3 + (-2 === d3 ? i8 : x2);
  }
  return [V(t6, l3 + (t6[s5] || "<?>") + (2 === i7 ? "</svg>" : 3 === i7 ? "</math>" : "")), e6];
};
var S2 = class _S {
  constructor({ strings: t6, _$litType$: i7 }, e6) {
    let r4;
    this.parts = [];
    let l3 = 0, a3 = 0;
    const u5 = t6.length - 1, d3 = this.parts, [f3, v3] = N(t6, i7);
    if (this.el = _S.createElement(f3, e6), P.currentNode = this.el.content, 2 === i7 || 3 === i7) {
      const t7 = this.el.content.firstChild;
      t7.replaceWith(...t7.childNodes);
    }
    for (; null !== (r4 = P.nextNode()) && d3.length < u5; ) {
      if (1 === r4.nodeType) {
        if (r4.hasAttributes()) for (const t7 of r4.getAttributeNames()) if (t7.endsWith(h2)) {
          const i8 = v3[a3++], s5 = r4.getAttribute(t7).split(o3), e7 = /([.?@])?(.*)/.exec(i8);
          d3.push({ type: 1, index: l3, name: e7[2], strings: s5, ctor: "." === e7[1] ? I : "?" === e7[1] ? L : "@" === e7[1] ? z : H }), r4.removeAttribute(t7);
        } else t7.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r4.removeAttribute(t7));
        if (y2.test(r4.tagName)) {
          const t7 = r4.textContent.split(o3), i8 = t7.length - 1;
          if (i8 > 0) {
            r4.textContent = s2 ? s2.emptyScript : "";
            for (let s5 = 0; s5 < i8; s5++) r4.append(t7[s5], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
            r4.append(t7[i8], c3());
          }
        }
      } else if (8 === r4.nodeType) if (r4.data === n3) d3.push({ type: 2, index: l3 });
      else {
        let t7 = -1;
        for (; -1 !== (t7 = r4.data.indexOf(o3, t7 + 1)); ) d3.push({ type: 7, index: l3 }), t7 += o3.length - 1;
      }
      l3++;
    }
  }
  static createElement(t6, i7) {
    const s5 = l2.createElement("template");
    return s5.innerHTML = t6, s5;
  }
};
function M(t6, i7, s5 = t6, e6) {
  if (i7 === E) return i7;
  let h4 = void 0 !== e6 ? s5._$Co?.[e6] : s5._$Cl;
  const o7 = a2(i7) ? void 0 : i7._$litDirective$;
  return h4?.constructor !== o7 && (h4?._$AO?.(false), void 0 === o7 ? h4 = void 0 : (h4 = new o7(t6), h4._$AT(t6, s5, e6)), void 0 !== e6 ? (s5._$Co ??= [])[e6] = h4 : s5._$Cl = h4), void 0 !== h4 && (i7 = M(t6, h4._$AS(t6, i7.values), h4, e6)), i7;
}
var R = class {
  constructor(t6, i7) {
    this._$AV = [], this._$AN = void 0, this._$AD = t6, this._$AM = i7;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t6) {
    const { el: { content: i7 }, parts: s5 } = this._$AD, e6 = (t6?.creationScope ?? l2).importNode(i7, true);
    P.currentNode = e6;
    let h4 = P.nextNode(), o7 = 0, n5 = 0, r4 = s5[0];
    for (; void 0 !== r4; ) {
      if (o7 === r4.index) {
        let i8;
        2 === r4.type ? i8 = new k(h4, h4.nextSibling, this, t6) : 1 === r4.type ? i8 = new r4.ctor(h4, r4.name, r4.strings, this, t6) : 6 === r4.type && (i8 = new Z(h4, this, t6)), this._$AV.push(i8), r4 = s5[++n5];
      }
      o7 !== r4?.index && (h4 = P.nextNode(), o7++);
    }
    return P.currentNode = l2, e6;
  }
  p(t6) {
    let i7 = 0;
    for (const s5 of this._$AV) void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t6, s5, i7), i7 += s5.strings.length - 2) : s5._$AI(t6[i7])), i7++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t6, i7, s5, e6) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t6, this._$AB = i7, this._$AM = s5, this.options = e6, this._$Cv = e6?.isConnected ?? true;
  }
  get parentNode() {
    let t6 = this._$AA.parentNode;
    const i7 = this._$AM;
    return void 0 !== i7 && 11 === t6?.nodeType && (t6 = i7.parentNode), t6;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t6, i7 = this) {
    t6 = M(this, t6, i7), a2(t6) ? t6 === A || null == t6 || "" === t6 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t6 !== this._$AH && t6 !== E && this._(t6) : void 0 !== t6._$litType$ ? this.$(t6) : void 0 !== t6.nodeType ? this.T(t6) : d2(t6) ? this.k(t6) : this._(t6);
  }
  O(t6) {
    return this._$AA.parentNode.insertBefore(t6, this._$AB);
  }
  T(t6) {
    this._$AH !== t6 && (this._$AR(), this._$AH = this.O(t6));
  }
  _(t6) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t6 : this.T(l2.createTextNode(t6)), this._$AH = t6;
  }
  $(t6) {
    const { values: i7, _$litType$: s5 } = t6, e6 = "number" == typeof s5 ? this._$AC(t6) : (void 0 === s5.el && (s5.el = S2.createElement(V(s5.h, s5.h[0]), this.options)), s5);
    if (this._$AH?._$AD === e6) this._$AH.p(i7);
    else {
      const t7 = new R(e6, this), s6 = t7.u(this.options);
      t7.p(i7), this.T(s6), this._$AH = t7;
    }
  }
  _$AC(t6) {
    let i7 = C.get(t6.strings);
    return void 0 === i7 && C.set(t6.strings, i7 = new S2(t6)), i7;
  }
  k(t6) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i7 = this._$AH;
    let s5, e6 = 0;
    for (const h4 of t6) e6 === i7.length ? i7.push(s5 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s5 = i7[e6], s5._$AI(h4), e6++;
    e6 < i7.length && (this._$AR(s5 && s5._$AB.nextSibling, e6), i7.length = e6);
  }
  _$AR(t6 = this._$AA.nextSibling, s5) {
    for (this._$AP?.(false, true, s5); t6 !== this._$AB; ) {
      const s6 = i3(t6).nextSibling;
      i3(t6).remove(), t6 = s6;
    }
  }
  setConnected(t6) {
    void 0 === this._$AM && (this._$Cv = t6, this._$AP?.(t6));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t6, i7, s5, e6, h4) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t6, this.name = i7, this._$AM = e6, this.options = h4, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = A;
  }
  _$AI(t6, i7 = this, s5, e6) {
    const h4 = this.strings;
    let o7 = false;
    if (void 0 === h4) t6 = M(this, t6, i7, 0), o7 = !a2(t6) || t6 !== this._$AH && t6 !== E, o7 && (this._$AH = t6);
    else {
      const e7 = t6;
      let n5, r4;
      for (t6 = h4[0], n5 = 0; n5 < h4.length - 1; n5++) r4 = M(this, e7[s5 + n5], i7, n5), r4 === E && (r4 = this._$AH[n5]), o7 ||= !a2(r4) || r4 !== this._$AH[n5], r4 === A ? t6 = A : t6 !== A && (t6 += (r4 ?? "") + h4[n5 + 1]), this._$AH[n5] = r4;
    }
    o7 && !e6 && this.j(t6);
  }
  j(t6) {
    t6 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t6 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t6) {
    this.element[this.name] = t6 === A ? void 0 : t6;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t6) {
    this.element.toggleAttribute(this.name, !!t6 && t6 !== A);
  }
};
var z = class extends H {
  constructor(t6, i7, s5, e6, h4) {
    super(t6, i7, s5, e6, h4), this.type = 5;
  }
  _$AI(t6, i7 = this) {
    if ((t6 = M(this, t6, i7, 0) ?? A) === E) return;
    const s5 = this._$AH, e6 = t6 === A && s5 !== A || t6.capture !== s5.capture || t6.once !== s5.once || t6.passive !== s5.passive, h4 = t6 !== A && (s5 === A || e6);
    e6 && this.element.removeEventListener(this.name, this, s5), h4 && this.element.addEventListener(this.name, this, t6), this._$AH = t6;
  }
  handleEvent(t6) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t6) : this._$AH.handleEvent(t6);
  }
};
var Z = class {
  constructor(t6, i7, s5) {
    this.element = t6, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s5;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t6) {
    M(this, t6);
  }
};
var j = { M: h2, P: o3, A: n3, C: 1, L: N, R, D: d2, V: M, I: k, H, N: L, U: z, B: I, F: Z };
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.3");
var D = (t6, i7, s5) => {
  const e6 = s5?.renderBefore ?? i7;
  let h4 = e6._$litPart$;
  if (void 0 === h4) {
    const t7 = s5?.renderBefore ?? null;
    e6._$litPart$ = h4 = new k(i7.insertBefore(c3(), t7), t7, void 0, s5 ?? {});
  }
  return h4._$AI(t6), h4;
};

// ../ha-board-weather/node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t6 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t6.firstChild, t6;
  }
  update(t6) {
    const r4 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t6), this._$Do = D(r4, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i4 });
(s3.litElementVersions ??= []).push("4.2.0");

// ../ha-board-weather/node_modules/lit-html/directive.js
var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e4 = (t6) => (...e6) => ({ _$litDirective$: t6, values: e6 });
var i5 = class {
  constructor(t6) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t6, e6, i7) {
    this._$Ct = t6, this._$AM = e6, this._$Ci = i7;
  }
  _$AS(t6, e6) {
    return this.update(t6, e6);
  }
  update(t6, e6) {
    return this.render(...e6);
  }
};

// ../ha-board-weather/node_modules/lit-html/directive-helpers.js
var { I: t4 } = j;
var i6 = (o7) => o7;
var s4 = () => document.createComment("");
var v2 = (o7, n5, e6) => {
  const l3 = o7._$AA.parentNode, d3 = void 0 === n5 ? o7._$AB : n5._$AA;
  if (void 0 === e6) {
    const i7 = l3.insertBefore(s4(), d3), n6 = l3.insertBefore(s4(), d3);
    e6 = new t4(i7, n6, o7, o7.options);
  } else {
    const t6 = e6._$AB.nextSibling, n6 = e6._$AM, c5 = n6 !== o7;
    if (c5) {
      let t7;
      e6._$AQ?.(o7), e6._$AM = o7, void 0 !== e6._$AP && (t7 = o7._$AU) !== n6._$AU && e6._$AP(t7);
    }
    if (t6 !== d3 || c5) {
      let o8 = e6._$AA;
      for (; o8 !== t6; ) {
        const t7 = i6(o8).nextSibling;
        i6(l3).insertBefore(o8, d3), o8 = t7;
      }
    }
  }
  return e6;
};
var u3 = (o7, t6, i7 = o7) => (o7._$AI(t6, i7), o7);
var m2 = {};
var p3 = (o7, t6 = m2) => o7._$AH = t6;
var M2 = (o7) => o7._$AH;
var h3 = (o7) => {
  o7._$AR(), o7._$AA.remove();
};

// ../ha-board-weather/node_modules/lit-html/directives/repeat.js
var u4 = (e6, s5, t6) => {
  const r4 = /* @__PURE__ */ new Map();
  for (let l3 = s5; l3 <= t6; l3++) r4.set(e6[l3], l3);
  return r4;
};
var c4 = e4(class extends i5 {
  constructor(e6) {
    if (super(e6), e6.type !== t3.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e6, s5, t6) {
    let r4;
    void 0 === t6 ? t6 = s5 : void 0 !== s5 && (r4 = s5);
    const l3 = [], o7 = [];
    let i7 = 0;
    for (const s6 of e6) l3[i7] = r4 ? r4(s6, i7) : i7, o7[i7] = t6(s6, i7), i7++;
    return { values: o7, keys: l3 };
  }
  render(e6, s5, t6) {
    return this.dt(e6, s5, t6).values;
  }
  update(s5, [t6, r4, c5]) {
    const d3 = M2(s5), { values: p4, keys: a3 } = this.dt(t6, r4, c5);
    if (!Array.isArray(d3)) return this.ut = a3, p4;
    const h4 = this.ut ??= [], v3 = [];
    let m3, y3, x2 = 0, j2 = d3.length - 1, k2 = 0, w2 = p4.length - 1;
    for (; x2 <= j2 && k2 <= w2; ) if (null === d3[x2]) x2++;
    else if (null === d3[j2]) j2--;
    else if (h4[x2] === a3[k2]) v3[k2] = u3(d3[x2], p4[k2]), x2++, k2++;
    else if (h4[j2] === a3[w2]) v3[w2] = u3(d3[j2], p4[w2]), j2--, w2--;
    else if (h4[x2] === a3[w2]) v3[w2] = u3(d3[x2], p4[w2]), v2(s5, v3[w2 + 1], d3[x2]), x2++, w2--;
    else if (h4[j2] === a3[k2]) v3[k2] = u3(d3[j2], p4[k2]), v2(s5, d3[x2], d3[j2]), j2--, k2++;
    else if (void 0 === m3 && (m3 = u4(a3, k2, w2), y3 = u4(h4, x2, j2)), m3.has(h4[x2])) if (m3.has(h4[j2])) {
      const e6 = y3.get(a3[k2]), t7 = void 0 !== e6 ? d3[e6] : null;
      if (null === t7) {
        const e7 = v2(s5, d3[x2]);
        u3(e7, p4[k2]), v3[k2] = e7;
      } else v3[k2] = u3(t7, p4[k2]), v2(s5, d3[x2], t7), d3[e6] = null;
      k2++;
    } else h3(d3[j2]), j2--;
    else h3(d3[x2]), x2++;
    for (; k2 <= w2; ) {
      const e6 = v2(s5, v3[w2 + 1]);
      u3(e6, p4[k2]), v3[k2++] = e6;
    }
    for (; x2 <= j2; ) {
      const e6 = d3[x2++];
      null !== e6 && h3(e6);
    }
    return this.ut = a3, p3(s5, v3), E;
  }
});

// ../ha-board-weather/node_modules/lit-html/directives/unsafe-html.js
var e5 = class extends i5 {
  constructor(i7) {
    if (super(i7), this.it = A, i7.type !== t3.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r4) {
    if (r4 === A || null == r4) return this._t = void 0, this.it = r4;
    if (r4 === E) return r4;
    if ("string" != typeof r4) throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r4 === this.it) return this._t;
    this.it = r4;
    const s5 = [r4];
    return s5.raw = s5, this._t = { _$litType$: this.constructor.resultType, strings: s5, values: [] };
  }
};
e5.directiveName = "unsafeHTML", e5.resultType = 1;
var o5 = e4(e5);

// ../ha-board-weather/node_modules/lit-html/directives/unsafe-svg.js
var t5 = class extends e5 {
};
t5.directiveName = "unsafeSVG", t5.resultType = 2;
var o6 = e4(t5);

// src/candidate/home-plan-card.css
var home_plan_card_default = '\n    :host { display:block; color-scheme:light; } :host([dark]) {color-scheme:dark;}\n    .hpf-home {\n      --hp-paper: light-dark(#fbfbfc,#1d2026); --hp-ink: light-dark(#20242b,#f4f5f8);\n      --hp-secondary: light-dark(#626b76,#aab2bf); --hp-line: light-dark(#e7e9ee,#353b46);\n      --hp-soft: light-dark(#f0f2f6,#2b303a); --hp-blue: light-dark(#2673e7,#74adff);\n      --hp-selected: light-dark(#e2ecff,#273e5b); --hp-warm: light-dark(#fff0c8,#55472c);\n      --hp-amber: light-dark(#926000,#f9cc6e); --hp-orange: light-dark(#b8561c,#ffb187);\n      --hp-alert-bg: light-dark(#fff1e7,#473428); --hp-floor: light-dark(#efede6,#30353c);\n      --hp-wall: light-dark(#bcbdb8,#68727e); --hp-furniture: light-dark(#dedbd2,#424a55);\n      --hp-furniture-line: light-dark(#c7c4bb,#5a6572); --hp-water: light-dark(#9fd0d8,#346472);\n      --hp-glass: light-dark(#c4dce5,#5b7b8d); --hp-good: light-dark(#367258,#89c6aa);\n      position: relative; max-width: 680px; margin: 0 auto; overflow: hidden; isolation: isolate;\n      background: var(--hp-paper); color: var(--hp-ink); border-radius: 26px;\n      box-shadow: 0 8px 34px light-dark(#202b4212,#00000026);\n      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; font-size: 14px;\n      -webkit-tap-highlight-color: transparent;\n    }\n    .hpf-home * { box-sizing: border-box; }\n    button, input { font: inherit; }\n    button { color: inherit; }\n    button:disabled { opacity: .5; }\n    .hpf-head { padding: 21px 22px 13px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n    .hpf-heading { display: flex; align-items: center; gap: 11px; }\n    .hpf-home-mark { display: grid; place-items: center; width: 39px; height: 39px; border-radius: 13px; color: var(--hp-blue); background: var(--hp-selected); }\n    .hpf-home-mark svg { width: 21px; height: 21px; }\n    h2 { margin: 0; font-size: 21px; line-height: 1.2; font-weight: 650; letter-spacing: -.5px; }\n    .hpf-floor-name { display: block; margin-top: 4px; font-size: 12px; color: var(--hp-secondary); }\n    .hpf-preview-mark { margin-right: 4px; font-size: 11px; color: var(--hp-secondary); white-space: nowrap; }\n    .hpf-tools { display: flex; align-items: center; justify-content: space-between; gap: 6px 10px; flex-wrap: wrap; padding: 0 22px 8px; }\n    .hpf-glance { display: flex; align-items: center; gap: 6px; min-width: 0; flex-wrap: nowrap; }\n    .hpf-glance button { display: inline-flex; align-items: center; gap: 5px; min-height: 40px; border: 0; border-radius: 12px; background: transparent; padding: 4px 7px; font-size: 12px; white-space: nowrap; }\n    .hpf-glance button:first-child { margin-left: -7px; }\n    .hpf-glance svg { width: 15px; height: 15px; }\n    .hpf-glance button[data-light-count] { color: var(--hp-amber); }\n    .hpf-glance button[data-open-count] { color: var(--hp-orange); }\n    .hpf-glance button[aria-pressed="true"] { background: var(--hp-soft); }\n    .hpf-view { display: flex; padding: 3px; margin-left: auto; border-radius: 11px; background: var(--hp-soft); }\n    .hpf-view button { display: flex; align-items: center; justify-content: center; min-width: 44px; min-height: 35px; padding: 5px 9px; border: 0; border-radius: 8px; background: transparent; color: var(--hp-secondary); font-size: 12px; }\n    .hpf-view button svg { width: 17px; height: 17px; }\n    .hpf-view button[aria-pressed="true"] { background: var(--hp-paper); color: var(--hp-ink); box-shadow: 0 1px 4px #00000013; }\n    .hpf-map { position: relative; margin: 0 auto; width: calc(100% - 24px); max-width: 560px; aspect-ratio: 1000 / 660; }\n    .hpf-aperture-layer { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; overflow: visible; pointer-events: none; }\n    .hpf-aperture-layer [data-map-aperture] { pointer-events: stroke; }\n    .hpf-drawing { display: block; width: 100%; height: 100%; overflow: visible; }\n    .hpf-room-floor { fill: var(--hp-floor); transition: fill .2s; }\n    .hpf-room-floor.is-lit { fill: var(--hp-warm); }\n    .hpf-room-floor.is-selected { fill: var(--hp-selected); }\n    .hpf-room-floor.is-muted { opacity: .28; }\n    .hpf-drawing .wall { fill: none; stroke: var(--hp-wall); stroke-width: 7; stroke-linecap: square; stroke-linejoin: miter; }\n    .hpf-drawing .inner-wall { fill: none; stroke: var(--hp-wall); stroke-width: 5; }\n    .hpf-drawing .thin { fill: none; stroke: var(--hp-glass); stroke-width: 1.6; opacity: .55; }\n    .hpf-drawing .door { fill: none; stroke: var(--hp-wall); stroke-width: 2.6; opacity: .75; }\n    .hpf-drawing .window { fill: none; stroke: var(--hp-glass); stroke-width: 5; }\n    .hpf-drawing .furniture { fill: var(--hp-furniture); stroke: var(--hp-furniture-line); stroke-width: 1.6; }\n    .hpf-drawing .furniture-line, .hpf-drawing .stairs { fill: none; stroke: var(--hp-furniture-line); stroke-width: 2; }\n    .hpf-drawing .plant { fill: none; stroke: var(--hp-good); stroke-width: 2; opacity: .4; }\n    .hpf-drawing .pool { fill: var(--hp-water); stroke: var(--hp-glass); stroke-width: 2; }\n    .hpf-drawing .pool-line { fill: none; stroke: var(--hp-paper); stroke-width: 2; opacity: .38; }\n    .hpf-drawing .trace-wall { fill: var(--hp-wall); }\n    .hpf-drawing .trace-door { fill: var(--hp-good); opacity: .7; }\n    .hpf-drawing .trace-window { fill: var(--hp-glass); }\n    .hpf-drawing .trace-stair { fill: var(--hp-furniture); }\n    .hpf-drawing .terrace { fill: var(--hp-soft); opacity: .7; }\n    .hpf-modebar { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 3px; margin: 2px 16px 8px; padding: 3px; border-radius: 14px; background: var(--hp-soft); }\n    .hpf-modebar button { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; min-width: 0; min-height: 49px; padding: 6px 1px; border: 0; border-radius: 11px; background: transparent; color: var(--hp-secondary); font-size: 11px; }\n    .hpf-modebar svg { width: 19px; height: 19px; }\n    .hpf-modebar button[aria-pressed="true"] { background: var(--hp-paper); color: var(--hp-ink); box-shadow: 0 1px 4px light-dark(#00000012,#00000026); }\n    .hpf-mode-short { display: none; }\n    .hpf-aperture-layer .aperture-line { fill: none; stroke: var(--hp-glass); stroke-width: 6; stroke-linecap: butt; }\n    .hpf-aperture-layer .aperture-halo { fill: none; stroke: var(--hp-orange); stroke-width: 20; opacity: .18; }\n    .hpf-aperture-layer .aperture-line.is-open, .hpf-aperture-layer .aperture-leaf { stroke: var(--hp-orange); }\n    .hpf-aperture-layer .aperture-leaf { fill: none; stroke-width: 4; }\n    .hpf-aperture-layer .shutter-track { fill: none; stroke: var(--hp-glass); stroke-width: 12; opacity: .5; }\n    .hpf-aperture-layer .shutter-fill { fill: none; stroke: var(--hp-blue); stroke-width: 12; }\n    .hpf-aperture-layer .aperture-leader { fill: none; stroke: var(--hp-blue); stroke-width: 1.4; opacity: .55; }\n    .hpf-aperture { position: absolute; z-index: 3; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; transform: translate(-50%,-50%); border: 0; border-radius: 12px; background: transparent; }\n    .hpf-aperture-mark { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; min-width: 22px; min-height: 23px; padding: 3px 5px; border-radius: 7px; background: var(--hp-paper); color: var(--hp-blue); box-shadow: 0 1px 5px light-dark(#1d2a4525,#00000055); font-size: 11px; font-variant-numeric: tabular-nums; }\n    .hpf-aperture-mark svg { width: 14px; height: 14px; }\n    .hpf-aperture.is-open:not(.has-cover) .hpf-aperture-mark { color: var(--hp-orange); background: var(--hp-alert-bg); }\n    .hpf-aperture:not(.show-value) .hpf-aperture-mark > span { display: none; }\n    .hpf-aperture.is-muted { opacity: .32; }\n    .hpf-map-legend { min-height: 30px; padding: 3px 17px 9px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px 14px; font-size: 11px; color: var(--hp-secondary); }\n    .hpf-map-legend span { display: inline-flex; gap: 5px; align-items: center; }\n    .hpf-map-legend svg { width: 13px; height: 13px; }\n    .hpf-map-legend .opening-key { color: var(--hp-orange); }\n    .hpf-map-legend .cover-key { color: var(--hp-blue); }\n    .hpf-room-tile .hpf-tile-cover { color: var(--hp-blue); }\n    .hpf-photo-style { position: absolute; left: 9px; bottom: 9px; border: 0; border-radius: 9px; min-height: 34px; padding: 5px 10px; background: var(--hp-paper); color: var(--hp-ink); font-size: 11px; }\n    .hpf-cover-state { font-size: 12px; margin-left: auto; color: var(--hp-blue); font-variant-numeric: tabular-nums; }\n    .hpf-quick-room { display: flex; align-items: center; justify-content: center; gap: 7px; border: 0; background: transparent; padding: 10px; min-height: 44px; width: 100%; color: var(--hp-blue); font-size: 12px; }\n    .hpf-quick-room svg { width: 15px; height: 15px; }\n    .hpf-photo-shortcut { position: absolute; display: flex; flex-direction: column; padding: 0; overflow: hidden; border: 1px solid var(--hp-line); border-radius: 16px; background: var(--hp-paper); text-align: left; }\n    .hpf-photo-shortcut img { width: 100%; flex: 1 1 0; min-height: 0; object-fit: cover; }\n    .hpf-photo-caption { display: flex; align-items: center; justify-content: space-between; gap: 4px; width: 100%; padding: 9px 10px; font-size: 12px; font-weight: 600; }\n    .hpf-photo-caption svg { flex: 0 0 auto; width: 14px; height: 14px; }\n    .hpf-room-photo { position: relative; height: 160px; margin: 0 0 14px; overflow: hidden; border-radius: 15px; background: var(--hp-soft); }\n    .hpf-room-photo img { width: 100%; height: 100%; object-fit: cover; }\n    .hpf-photo-next { position: absolute; right: 9px; bottom: 9px; min-width: 44px; min-height: 36px; border: 0; border-radius: 10px; background: #15202dcc; color: #fff; padding: 6px 10px; font-size: 12px; }\n    .hpf-zone { position: absolute; margin: 0; border: 0; padding: 0; background: transparent; overflow: visible; border-radius: 4px; }\n    .hpf-zone.is-muted { opacity: .36; }\n    .hpf-room-name { position: absolute; display: flex; align-items: center; flex-direction: column; gap: 3px; transform: translate(-50%,-50%); white-space: nowrap; pointer-events: none; }\n    .hpf-room-name strong { font-size: clamp(11px,1.8vw,14px); line-height: 1.15; font-weight: 620; letter-spacing: -.2px; text-shadow: 0 1px 8px var(--hp-floor); }\n    .hpf-room-name small { font-size: 11px; line-height: 1.1; color: var(--hp-secondary); }\n    .hpf-name-micro { display: none; }\n    .hpf-zone.has-opening strong, .hpf-zone.has-opening small { color: var(--hp-orange); }\n    .hpf-zone[aria-pressed="true"] strong { color: var(--hp-blue); }\n    .hpf-room-name .hpf-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--hp-amber); }\n    .hpf-room-alert { display: inline-grid; place-items: center; margin-left: 3px; width: 12px; height: 12px; font-size: 10px; color: var(--hp-paper); background: var(--hp-orange); border-radius: 50%; text-shadow: none; vertical-align: 1px; }\n    .hpf-room-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; padding: 9px 20px 18px; }\n    .hpf-room-grid[hidden], [hidden] { display: none !important; }\n    .hpf-room-tile { min-width: 0; padding: 15px; min-height: 99px; text-align: left; border: 0; border-radius: 17px; background: var(--hp-soft); }\n    .hpf-room-tile svg { display: block; width: 20px; height: 20px; margin-bottom: 10px; color: var(--hp-secondary); }\n    .hpf-room-tile strong { display: block; font-size: 13px; font-weight: 600; }\n    .hpf-room-tile small { display: block; margin-top: 4px; font-size: 11px; color: var(--hp-secondary); }\n    .hpf-room-tile.is-lit { background: var(--hp-warm); }\n    .hpf-room-tile.has-opening { background: var(--hp-alert-bg); }\n    .hpf-room-tile.has-opening small { color: var(--hp-orange); }\n    .hpf-footer { display: flex; align-items: center; gap: 8px; padding: 12px 21px 17px; border-top: 1px solid var(--hp-line); }\n    .hpf-footer > svg { flex: 0 0 auto; width: 16px; height: 16px; color: var(--hp-orange); }\n    .hpf-footer-copy { font-size: 12px; min-width: 0; flex: 1; color: var(--hp-secondary); }\n    .hpf-footer button { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; flex: 0 0 auto; border: 0; padding: 6px 0 6px 9px; background: transparent; color: var(--hp-ink); font-size: 12px; font-weight: 600; }\n    .hpf-footer button svg { width: 14px; height: 14px; }\n    .hpf-sheet { position: absolute; z-index: 5; inset: auto 0 0; margin: 0; width: 100%; max-width: none; max-height: 100%; padding: 18px 22px 21px; border: 1px solid var(--hp-line); border-bottom: 0; border-radius: 23px 23px 0 0; background: var(--hp-paper); color: var(--hp-ink); box-shadow: 0 -15px 50px #00000022; overflow-y: auto; }\n    .hpf-sheet::backdrop { background: transparent; }\n    .hpf-sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }\n    .hpf-sheet h3 { margin: 0; font-size: 20px; font-weight: 650; letter-spacing: -.4px; }\n    .hpf-sheet-sub { display: block; margin-top: 4px; font-size: 12px; color: var(--hp-secondary); }\n    .hpf-close { display: grid; place-items: center; width: 44px; height: 44px; flex: 0 0 auto; border: 0; border-radius: 50%; background: var(--hp-soft); }\n    .hpf-close svg { width: 18px; height: 18px; }\n    .hpf-device-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }\n    .hpf-device { display: flex; align-items: center; gap: 11px; min-height: 68px; border: 0; border-radius: 16px; background: var(--hp-soft); padding: 13px 14px; text-align: left; }\n    .hpf-device > svg { width: 23px; height: 23px; flex: 0 0 auto; }\n    .hpf-device.is-lit { background: var(--hp-warm); color: var(--hp-amber); }\n    .hpf-device strong { display: block; font-size: 13px; font-weight: 600; }\n    .hpf-device small { display: block; margin-top: 4px; font-size: 12px; }\n    .hpf-cover { margin-top: 10px; padding: 13px 15px; border-radius: 16px; background: var(--hp-soft); }\n    .hpf-cover-caption { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }\n    .hpf-cover-caption svg { width: 17px; height: 17px; }\n    .hpf-cover-caption output { margin-left: auto; font-weight: 500; font-variant-numeric: tabular-nums; }\n    .hpf-cover input { width: 100%; margin: 9px 0 5px; min-height: 30px; accent-color: var(--hp-blue); }\n    .hpf-cover-actions { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; }\n    .hpf-cover-actions button { min-height: 40px; display: flex; align-items: center; justify-content: center; gap: 5px; border: 0; border-radius: 9px; background: var(--hp-paper); font-size: 12px; }\n    .hpf-cover-actions svg { width: 14px; height: 14px; }\n    .hpf-opening { display: flex; align-items: center; gap: 9px; padding: 12px 1px 2px; font-size: 12px; color: var(--hp-secondary); }\n    .hpf-opening svg { width: 17px; height: 17px; flex: 0 0 auto; }\n    .hpf-opening.is-open { color: var(--hp-orange); }\n    .hpf-opening strong { margin-left: auto; font-weight: 600; }\n    .hpf-sheet details { margin-top: 13px; border-top: 1px solid var(--hp-line); padding-top: 6px; }\n    .hpf-sheet summary { padding: 9px 0; font-size: 12px; color: var(--hp-secondary); }\n    .hpf-extra { display: flex; align-items: center; gap: 8px; padding: 7px 0; font-size: 12px; }\n    .hpf-extra svg { width: 16px; height: 16px; color: var(--hp-secondary); }\n    .hpf-extra span:last-child { margin-left: auto; color: var(--hp-secondary); }\n    .hpf-empty { padding: 20px 0 14px; font-size: 13px; color: var(--hp-secondary); }\n    .hpf-alerts { display: grid; gap: 8px; }\n    .hpf-alert-item { display: flex; align-items: center; gap: 12px; min-height: 61px; padding: 11px 14px; background: var(--hp-alert-bg); border: 0; border-radius: 15px; text-align: left; }\n    .hpf-alert-item > svg { width: 20px; height: 20px; color: var(--hp-orange); }\n    .hpf-alert-item strong { display: block; font-size: 13px; font-weight: 600; }\n    .hpf-alert-item small { display: block; margin-top: 4px; font-size: 12px; color: var(--hp-orange); }\n    .hpf-announcement { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); }\n    @media (max-width: 460px) {\n      .hpf-head { padding: 18px 16px 10px; }\n      .hpf-tools { padding: 0 16px 7px; gap: 6px; }\n      .hpf-preview-mark { font-size: 11px; }\n      .hpf-room-grid { grid-template-columns: repeat(2,minmax(0,1fr)); padding: 6px 14px 14px; gap: 8px; }\n      .hpf-room-tile { min-height: 91px; padding: 12px; }\n      .hpf-footer { padding: 8px 15px 12px; }\n      .hpf-sheet { padding: 16px; }\n      .hpf-room-name strong { font-size: 11px; }\n      .hpf-view button { min-width: 35px; padding: 5px 7px; }\n      .hpf-glance { gap: 3px; }\n      .hpf-glance button { padding-inline: 5px; font-size: 11px; gap: 4px; }\n      .hpf-room-photo { height: 120px; }\n      .hpf-photo-caption { padding: 8px; font-size: 11px; }\n      .hpf-photo-shortcut { border-radius: 12px; }\n    }\n    @media (pointer: coarse) {\n      .hpf-glance button, .hpf-view button, .hpf-cover-actions button, .hpf-footer button { min-height: 44px; }\n      .hpf-view button { min-width: 42px; }\n    }\n    @media (max-width: 360px) {\n      .hpf-name-full { display: none; }\n      .hpf-name-micro { display: inline; }\n      .hpf-mode-long { display: none; }\n      .hpf-mode-short { display: inline; }\n    }\n    @media (prefers-reduced-motion: reduce) { .hpf-room-floor { transition: none; } }\n  ';

// src/candidate/home-plan-card.js
var VERSION = "0.1.0-rc.2";
var ENTITY = /^[a-z_]+\.[a-z0-9_]+$/;
var BAD = /* @__PURE__ */ new Set(["unknown", "unavailable"]);
var ALERT_CLASSES = /* @__PURE__ */ new Set(["smoke", "gas", "moisture", "problem", "tamper", "battery", "safety"]);
var OPEN_CLASSES = /* @__PURE__ */ new Set(["door", "window", "opening", "garage_door"]);
var MODES = [["", "home", "Pièces"], ["lights", "lightbulb", "Lumières"], ["temperature", "thermometer", "Temp."], ["openings", "door-open", "Ouvertures"], ["covers", "blinds", "Volets"]];
var ICON = { home: "mdi:home-outline", house: "mdi:home-outline", lightbulb: "mdi:lightbulb-outline", thermometer: "mdi:thermometer", "door-open": "mdi:door-open", blinds: "mdi:blinds-horizontal", sofa: "mdi:sofa-outline", waves: "mdi:pool", sun: "mdi:white-balance-sunny", armchair: "mdi:seat-outline", bath: "mdi:bathtub-outline", "washing-machine": "mdi:washing-machine", "cooking-pot": "mdi:countertop-outline", utensils: "mdi:silverware-fork-knife", "briefcase-business": "mdi:desk", "bed-double": "mdi:bed-outline", "door-closed": "mdi:door-closed", x: "mdi:close", "chevron-right": "mdi:chevron-right", "chevron-up": "mdi:chevron-up", "chevron-down": "mdi:chevron-down", square: "mdi:stop", "shield-check": "mdi:shield-check-outline", "circle-alert": "mdi:alert-circle-outline", tv: "mdi:television", bot: "mdi:robot-vacuum", refrigerator: "mdi:fridge-outline", "panels-top-left": "mdi:window-closed-variant", smoke: "mdi:smoke-detector-variant", plus: "mdi:plus", settings: "mdi:cog-outline" };
var icon = (name) => b2`<ha-icon icon=${ICON[name] || name || "mdi:circle-small"} aria-hidden="true"></ha-icon>`;
var copy = (value) => structuredClone(value);
function validEntity(id) {
  return typeof id === "string" && ENTITY.test(id);
}
function known(state) {
  return !!state && !BAD.has(state.state);
}
function coverPosition(state) {
  const n5 = state?.attributes?.current_position;
  return typeof n5 === "number" && Number.isFinite(n5) && n5 >= 0 && n5 <= 100 ? n5 : null;
}
function coverText(state) {
  if (!state) return "Entité introuvable";
  if (state.state === "unavailable") return "Indisponible";
  if (state.state === "opening") return "Ouverture…";
  if (state.state === "closing") return "Fermeture…";
  const p4 = coverPosition(state);
  return p4 === 0 ? "Fermé" : p4 === 100 ? "Ouvert" : p4 !== null ? `${p4} % ouvert` : state.state === "closed" ? "Fermé" : state.state === "open" ? "Ouvert · position inconnue" : "Position inconnue";
}
function validateConfig(config) {
  if (!config || typeof config !== "object") throw Error("Configuration du plan requise.");
  const result = copy(config);
  for (const key of ["rooms", "apertures", "markers"]) {
    if (result[key] !== void 0 && !Array.isArray(result[key])) throw Error(`${key} doit être une liste.`);
    result[key] ||= [];
    if (result[key].length > 200) throw Error("Trop d’éléments dans le plan.");
    const seen = /* @__PURE__ */ new Set();
    for (const item of result[key]) {
      if (!item.id || typeof item.id !== "string" || seen.has(item.id)) throw Error(`Identifiant ${key} absent ou dupliqué.`);
      seen.add(item.id);
      for (const [field, value] of Object.entries(item)) if (field.endsWith("_entity") && value && !validEntity(value)) throw Error(`Entité invalide : ${field}`);
      if (item.entity && !validEntity(item.entity)) throw Error("Équipement de repère invalide.");
      if (item.excluded_entities && (!Array.isArray(item.excluded_entities) || item.excluded_entities.some((e6) => !validEntity(e6)))) throw Error("Liste d’exclusions invalide.");
      if (item.entities && (!Array.isArray(item.entities) || item.entities.some((e6) => !validEntity(e6)))) throw Error("Liste d’équipements invalide.");
      if (item.point && (!Array.isArray(item.point) || item.point.length !== 2 || !item.point.every(Number.isFinite))) throw Error("Position de repère invalide.");
    }
  }
  return result;
}
function sanitizeArtwork(markup) {
  const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${markup || ""}</svg>`, "image/svg+xml");
  if (doc.querySelector("parsererror")) throw Error("Tracé du plan invalide.");
  const tags = /* @__PURE__ */ new Set(["svg", "g", "path", "rect", "line", "polyline", "polygon", "circle", "ellipse"]);
  const attrs = /* @__PURE__ */ new Set(["class", "d", "x", "y", "x1", "x2", "y1", "y2", "width", "height", "rx", "ry", "cx", "cy", "r", "points", "transform"]);
  for (const el of [...doc.documentElement.querySelectorAll("*")]) {
    if (!tags.has(el.localName)) {
      el.remove();
      continue;
    }
    for (const a3 of [...el.attributes]) if (!attrs.has(a3.name)) el.removeAttribute(a3.name);
  }
  return doc.documentElement.innerHTML;
}
function safeImage(url) {
  return typeof url === "string" && (/^\/local\//.test(url) || /^data:image\/(jpeg|png|webp);base64,/.test(url)) ? url : "";
}
function validateModel(model) {
  if (!model || !Array.isArray(model.rooms) || model.rooms.length > 200) throw Error("Pièces du plan invalides.");
  if (!Array.isArray(model.bounds) || model.bounds.length !== 4 || !model.bounds.every(Number.isFinite) || model.bounds[2] <= 0 || model.bounds[3] <= 0) throw Error("Dimensions du plan invalides.");
  const seen = /* @__PURE__ */ new Set();
  for (const r4 of model.rooms) {
    if (!r4.id || seen.has(r4.id)) throw Error("Identifiant de pièce absent ou dupliqué.");
    seen.add(r4.id);
  }
  return { ...copy(model), artwork: sanitizeArtwork(model.artwork) };
}
var HomePlanCard = class extends i4 {
  static properties = { hass: {}, _config: { state: true }, _model: { state: true }, _registry: { state: true }, _registryError: { state: true }, _selected: { state: true }, _quick: { state: true }, _view: { state: true }, _mode: { state: true }, _error: { state: true }, _feedback: { state: true }, _busy: { state: true }, _photoMode: { state: true }, _photos: { state: true }, _showAlerts: { state: true } };
  static styles = [r(home_plan_card_default), i`
    :host{--ha-card-border-width:0} .hpf-home{max-width:none;border-radius:var(--ha-card-border-radius,24px);box-shadow:none;background:var(--ha-card-background,var(--card-background-color,#fff));--hp-paper:var(--ha-card-background,var(--card-background-color,#fff));--hp-ink:var(--primary-text-color);--hp-secondary:var(--secondary-text-color)}
    ha-icon{--mdc-icon-size:18px;width:18px;height:18px;display:inline-flex;flex-shrink:0}button{cursor:pointer}button:focus-visible{outline:2px solid var(--hp-blue);outline-offset:2px}
    .hpf-home-mark ha-icon{--mdc-icon-size:22px;width:22px;height:22px}.hpf-glance ha-icon{--mdc-icon-size:15px;width:15px;height:15px}.hpf-modebar ha-icon{--mdc-icon-size:19px;width:19px;height:19px}.hpf-cover-actions ha-icon,.hpf-aperture ha-icon{--mdc-icon-size:14px;width:14px;height:14px}
    .hpf-sheet{position:absolute;inset:auto 0 0;border:0;border-top:1px solid var(--hp-line);border-radius:23px 23px 0 0;max-height:95%;overflow-y:auto;margin-top:8px;width:auto}.hpf-sheet-head h3{font-size:19px}.hpf-sheet[hidden]{display:none}
    .hpf-sheet-head{margin-bottom:10px}.hpf-close ha-icon{--mdc-icon-size:20px}.hpf-state{font-size:12px;color:var(--hp-secondary);padding:5px 16px 12px}.hpf-state.is-error{color:var(--error-color,#b3261e)}
    .hpf-cover-caption{flex-wrap:wrap;gap:6px}.hpf-cover-caption span{flex:1;min-width:110px}.hpf-cover-caption output{font-size:12px}.hpf-cover input{min-height:44px;margin:2px 0}.hpf-cover-actions button{min-height:44px}.hpf-room-tile ha-icon{display:block;margin-bottom:8px;--mdc-icon-size:20px}
    .hpf-more{display:flex;width:100%;gap:8px;align-items:center;justify-content:space-between;min-height:44px;text-align:left;border:0;border-bottom:1px solid var(--hp-line);padding:9px 0;background:transparent;font-size:12px}.hpf-more span:last-child{margin-left:auto;text-align:right;color:var(--hp-secondary)}
    .hpf-map .hpf-room-marker{position:absolute;z-index:3;transform:translate(-50%,-50%);display:grid;place-items:center;width:44px;height:44px;border:0;background:transparent;border-radius:10px}.hpf-room-marker ha-icon{background:var(--hp-paper);border-radius:5px;padding:2px;box-sizing:content-box;color:var(--hp-secondary)}.hpf-room-marker.is-alert ha-icon{color:var(--error-color,#b3261e);background:var(--hp-alert-bg)}
    .hpf-room-name .hpf-problem{color:var(--error-color,#b3261e)}.hpf-empty{padding:16px}.hpf-photo-caption ha-icon{width:14px;height:14px;--mdc-icon-size:14px}.hpf-device-grid{grid-template-columns:repeat(auto-fit,minmax(125px,1fr))}.hpf-device ha-icon{width:22px;height:22px;--mdc-icon-size:22px}.hpf-opening strong{white-space:nowrap}.hpf-cover-state{color:var(--hp-blue)}.hpf-footer .hpf-footer-copy{line-height:1.4}.hpf-danger{color:var(--error-color,#b3261e)}
  `];
  constructor() {
    super();
    this._config = { rooms: [], apertures: [], markers: [] };
    this._view = "plan";
    this._mode = "";
    this._selected = null;
    this._quick = null;
    this._showAlerts = false;
    this._error = "";
    this._feedback = "";
    this._busy = /* @__PURE__ */ new Set();
    this._photoMode = /* @__PURE__ */ new Set();
    this._photos = {};
    this._epoch = 0;
    this._unsubs = [];
    this._pulseTimers = /* @__PURE__ */ new Set();
    this._observed = /* @__PURE__ */ new Set();
    this._registry = { entities: {}, devices: {}, areas: {} };
  }
  static getConfigElement() {
    return document.createElement("home-plan-card-editor");
  }
  static getStubConfig() {
    return { name: "Maison", floor: "Rez-de-chaussée", rooms: [], apertures: [], markers: [] };
  }
  setConfig(config) {
    this._commandEpoch = (this._commandEpoch || 0) + 1;
    clearTimeout(this._feedbackTimer);
    this._pulseTimers.forEach(clearTimeout);
    this._pulseTimers.clear();
    this._busy = /* @__PURE__ */ new Set();
    this._feedback = "";
    this._config = validateConfig(config);
    this._selected = null;
    this._quick = null;
    this._showAlerts = false;
    this._error = "";
    this._loadModel();
  }
  getCardSize() {
    return 10;
  }
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6 };
  }
  connectedCallback() {
    super.connectedCallback();
    this._epoch++;
    this._loadModel();
    this._startRegistry();
  }
  disconnectedCallback() {
    this._epoch++;
    this._modelRequest?.abort();
    this._modelRequest = null;
    this._modelLoading = false;
    this._registryLoading = false;
    this._unsubs.splice(0).forEach((fn) => fn());
    clearTimeout(this._feedbackTimer);
    this._pulseTimers.forEach(clearTimeout);
    this._pulseTimers.clear();
    this._busy = /* @__PURE__ */ new Set();
    super.disconnectedCallback();
  }
  updated(changed) {
    if (changed.has("hass")) {
      this.toggleAttribute("dark", !!this.hass?.themes?.darkMode);
      if (!this._registryLoaded && !this._registryLoading) this._startRegistry();
    }
  }
  shouldUpdate(changed) {
    if (changed.size === 1 && changed.has("hass")) {
      const old = changed.get("hass");
      if (old && old.entities === this.hass?.entities && old.devices === this.hass?.devices && old.themes === this.hass?.themes && old.locale === this.hass?.locale && [...this._observed].every((id) => old.states?.[id] === this.hass?.states?.[id])) return false;
    }
    return true;
  }
  async _loadModel() {
    if (!this.isConnected) return;
    this._modelRequest?.abort();
    const abort = new AbortController();
    this._modelRequest = abort;
    const epoch = this._epoch;
    try {
      let model = this._config.model;
      if (!model && this._config.model_url) {
        const u5 = new URL(this._config.model_url, location.origin);
        if (u5.origin !== location.origin || !u5.pathname.startsWith("/local/")) throw Error("Le plan doit être un fichier local Home Assistant.");
        const response = await fetch(u5, { signal: abort.signal });
        if (!response.ok) throw Error(`Chargement du plan : HTTP ${response.status}`);
        const text = await response.text();
        if (text.length > 3e6) throw Error("Plan trop volumineux.");
        model = JSON.parse(text);
      }
      if (!model) model = { bounds: [0, 0, 100, 100], rooms: [], artwork: "" };
      const prepared = validateModel(model);
      if (abort.signal.aborted || epoch !== this._epoch || !this.isConnected) return;
      this._model = prepared;
      this._error = "";
    } catch (e6) {
      if (e6.name !== "AbortError" && epoch === this._epoch && this.isConnected) this._error = e6.message;
    }
  }
  async _startRegistry() {
    if (!this.isConnected || !this.hass?.callWS || this._registryLoading) return;
    this._registryLoading = true;
    const epoch = this._epoch;
    try {
      if (!this._unsubs.length && this.hass.connection?.subscribeEvents) {
        for (const type of ["entity_registry_updated", "device_registry_updated", "area_registry_updated"]) {
          const fn = await this.hass.connection.subscribeEvents(() => {
            this._registryLoaded = false;
            this._registryDirty = true;
            this._startRegistry();
          }, type);
          if (epoch !== this._epoch || !this.isConnected) {
            fn();
            return;
          }
          this._unsubs.push(fn);
        }
      }
      this._registryDirty = false;
      const [entities, devices, areas] = await Promise.all(["entity", "device", "area"].map((k2) => this.hass.callWS({ type: `config/${k2}_registry/list` })));
      if (epoch !== this._epoch || !this.isConnected) return;
      this._registry = { entities: Object.fromEntries(entities.map((e6) => [e6.entity_id, e6])), devices: Object.fromEntries(devices.map((d3) => [d3.id || d3.device_id, d3])), areas: Object.fromEntries(areas.map((a3) => [a3.area_id, a3])) };
      this._registryLoaded = true;
      this._registryError = "";
    } catch {
      if (epoch === this._epoch) {
        this._registryLoaded = true;
        this._registryError = "Associations automatiques indisponibles · équipements configurés conservés";
      }
    } finally {
      if (epoch === this._epoch) {
        this._registryLoading = false;
        if (this._registryDirty) this._startRegistry();
      }
    }
  }
  _state(id) {
    if (id) this._observed.add(id);
    return this.hass?.states?.[id];
  }
  _name(id) {
    const s5 = this._state(id);
    return s5?.attributes?.friendly_name || id;
  }
  _format(id) {
    const s5 = this._state(id);
    if (!s5) return "Entité introuvable";
    if (s5.state === "unavailable") return "Indisponible";
    if (s5.state === "unknown") return "Inconnu";
    if (this.hass?.formatEntityState) return this.hass.formatEntityState(s5);
    return s5.state + (s5.attributes?.unit_of_measurement ? " " + s5.attributes.unit_of_measurement : "");
  }
  _rooms() {
    const overrides = new Map(this._config.rooms.map((r4) => [r4.id, r4]));
    return (this._model?.rooms || []).map((r4) => ({ ...r4, ...overrides.get(r4.id) }));
  }
  _apertures() {
    const overrides = new Map(this._config.apertures.map((a3) => [a3.id, a3]));
    return (this._model?.apertures || []).map((a3) => ({ ...a3, ...overrides.get(a3.id) }));
  }
  _markers() {
    const overrides = new Map(this._config.markers.map((a3) => [a3.id, a3]));
    const base = (this._model?.markers || []).map((a3) => ({ ...a3, ...overrides.get(a3.id) }));
    const ids = new Set(base.map((m3) => m3.id));
    return [...base, ...this._config.markers.filter((m3) => !ids.has(m3.id))];
  }
  _entities(r4) {
    if (this._roomEntityCache?.has(r4.id)) return this._roomEntityCache.get(r4.id);
    const explicit = [...r4.entities || [], r4.temperature_entity, r4.light_entity, ...this._apertures().filter((a3) => a3.room === r4.id).flatMap((a3) => [a3.cover_entity, a3.opening_entity, a3.command_entity]), ...this._markers().filter((a3) => a3.room === r4.id).map((a3) => a3.entity)];
    const reg = this._registry.entities, devices = this._registry.devices;
    if (r4.auto_area && r4.area_id) for (const e6 of Object.values(reg)) {
      if (e6.disabled_by || e6.hidden_by || e6.entity_category || r4.excluded_entities?.includes(e6.entity_id)) continue;
      const area = e6.area_id || devices[e6.device_id]?.area_id;
      if (area !== r4.area_id) continue;
      const s5 = this.hass?.states?.[e6.entity_id], d3 = e6.entity_id.split(".")[0], cls = s5?.attributes?.device_class;
      if (["light", "cover", "fan", "climate", "vacuum", "media_player"].includes(d3) || d3 === "sensor" && ["temperature", "humidity", "battery", "power", "energy", "carbon_dioxide", "volatile_organic_compounds"].includes(cls) || d3 === "binary_sensor" && (OPEN_CLASSES.has(cls) || ALERT_CLASSES.has(cls))) explicit.push(e6.entity_id);
    }
    const ids = [...new Set(explicit.filter(validEntity))];
    ids.forEach((id) => this._observed.add(id));
    this._roomEntityCache?.set(r4.id, ids);
    return ids;
  }
  _lights(r4) {
    const ids = this._entities(r4).filter((e6) => e6.startsWith("light."));
    const members = new Set(ids.flatMap((id) => this._state(id)?.attributes?.entity_id || []));
    return ids.filter((id) => !members.has(id));
  }
  _covers(r4) {
    return this._entities(r4).filter((e6) => e6.startsWith("cover."));
  }
  _openings(r4) {
    return [...new Set(this._apertures().filter((a3) => a3.room === r4.id && a3.opening_entity).map((a3) => a3.opening_entity))];
  }
  _temperature(r4) {
    return r4.temperature_entity || this._entities(r4).find((id) => this._state(id)?.attributes?.device_class === "temperature" && id.startsWith("sensor."));
  }
  _problems(r4) {
    return this._entities(r4).filter((id) => {
      const s5 = this._state(id), cls = s5?.attributes?.device_class;
      return known(s5) && (id.startsWith("binary_sensor.") && ALERT_CLASSES.has(cls) && s5.state === "on" || id.startsWith("sensor.") && cls === "battery" && Number(s5.state) <= 20);
    });
  }
  _matches(r4) {
    return !this._mode || this._mode === "lights" && this._lights(r4).some((id) => this._state(id)?.state === "on") || this._mode === "covers" && this._covers(r4).length || this._mode === "temperature" && this._temperature(r4) || this._mode === "openings" && this._openings(r4).some((id) => this._state(id)?.state === "on");
  }
  _status(r4) {
    const p4 = this._problems(r4), o7 = this._openings(r4).filter((id) => this._state(id)?.state === "on"), temp = this._temperature(r4);
    if (p4.length) return `${p4.length} alerte${p4.length > 1 ? "s" : ""}`;
    if (o7.length) return `${o7.length} ouverture${o7.length > 1 ? "s" : ""}`;
    if (temp) return this._format(temp);
    const c5 = this._covers(r4);
    return c5.length === 1 ? coverText(this._state(c5[0])) : c5.length ? `${c5.length} volets` : this._entities(r4).length ? "Équipements de la pièce" : "Aucun équipement associé";
  }
  _photo(r4) {
    return safeImage(r4.illustration && !this._photoMode.has(r4.id) ? r4.illustration : r4.photos?.[this._photos[r4.id] || 0]);
  }
  _more(id) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true }));
  }
  _select(r4, opener) {
    this._opener = opener;
    this._selected = r4.id;
    this._quick = null;
    this._showAlerts = false;
    this._focusSheet();
  }
  _aperture(a3, opener) {
    this._opener = opener;
    this._selected = a3.room;
    this._quick = a3.id;
    this._showAlerts = false;
    this._focusSheet();
  }
  async _focusSheet() {
    await this.updateComplete;
    this.renderRoot.querySelector(".hpf-sheet [data-close]")?.focus({ preventScroll: true });
    this.renderRoot.querySelector(".hpf-sheet")?.scrollIntoView({ behavior: "auto", block: "nearest" });
  }
  _close() {
    this._selected = null;
    this._quick = null;
    this._showAlerts = false;
    this.updateComplete.then(() => this._opener?.isConnected && this._opener.focus({ preventScroll: true }));
  }
  async _send(entity, service, data = {}) {
    const [domain, action] = service.split(".");
    const state = this._state(entity);
    if (!validEntity(entity) || !state || state.state === "unavailable") return;
    const allowed = { light: ["turn_on", "turn_off"], cover: ["open_cover", "close_cover", "stop_cover", "set_cover_position"], switch: ["turn_on", "turn_off"] };
    if (!allowed[domain]?.includes(action) || entity.split(".")[0] !== domain) throw Error("Commande non autorisée.");
    if (this._busy.has(entity)) return;
    const epoch = this._epoch, generation = this._commandEpoch;
    this._busy = /* @__PURE__ */ new Set([...this._busy, entity]);
    this._feedback = "Envoi de la commande…";
    clearTimeout(this._feedbackTimer);
    try {
      await this.hass.callService(domain, action, data, { entity_id: entity });
      if (epoch === this._epoch && generation === this._commandEpoch && this.isConnected) this._feedback = domain === "switch" ? "Impulsion envoyée · état physique non suivi" : "Commande envoyée · état affiché selon le retour de l’équipement";
    } catch (e6) {
      if (epoch === this._epoch && generation === this._commandEpoch && this.isConnected) this._feedback = "Échec de la commande : " + (e6.message || String(e6));
    } finally {
      if (epoch === this._epoch && generation === this._commandEpoch && this.isConnected) {
        if (domain === "switch") {
          const timer = setTimeout(() => {
            this._pulseTimers.delete(timer);
            if (epoch === this._epoch && generation === this._commandEpoch && this.isConnected) this._busy = new Set([...this._busy].filter((id) => id !== entity));
          }, 2e3);
          this._pulseTimers.add(timer);
        } else this._busy = new Set([...this._busy].filter((id) => id !== entity));
        this._feedbackTimer = setTimeout(() => {
          this._feedback = "";
        }, 7e3);
      }
    }
  }
  _cover(entity, name) {
    const s5 = this._state(entity), p4 = coverPosition(s5), f3 = s5?.attributes?.supported_features || 0, disabled = !s5 || s5.state === "unavailable" || this._busy.has(entity);
    return b2`<div class="hpf-cover" data-entity=${entity}><label class="hpf-cover-caption">${icon("blinds")}<span>${name || this._name(entity)}</span><output>${coverText(s5)}</output></label><input aria-label=${"Pourcentage d’ouverture de " + (name || this._name(entity))} type="range" min="0" max="100" .value=${String(p4 ?? 50)} ?disabled=${disabled || p4 === null || !(f3 & 4)} @change=${(e6) => this._send(entity, "cover.set_cover_position", { position: Number(e6.target.value) })}><div class="hpf-cover-actions"><button ?disabled=${disabled || !(f3 & 1)} @click=${() => this._send(entity, "cover.open_cover")}>${icon("chevron-up")}Ouvrir</button><button ?disabled=${disabled || !(f3 & 8)} @click=${() => this._send(entity, "cover.stop_cover")}>${icon("square")}Arrêter</button><button ?disabled=${disabled || !(f3 & 2)} @click=${() => this._send(entity, "cover.close_cover")}>${icon("chevron-down")}Fermer</button></div></div>`;
  }
  _opening(entity, name) {
    const s5 = this._state(entity);
    return b2`<div class=${"hpf-opening " + (s5?.state === "on" ? "is-open" : "")}>${icon(s5?.attributes?.device_class === "window" ? "panels-top-left" : "door-open")}<span>${name || this._name(entity)}</span><strong>${known(s5) ? s5.state === "on" ? "Ouverte" : "Fermée" : s5?.state === "unavailable" ? "Indisponible" : "État inconnu"}</strong></div>`;
  }
  _equipment(id) {
    const s5 = this._state(id);
    return b2`<button class="hpf-more" @click=${() => this._more(id)}>${icon(s5?.attributes?.icon || (s5?.attributes?.device_class === "smoke" ? "smoke" : "settings"))}<span>${this._name(id)}</span><span>${this._format(id)}</span></button>`;
  }
  _sheet(rooms) {
    const r4 = rooms.find((r5) => r5.id === this._selected), a3 = this._apertures().find((a4) => a4.id === this._quick);
    if (this._showAlerts) return b2`<section class="hpf-sheet" role="region" aria-label="Alertes"><div class="hpf-sheet-head"><h3>À vérifier</h3><button class="hpf-close" data-close aria-label="Revenir au plan" @click=${this._close}>${icon("x")}</button></div>${rooms.map((r5) => b2`${this._problems(r5).map((id) => this._equipment(id))}${this._openings(r5).filter((id) => this._state(id)?.state === "on").map((id) => this._equipment(id))}`)}</section>`;
    if (!r4) return A;
    const covered = a3?.cover_entity ? [a3.cover_entity] : this._covers(r4), opening = a3?.opening_entity ? [a3.opening_entity] : this._openings(r4), lights = this._lights(r4), photo = this._photo(r4);
    const main = /* @__PURE__ */ new Set([...covered, ...opening, ...lights, this._temperature(r4)]);
    const rest = this._entities(r4).filter((id) => !main.has(id) && id !== a3?.command_entity);
    return b2`<section class="hpf-sheet" role="region" aria-label=${a3?.name || r4.name} @keydown=${(e6) => {
      if (e6.key === "Escape") this._close();
    }}><div class="hpf-sheet-head"><div><h3>${a3?.name || r4.name}</h3><span class="hpf-sheet-sub">${a3 ? r4.name : this._temperature(r4) ? this._format(this._temperature(r4)) : this._config.floor || this._model?.floor || ""}</span></div><button class="hpf-close" data-close aria-label="Revenir au plan" @click=${this._close}>${icon("x")}</button></div>
      ${!a3 && photo ? b2`<div class="hpf-room-photo"><img src=${photo} alt=${(r4.illustration && !this._photoMode.has(r4.id) ? "Illustration de " : "Photo de ") + r4.name}>${r4.illustration ? b2`<button class="hpf-photo-style" @click=${() => {
      const set = new Set(this._photoMode);
      set.has(r4.id) ? set.delete(r4.id) : set.add(r4.id);
      this._photoMode = set;
    }}>${this._photoMode.has(r4.id) ? "Voir l’illustration" : "Voir la photo"}</button>` : A}${r4.photos?.length > 1 && this._photoMode.has(r4.id) ? b2`<button class="hpf-photo-next" @click=${() => this._photos = { ...this._photos, [r4.id]: ((this._photos[r4.id] || 0) + 1) % r4.photos.length }}>${(this._photos[r4.id] || 0) + 1} / ${r4.photos.length}</button>` : A}</div>` : A}
      ${!a3 && lights.length ? b2`<div class="hpf-device-grid">${c4(lights, (id) => id, (id) => {
      const s5 = this._state(id);
      return b2`<button class=${"hpf-device " + (s5?.state === "on" ? "is-lit" : "")} ?disabled=${!known(s5) || this._busy.has(id)} aria-pressed=${s5?.state === "on"} @click=${() => this._send(id, s5.state === "on" ? "light.turn_off" : "light.turn_on")}>${icon("lightbulb")}<span><strong>${this._name(id)}</strong><small>${this._format(id)}</small></span></button>`;
    })}</div>` : A}
      ${c4(covered, (id) => id, (id) => this._cover(id))}${opening.map((id) => this._opening(id))}
      ${a3?.command_entity ? b2`<div class="hpf-cover"><div class="hpf-cover-caption">${icon("door-open")}<span>Porte motorisée</span></div><p class="hpf-sheet-sub">État physique non suivi · commande par impulsion</p><button class="hpf-device" data-command=${a3.command_entity} ?disabled=${!this._state(a3.command_entity) || this._state(a3.command_entity)?.state === "unavailable" || this._busy.has(a3.command_entity)} @click=${() => this._send(a3.command_entity, "switch.turn_on")}>${icon("door-open")}Actionner la porte</button><button class="hpf-more" @click=${() => this._more(a3.command_entity)}>${icon("settings")}Détails de l’équipement${icon("chevron-right")}</button></div>` : A}
      ${!a3 ? b2`${rest.filter((id) => this._state(id)?.attributes?.device_class === "smoke").map((id) => this._equipment(id))}${rest.some((id) => this._state(id)?.attributes?.device_class !== "smoke") ? b2`<details><summary>Autres équipements (${rest.filter((id) => this._state(id)?.attributes?.device_class !== "smoke").length})</summary>${rest.filter((id) => this._state(id)?.attributes?.device_class !== "smoke").map((id) => this._equipment(id))}</details>` : A}` : b2`<button class="hpf-quick-room" @click=${(e6) => this._select(r4, e6.currentTarget)}>${icon(r4.icon)}Voir la pièce${icon("chevron-right")}</button>`}
      ${!this._entities(r4).length ? b2`<p class="hpf-empty">Aucun équipement associé. Ajoutez-les dans l’éditeur de la carte.</p>` : A}
    </section>`;
  }
  _map(rooms) {
    const b3 = this._model.bounds, apertures = this._apertures(), markers = this._markers(), pct = (v3, i7) => (v3 - b3[i7]) / b3[i7 + 2] * 100;
    const pointStyle = (p4) => `left:clamp(22px,${pct(p4[0], 0)}%,calc(100% - 22px));top:${pct(p4[1], 1)}%`;
    const selected = rooms.find((r4) => r4.id === this._selected) || rooms.find((r4) => r4.id === this._model.preview?.room);
    return b2`<div class="hpf-map" style=${`aspect-ratio:${b3[2]}/${b3[3]}`}>
      <svg class="hpf-drawing" viewBox=${b3.join(" ")} role="img" aria-label=${"Plan du " + (this._config.floor || this._model.floor || "niveau")}><title>Pièces et équipements</title>${rooms.map((r4) => w`<path class=${`hpf-room-floor ${this._lights(r4).some((id) => this._state(id)?.state === "on") ? "is-lit" : ""} ${r4.id === this._selected ? "is-selected" : ""} ${this._matches(r4) ? "" : "is-muted"}`} d=${r4.path || ""}/>`)}${o6(this._model.artwork)}</svg>
      ${c4(rooms, (r4) => r4.id, (r4) => {
      const [x2, y3, w2, h4] = r4.hit || [r4.x, r4.y, r4.w, r4.h], l3 = r4.label || [x2 + w2 / 2, y3 + h4 / 2], temp = this._temperature(r4), opens = this._openings(r4).some((id) => this._state(id)?.state === "on"), problems = this._problems(r4);
      return b2`<button class=${`hpf-zone ${opens ? "has-opening" : ""} ${this._matches(r4) ? "" : "is-muted"}`} style=${`left:${pct(x2, 0)}%;top:${pct(y3, 1)}%;width:${w2 / b3[2] * 100}%;height:${h4 / b3[3] * 100}%`} aria-label=${r4.name + ", " + this._status(r4)} aria-pressed=${r4.id === this._selected} @click=${(e6) => this._select(r4, e6.currentTarget)}><span class="hpf-room-name" ?hidden=${r4.hide_label} style=${`left:${(l3[0] - x2) / w2 * 100}%;top:${(l3[1] - y3) / h4 * 100}%`}><strong><span class="hpf-name-full">${r4.short || r4.name}</span><span class="hpf-name-micro">${r4.micro || r4.short || r4.name}</span>${opens || problems.length ? b2`<span class=${"hpf-room-alert " + (problems.length ? "hpf-problem" : "")}>!</span>` : A}</strong>${temp ? b2`<small>${this._format(temp)}</small>` : this._lights(r4).some((id) => this._state(id)?.state === "on") ? b2`<span class="hpf-dot"></span>` : A}</span></button>`;
    })}
      <svg class="hpf-aperture-layer" viewBox=${b3.join(" ")} aria-hidden="true">${apertures.map((a3) => {
      const s5 = a3.segment;
      if (!s5 || s5.length !== 4) return A;
      const p4 = `M${s5[0]} ${s5[1]}L${s5[2]} ${s5[3]}`, o7 = this._state(a3.opening_entity), c5 = this._state(a3.cover_entity), pos = coverPosition(c5), vertical = s5[0] === s5[2], shift = vertical ? -12 : 12, parallel = `M${s5[0] + (vertical ? shift : 0)} ${s5[1] + (vertical ? 0 : shift)}L${s5[2] + (vertical ? shift : 0)} ${s5[3] + (vertical ? 0 : shift)}`;
      return w`${o7?.state === "on" ? w`<path class="aperture-halo" d=${p4}/>` : A}<path class=${"aperture-line " + (o7?.state === "on" ? "is-open" : "")} d=${p4} data-map-aperture=${a3.id} @click=${(e6) => this._aperture(a3, this.renderRoot.querySelector(`[data-aperture="${CSS.escape(a3.id)}"]`))}/>${a3.cover_entity ? w`<path class="shutter-track" d=${parallel}/>${pos !== null ? w`<path class="shutter-fill" d=${parallel} pathLength="100" stroke-dasharray=${`${100 - pos} 100`}/>` : A}${this._mode === "covers" && a3.control ? w`<path class="aperture-leader" d=${`M${(s5[0] + s5[2]) / 2} ${(s5[1] + s5[3]) / 2}L${a3.control[0]} ${a3.control[1]}`}/>` : A}` : A}`;
    })}</svg>
      ${apertures.filter((a3) => a3.cover_entity || a3.command_entity || a3.opening_entity).map((a3) => {
      const p4 = a3.control || [(a3.segment[0] + a3.segment[2]) / 2, (a3.segment[1] + a3.segment[3]) / 2], o7 = this._state(a3.opening_entity), c5 = this._state(a3.cover_entity), r4 = rooms.find((r5) => r5.id === a3.room);
      return b2`<button data-aperture=${a3.id} class=${`hpf-aperture ${a3.cover_entity ? "has-cover" : ""} ${this._mode === "covers" ? "show-value" : ""} ${o7?.state === "on" ? "is-open" : ""} ${r4 && this._matches(r4) ? "" : "is-muted"}`} style=${pointStyle(p4)} aria-label=${a3.name + (a3.cover_entity ? ", " + coverText(c5) : "")} @click=${(e6) => this._aperture(a3, e6.currentTarget)}><span class="hpf-aperture-mark">${icon(a3.cover_entity ? "blinds" : o7?.state === "off" ? "door-closed" : "door-open")}${a3.cover_entity ? b2`<span>${coverPosition(c5) === 0 ? "Fermé" : coverPosition(c5) === 100 ? "Ouvert" : coverPosition(c5) !== null ? coverPosition(c5) + " %" : "?"}</span>` : A}</span></button>`;
    })}
      ${markers.filter((m3) => m3.entity && m3.point && (!this._mode || this._mode === "openings" || this._state(m3.entity)?.state === "on")).map((m3) => b2`<button class=${"hpf-room-marker " + (this._state(m3.entity)?.state === "on" ? "is-alert" : "")} style=${pointStyle(m3.point)} aria-label=${this._name(m3.entity) + ", " + this._format(m3.entity)} @click=${() => this._more(m3.entity)}>${icon(m3.icon || "smoke")}</button>`)}
      ${selected && this._photo(selected) && this._model.preview ? b2`<button class="hpf-photo-shortcut" style=${`left:${pct(this._model.preview.x, 0)}%;top:${pct(this._model.preview.y, 1)}%;width:${this._model.preview.w / b3[2] * 100}%;height:${this._model.preview.h / b3[3] * 100}%`} @click=${(e6) => this._select(selected, e6.currentTarget)}><img src=${this._photo(selected)} alt=${selected.name}><span class="hpf-photo-caption">${selected.short || selected.name}${icon("chevron-right")}</span></button>` : A}
    </div>`;
  }
  render() {
    this._observed = /* @__PURE__ */ new Set();
    this._roomEntityCache = /* @__PURE__ */ new Map();
    if (!this._model) return b2`<ha-card><div class="hpf-empty">${this._error || "Chargement du plan…"}</div></ha-card>`;
    const rooms = this._rooms(), lights = [...new Set(rooms.flatMap((r4) => this._lights(r4)))].filter((id) => this._state(id)?.state === "on"), openingIds = [...new Set(rooms.flatMap((r4) => this._openings(r4)))], open = openingIds.filter((id) => this._state(id)?.state === "on"), unknown = openingIds.filter((id) => !known(this._state(id))), problems = [...new Set(rooms.flatMap((r4) => this._problems(r4)))];
    return b2`<ha-card><section class="hpf-home" aria-label="Plan et commandes de la maison"><header class="hpf-head"><div class="hpf-heading"><span class="hpf-home-mark">${icon("house")}</span><div><h2>${this._config.name || "Maison"}</h2><span class="hpf-floor-name">${this._config.floor || this._model.floor}</span></div></div></header>
      <div class="hpf-tools"><div class="hpf-glance"><button data-light-count aria-pressed=${this._mode === "lights"} @click=${() => this._mode = this._mode === "lights" ? "" : "lights"}>${icon("lightbulb")}${lights.length} lumière${lights.length > 1 ? "s" : ""}</button><button data-open-count aria-pressed=${this._mode === "openings"} @click=${() => this._mode = this._mode === "openings" ? "" : "openings"}>${icon("door-open")}${open.length} ouverture${open.length > 1 ? "s" : ""}${unknown.length ? " · " + unknown.length + " ?" : ""}</button></div><div class="hpf-view" role="group" aria-label="Présentation"><button aria-pressed=${this._view === "plan"} @click=${() => this._view = "plan"}>Plan</button><button aria-pressed=${this._view === "rooms"} @click=${() => this._view = "rooms"}>Pièces</button></div></div>
      <div class="hpf-modebar" role="group" aria-label="Informations sur le plan">${MODES.map(([mode, i7, label]) => b2`<button data-mode=${mode} aria-pressed=${this._mode === mode} aria-label=${label} @click=${() => this._mode = mode}>${icon(i7)}${mode === "openings" ? b2`<span class="hpf-mode-long">${label}</span><span class="hpf-mode-short">Ouv.</span>` : label}</button>`)}</div>
      ${!rooms.length ? b2`<div class="hpf-empty">Ajoutez un plan local et ses pièces dans l’éditeur de la carte.</div>` : this._view === "plan" ? this._map(rooms) : b2`<div class="hpf-room-grid">${rooms.filter((r4) => this._matches(r4)).map((r4) => b2`<button class=${"hpf-room-tile " + (this._problems(r4).length ? "has-opening" : "")} data-room=${r4.id} @click=${(e6) => this._select(r4, e6.currentTarget)}>${icon(r4.icon)}<strong>${r4.name}</strong><small>${this._status(r4)}</small></button>`)}</div>`}
      ${this._view === "plan" ? b2`<div class="hpf-map-legend"><span class="opening-key">${icon("door-open")}Ouverture physique</span><span class="cover-key">${icon("blinds")}${this._mode === "covers" ? "Volet · % d’ouverture" : "Toucher pour commander"}</span></div>` : A}
      <footer class="hpf-footer">${icon(problems.length || open.length ? "circle-alert" : "shield-check")}<span class="hpf-footer-copy">${problems.length ? `${problems.length} alerte${problems.length > 1 ? "s" : ""}` : open.length ? `${open.length} ouverture${open.length > 1 ? "s" : ""} ouverte${open.length > 1 ? "s" : ""}` : unknown.length ? "État de certaines ouvertures inconnu" : "Les ouvertures suivies sont fermées"}</span>${problems.length || open.length ? b2`<button data-alerts @click=${(e6) => {
      this._opener = e6.currentTarget;
      this._showAlerts = true;
      this._focusSheet();
    }}>À vérifier${icon("chevron-right")}</button>` : A}</footer>
      ${this._sheet(rooms)}${this._feedback ? b2`<div class="hpf-state" role="status" aria-live="polite">${this._feedback}</div>` : A}${this._registryError ? b2`<div class="hpf-state">${this._registryError}</div>` : A}${this._error ? b2`<div class="hpf-state is-error" role="alert">${this._error}</div>` : A}
    </section></ha-card>`;
  }
};
var HomePlanCardEditor = class extends i4 {
  static properties = { hass: {}, _config: { state: true }, _room: { state: true }, _marker: { state: true }, _formReady: { state: true }, _formError: { state: true } };
  static styles = i`:host{display:block} .fields{display:grid;gap:16px}select,input{box-sizing:border-box;font:inherit;width:100%;min-height:44px;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;padding:8px}label{display:grid;gap:8px}h3{font-size:16px;margin:8px 0}p{font-size:13px;color:var(--secondary-text-color)}.row{display:flex;gap:8px}.row>*{flex:1}button{font:inherit;min-height:44px;border:0;border-radius:8px;padding:8px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}a{color:var(--primary-color)}`;
  constructor() {
    super();
    this._config = { rooms: [], apertures: [], markers: [] };
    this._room = "";
    this._marker = "";
    this._formReady = !!customElements.get("ha-form");
    this._formError = "";
    this._editorEpoch = 0;
  }
  connectedCallback() {
    super.connectedCallback();
    const epoch = ++this._editorEpoch;
    this._prepareForm(epoch);
  }
  disconnectedCallback() {
    this._editorEpoch++;
    clearTimeout(this._editorWait);
    super.disconnectedCallback();
  }
  async _prepareForm(epoch) {
    if (customElements.get("ha-form")) {
      this._formReady = true;
      return;
    }
    try {
      const helpers = await window.loadCardHelpers?.();
      const tile = helpers?.createCardElement({ type: "tile", entity: "sun.sun" });
      await tile?.constructor.getConfigElement?.();
    } catch {
    }
    if (epoch !== this._editorEpoch || !this.isConnected) return;
    const ready = await Promise.race([customElements.whenDefined("ha-form").then(() => true), new Promise((resolve) => {
      this._editorWait = setTimeout(() => resolve(false), 6e3);
    })]);
    clearTimeout(this._editorWait);
    if (epoch === this._editorEpoch && this.isConnected) {
      this._formReady = ready;
      this._formError = ready ? "" : "Éditeur natif indisponible. Fermez puis rouvrez l’éditeur de la carte.";
    }
  }
  setConfig(config) {
    this._config = validateConfig(config);
    if (!this._config.rooms.some((r4) => r4.id === this._room)) this._room = this._config.rooms[0]?.id || "";
  }
  _change(patch) {
    this._config = { ...this._config, ...patch };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: copy(this._config) }, bubbles: true, composed: true }));
  }
  _roomChange(patch) {
    this._change({ rooms: this._config.rooms.map((r4) => r4.id === this._room ? { ...r4, ...patch } : r4) });
  }
  _markerChange(patch) {
    this._change({ markers: this._config.markers.map((m3) => m3.id === this._marker ? { ...m3, ...patch } : m3) });
  }
  render() {
    if (!this._formReady) return b2`<p>${this._formError || "Chargement de l’éditeur natif…"}</p>`;
    const r4 = this._config.rooms.find((r5) => r5.id === this._room), m3 = this._config.markers.find((m4) => m4.id === this._marker);
    return b2`<div class="fields"><label>Nom de la carte<input .value=${this._config.name || "Maison"} @change=${(e6) => this._change({ name: e6.target.value })}></label><label>Fichier du plan<input .value=${this._config.model_url || ""} placeholder="/local/maison/plan.json" @change=${(e6) => this._change({ model_url: e6.target.value })}></label><label>Pièce<select .value=${this._room} @change=${(e6) => {
      this._room = e6.target.value;
      this._marker = "";
    }}><option value="">Choisir une pièce</option>${this._config.rooms.map((r5) => b2`<option value=${r5.id}>${r5.name || r5.id}</option>`)}</select></label>
      ${r4 ? b2`<ha-form .hass=${this.hass} .data=${r4} .schema=${[{ name: "name", selector: { text: {} } }, { name: "area_id", selector: { area: {} } }, { name: "auto_area", selector: { boolean: {} } }, { name: "entities", selector: { entity: { multiple: true } } }, { name: "excluded_entities", selector: { entity: { multiple: true } } }, { name: "temperature_entity", selector: { entity: { filter: { domain: "sensor" } } } }, { name: "light_entity", selector: { entity: { filter: { domain: "light" } } } }]} .computeLabel=${(s5) => ({ name: "Nom de la pièce", area_id: "Zone Home Assistant", auto_area: "Afficher les équipements de cette zone", entities: "Équipements ajoutés à cette pièce", excluded_entities: "Équipements automatiques à masquer", temperature_entity: "Température principale", light_entity: "Éclairage principal" })[s5.name]} @value-changed=${(e6) => {
      e6.stopPropagation();
      this._roomChange(e6.detail.value);
    }}></ha-form>
      <h3>Fenêtres et portes</h3>${this._config.apertures.filter((a3) => a3.room === r4.id).map((a3) => b2`<details><summary>${a3.name || a3.id}</summary><ha-form .hass=${this.hass} .data=${a3} .schema=${[{ name: "opening_entity", selector: { entity: { filter: { domain: "binary_sensor" } } } }, { name: "cover_entity", selector: { entity: { filter: { domain: "cover" } } } }, { name: "command_entity", selector: { entity: { filter: { domain: "switch" } } } }]} .computeLabel=${(s5) => ({ opening_entity: "Contact physique", cover_entity: "Volet associé", command_entity: "Commande motorisée" })[s5.name]} @value-changed=${(e6) => {
      e6.stopPropagation();
      this._change({ apertures: this._config.apertures.map((x2) => x2.id === a3.id ? { ...x2, ...e6.detail.value } : x2) });
    }}></ha-form></details>`)}
      <h3>Repères sur le plan</h3><label>Équipement<select .value=${this._marker} @change=${(e6) => this._marker = e6.target.value}><option value="">Choisir un repère</option>${this._config.markers.filter((m4) => m4.room === r4.id).map((m4) => b2`<option value=${m4.id}>${m4.name || m4.entity || m4.id}</option>`)}</select></label><button @click=${() => {
      const id = "marker-" + (globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + "-" + Math.random().toString(36).slice(2));
      this._change({ markers: [...this._config.markers, { id, room: r4.id, name: "Équipement", point: copy(r4.label || [0, 0]), icon: "mdi:circle-small" }] });
      this._marker = id;
    }}>Ajouter un repère</button>
      ${m3 ? b2`<ha-form .hass=${this.hass} .data=${m3} .schema=${[{ name: "name", selector: { text: {} } }, { name: "entity", selector: { entity: {} } }, { name: "icon", selector: { icon: {} } }]} .computeLabel=${(s5) => ({ name: "Libellé", entity: "Équipement", icon: "Icône" })[s5.name]} @value-changed=${(e6) => {
      e6.stopPropagation();
      this._markerChange(e6.detail.value);
    }}></ha-form><div class="row"><label>Position X<input type="number" .value=${String(m3.point?.[0] || 0)} @change=${(e6) => this._markerChange({ point: [Number(e6.target.value), m3.point?.[1] || 0] })}></label><label>Position Y<input type="number" .value=${String(m3.point?.[1] || 0)} @change=${(e6) => this._markerChange({ point: [m3.point?.[0] || 0, Number(e6.target.value)] })}></label></div><button @click=${() => {
      this._change({ markers: this._config.markers.filter((x2) => x2.id !== m3.id) });
      this._marker = "";
    }}>Retirer ce repère</button>` : A}` : A}
      <p>Les équipements d’une zone suivent les associations de Paramètres → Appareils et services → Zones. Les ajouts manuels et repères ci-dessus concernent cette carte.</p><a href=${this._config.documentation_url || "https://github.com/smornierHA/ha-board"} target="_blank" rel="noopener noreferrer">Documentation du plan</a></div>`;
  }
};
if (!customElements.get("home-plan-card")) customElements.define("home-plan-card", HomePlanCard);
if (!customElements.get("home-plan-card-editor")) customElements.define("home-plan-card-editor", HomePlanCardEditor);
window.customCards ||= [];
if (!window.customCards.some((c5) => c5.type === "home-plan-card")) window.customCards.push({ type: "home-plan-card", name: "Plan de la maison", description: "Pièces, volets, lumières, ouvertures et équipements", preview: true, documentationURL: "https://github.com/smornierHA/ha-board" });
export {
  HomePlanCard,
  HomePlanCardEditor,
  VERSION,
  coverPosition,
  coverText,
  known,
  sanitizeArtwork,
  validEntity,
  validateConfig
};
