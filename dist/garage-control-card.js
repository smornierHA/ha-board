/* HA-BOARD Garage Control 1.1.0 | lit-element 4.2.0 incorporated | see THIRD-PARTY-NOTICES.md */

// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t3, e4, o5) {
    if (this._$cssResult$ = true, o5 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t3, this.t = e4;
  }
  get styleSheet() {
    let t3 = this.o;
    const s4 = this.t;
    if (e && void 0 === t3) {
      const e4 = void 0 !== s4 && 1 === s4.length;
      e4 && (t3 = o.get(s4)), void 0 === t3 && ((this.o = t3 = new CSSStyleSheet()).replaceSync(this.cssText), e4 && o.set(s4, t3));
    }
    return t3;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t3) => new n("string" == typeof t3 ? t3 : t3 + "", void 0, s);
var i = (t3, ...e4) => {
  const o5 = 1 === t3.length ? t3[0] : e4.reduce((e5, s4, o6) => e5 + ((t4) => {
    if (true === t4._$cssResult$) return t4.cssText;
    if ("number" == typeof t4) return t4;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t4 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s4) + t3[o6 + 1], t3[0]);
  return new n(o5, t3, s);
};
var S = (s4, o5) => {
  if (e) s4.adoptedStyleSheets = o5.map((t3) => t3 instanceof CSSStyleSheet ? t3 : t3.styleSheet);
  else for (const e4 of o5) {
    const o6 = document.createElement("style"), n5 = t.litNonce;
    void 0 !== n5 && o6.setAttribute("nonce", n5), o6.textContent = e4.cssText, s4.appendChild(o6);
  }
};
var c = e ? (t3) => t3 : (t3) => t3 instanceof CSSStyleSheet ? ((t4) => {
  let e4 = "";
  for (const s4 of t4.cssRules) e4 += s4.cssText;
  return r(e4);
})(t3) : t3;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t3, s4) => t3;
var u = { toAttribute(t3, s4) {
  switch (s4) {
    case Boolean:
      t3 = t3 ? l : null;
      break;
    case Object:
    case Array:
      t3 = null == t3 ? t3 : JSON.stringify(t3);
  }
  return t3;
}, fromAttribute(t3, s4) {
  let i5 = t3;
  switch (s4) {
    case Boolean:
      i5 = null !== t3;
      break;
    case Number:
      i5 = null === t3 ? null : Number(t3);
      break;
    case Object:
    case Array:
      try {
        i5 = JSON.parse(t3);
      } catch (t4) {
        i5 = null;
      }
  }
  return i5;
} };
var f = (t3, s4) => !i2(t3, s4);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
  static addInitializer(t3) {
    this._$Ei(), (this.l ??= []).push(t3);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t3, s4 = b) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t3) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t3, s4), !s4.noAccessor) {
      const i5 = Symbol(), h3 = this.getPropertyDescriptor(t3, i5, s4);
      void 0 !== h3 && e2(this.prototype, t3, h3);
    }
  }
  static getPropertyDescriptor(t3, s4, i5) {
    const { get: e4, set: r4 } = h(this.prototype, t3) ?? { get() {
      return this[s4];
    }, set(t4) {
      this[s4] = t4;
    } };
    return { get: e4, set(s5) {
      const h3 = e4?.call(this);
      r4?.call(this, s5), this.requestUpdate(t3, h3, i5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t3) {
    return this.elementProperties.get(t3) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t3 = n2(this);
    t3.finalize(), void 0 !== t3.l && (this.l = [...t3.l]), this.elementProperties = new Map(t3.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t4 = this.properties, s4 = [...r2(t4), ...o2(t4)];
      for (const i5 of s4) this.createProperty(i5, t4[i5]);
    }
    const t3 = this[Symbol.metadata];
    if (null !== t3) {
      const s4 = litPropertyMetadata.get(t3);
      if (void 0 !== s4) for (const [t4, i5] of s4) this.elementProperties.set(t4, i5);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t4, s4] of this.elementProperties) {
      const i5 = this._$Eu(t4, s4);
      void 0 !== i5 && this._$Eh.set(i5, t4);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s4) {
    const i5 = [];
    if (Array.isArray(s4)) {
      const e4 = new Set(s4.flat(1 / 0).reverse());
      for (const s5 of e4) i5.unshift(c(s5));
    } else void 0 !== s4 && i5.push(c(s4));
    return i5;
  }
  static _$Eu(t3, s4) {
    const i5 = s4.attribute;
    return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t3 ? t3.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t3) => this.enableUpdating = t3), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t3) => t3(this));
  }
  addController(t3) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t3), void 0 !== this.renderRoot && this.isConnected && t3.hostConnected?.();
  }
  removeController(t3) {
    this._$EO?.delete(t3);
  }
  _$E_() {
    const t3 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
    for (const i5 of s4.keys()) this.hasOwnProperty(i5) && (t3.set(i5, this[i5]), delete this[i5]);
    t3.size > 0 && (this._$Ep = t3);
  }
  createRenderRoot() {
    const t3 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t3, this.constructor.elementStyles), t3;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t3) => t3.hostConnected?.());
  }
  enableUpdating(t3) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t3) => t3.hostDisconnected?.());
  }
  attributeChangedCallback(t3, s4, i5) {
    this._$AK(t3, i5);
  }
  _$ET(t3, s4) {
    const i5 = this.constructor.elementProperties.get(t3), e4 = this.constructor._$Eu(t3, i5);
    if (void 0 !== e4 && true === i5.reflect) {
      const h3 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s4, i5.type);
      this._$Em = t3, null == h3 ? this.removeAttribute(e4) : this.setAttribute(e4, h3), this._$Em = null;
    }
  }
  _$AK(t3, s4) {
    const i5 = this.constructor, e4 = i5._$Eh.get(t3);
    if (void 0 !== e4 && this._$Em !== e4) {
      const t4 = i5.getPropertyOptions(e4), h3 = "function" == typeof t4.converter ? { fromAttribute: t4.converter } : void 0 !== t4.converter?.fromAttribute ? t4.converter : u;
      this._$Em = e4;
      const r4 = h3.fromAttribute(s4, t4.type);
      this[e4] = r4 ?? this._$Ej?.get(e4) ?? r4, this._$Em = null;
    }
  }
  requestUpdate(t3, s4, i5, e4 = false, h3) {
    if (void 0 !== t3) {
      const r4 = this.constructor;
      if (false === e4 && (h3 = this[t3]), i5 ??= r4.getPropertyOptions(t3), !((i5.hasChanged ?? f)(h3, s4) || i5.useDefault && i5.reflect && h3 === this._$Ej?.get(t3) && !this.hasAttribute(r4._$Eu(t3, i5)))) return;
      this.C(t3, s4, i5);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t3, s4, { useDefault: i5, reflect: e4, wrapped: h3 }, r4) {
    i5 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t3) && (this._$Ej.set(t3, r4 ?? s4 ?? this[t3]), true !== h3 || void 0 !== r4) || (this._$AL.has(t3) || (this.hasUpdated || i5 || (s4 = void 0), this._$AL.set(t3, s4)), true === e4 && this._$Em !== t3 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t3));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t4) {
      Promise.reject(t4);
    }
    const t3 = this.scheduleUpdate();
    return null != t3 && await t3, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t5, s5] of this._$Ep) this[t5] = s5;
        this._$Ep = void 0;
      }
      const t4 = this.constructor.elementProperties;
      if (t4.size > 0) for (const [s5, i5] of t4) {
        const { wrapped: t5 } = i5, e4 = this[s5];
        true !== t5 || this._$AL.has(s5) || void 0 === e4 || this.C(s5, void 0, i5, e4);
      }
    }
    let t3 = false;
    const s4 = this._$AL;
    try {
      t3 = this.shouldUpdate(s4), t3 ? (this.willUpdate(s4), this._$EO?.forEach((t4) => t4.hostUpdate?.()), this.update(s4)) : this._$EM();
    } catch (s5) {
      throw t3 = false, this._$EM(), s5;
    }
    t3 && this._$AE(s4);
  }
  willUpdate(t3) {
  }
  _$AE(t3) {
    this._$EO?.forEach((t4) => t4.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t3)), this.updated(t3);
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
  shouldUpdate(t3) {
    return true;
  }
  update(t3) {
    this._$Eq &&= this._$Eq.forEach((t4) => this._$ET(t4, this[t4])), this._$EM();
  }
  updated(t3) {
  }
  firstUpdated(t3) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = (t3) => t3;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t3) => t3 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t3) => null === t3 || "object" != typeof t3 && "function" != typeof t3;
var u2 = Array.isArray;
var d2 = (t3) => u2(t3) || "function" == typeof t3?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t3) => (i5, ...s4) => ({ _$litType$: t3, strings: i5, values: s4 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t3, i5) {
  if (!u2(t3) || !t3.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i5) : i5;
}
var N = (t3, i5) => {
  const s4 = t3.length - 1, e4 = [];
  let n5, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = v;
  for (let i6 = 0; i6 < s4; i6++) {
    const s5 = t3[i6];
    let a3, u3, d3 = -1, f3 = 0;
    for (; f3 < s5.length && (c4.lastIndex = f3, u3 = c4.exec(s5), null !== u3); ) f3 = c4.lastIndex, c4 === v ? "!--" === u3[1] ? c4 = _ : void 0 !== u3[1] ? c4 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n5 = RegExp("</" + u3[2], "g")), c4 = p2) : void 0 !== u3[3] && (c4 = p2) : c4 === p2 ? ">" === u3[0] ? (c4 = n5 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n5 = void 0);
    const x2 = c4 === p2 && t3[i6 + 1].startsWith("/>") ? " " : "";
    l3 += c4 === v ? s5 + r3 : d3 >= 0 ? (e4.push(a3), s5.slice(0, d3) + h2 + s5.slice(d3) + o3 + x2) : s5 + o3 + (-2 === d3 ? i6 : x2);
  }
  return [V(t3, l3 + (t3[s4] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), e4];
};
var S2 = class _S {
  constructor({ strings: t3, _$litType$: i5 }, e4) {
    let r4;
    this.parts = [];
    let l3 = 0, a3 = 0;
    const u3 = t3.length - 1, d3 = this.parts, [f3, v2] = N(t3, i5);
    if (this.el = _S.createElement(f3, e4), P.currentNode = this.el.content, 2 === i5 || 3 === i5) {
      const t4 = this.el.content.firstChild;
      t4.replaceWith(...t4.childNodes);
    }
    for (; null !== (r4 = P.nextNode()) && d3.length < u3; ) {
      if (1 === r4.nodeType) {
        if (r4.hasAttributes()) for (const t4 of r4.getAttributeNames()) if (t4.endsWith(h2)) {
          const i6 = v2[a3++], s4 = r4.getAttribute(t4).split(o3), e5 = /([.?@])?(.*)/.exec(i6);
          d3.push({ type: 1, index: l3, name: e5[2], strings: s4, ctor: "." === e5[1] ? I : "?" === e5[1] ? L : "@" === e5[1] ? z : H }), r4.removeAttribute(t4);
        } else t4.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r4.removeAttribute(t4));
        if (y2.test(r4.tagName)) {
          const t4 = r4.textContent.split(o3), i6 = t4.length - 1;
          if (i6 > 0) {
            r4.textContent = s2 ? s2.emptyScript : "";
            for (let s4 = 0; s4 < i6; s4++) r4.append(t4[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
            r4.append(t4[i6], c3());
          }
        }
      } else if (8 === r4.nodeType) if (r4.data === n3) d3.push({ type: 2, index: l3 });
      else {
        let t4 = -1;
        for (; -1 !== (t4 = r4.data.indexOf(o3, t4 + 1)); ) d3.push({ type: 7, index: l3 }), t4 += o3.length - 1;
      }
      l3++;
    }
  }
  static createElement(t3, i5) {
    const s4 = l2.createElement("template");
    return s4.innerHTML = t3, s4;
  }
};
function M(t3, i5, s4 = t3, e4) {
  if (i5 === E) return i5;
  let h3 = void 0 !== e4 ? s4._$Co?.[e4] : s4._$Cl;
  const o5 = a2(i5) ? void 0 : i5._$litDirective$;
  return h3?.constructor !== o5 && (h3?._$AO?.(false), void 0 === o5 ? h3 = void 0 : (h3 = new o5(t3), h3._$AT(t3, s4, e4)), void 0 !== e4 ? (s4._$Co ??= [])[e4] = h3 : s4._$Cl = h3), void 0 !== h3 && (i5 = M(t3, h3._$AS(t3, i5.values), h3, e4)), i5;
}
var R = class {
  constructor(t3, i5) {
    this._$AV = [], this._$AN = void 0, this._$AD = t3, this._$AM = i5;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t3) {
    const { el: { content: i5 }, parts: s4 } = this._$AD, e4 = (t3?.creationScope ?? l2).importNode(i5, true);
    P.currentNode = e4;
    let h3 = P.nextNode(), o5 = 0, n5 = 0, r4 = s4[0];
    for (; void 0 !== r4; ) {
      if (o5 === r4.index) {
        let i6;
        2 === r4.type ? i6 = new k(h3, h3.nextSibling, this, t3) : 1 === r4.type ? i6 = new r4.ctor(h3, r4.name, r4.strings, this, t3) : 6 === r4.type && (i6 = new Z(h3, this, t3)), this._$AV.push(i6), r4 = s4[++n5];
      }
      o5 !== r4?.index && (h3 = P.nextNode(), o5++);
    }
    return P.currentNode = l2, e4;
  }
  p(t3) {
    let i5 = 0;
    for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t3, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t3[i5])), i5++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t3, i5, s4, e4) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t3, this._$AB = i5, this._$AM = s4, this.options = e4, this._$Cv = e4?.isConnected ?? true;
  }
  get parentNode() {
    let t3 = this._$AA.parentNode;
    const i5 = this._$AM;
    return void 0 !== i5 && 11 === t3?.nodeType && (t3 = i5.parentNode), t3;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t3, i5 = this) {
    t3 = M(this, t3, i5), a2(t3) ? t3 === A || null == t3 || "" === t3 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t3 !== this._$AH && t3 !== E && this._(t3) : void 0 !== t3._$litType$ ? this.$(t3) : void 0 !== t3.nodeType ? this.T(t3) : d2(t3) ? this.k(t3) : this._(t3);
  }
  O(t3) {
    return this._$AA.parentNode.insertBefore(t3, this._$AB);
  }
  T(t3) {
    this._$AH !== t3 && (this._$AR(), this._$AH = this.O(t3));
  }
  _(t3) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t3 : this.T(l2.createTextNode(t3)), this._$AH = t3;
  }
  $(t3) {
    const { values: i5, _$litType$: s4 } = t3, e4 = "number" == typeof s4 ? this._$AC(t3) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
    if (this._$AH?._$AD === e4) this._$AH.p(i5);
    else {
      const t4 = new R(e4, this), s5 = t4.u(this.options);
      t4.p(i5), this.T(s5), this._$AH = t4;
    }
  }
  _$AC(t3) {
    let i5 = C.get(t3.strings);
    return void 0 === i5 && C.set(t3.strings, i5 = new S2(t3)), i5;
  }
  k(t3) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i5 = this._$AH;
    let s4, e4 = 0;
    for (const h3 of t3) e4 === i5.length ? i5.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i5[e4], s4._$AI(h3), e4++;
    e4 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e4), i5.length = e4);
  }
  _$AR(t3 = this._$AA.nextSibling, s4) {
    for (this._$AP?.(false, true, s4); t3 !== this._$AB; ) {
      const s5 = i3(t3).nextSibling;
      i3(t3).remove(), t3 = s5;
    }
  }
  setConnected(t3) {
    void 0 === this._$AM && (this._$Cv = t3, this._$AP?.(t3));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t3, i5, s4, e4, h3) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t3, this.name = i5, this._$AM = e4, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
  }
  _$AI(t3, i5 = this, s4, e4) {
    const h3 = this.strings;
    let o5 = false;
    if (void 0 === h3) t3 = M(this, t3, i5, 0), o5 = !a2(t3) || t3 !== this._$AH && t3 !== E, o5 && (this._$AH = t3);
    else {
      const e5 = t3;
      let n5, r4;
      for (t3 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r4 = M(this, e5[s4 + n5], i5, n5), r4 === E && (r4 = this._$AH[n5]), o5 ||= !a2(r4) || r4 !== this._$AH[n5], r4 === A ? t3 = A : t3 !== A && (t3 += (r4 ?? "") + h3[n5 + 1]), this._$AH[n5] = r4;
    }
    o5 && !e4 && this.j(t3);
  }
  j(t3) {
    t3 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t3 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t3) {
    this.element[this.name] = t3 === A ? void 0 : t3;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t3) {
    this.element.toggleAttribute(this.name, !!t3 && t3 !== A);
  }
};
var z = class extends H {
  constructor(t3, i5, s4, e4, h3) {
    super(t3, i5, s4, e4, h3), this.type = 5;
  }
  _$AI(t3, i5 = this) {
    if ((t3 = M(this, t3, i5, 0) ?? A) === E) return;
    const s4 = this._$AH, e4 = t3 === A && s4 !== A || t3.capture !== s4.capture || t3.once !== s4.once || t3.passive !== s4.passive, h3 = t3 !== A && (s4 === A || e4);
    e4 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
  }
  handleEvent(t3) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t3) : this._$AH.handleEvent(t3);
  }
};
var Z = class {
  constructor(t3, i5, s4) {
    this.element = t3, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3) {
    M(this, t3);
  }
};
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.3");
var D = (t3, i5, s4) => {
  const e4 = s4?.renderBefore ?? i5;
  let h3 = e4._$litPart$;
  if (void 0 === h3) {
    const t4 = s4?.renderBefore ?? null;
    e4._$litPart$ = h3 = new k(i5.insertBefore(c3(), t4), t4, void 0, s4 ?? {});
  }
  return h3._$AI(t3), h3;
};

// node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t3 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t3.firstChild, t3;
  }
  update(t3) {
    const r4 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t3), this._$Do = D(r4, this.renderRoot, this.renderOptions);
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

// src/candidate/garage-control-card.js
var VERSION = "1.1.0";
var GarageControlCard = class _GarageControlCard extends i4 {
  static properties = {
    hass: {},
    _config: { state: true },
    _dialogOpen: { state: true },
    _error: { state: true },
    _cameraCard: { state: true },
    _activeCameraIndex: { state: true },
    _garageBusy: { state: true },
    _garageFeedback: { state: true },
    _pendingAction: { state: true },
    _eventContext: { state: true }
  };
  static getDefaultConfig() {
    return {
      name: "Garage",
      icon: "mdi:garage",
      popup_hash: "#popup_garage",
      clear_hash_on_close: true,
      close_on_hash_change: true,
      garage_service: void 0,
      garage_open_service: void 0,
      garage_close_service: void 0,
      garage_stop_service: void 0,
      garage_command_mode: "pulse",
      garage_open_state: "on",
      garage_closed_state: "off",
      allow_unknown_command_state: true,
      pulse_stop_enabled: false,
      camera_view: "live",
      camera_fit_mode: "cover",
      camera_aspect_ratio: "16:9",
      motion_entity: "",
      person_entity: "",
      vehicle_entities: [],
      event_entities: [],
      last_person_entity: "",
      last_motion_entity: "",
      last_vehicle_a_entity: "",
      last_vehicle_b_entity: "",
      last_car_entity: "",
      show_snapshots: true,
      show_empty_events: false,
      show_motion_badge: true,
      show_person_badge: true,
      live_detection_badge_duration_ms: 12e3,
      show_debug: false,
      action_feedback: true,
      action_lock_ms: 2e3,
      feedback_duration_ms: 2400,
      state_confirmation_timeout_ms: 25e3,
      event_message_duration_ms: 12e3
    };
  }
  static getStubConfig() {
    return {
      ...this.getDefaultConfig(),
      garage_entity: "switch.example_garage_command",
      garage_state_entity: "binary_sensor.example_garage_open",
      camera_entities: [
        { entity: "camera.example_garage", name: "Garage", icon: "mdi:garage", camera_view: "live" },
        { entity: "camera.example_driveway", name: "Allée", icon: "mdi:road-variant", camera_view: "live" }
      ]
    };
  }
  static getConfigElement() {
    return document.createElement("garage-control-card-editor");
  }
  static getConfigForm() {
    const section = (name, title, schema) => ({ type: "expandable", name, title, flatten: true, schema });
    const entity = (name) => ({ name, selector: { entity: {} } });
    const text = (name) => ({ name, selector: { text: {} } });
    const boolean = (name) => ({ name, selector: { boolean: {} } });
    const number = (name, step = 1) => ({ name, selector: { number: { mode: "box", min: 0, step } } });
    const object = (name) => ({ name, selector: { object: {} } });
    return {
      schema: [
        section("general", "Carte et navigation", [
          text("name"),
          { name: "icon", selector: { icon: {} } },
          text("popup_hash"),
          boolean("clear_hash_on_close"),
          boolean("close_on_hash_change")
        ]),
        section("command", "Commande et état physique", [
          entity("garage_entity"),
          entity("garage_state_entity"),
          { name: "garage_command_mode", selector: { select: { mode: "dropdown", options: [
            { value: "pulse", label: "Impulsion" },
            { value: "stateful", label: "État maintenu" }
          ] } } },
          text("garage_service"),
          text("garage_open_service"),
          text("garage_close_service"),
          text("garage_stop_service"),
          text("garage_open_state"),
          text("garage_closed_state"),
          boolean("allow_unknown_command_state"),
          boolean("pulse_stop_enabled")
        ]),
        section("camera", "Caméras", [
          entity("camera_entity"),
          text("camera_name"),
          { name: "camera_icon", selector: { icon: {} } },
          object("camera_entities"),
          { name: "camera_view", selector: { select: { mode: "dropdown", options: ["live", "auto"] } } },
          { name: "camera_fit_mode", selector: { select: { mode: "dropdown", options: ["cover", "contain", "fill"] } } },
          text("camera_aspect_ratio")
        ]),
        section("detections", "Détections, véhicules et événements", [
          entity("motion_entity"),
          entity("person_entity"),
          boolean("show_motion_badge"),
          boolean("show_person_badge"),
          number("live_detection_badge_duration_ms", 100),
          object("vehicle_entities"),
          object("event_entities"),
          entity("last_person_entity"),
          entity("last_motion_entity"),
          entity("last_vehicle_a_entity"),
          entity("last_vehicle_b_entity"),
          entity("last_car_entity"),
          boolean("show_snapshots"),
          boolean("show_empty_events"),
          number("event_message_duration_ms", 100)
        ]),
        section("feedback", "Protection et retours", [
          boolean("action_feedback"),
          number("action_lock_ms", 100),
          number("feedback_duration_ms", 100),
          number("state_confirmation_timeout_ms", 100),
          boolean("show_debug")
        ])
      ],
      computeLabel: (schema) => ({
        name: "Nom",
        icon: "Icône",
        popup_hash: "Hash de navigation",
        clear_hash_on_close: "Effacer le hash à la fermeture",
        close_on_hash_change: "Fermer si le hash change",
        garage_entity: "Entité de commande",
        garage_state_entity: "Capteur d’état physique",
        garage_command_mode: "Mode de commande",
        garage_service: "Service principal",
        garage_open_service: "Service d’ouverture",
        garage_close_service: "Service de fermeture",
        garage_stop_service: "Service d’arrêt",
        garage_open_state: "Valeur ouverte",
        garage_closed_state: "Valeur fermée",
        allow_unknown_command_state: "Autoriser une commande si l’état de commande est inconnu",
        pulse_stop_enabled: "Autoriser une impulsion d’arrêt en mouvement",
        camera_entity: "Caméra unique (ancien format)",
        camera_name: "Nom de la caméra",
        camera_icon: "Icône de la caméra",
        camera_entities: "Liste structurée des caméras",
        camera_view: "Mode caméra",
        camera_fit_mode: "Ajustement de l’image",
        camera_aspect_ratio: "Ratio d’image",
        motion_entity: "Capteur de mouvement",
        person_entity: "Capteur de personne",
        show_motion_badge: "Afficher le badge mouvement",
        show_person_badge: "Afficher le badge personne",
        live_detection_badge_duration_ms: "Durée du badge récent (ms)",
        vehicle_entities: "Liste structurée des véhicules",
        event_entities: "Liste structurée des images d’événement",
        last_person_entity: "Dernière personne",
        last_motion_entity: "Dernier mouvement",
        last_vehicle_a_entity: "Dernier véhicule A",
        last_vehicle_b_entity: "Dernier véhicule B",
        last_car_entity: "Dernière voiture",
        show_snapshots: "Afficher les captures",
        show_empty_events: "Afficher une section événements vide",
        event_message_duration_ms: "Durée du message de détection (ms)",
        action_feedback: "Afficher les retours de commande",
        action_lock_ms: "Verrou anti-double commande (ms)",
        feedback_duration_ms: "Durée des retours (ms)",
        state_confirmation_timeout_ms: "Délai de confirmation physique (ms)",
        show_debug: "Afficher le diagnostic"
      })[schema.name] || schema.name
    };
  }
  static styles = i`
    :host {
      display: block;
      --garage-red: var(--red-color, #f44336);
      --garage-green: var(--green-color, #4caf50);
      --garage-blue: var(--blue-color, #2196f3);
      --garage-orange: var(--orange-color, #ff9800);
      --garage-grey: var(--disabled-text-color, #8a8a8a);
      --garage-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
      --garage-text: var(--primary-text-color, #111);
      --garage-secondary: var(--secondary-text-color, #666);
      --garage-border: color-mix(in srgb, var(--primary-text-color, #111) 14%, transparent);
      --garage-soft: color-mix(in srgb, var(--primary-text-color, #111) 8%, transparent);
    }

    * {
      box-sizing: border-box;
    }

    ha-card {
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 18px);
      border: 1px solid var(--garage-border);
      background:
        linear-gradient(
          145deg,
          var(--garage-card-bg),
          color-mix(in srgb, var(--garage-card-bg) 88%, var(--primary-text-color, #111) 5%)
        );
      color: var(--garage-text);
      cursor: pointer;
    }

    ha-card:focus-visible,
    button:focus-visible,
    summary:focus-visible {
      outline: 2px solid var(--garage-blue);
      outline-offset: 2px;
    }

    .main-card {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      padding: 14px;
      position: relative;
      border-left: 5px solid transparent;
      transition: border-color 0.18s ease, filter 0.18s ease;
    }

    .main-card.closed { border-left-color: var(--garage-green); }
    .main-card.open { border-left-color: var(--garage-orange); }
    .main-card.moving { border-left-color: var(--garage-blue); }
    .main-card.unavailable { border-left-color: var(--garage-red); }
    .main-card.unknown { border-left-color: var(--garage-grey); }

    .main-card.moving .icon-wrap {
      animation: garage-pulse 1.25s ease-in-out infinite;
    }

    .icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: var(--garage-soft);
      color: var(--garage-text);
      flex: 0 0 auto;
    }

    .closed .icon-wrap,
    .status-pill.closed {
      background: color-mix(in srgb, var(--garage-green) 17%, transparent);
      color: var(--garage-green);
    }

    .open .icon-wrap,
    .status-pill.open {
      background: color-mix(in srgb, var(--garage-orange) 18%, transparent);
      color: var(--garage-orange);
    }

    .moving .icon-wrap,
    .status-pill.moving {
      background: color-mix(in srgb, var(--garage-blue) 18%, transparent);
      color: var(--garage-blue);
    }

    .unavailable .icon-wrap,
    .status-pill.unavailable {
      background: color-mix(in srgb, var(--garage-red) 16%, transparent);
      color: var(--garage-red);
    }

    .title {
      font-size: 16px;
      font-weight: 800;
      line-height: 1.15;
    }

    .subtitle {
      margin-top: 3px;
      font-size: 13px;
      color: var(--garage-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mini-vehicles {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
    }

    .mini-vehicle {
      min-width: 42px;
      height: 36px;
      padding: 0 9px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      background: var(--garage-soft);
      color: var(--garage-secondary);
      cursor: pointer;
      font-size: 11px;
      font-weight: 850;
      white-space: nowrap;
    }

    .mini-vehicle.present {
      background: color-mix(in srgb, var(--garage-blue) 18%, transparent);
      color: var(--garage-blue);
    }

    .mini-vehicle.unavailable {
      background: color-mix(in srgb, var(--garage-red) 12%, transparent);
      color: var(--garage-red);
    }

    .mini-vehicle ha-icon {
      --mdc-icon-size: 18px;
    }

    .overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483640;
      background: rgba(0, 0, 0, 0.62);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }

    .dialog {
      width: min(780px, 100%);
      max-height: min(94vh, 940px);
      overflow: auto;
      overscroll-behavior: contain;
      border-radius: 28px;
      background:
        linear-gradient(
          160deg,
          var(--garage-card-bg),
          color-mix(in srgb, var(--garage-card-bg) 86%, var(--primary-text-color, #111) 6%)
        );
      color: var(--garage-text);
      box-shadow: 0 24px 90px rgba(0, 0, 0, 0.42);
      border: 1px solid color-mix(in srgb, white 18%, transparent);
    }

    .dialog-header {
      position: sticky;
      top: 0;
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 18px 10px;
      background: color-mix(in srgb, var(--garage-card-bg) 92%, transparent);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .dialog-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .dialog-title-copy {
      min-width: 0;
    }

    .status-pill {
      margin-top: 5px;
      width: fit-content;
      max-width: 100%;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      padding: 6px 9px;
      font-size: 12px;
      font-weight: 850;
      background: var(--garage-soft);
      color: var(--garage-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-pill ha-icon {
      --mdc-icon-size: 17px;
      flex: 0 0 auto;
    }

    .close-btn {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      border: 0;
      cursor: pointer;
      background: var(--garage-soft);
      color: var(--garage-text);
      display: grid;
      place-items: center;
      flex: 0 0 auto;
    }

    .camera-section {
      margin: 0 18px;
    }

    .camera-area {
      border-radius: 22px;
      overflow: hidden;
      background: #111;
      min-height: 220px;
      position: relative;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
      touch-action: pan-y;
    }

    .camera-area ha-card {
      border-radius: 0;
      border: 0;
      box-shadow: none;
    }

    .camera-placeholder {
      aspect-ratio: 16 / 9;
      min-height: 220px;
      display: grid;
      place-items: center;
      color: rgba(255, 255, 255, 0.75);
      padding: 20px;
      text-align: center;
    }

    .camera-placeholder-content {
      display: grid;
      justify-items: center;
      gap: 9px;
    }

    .camera-placeholder ha-icon {
      --mdc-icon-size: 32px;
    }

    .camera-overlay-label {
      position: absolute;
      left: 12px;
      bottom: 12px;
      z-index: 2;
      padding: 7px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.52);
      color: white;
      font-size: 13px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: none;
    }

    .camera-live-badges {
      position: absolute;
      right: 12px;
      top: 12px;
      z-index: 2;
      display: flex;
      gap: 6px;
      pointer-events: none;
    }

    .camera-live-badge {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      color: white;
      background: rgba(0, 0, 0, 0.52);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .camera-live-badge.active {
      background: color-mix(in srgb, var(--garage-orange) 84%, rgba(0, 0, 0, 0.35));
    }

    .camera-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 4px 2px;
    }

    .bullet {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      border: 0;
      cursor: pointer;
      background: color-mix(in srgb, var(--primary-text-color, #111) 28%, transparent);
      padding: 0;
      transition: transform 0.16s ease, width 0.16s ease, background 0.16s ease;
    }

    .bullet.active {
      width: 24px;
      background: var(--garage-blue);
    }

    .camera-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 8px 0 0;
      scrollbar-width: none;
    }

    .camera-tabs::-webkit-scrollbar { display: none; }

    .camera-tab {
      border: 0;
      border-radius: 999px;
      padding: 8px 11px;
      white-space: nowrap;
      cursor: pointer;
      font-size: 12px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--garage-soft);
      color: var(--garage-text);
    }

    .camera-tab.active {
      background: color-mix(in srgb, var(--garage-blue) 18%, transparent);
      color: var(--garage-blue);
    }

    .dialog-body {
      padding: 14px 18px 18px;
    }

    .message-zone {
      margin: 0 0 12px;
    }

    .context-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 14px;
      border-left: 4px solid var(--garage-blue);
      background: color-mix(in srgb, var(--primary-text-color, #111) 7%, transparent);
      color: var(--garage-text);
      font-size: 13px;
      font-weight: 750;
      line-height: 1.35;
    }

    .context-message.success {
      border-left-color: var(--garage-green);
      color: var(--garage-green);
      background: color-mix(in srgb, var(--garage-green) 12%, transparent);
    }

    .context-message.error-state {
      border-left-color: var(--garage-red);
      color: var(--garage-red);
      background: color-mix(in srgb, var(--garage-red) 12%, transparent);
    }

    .context-message.warning {
      border-left-color: var(--garage-orange);
      color: var(--garage-orange);
      background: color-mix(in srgb, var(--garage-orange) 12%, transparent);
    }

    .context-message.info {
      border-left-color: var(--garage-blue);
      color: var(--garage-blue);
      background: color-mix(in srgb, var(--garage-blue) 11%, transparent);
    }

    .context-meta {
      color: var(--garage-secondary);
      font-weight: 650;
    }

    .primary-action {
      margin-bottom: 14px;
    }

    .button {
      width: 100%;
      border: 0;
      border-radius: 18px;
      padding: 13px 14px;
      min-height: 52px;
      cursor: pointer;
      font-weight: 850;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: white;
      background: color-mix(in srgb, var(--garage-blue) 86%, black 4%);
      transition: transform 0.12s ease, filter 0.12s ease, opacity 0.12s ease;
    }

    .button:active { transform: scale(0.985); }
    .button.open-action { background: color-mix(in srgb, var(--garage-blue) 86%, black 4%); }
    .button.close-action { background: color-mix(in srgb, var(--garage-orange) 88%, black 5%); }
    .button.stop-action { background: color-mix(in srgb, var(--garage-red) 86%, black 5%); }
    .button.command-action { background: color-mix(in srgb, var(--garage-blue) 78%, var(--garage-grey) 14%); }
    .button:disabled { opacity: 0.48; cursor: not-allowed; }
    .spin { animation: spin 0.8s linear infinite; }

    .section {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--garage-border);
    }

    .section-title {
      margin: 0 0 10px;
      font-size: 13px;
      font-weight: 850;
      color: var(--garage-secondary);
      letter-spacing: 0.01em;
    }

    .vehicle-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .vehicle-card {
      border: 1px solid var(--garage-border);
      border-radius: 18px;
      min-height: 82px;
      padding: 12px;
      background: var(--garage-soft);
      color: var(--garage-text);
      cursor: pointer;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      text-align: left;
    }

    .vehicle-card.present {
      border-color: color-mix(in srgb, var(--garage-blue) 42%, transparent);
      background: color-mix(in srgb, var(--garage-blue) 13%, transparent);
    }

    .vehicle-card.unavailable {
      border-color: color-mix(in srgb, var(--garage-red) 32%, transparent);
      background: color-mix(in srgb, var(--garage-red) 9%, transparent);
    }

    .vehicle-icon {
      width: 42px;
      height: 42px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: color-mix(in srgb, var(--primary-text-color, #111) 9%, transparent);
      color: var(--garage-secondary);
    }

    .vehicle-card.present .vehicle-icon {
      background: color-mix(in srgb, var(--garage-blue) 20%, transparent);
      color: var(--garage-blue);
    }

    .vehicle-card.unavailable .vehicle-icon {
      background: color-mix(in srgb, var(--garage-red) 16%, transparent);
      color: var(--garage-red);
    }

    .vehicle-name {
      font-size: 14px;
      font-weight: 850;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .vehicle-state {
      margin-top: 3px;
      font-size: 12px;
      font-weight: 700;
      color: var(--garage-secondary);
    }

    .event-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .event-grid.single {
      grid-template-columns: 1fr;
    }

    .snapshot {
      border: 0;
      padding: 0;
      text-align: left;
      border-radius: 18px;
      overflow: hidden;
      background: var(--garage-soft);
      min-height: 104px;
      position: relative;
      cursor: pointer;
      width: 100%;
      color: inherit;
    }

    .snapshot:active { transform: scale(0.99); }

    .snapshot img {
      width: 100%;
      height: 142px;
      object-fit: cover;
      display: block;
      background: #111;
    }

    .snapshot-label {
      position: absolute;
      left: 8px;
      bottom: 8px;
      max-width: calc(100% - 16px);
      padding: 6px 9px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      color: white;
      background: rgba(0, 0, 0, 0.58);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .empty-events {
      padding: 12px;
      border-radius: 14px;
      color: var(--garage-secondary);
      background: var(--garage-soft);
      font-size: 13px;
    }

    .debug {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--garage-border);
      color: var(--garage-secondary);
      font-size: 12px;
    }

    .debug summary {
      cursor: pointer;
      font-weight: 850;
      color: var(--garage-secondary);
    }

    .debug pre {
      margin: 10px 0 0;
      padding: 10px;
      border-radius: 12px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      background: color-mix(in srgb, var(--primary-text-color, #111) 7%, transparent);
      color: var(--garage-text);
      font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    @media (max-width: 620px) {
      .mini-vehicle {
        min-width: 36px;
        padding: 0 7px;
      }
    }

    @media (max-width: 560px) {
      .overlay {
        padding: 0;
        align-items: flex-end;
      }

      .dialog {
        border-radius: 28px 28px 0 0;
        max-height: 94vh;
        width: 100%;
        padding-bottom: env(safe-area-inset-bottom, 0);
      }

      .camera-section { margin: 0 12px; }
      .dialog-header { padding-left: 14px; padding-right: 14px; }
      .dialog-body { padding-left: 14px; padding-right: 14px; }
      .event-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 390px) {
      .main-card {
        gap: 9px;
        padding: 12px;
      }

      .mini-vehicles { gap: 5px; }

      .mini-vehicle {
        width: 34px;
        min-width: 34px;
        padding: 0;
      }

      .mini-vehicle span { display: none; }
      .vehicle-grid { gap: 8px; }
      .vehicle-card { padding: 10px; gap: 8px; }
      .vehicle-icon { width: 38px; height: 38px; }
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes garage-pulse {
      0%, 100% { transform: scale(1); filter: brightness(1); }
      50% { transform: scale(1.07); filter: brightness(1.12); }
    }
  `;
  constructor() {
    super();
    this._dialogOpen = false;
    this._error = "";
    this._cameraCard = null;
    this._cameraCardEntity = null;
    this._cameraLoadToken = 0;
    this._cameraGeneration = 0;
    this._activeCameraIndex = 0;
    this._garageBusy = false;
    this._garageFeedback = null;
    this._pendingAction = null;
    this._eventContext = null;
    this._touchStartX = 0;
    this._busyTimer = null;
    this._feedbackTimer = null;
    this._confirmationTimer = null;
    this._eventTimer = null;
    this._attached = false;
    this._commandGeneration = 0;
  }
  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Configuration garage-control-card invalide.");
    }
    if (!config.garage_entity) {
      throw new Error("garage_entity est obligatoire.");
    }
    if (!config.camera_entity && !(Array.isArray(config.camera_entities) && config.camera_entities.length)) {
      throw new Error("camera_entity ou camera_entities est obligatoire.");
    }
    const popupHash = String(config.popup_hash || "#popup_garage");
    if (this._config) this._invalidateCommandCycle(true);
    const cameraGeneration = ++this._cameraGeneration;
    this._config = {
      ..._GarageControlCard.getDefaultConfig(),
      ...config,
      popup_hash: popupHash.startsWith("#") ? popupHash : `#${popupHash}`
    };
    this._destroyCameraCard();
    if (this._dialogOpen && this._attached) {
      queueMicrotask(() => {
        if (!this._attached || !this._dialogOpen || cameraGeneration !== this._cameraGeneration) return;
        this._ensureCameraCard(true, cameraGeneration);
      });
    }
    this.requestUpdate();
  }
  connectedCallback() {
    super.connectedCallback();
    this._attached = true;
    this._commandGeneration += 1;
    const cameraGeneration = ++this._cameraGeneration;
    const dialogWasOpen = this._dialogOpen;
    window.addEventListener("hashchange", this._handleHashChange);
    window.addEventListener("keydown", this._handleKeyDown);
    queueMicrotask(() => {
      if (!this._attached || cameraGeneration !== this._cameraGeneration) return;
      this._handleHashChange();
      if (dialogWasOpen && this._dialogOpen) {
        this._ensureCameraCard(false, cameraGeneration);
      }
    });
  }
  disconnectedCallback() {
    this._attached = false;
    this._cameraGeneration += 1;
    window.removeEventListener("hashchange", this._handleHashChange);
    window.removeEventListener("keydown", this._handleKeyDown);
    this._invalidateCommandCycle(true);
    this._destroyCameraCard();
    super.disconnectedCallback();
  }
  updated(changedProps) {
    if (!changedProps.has("hass")) return;
    if (this._cameraCard) this._cameraCard.hass = this.hass;
    const oldHass = changedProps.get("hass");
    this._handlePendingStateUpdate(oldHass);
    this._handleDetectionUpdates(oldHass);
  }
  getCardSize() {
    return 1;
  }
  _handleHashChange = () => {
    if (!this._config?.popup_hash) return;
    const matches = window.location.hash === this._config.popup_hash;
    if (matches && !this._dialogOpen) {
      this._openDialog(false);
    } else if (!matches && this._dialogOpen && this._config.close_on_hash_change !== false) {
      this._closeDialog(false);
    }
  };
  _handleKeyDown = (event) => {
    if (event.key === "Escape" && this._dialogOpen) this._closeDialog(true);
  };
  _state(entityId, hass = this.hass) {
    return entityId ? hass?.states?.[entityId] : void 0;
  }
  _domain(entityId) {
    return String(entityId || "").split(".")[0];
  }
  _isUnavailableState(rawState) {
    return rawState === "unavailable" || rawState === "unknown";
  }
  _isOn(entityId, hass = this.hass) {
    return this._state(entityId, hass)?.state === "on";
  }
  _isRecentlyActive(entityId, activeState = "on", durationMs = 12e3, hass = this.hass) {
    const entity = this._state(entityId, hass);
    if (!entity || String(entity.state) !== String(activeState)) return false;
    const changedAt = Date.parse(entity.last_changed || entity.last_updated || "");
    if (!Number.isFinite(changedAt)) return false;
    const age = Date.now() - changedAt;
    const maxAge = Math.max(1e3, Number(durationMs || 12e3));
    return age >= -5e3 && age <= maxAge;
  }
  _commandAvailable() {
    const entityId = this._config?.garage_entity;
    const entity = this._state(entityId);
    if (!entity) return false;
    if (entity.state === "unavailable") return false;
    if (entity.state === "unknown" && this._config.allow_unknown_command_state === false) return false;
    return true;
  }
  _stateEntityId() {
    if (this._config?.garage_state_entity) return this._config.garage_state_entity;
    const commandEntity = this._config?.garage_entity;
    const domain = this._domain(commandEntity);
    if (domain === "cover") return commandEntity;
    if (domain === "switch" && String(this._config?.garage_command_mode).toLowerCase() === "stateful") {
      return commandEntity;
    }
    return "";
  }
  _garageStateInfo(hass = this.hass) {
    const entityId = this._stateEntityId();
    if (!entityId) {
      return {
        entityId: "",
        raw: "",
        key: "unknown",
        text: "État non disponible",
        cls: "unknown",
        icon: "mdi:help-circle-outline"
      };
    }
    const entity = this._state(entityId, hass);
    if (!entity) {
      return {
        entityId,
        raw: "missing",
        key: "unavailable",
        text: "État indisponible",
        cls: "unavailable",
        icon: "mdi:alert-circle-outline"
      };
    }
    const raw = String(entity.state || "").toLowerCase();
    const openState = String(this._config?.garage_open_state ?? "on").toLowerCase();
    const closedState = String(this._config?.garage_closed_state ?? "off").toLowerCase();
    if (raw === "opening") {
      return { entityId, raw, key: "opening", text: "Ouverture…", cls: "moving", icon: "mdi:garage-open-variant" };
    }
    if (raw === "closing") {
      return { entityId, raw, key: "closing", text: "Fermeture…", cls: "moving", icon: "mdi:garage-alert-variant" };
    }
    if (raw === openState || raw === "open") {
      return { entityId, raw, key: "open", text: "Garage ouvert", cls: "open", icon: "mdi:garage-open" };
    }
    if (raw === closedState || raw === "closed") {
      return { entityId, raw, key: "closed", text: "Garage fermé", cls: "closed", icon: "mdi:garage" };
    }
    if (raw === "unavailable") {
      return { entityId, raw, key: "unavailable", text: "État indisponible", cls: "unavailable", icon: "mdi:alert-circle-outline" };
    }
    if (raw === "unknown" || raw === "") {
      return { entityId, raw, key: "unknown", text: "État inconnu", cls: "unknown", icon: "mdi:help-circle-outline" };
    }
    return {
      entityId,
      raw,
      key: "unknown",
      text: entity.attributes?.friendly_name ? `${entity.attributes.friendly_name} : ${entity.state}` : `État : ${entity.state}`,
      cls: "unknown",
      icon: "mdi:help-circle-outline"
    };
  }
  _garageStatus() {
    const state = this._garageStateInfo();
    const commandAvailable = this._commandAvailable();
    if (!commandAvailable) {
      return {
        ...state,
        cls: "unavailable",
        icon: "mdi:garage-alert",
        commandAvailable: false
      };
    }
    return { ...state, commandAvailable: true };
  }
  _cameras() {
    const cfg = this._config || {};
    const raw = Array.isArray(cfg.camera_entities) && cfg.camera_entities.length ? cfg.camera_entities : [{
      entity: cfg.camera_entity,
      name: cfg.camera_name || "Garage",
      icon: cfg.camera_icon || "mdi:cctv"
    }];
    return raw.map((item, index) => {
      if (typeof item === "string") {
        return {
          entity: item,
          name: this._state(item)?.attributes?.friendly_name || `Caméra ${index + 1}`,
          icon: "mdi:cctv",
          camera_view: cfg.camera_view,
          fit_mode: cfg.camera_fit_mode,
          aspect_ratio: cfg.camera_aspect_ratio
        };
      }
      const entity = item?.entity || item?.entity_id || item?.camera_entity;
      if (!entity) return null;
      return {
        entity,
        name: item.name || this._state(entity)?.attributes?.friendly_name || `Caméra ${index + 1}`,
        icon: item.icon || "mdi:cctv",
        camera_view: item.camera_view || cfg.camera_view,
        fit_mode: item.fit_mode || cfg.camera_fit_mode,
        aspect_ratio: item.aspect_ratio || cfg.camera_aspect_ratio
      };
    }).filter(Boolean);
  }
  _activeCamera() {
    const cameras = this._cameras();
    if (!cameras.length) return null;
    const safeIndex = Math.max(0, Math.min(this._activeCameraIndex, cameras.length - 1));
    if (safeIndex !== this._activeCameraIndex) this._activeCameraIndex = safeIndex;
    return cameras[safeIndex];
  }
  async _ensureCameraCard(force = false, cameraGeneration = this._cameraGeneration) {
    if (!this._attached || !this._dialogOpen || cameraGeneration !== this._cameraGeneration) return;
    const config = this._config;
    const camera = this._activeCamera();
    if (!camera?.entity) return;
    if (!force && this._cameraCard && this._cameraCardEntity === camera.entity) return;
    const loadToken = ++this._cameraLoadToken;
    this._cameraCard = null;
    this._cameraCardEntity = null;
    this.requestUpdate();
    try {
      const helpers = await window.loadCardHelpers();
      const cameraCard = await helpers.createCardElement({
        type: "picture-entity",
        entity: camera.entity,
        camera_view: camera.camera_view || "live",
        fit_mode: camera.fit_mode || "cover",
        aspect_ratio: camera.aspect_ratio || "16:9",
        show_state: false,
        show_name: false,
        tap_action: { action: "more-info" }
      });
      if (loadToken !== this._cameraLoadToken || !this._attached || !this._dialogOpen || cameraGeneration !== this._cameraGeneration || config !== this._config || this._activeCamera()?.entity !== camera.entity) {
        return;
      }
      cameraCard.hass = this.hass;
      this._cameraCard = cameraCard;
      this._cameraCardEntity = camera.entity;
      this.requestUpdate();
    } catch (error) {
      if (loadToken !== this._cameraLoadToken || !this._attached || !this._dialogOpen || cameraGeneration !== this._cameraGeneration || config !== this._config) return;
      this._error = `Impossible de charger la caméra ${camera.entity} : ${error?.message || error}`;
      this.requestUpdate();
    }
  }
  _destroyCameraCard() {
    this._cameraLoadToken += 1;
    this._cameraCard = null;
    this._cameraCardEntity = null;
  }
  _setActiveCamera(index) {
    const cameras = this._cameras();
    if (!cameras.length) return;
    const next = Math.max(0, Math.min(index, cameras.length - 1));
    if (next === this._activeCameraIndex && this._cameraCard) return;
    this._activeCameraIndex = next;
    this._destroyCameraCard();
    this._ensureCameraCard(true);
  }
  _advanceCamera(delta) {
    const cameras = this._cameras();
    if (cameras.length <= 1) return;
    const next = (this._activeCameraIndex + delta + cameras.length) % cameras.length;
    this._setActiveCamera(next);
  }
  _onTouchStart(event) {
    this._touchStartX = event.touches?.[0]?.clientX || 0;
  }
  _onTouchEnd(event) {
    const endX = event.changedTouches?.[0]?.clientX || 0;
    const delta = endX - this._touchStartX;
    if (Math.abs(delta) > 42) this._advanceCamera(delta < 0 ? 1 : -1);
  }
  _openDialog(updateHash = true) {
    this._dialogOpen = true;
    this._error = "";
    this._ensureCameraCard();
    if (updateHash && this._config?.popup_hash && window.location.hash !== this._config.popup_hash) {
      window.history.pushState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${this._config.popup_hash}`
      );
    }
  }
  _closeDialog(clearHash = true) {
    this._dialogOpen = false;
    this._destroyCameraCard();
    if (clearHash && this._config?.clear_hash_on_close !== false && this._config?.popup_hash && window.location.hash === this._config.popup_hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }
  _inferFixedService(entityId) {
    const domain = this._domain(entityId);
    if (domain === "switch") return "switch.toggle";
    if (domain === "button") return "button.press";
    if (domain === "input_button") return "input_button.press";
    return "homeassistant.toggle";
  }
  _actionPlan() {
    const entityId = this._config?.garage_entity;
    const domain = this._domain(entityId);
    const state = this._garageStateInfo();
    const commandAvailable = this._commandAvailable();
    if (!commandAvailable) {
      return {
        entityId,
        domain,
        service: "",
        intent: "unavailable",
        label: "Garage indisponible",
        icon: "mdi:garage-alert",
        cls: "command-action",
        disabled: true,
        expectedState: null
      };
    }
    if (domain === "cover") {
      if (state.key === "closed") {
        return {
          entityId,
          domain,
          service: this._config.garage_open_service || "cover.open_cover",
          intent: "open",
          label: "Ouvrir garage",
          icon: "mdi:garage-open",
          cls: "open-action",
          disabled: false,
          expectedState: "open"
        };
      }
      if (state.key === "open") {
        return {
          entityId,
          domain,
          service: this._config.garage_close_service || "cover.close_cover",
          intent: "close",
          label: "Fermer garage",
          icon: "mdi:garage",
          cls: "close-action",
          disabled: false,
          expectedState: "closed"
        };
      }
      if (state.key === "opening" || state.key === "closing") {
        return {
          entityId,
          domain,
          service: this._config.garage_stop_service || "cover.stop_cover",
          intent: "stop",
          label: "Stop",
          icon: "mdi:stop-circle-outline",
          cls: "stop-action",
          disabled: false,
          expectedState: null
        };
      }
      return {
        entityId,
        domain,
        service: this._config.garage_service || "cover.toggle",
        intent: "command",
        label: "Commander garage",
        icon: "mdi:garage-variant",
        cls: "command-action",
        disabled: false,
        expectedState: null
      };
    }
    const fixedService = this._config.garage_service || this._inferFixedService(entityId);
    if (state.key === "opening" || state.key === "closing") {
      if (this._config.pulse_stop_enabled === true) {
        return {
          entityId,
          domain,
          service: fixedService,
          intent: "stop",
          label: "Stop",
          icon: "mdi:stop-circle-outline",
          cls: "stop-action",
          disabled: false,
          expectedState: null
        };
      }
      return {
        entityId,
        domain,
        service: fixedService,
        intent: "moving",
        label: "Garage en mouvement",
        icon: "mdi:progress-clock",
        cls: "command-action",
        disabled: true,
        expectedState: null
      };
    }
    if (state.key === "closed") {
      return {
        entityId,
        domain,
        service: fixedService,
        intent: "open",
        label: "Ouvrir garage",
        icon: "mdi:garage-open",
        cls: "open-action",
        disabled: false,
        expectedState: "open"
      };
    }
    if (state.key === "open") {
      return {
        entityId,
        domain,
        service: fixedService,
        intent: "close",
        label: "Fermer garage",
        icon: "mdi:garage",
        cls: "close-action",
        disabled: false,
        expectedState: "closed"
      };
    }
    return {
      entityId,
      domain,
      service: fixedService,
      intent: "command",
      label: "Commander garage",
      icon: "mdi:garage-variant",
      cls: "command-action",
      disabled: false,
      expectedState: null
    };
  }
  _progressFeedback(intent) {
    if (intent === "open") {
      return { text: "Ouverture du garage…", cls: "warning", icon: "mdi:garage-open" };
    }
    if (intent === "close") {
      return { text: "Fermeture du garage…", cls: "warning", icon: "mdi:garage" };
    }
    if (intent === "stop") {
      return { text: "Arrêt du garage…", cls: "warning", icon: "mdi:stop-circle-outline" };
    }
    return { text: "Commande garage en cours…", cls: "info", icon: "mdi:garage-variant" };
  }
  _setFeedback(feedback, autoClearMs = 0) {
    if (this._feedbackTimer) {
      window.clearTimeout(this._feedbackTimer);
      this._feedbackTimer = null;
    }
    this._garageFeedback = feedback || null;
    if (feedback && autoClearMs > 0) {
      this._feedbackTimer = window.setTimeout(() => {
        this._garageFeedback = null;
        this._feedbackTimer = null;
        this.requestUpdate();
      }, autoClearMs);
    }
  }
  _releaseBusyAfter(delayMs, commandGeneration) {
    if (this._busyTimer) window.clearTimeout(this._busyTimer);
    const delay = Math.max(300, Number(delayMs || 2e3));
    this._busyTimer = window.setTimeout(() => {
      if (!this._attached || commandGeneration !== this._commandGeneration) return;
      this._garageBusy = false;
      this._busyTimer = null;
      this.requestUpdate();
    }, delay);
  }
  _scheduleConfirmationTimeout(actionToken, commandGeneration) {
    if (this._confirmationTimer) window.clearTimeout(this._confirmationTimer);
    const timeout = Math.max(2e3, Number(this._config.state_confirmation_timeout_ms || 25e3));
    this._confirmationTimer = window.setTimeout(() => {
      if (!this._attached || commandGeneration !== this._commandGeneration) return;
      if (!this._pendingAction || this._pendingAction.token !== actionToken) return;
      this._pendingAction = null;
      this._confirmationTimer = null;
      this._setFeedback(
        {
          text: "Commande garage envoyée",
          meta: "État non confirmé",
          cls: "warning",
          icon: "mdi:alert-circle-outline"
        },
        Number(this._config.feedback_duration_ms || 2400)
      );
      this.requestUpdate();
    }, timeout);
  }
  _confirmPendingAction(stateKey) {
    const pending = this._pendingAction;
    if (!pending || !pending.expectedState || stateKey !== pending.expectedState) return;
    if (this._confirmationTimer) {
      window.clearTimeout(this._confirmationTimer);
      this._confirmationTimer = null;
    }
    this._pendingAction = null;
    const opened = stateKey === "open";
    this._setFeedback(
      {
        text: opened ? "Garage ouvert" : "Garage fermé",
        cls: "success",
        icon: opened ? "mdi:garage-open" : "mdi:garage"
      },
      Number(this._config.feedback_duration_ms || 2400)
    );
    this.requestUpdate();
  }
  _handlePendingStateUpdate(oldHass) {
    if (!this._pendingAction) return;
    const current = this._garageStateInfo(this.hass);
    const previous = this._garageStateInfo(oldHass);
    if (current.key === "unavailable") {
      if (this._confirmationTimer) {
        window.clearTimeout(this._confirmationTimer);
        this._confirmationTimer = null;
      }
      this._pendingAction = null;
      this._setFeedback(
        {
          text: "État du garage indisponible",
          cls: "error-state",
          icon: "mdi:alert-circle"
        },
        Number(this._config.feedback_duration_ms || 2400)
      );
      return;
    }
    if (current.key !== previous.key || current.key !== this._pendingAction.initialState) {
      this._confirmPendingAction(current.key);
    }
  }
  async _runGarageAction() {
    this._error = "";
    if (this._garageBusy) return;
    const plan = this._actionPlan();
    if (plan.disabled) {
      this._error = plan.label || "Garage indisponible";
      this.requestUpdate();
      return;
    }
    const [domain, serviceName] = String(plan.service || "").split(".");
    if (!domain || !serviceName) {
      this._error = `Service garage invalide : ${plan.service || "non défini"}`;
      this.requestUpdate();
      return;
    }
    const actionToken = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const commandGeneration = ++this._commandGeneration;
    const initialState = this._garageStateInfo().key;
    this._garageBusy = true;
    this._pendingAction = plan.expectedState ? {
      token: actionToken,
      expectedState: plan.expectedState,
      initialState,
      intent: plan.intent,
      startedAt: Date.now(),
      commandGeneration
    } : null;
    if (this._config.action_feedback !== false) {
      this._setFeedback(this._progressFeedback(plan.intent));
    }
    this.requestUpdate();
    try {
      await this.hass.callService(domain, serviceName, {}, { entity_id: plan.entityId });
      if (!this._attached || commandGeneration !== this._commandGeneration) return;
      this._releaseBusyAfter(Number(this._config.action_lock_ms || 2e3), commandGeneration);
      if (plan.expectedState) {
        if (this._pendingAction?.token === actionToken) {
          if (this._config.action_feedback !== false) {
            this._setFeedback({
              text: "Commande garage envoyée",
              meta: "Confirmation de l’état en attente",
              cls: "warning",
              icon: "mdi:progress-clock"
            });
          }
          this._scheduleConfirmationTimeout(actionToken, commandGeneration);
          this._confirmPendingAction(this._garageStateInfo().key);
        }
      } else {
        this._pendingAction = null;
        if (this._config.action_feedback !== false) {
          this._setFeedback(
            {
              text: plan.intent === "stop" ? "Commande d’arrêt envoyée" : "Commande garage envoyée",
              meta: "État physique non confirmé",
              cls: "info",
              icon: "mdi:send-check-outline"
            },
            Number(this._config.feedback_duration_ms || 2400)
          );
        }
      }
    } catch (error) {
      if (!this._attached || commandGeneration !== this._commandGeneration) return;
      if (this._confirmationTimer) {
        window.clearTimeout(this._confirmationTimer);
        this._confirmationTimer = null;
      }
      this._pendingAction = null;
      this._garageBusy = false;
      this._error = `Impossible de commander le garage : ${error?.message || error}`;
      this._setFeedback(
        {
          text: "Impossible de commander le garage",
          cls: "error-state",
          icon: "mdi:alert-circle"
        },
        Number(this._config.feedback_duration_ms || 2400)
      );
      this.requestUpdate();
    }
  }
  _vehicles() {
    const raw = Array.isArray(this._config?.vehicle_entities) ? this._config.vehicle_entities : [];
    return raw.map((item, index) => {
      if (typeof item === "string") {
        return {
          key: `vehicle_${index}`,
          name: this._state(item)?.attributes?.friendly_name || `Véhicule ${index + 1}`,
          entity: item,
          icon: "mdi:car",
          present_state: "on",
          present_label: "Présent",
          absent_label: "Absent",
          unavailable_label: "Indisponible"
        };
      }
      const entity = item?.entity || item?.entity_id;
      if (!entity) return null;
      return {
        key: item.key || `vehicle_${index}`,
        name: item.name || this._state(entity)?.attributes?.friendly_name || `Véhicule ${index + 1}`,
        entity,
        count_entity: item.count_entity || "",
        icon: item.icon || "mdi:car",
        present_state: String(item.present_state ?? "on"),
        present_label: item.present_label || "Présent",
        absent_label: item.absent_label || "Absent",
        unavailable_label: item.unavailable_label || "Indisponible",
        detection_message: item.detection_message || `Voiture ${item.name || index + 1} détectée`
      };
    }).filter(Boolean);
  }
  _vehicleInfo(vehicle, hass = this.hass) {
    const entity = this._state(vehicle.entity, hass);
    if (!entity || this._isUnavailableState(entity.state)) {
      return {
        ...vehicle,
        raw: entity?.state || "missing",
        key: "unavailable",
        text: vehicle.unavailable_label,
        cls: "unavailable",
        present: false,
        count: ""
      };
    }
    const present = String(entity.state) === String(vehicle.present_state);
    const countEntity = vehicle.count_entity ? this._state(vehicle.count_entity, hass) : null;
    const countRaw = countEntity && !this._isUnavailableState(countEntity.state) ? Number(countEntity.state) : NaN;
    const count = Number.isFinite(countRaw) && countRaw > 0 ? String(countRaw) : "";
    return {
      ...vehicle,
      raw: entity.state,
      key: present ? "present" : "absent",
      text: present ? vehicle.present_label : vehicle.absent_label,
      cls: present ? "present" : "absent",
      present,
      count
    };
  }
  _detectionCandidates() {
    const candidates = [];
    if (this._config?.motion_entity) {
      candidates.push({
        entity: this._config.motion_entity,
        text: "Mouvement détecté",
        icon: "mdi:motion-sensor",
        cls: "warning",
        priority: 1
      });
    }
    if (this._config?.person_entity) {
      candidates.push({
        entity: this._config.person_entity,
        text: "Personne détectée",
        icon: "mdi:account-alert",
        cls: "warning",
        priority: 2
      });
    }
    for (const vehicle of this._vehicles()) {
      candidates.push({
        entity: vehicle.entity,
        activeState: vehicle.present_state,
        text: vehicle.detection_message,
        icon: vehicle.icon,
        cls: "info",
        priority: 3
      });
    }
    return candidates;
  }
  _handleDetectionUpdates(oldHass) {
    const duration = Math.max(1e3, Number(this._config?.event_message_duration_ms || 12e3));
    const now = Date.now();
    const triggered = [];
    for (const candidate of this._detectionCandidates()) {
      const current = this._state(candidate.entity, this.hass);
      if (!current) continue;
      const activeState = String(candidate.activeState ?? "on");
      const active = String(current.state) === activeState;
      if (!active) continue;
      const previous = this._state(candidate.entity, oldHass);
      const transitioned = previous ? String(previous.state) !== activeState : false;
      const changedAt = Date.parse(current.last_changed || current.last_updated || "") || 0;
      const recentInitialState = !previous && changedAt > 0 && now - changedAt <= duration;
      if (transitioned || recentInitialState) {
        triggered.push({ ...candidate, changedAt });
      }
    }
    if (!triggered.length) return;
    triggered.sort((a3, b3) => b3.changedAt - a3.changedAt || b3.priority - a3.priority);
    const selected = triggered[0];
    this._eventContext = {
      text: selected.text,
      cls: selected.cls,
      icon: selected.icon,
      entity: selected.entity,
      until: now + duration
    };
    if (this._eventTimer) window.clearTimeout(this._eventTimer);
    this._eventTimer = window.setTimeout(() => {
      this._eventContext = null;
      this._eventTimer = null;
      this.requestUpdate();
    }, duration);
  }
  _events() {
    if (this._config?.show_snapshots === false) return [];
    const raw = Array.isArray(this._config?.event_entities) ? this._config.event_entities : [];
    const normalized = raw.map((item, index) => {
      if (typeof item === "string") {
        return {
          key: `event_${index}`,
          name: this._state(item)?.attributes?.friendly_name || `Événement ${index + 1}`,
          entity: item,
          icon: "mdi:image"
        };
      }
      const entity = item?.entity || item?.entity_id;
      if (!entity) return null;
      return {
        key: item.key || `event_${index}`,
        name: item.name || this._state(entity)?.attributes?.friendly_name || `Événement ${index + 1}`,
        entity,
        icon: item.icon || "mdi:image"
      };
    }).filter(Boolean);
    const aliases = [
      ["last_person_entity", "Dernière personne", "mdi:account-clock"],
      ["last_motion_entity", "Dernier mouvement", "mdi:motion-sensor"],
      ["last_vehicle_a_entity", "Véhicule A", "mdi:car"],
      ["last_vehicle_b_entity", "Véhicule B", "mdi:car-side"],
      ["last_car_entity", "Dernière voiture", "mdi:car-clock"]
    ];
    for (const [configKey, name, icon] of aliases) {
      const entity = this._config?.[configKey];
      if (entity && !normalized.some((item) => item.entity === entity)) {
        normalized.push({ key: configKey, name, entity, icon });
      }
    }
    return normalized;
  }
  _entityPicture(entityId) {
    const entity = this._state(entityId);
    const picture = entity?.attributes?.entity_picture;
    if (!picture) return "";
    const absolute = picture.startsWith("http") ? picture : `${window.location.origin}${picture}`;
    const separator = absolute.includes("?") ? "&" : "?";
    const version = encodeURIComponent(entity.last_updated || entity.last_changed || "");
    return `${absolute}${separator}garage_card_v=${version}`;
  }
  _formatEventTime(entityId) {
    const entity = this._state(entityId);
    if (!entity) return "";
    const stateTimestamp = !this._isUnavailableState(entity.state) && Number.isFinite(Date.parse(entity.state)) ? entity.state : "";
    const raw = stateTimestamp || entity.last_changed || entity.last_updated;
    if (!raw) return "";
    try {
      return new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(raw));
    } catch (_error) {
      return "";
    }
  }
  _showMoreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId }
    }));
  }
  _contextMessage() {
    if (this._error) {
      return {
        text: this._error,
        cls: "error-state",
        icon: "mdi:alert-circle"
      };
    }
    if (this._garageFeedback) return this._garageFeedback;
    if (!this._commandAvailable()) {
      return {
        text: "Garage indisponible",
        cls: "error-state",
        icon: "mdi:garage-alert"
      };
    }
    const state = this._garageStateInfo();
    if (state.key === "unavailable") {
      return {
        text: "État du garage indisponible",
        meta: "Commande toujours disponible",
        cls: "warning",
        icon: "mdi:alert-circle-outline"
      };
    }
    if (this._eventContext && this._eventContext.until > Date.now()) {
      return this._eventContext;
    }
    return null;
  }
  _clearAllTimers() {
    for (const timerName of ["_busyTimer", "_feedbackTimer", "_confirmationTimer", "_eventTimer"]) {
      if (this[timerName]) window.clearTimeout(this[timerName]);
      this[timerName] = null;
    }
  }
  _invalidateCommandCycle(clearFeedback = false) {
    this._commandGeneration += 1;
    this._clearAllTimers();
    this._garageBusy = false;
    this._pendingAction = null;
    if (clearFeedback) {
      this._garageFeedback = null;
      this._error = "";
    }
  }
  _renderIcon(icon, extraClass = "") {
    return b2`<ha-icon class=${extraClass} .icon=${icon}></ha-icon>`;
  }
  _renderMainCard() {
    const status = this._garageStatus();
    const vehicles = this._vehicles().slice(0, 2).map((vehicle) => this._vehicleInfo(vehicle));
    return b2`
      <ha-card
        role="button"
        tabindex="0"
        aria-label="Ouvrir la carte ${this._config.name}"
        @click=${() => this._openDialog(true)}
        @keydown=${(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this._openDialog(true);
      }
    }}
      >
        <div class="main-card ${status.cls}">
          <div class="icon-wrap">${this._renderIcon(status.icon || this._config.icon)}</div>
          <div>
            <div class="title">${this._config.name}</div>
            <div class="subtitle">${status.text}</div>
          </div>
          <div class="mini-vehicles" @click=${(event) => event.stopPropagation()}>
            ${vehicles.map((vehicle) => b2`
              <button
                class="mini-vehicle ${vehicle.cls}"
                title="${vehicle.name} : ${vehicle.text}"
                aria-label="${vehicle.name} : ${vehicle.text}"
                @click=${() => this._showMoreInfo(vehicle.entity)}
              >
                ${this._renderIcon(vehicle.icon)}
                <span>${vehicle.name}</span>
              </button>
            `)}
          </div>
        </div>
      </ha-card>
    `;
  }
  _renderCameraNav(cameras) {
    if (cameras.length <= 1) return "";
    return b2`
      <div class="camera-nav">
        ${cameras.map((camera, index) => b2`
          <button
            class="bullet ${index === this._activeCameraIndex ? "active" : ""}"
            title=${camera.name}
            aria-label="Afficher la caméra ${camera.name}"
            @click=${() => this._setActiveCamera(index)}
          ></button>
        `)}
      </div>
      <div class="camera-tabs">
        ${cameras.map((camera, index) => b2`
          <button
            class="camera-tab ${index === this._activeCameraIndex ? "active" : ""}"
            @click=${() => this._setActiveCamera(index)}
          >
            ${this._renderIcon(camera.icon)} ${camera.name}
          </button>
        `)}
      </div>
    `;
  }
  _renderVehicles() {
    const vehicles = this._vehicles().map((vehicle) => this._vehicleInfo(vehicle));
    if (!vehicles.length) return "";
    return b2`
      <div class="section">
        <div class="section-title">Présence véhicules</div>
        <div class="vehicle-grid">
          ${vehicles.map((vehicle) => b2`
            <button
              class="vehicle-card ${vehicle.cls}"
              @click=${() => this._showMoreInfo(vehicle.entity)}
              title="Ouvrir les détails de ${vehicle.name}"
            >
              <span class="vehicle-icon">${this._renderIcon(vehicle.icon)}</span>
              <span>
                <span class="vehicle-name">${vehicle.name}</span>
                <span class="vehicle-state">
                  ${vehicle.text}${vehicle.count ? ` · ${vehicle.count}` : ""}
                </span>
              </span>
            </button>
          `)}
        </div>
      </div>
    `;
  }
  _renderEvents() {
    if (this._config.show_snapshots === false) return "";
    const events = this._events().map((event) => ({
      ...event,
      picture: this._entityPicture(event.entity),
      time: this._formatEventTime(event.entity)
    })).filter((event) => Boolean(event.picture));
    if (!events.length && this._config.show_empty_events !== true) return "";
    return b2`
      <div class="section">
        <div class="section-title">Derniers événements</div>
        ${events.length ? b2`
          <div class="event-grid ${events.length === 1 ? "single" : ""}">
            ${events.map((event) => b2`
              <button
                class="snapshot"
                @click=${() => this._showMoreInfo(event.entity)}
                title="Ouvrir ${event.name}"
              >
                <img src=${event.picture} alt=${event.name} loading="lazy" />
                <div class="snapshot-label">
                  ${event.name}${event.time ? ` · ${event.time}` : ""}
                </div>
              </button>
            `)}
          </div>
        ` : b2`
          <div class="empty-events">Aucun snapshot exploitable n’est actuellement disponible.</div>
        `}
      </div>
    `;
  }
  _renderDebug() {
    if (this._config.show_debug !== true) return "";
    const state = this._garageStateInfo();
    const plan = this._actionPlan();
    const activeCamera = this._activeCamera();
    const vehicles = this._vehicles().map((vehicle) => this._vehicleInfo(vehicle));
    const command = this._state(this._config.garage_entity);
    const debugData = {
      version: VERSION,
      command_entity: this._config.garage_entity,
      command_state: command?.state || "missing",
      command_available: this._commandAvailable(),
      action_service: plan.service || "none",
      action_intent: plan.intent,
      state_entity: state.entityId || "none",
      state_raw: state.raw || "none",
      state_interpreted: state.key,
      camera_active: activeCamera?.entity || "none",
      camera_index: `${this._activeCameraIndex + 1}/${this._cameras().length}`,
      busy: this._garageBusy,
      pending_expected_state: this._pendingAction?.expectedState || "none",
      feedback: this._garageFeedback?.text || "none",
      vehicles: Object.fromEntries(vehicles.map((vehicle) => [vehicle.name, vehicle.raw])),
      motion: this._config.motion_entity ? this._state(this._config.motion_entity)?.state || "missing" : "not configured",
      person: this._config.person_entity ? this._state(this._config.person_entity)?.state || "missing" : "not configured"
    };
    return b2`
      <details class="debug">
        <summary>Debug garage-control-card</summary>
        <pre>${JSON.stringify(debugData, null, 2)}</pre>
      </details>
    `;
  }
  _renderDialog() {
    if (!this._dialogOpen) return "";
    const status = this._garageStatus();
    const cameras = this._cameras();
    const activeCamera = this._activeCamera();
    const action = this._actionPlan();
    const contextMessage = this._contextMessage();
    const liveBadgeDuration = Math.max(
      1e3,
      Number(this._config.live_detection_badge_duration_ms || this._config.event_message_duration_ms || 12e3)
    );
    const motion = this._config.show_motion_badge !== false && this._isRecentlyActive(this._config.motion_entity, "on", liveBadgeDuration);
    const person = this._config.show_person_badge !== false && this._isOn(this._config.person_entity);
    const actionLabel = this._garageBusy && this._garageFeedback?.text ? this._garageFeedback.text : action.label;
    const actionIcon = this._garageBusy ? "mdi:loading" : action.icon;
    return b2`
      <div class="overlay" @click=${() => this._closeDialog(true)}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${this._config.name} @click=${(event) => event.stopPropagation()}>
          <div class="dialog-header">
            <div class="dialog-title-row">
              <div class="icon-wrap ${status.cls}">${this._renderIcon(status.icon || this._config.icon)}</div>
              <div class="dialog-title-copy">
                <div class="title">${this._config.name}</div>
                <div class="status-pill ${status.cls}">
                  ${this._renderIcon(status.icon || this._config.icon)}
                  <span>${status.text}</span>
                </div>
              </div>
            </div>
            <button class="close-btn" @click=${() => this._closeDialog(true)} title="Fermer">
              ${this._renderIcon("mdi:close")}
            </button>
          </div>

          <div class="camera-section">
            <div class="camera-area" @touchstart=${this._onTouchStart} @touchend=${this._onTouchEnd}>
              ${this._cameraCard || b2`
                <div class="camera-placeholder">
                  <div class="camera-placeholder-content">
                    ${this._renderIcon("mdi:camera")}
                    <span>Chargement de la caméra…</span>
                  </div>
                </div>
              `}
              ${activeCamera ? b2`
                <div class="camera-overlay-label">
                  ${this._renderIcon(activeCamera.icon)} ${activeCamera.name}
                </div>
              ` : ""}
              ${motion || person ? b2`
                <div class="camera-live-badges">
                  ${motion ? b2`<span class="camera-live-badge active" title="Mouvement récent">${this._renderIcon("mdi:motion-sensor")}</span>` : ""}
                  ${person ? b2`<span class="camera-live-badge active" title="Personne détectée">${this._renderIcon("mdi:account")}</span>` : ""}
                </div>
              ` : ""}
            </div>
            ${this._renderCameraNav(cameras)}
          </div>

          <div class="dialog-body">
            ${contextMessage ? b2`
              <div class="message-zone">
                <div class="context-message ${contextMessage.cls || "info"}">
                  ${this._renderIcon(contextMessage.icon || "mdi:information-outline")}
                  <span>${contextMessage.text}</span>
                  ${contextMessage.meta ? b2`<span class="context-meta">· ${contextMessage.meta}</span>` : ""}
                </div>
              </div>
            ` : ""}

            <div class="primary-action">
              <button
                class="button ${action.cls}"
                ?disabled=${action.disabled || this._garageBusy}
                @click=${() => this._runGarageAction()}
              >
                ${this._renderIcon(actionIcon, this._garageBusy ? "spin" : "")}
                ${actionLabel}
              </button>
            </div>

            ${this._renderVehicles()}
            ${this._renderEvents()}
            ${this._renderDebug()}
          </div>
        </div>
      </div>
    `;
  }
  render() {
    if (!this._config || !this.hass) return b2``;
    return b2`${this._renderMainCard()}${this._renderDialog()}`;
  }
};
var GarageControlCardEditor = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._generation = 0;
  }
  setConfig(config) {
    this._config = structuredClone(config || {});
    this._updateForm();
  }
  set hass(hass) {
    this._hass = hass;
    this._updateForm();
  }
  connectedCallback() {
    this._mountForm();
  }
  disconnectedCallback() {
    this._generation += 1;
    window.clearTimeout(this._waitTimer);
  }
  async _mountForm() {
    const generation = ++this._generation;
    this.shadowRoot.textContent = "Chargement de l’éditeur…";
    const ready = await Promise.race([
      customElements.whenDefined("ha-form").then(() => true),
      new Promise((resolve) => {
        this._waitTimer = window.setTimeout(() => resolve(false), 1e4);
      })
    ]);
    window.clearTimeout(this._waitTimer);
    if (!this.isConnected || generation !== this._generation) return;
    if (!ready) {
      this.shadowRoot.textContent = "Éditeur indisponible. Rouvrir la carte ou utiliser YAML.";
      return;
    }
    this._form = document.createElement("ha-form");
    this._form.addEventListener("value-changed", (event) => this._valueChanged(event));
    this.shadowRoot.replaceChildren(this._form);
    this._updateForm();
  }
  _updateForm() {
    if (!this._form) return;
    const { schema, computeLabel } = GarageControlCard.getConfigForm();
    this._form.hass = this._hass;
    this._form.schema = schema;
    this._form.computeLabel = computeLabel;
    this._formData = {
      ...GarageControlCard.getDefaultConfig(),
      ...structuredClone(this._config || {})
    };
    this._form.data = structuredClone(this._formData);
  }
  _valueChanged(event) {
    event.stopPropagation();
    const data = event.detail?.value;
    if (!data || typeof data !== "object" || Array.isArray(data)) return;
    const { schema } = GarageControlCard.getConfigForm();
    const editable = /* @__PURE__ */ new Set();
    const collect = (items) => items.forEach((item) => {
      if (item.selector) editable.add(item.name);
      if (item.schema) collect(item.schema);
    });
    collect(schema);
    const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
    const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
    const defaults = GarageControlCard.getDefaultConfig();
    const previous = this._formData || { ...defaults, ...this._config };
    const emitted = Object.keys(data).filter((key) => editable.has(key));
    const fullSnapshot = emitted.length > 1;
    const next = structuredClone(this._config || {});
    for (const key of editable) {
      if (own(data, key)) {
        if (same(data[key], previous[key])) continue;
        if (data[key] === void 0 || own(defaults, key) && same(data[key], defaults[key])) delete next[key];
        else next[key] = structuredClone(data[key]);
      } else if (fullSnapshot && own(previous, key) && own(next, key)) {
        delete next[key];
      }
    }
    this._config = next;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: structuredClone(this._config) },
      bubbles: true,
      composed: true
    }));
    this._updateForm();
  }
};
if (!customElements.get("garage-control-card")) {
  customElements.define("garage-control-card", GarageControlCard);
}
if (!customElements.get("garage-control-card-editor")) {
  customElements.define("garage-control-card-editor", GarageControlCardEditor);
}
window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "garage-control-card")) {
  window.customCards.push({
    type: "garage-control-card",
    name: "Garage Control Card",
    preview: true,
    description: "Carte garage mobile-first avec caméras, commande, présence véhicules et événements, sans SIP.",
    documentationURL: "https://github.com/smornierHA/ha-board/blob/main/docs/CARDS.md#garage-control-card"
  });
}
console.info(
  `%c GARAGE-CONTROL-CARD %c v${VERSION}`,
  "color: white; background: #2196f3; font-weight: 700; padding: 2px 6px; border-radius: 4px 0 0 4px;",
  "color: #2196f3; background: rgba(33, 150, 243, 0.12); font-weight: 700; padding: 2px 6px; border-radius: 0 4px 4px 0;"
);
