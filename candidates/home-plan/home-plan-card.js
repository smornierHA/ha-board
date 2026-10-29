/* HA-BOARD Home Plan 0.6.0-rc.2 | Lit incorporated | see THIRD-PARTY-NOTICES.md
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

// node_modules/@lit/reactive-element/css-tag.js
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

// node_modules/@lit/reactive-element/reactive-element.js
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

// node_modules/lit-html/lit-html.js
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

// node_modules/lit-element/lit-element.js
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

// node_modules/lit-html/directive.js
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

// node_modules/lit-html/directive-helpers.js
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

// node_modules/lit-html/directives/repeat.js
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

// node_modules/lit-html/directives/unsafe-html.js
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

// node_modules/lit-html/directives/unsafe-svg.js
var t5 = class extends e5 {
};
t5.directiveName = "unsafeSVG", t5.resultType = 2;
var o6 = e4(t5);

// src/candidate/home-plan-card.css
var home_plan_card_default = '\n    :host { display:block; color-scheme:light; } :host([dark]) {color-scheme:dark;}\n    .hpf-home {\n      --hp-paper: light-dark(#fbfbfc,#1d2026); --hp-ink: light-dark(#20242b,#f4f5f8);\n      --hp-secondary: light-dark(#626b76,#aab2bf); --hp-line: light-dark(#e7e9ee,#353b46);\n      --hp-soft: light-dark(#f0f2f6,#2b303a); --hp-blue: light-dark(#2673e7,#74adff);\n      --hp-selected: light-dark(#e2ecff,#273e5b); --hp-warm: light-dark(#fff0c8,#55472c);\n      --hp-amber: light-dark(#926000,#f9cc6e); --hp-orange: light-dark(#b8561c,#ffb187);\n      --hp-alert-bg: light-dark(#fff1e7,#473428); --hp-floor: light-dark(#efede6,#30353c);\n      --hp-wall: light-dark(#bcbdb8,#68727e); --hp-furniture: light-dark(#dedbd2,#424a55);\n      --hp-furniture-line: light-dark(#c7c4bb,#5a6572); --hp-water: light-dark(#9fd0d8,#346472);\n      --hp-glass: light-dark(#c4dce5,#5b7b8d); --hp-good: light-dark(#367258,#89c6aa);\n      position: relative; max-width: 680px; margin: 0 auto; overflow: hidden; isolation: isolate;\n      background: var(--hp-paper); color: var(--hp-ink); border-radius: 26px;\n      box-shadow: 0 8px 34px light-dark(#202b4212,#00000026);\n      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; font-size: 14px;\n      -webkit-tap-highlight-color: transparent;\n    }\n    .hpf-home * { box-sizing: border-box; }\n    button, input { font: inherit; }\n    button { color: inherit; }\n    button:disabled { opacity: .5; }\n    .hpf-head { padding: 21px 22px 13px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n    .hpf-heading { display: flex; align-items: center; gap: 11px; }\n    .hpf-home-mark { display: grid; place-items: center; width: 39px; height: 39px; border-radius: 13px; color: var(--hp-blue); background: var(--hp-selected); }\n    .hpf-home-mark svg { width: 21px; height: 21px; }\n    h2 { margin: 0; font-size: 21px; line-height: 1.2; font-weight: 650; letter-spacing: -.5px; }\n    .hpf-floor-name { display: block; margin-top: 4px; font-size: 12px; color: var(--hp-secondary); }\n    .hpf-preview-mark { margin-right: 4px; font-size: 11px; color: var(--hp-secondary); white-space: nowrap; }\n    .hpf-tools { display: flex; align-items: center; justify-content: space-between; gap: 6px 10px; flex-wrap: wrap; padding: 0 22px 8px; }\n    .hpf-glance { display: flex; align-items: center; gap: 6px; min-width: 0; flex-wrap: nowrap; }\n    .hpf-glance button { display: inline-flex; align-items: center; gap: 5px; min-height: 40px; border: 0; border-radius: 12px; background: transparent; padding: 4px 7px; font-size: 12px; white-space: nowrap; }\n    .hpf-glance button:first-child { margin-left: -7px; }\n    .hpf-glance svg { width: 15px; height: 15px; }\n    .hpf-glance button[data-light-count] { color: var(--hp-amber); }\n    .hpf-glance button[data-open-count] { color: var(--hp-orange); }\n    .hpf-glance button[aria-pressed="true"] { background: var(--hp-soft); }\n    .hpf-view { display: flex; padding: 3px; margin-left: auto; border-radius: 11px; background: var(--hp-soft); }\n    .hpf-view button { display: flex; align-items: center; justify-content: center; min-width: 44px; min-height: 35px; padding: 5px 9px; border: 0; border-radius: 8px; background: transparent; color: var(--hp-secondary); font-size: 12px; }\n    .hpf-view button svg { width: 17px; height: 17px; }\n    .hpf-view button[aria-pressed="true"] { background: var(--hp-paper); color: var(--hp-ink); box-shadow: 0 1px 4px #00000013; }\n    .hpf-map { position: relative; margin: 0 auto; width: calc(100% - 24px); max-width: 560px; aspect-ratio: 1000 / 660; }\n    .hpf-aperture-layer { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; overflow: visible; pointer-events: none; }\n    .hpf-aperture-layer [data-map-aperture] { pointer-events: stroke; }\n    .hpf-drawing { display: block; width: 100%; height: 100%; overflow: visible; }\n    .hpf-room-floor { fill: var(--hp-floor); transition: fill .2s; }\n    .hpf-room-floor.is-lit { fill: var(--hp-warm); }\n    .hpf-room-floor.is-selected { fill: var(--hp-selected); }\n    .hpf-room-floor.is-muted { opacity: .28; }\n    .hpf-drawing .wall { fill: none; stroke: var(--hp-wall); stroke-width: 7; stroke-linecap: square; stroke-linejoin: miter; }\n    .hpf-drawing .inner-wall { fill: none; stroke: var(--hp-wall); stroke-width: 5; }\n    .hpf-drawing .thin { fill: none; stroke: var(--hp-glass); stroke-width: 1.6; opacity: .55; }\n    .hpf-drawing .door { fill: none; stroke: var(--hp-wall); stroke-width: 2.6; opacity: .75; }\n    .hpf-drawing .window { fill: none; stroke: var(--hp-glass); stroke-width: 5; }\n    .hpf-drawing .furniture { fill: var(--hp-furniture); stroke: var(--hp-furniture-line); stroke-width: 1.6; }\n    .hpf-drawing .furniture-line, .hpf-drawing .stairs { fill: none; stroke: var(--hp-furniture-line); stroke-width: 2; }\n    .hpf-drawing .plant { fill: none; stroke: var(--hp-good); stroke-width: 2; opacity: .4; }\n    .hpf-drawing .pool { fill: var(--hp-water); stroke: var(--hp-glass); stroke-width: 2; }\n    .hpf-drawing .pool-line { fill: none; stroke: var(--hp-paper); stroke-width: 2; opacity: .38; }\n    .hpf-drawing .trace-wall { fill: var(--hp-wall); }\n    .hpf-drawing .trace-door { fill: var(--hp-good); opacity: .7; }\n    .hpf-drawing .trace-window { fill: var(--hp-glass); }\n    .hpf-drawing .trace-stair { fill: var(--hp-furniture); }\n    .hpf-drawing .terrace { fill: var(--hp-soft); opacity: .7; }\n    .hpf-modebar { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 3px; margin: 2px 16px 8px; padding: 3px; border-radius: 14px; background: var(--hp-soft); }\n    .hpf-modebar button { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; min-width: 0; min-height: 49px; padding: 6px 1px; border: 0; border-radius: 11px; background: transparent; color: var(--hp-secondary); font-size: 11px; }\n    .hpf-modebar svg { width: 19px; height: 19px; }\n    .hpf-modebar button[aria-pressed="true"] { background: var(--hp-paper); color: var(--hp-ink); box-shadow: 0 1px 4px light-dark(#00000012,#00000026); }\n    .hpf-mode-short { display: none; }\n    .hpf-aperture-layer .aperture-line { fill: none; stroke: var(--hp-glass); stroke-width: 6; stroke-linecap: butt; }\n    .hpf-aperture-layer .aperture-halo { fill: none; stroke: var(--hp-orange); stroke-width: 20; opacity: .18; }\n    .hpf-aperture-layer .aperture-line.is-open, .hpf-aperture-layer .aperture-leaf { stroke: var(--hp-orange); }\n    .hpf-aperture-layer .aperture-leaf { fill: none; stroke-width: 4; }\n    .hpf-aperture-layer .shutter-track { fill: none; stroke: var(--hp-glass); stroke-width: 12; opacity: .5; }\n    .hpf-aperture-layer .shutter-fill { fill: none; stroke: var(--hp-blue); stroke-width: 12; }\n    .hpf-aperture-layer .aperture-leader { fill: none; stroke: var(--hp-blue); stroke-width: 1.4; opacity: .55; }\n    .hpf-aperture { position: absolute; z-index: 3; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; transform: translate(-50%,-50%); border: 0; border-radius: 12px; background: transparent; }\n    .hpf-aperture-mark { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; min-width: 22px; min-height: 23px; padding: 3px 5px; border-radius: 7px; background: var(--hp-paper); color: var(--hp-blue); box-shadow: 0 1px 5px light-dark(#1d2a4525,#00000055); font-size: 11px; font-variant-numeric: tabular-nums; }\n    .hpf-aperture-mark svg { width: 14px; height: 14px; }\n    .hpf-aperture.is-open:not(.has-cover) .hpf-aperture-mark { color: var(--hp-orange); background: var(--hp-alert-bg); }\n    .hpf-aperture:not(.show-value) .hpf-aperture-mark > span { display: none; }\n    .hpf-aperture.is-muted { opacity: .32; }\n    .hpf-map-legend { min-height: 30px; padding: 3px 17px 9px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px 14px; font-size: 11px; color: var(--hp-secondary); }\n    .hpf-map-legend span { display: inline-flex; gap: 5px; align-items: center; }\n    .hpf-map-legend svg { width: 13px; height: 13px; }\n    .hpf-map-legend .opening-key { color: var(--hp-orange); }\n    .hpf-map-legend .cover-key { color: var(--hp-blue); }\n    .hpf-room-tile .hpf-tile-cover { color: var(--hp-blue); }\n    .hpf-photo-style { position: absolute; left: 9px; bottom: 9px; border: 0; border-radius: 9px; min-height: 34px; padding: 5px 10px; background: var(--hp-paper); color: var(--hp-ink); font-size: 11px; }\n    .hpf-cover-state { font-size: 12px; margin-left: auto; color: var(--hp-blue); font-variant-numeric: tabular-nums; }\n    .hpf-quick-room { display: flex; align-items: center; justify-content: center; gap: 7px; border: 0; background: transparent; padding: 10px; min-height: 44px; width: 100%; color: var(--hp-blue); font-size: 12px; }\n    .hpf-quick-room svg { width: 15px; height: 15px; }\n    .hpf-photo-shortcut { position: absolute; display: flex; flex-direction: column; padding: 0; overflow: hidden; border: 1px solid var(--hp-line); border-radius: 16px; background: var(--hp-paper); text-align: left; }\n    .hpf-photo-shortcut img { width: 100%; flex: 1 1 0; min-height: 0; object-fit: cover; }\n    .hpf-photo-caption { display: flex; align-items: center; justify-content: space-between; gap: 4px; width: 100%; padding: 9px 10px; font-size: 12px; font-weight: 600; }\n    .hpf-photo-caption svg { flex: 0 0 auto; width: 14px; height: 14px; }\n    .hpf-room-photo { position: relative; height: 160px; margin: 0 0 14px; overflow: hidden; border-radius: 15px; background: var(--hp-soft); }\n    .hpf-room-photo img { width: 100%; height: 100%; object-fit: cover; }\n    .hpf-photo-next { position: absolute; right: 9px; bottom: 9px; min-width: 44px; min-height: 36px; border: 0; border-radius: 10px; background: #15202dcc; color: #fff; padding: 6px 10px; font-size: 12px; }\n    .hpf-zone { position: absolute; margin: 0; border: 0; padding: 0; background: transparent; overflow: visible; border-radius: 4px; }\n    .hpf-zone.is-muted { opacity: .36; }\n    .hpf-room-name { position: absolute; display: flex; align-items: center; flex-direction: column; gap: 3px; transform: translate(-50%,-50%); white-space: nowrap; pointer-events: none; }\n    .hpf-room-name strong { font-size: clamp(11px,1.8vw,14px); line-height: 1.15; font-weight: 620; letter-spacing: -.2px; text-shadow: 0 1px 8px var(--hp-floor); }\n    .hpf-room-name small { font-size: 11px; line-height: 1.1; color: var(--hp-secondary); }\n    .hpf-name-micro { display: none; }\n    .hpf-zone.has-opening strong, .hpf-zone.has-opening small { color: var(--hp-orange); }\n    .hpf-zone[aria-pressed="true"] strong { color: var(--hp-blue); }\n    .hpf-room-name .hpf-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--hp-amber); }\n    .hpf-room-alert { display: inline-grid; place-items: center; margin-left: 3px; width: 12px; height: 12px; font-size: 10px; color: var(--hp-paper); background: var(--hp-orange); border-radius: 50%; text-shadow: none; vertical-align: 1px; }\n    .hpf-room-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; padding: 9px 20px 18px; }\n    .hpf-room-grid[hidden], [hidden] { display: none !important; }\n    .hpf-room-tile { min-width: 0; padding: 15px; min-height: 99px; text-align: left; border: 0; border-radius: 17px; background: var(--hp-soft); }\n    .hpf-room-tile svg { display: block; width: 20px; height: 20px; margin-bottom: 10px; color: var(--hp-secondary); }\n    .hpf-room-tile strong { display: block; font-size: 13px; font-weight: 600; }\n    .hpf-room-tile small { display: block; margin-top: 4px; font-size: 11px; color: var(--hp-secondary); }\n    .hpf-room-tile.is-lit { background: var(--hp-warm); }\n    .hpf-room-tile.has-opening { background: var(--hp-alert-bg); }\n    .hpf-room-tile.has-opening small { color: var(--hp-orange); }\n    .hpf-footer { display: flex; align-items: center; gap: 8px; padding: 12px 21px 17px; border-top: 1px solid var(--hp-line); }\n    .hpf-footer > svg { flex: 0 0 auto; width: 16px; height: 16px; color: var(--hp-orange); }\n    .hpf-footer-copy { font-size: 12px; min-width: 0; flex: 1; color: var(--hp-secondary); }\n    .hpf-footer button { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; flex: 0 0 auto; border: 0; padding: 6px 0 6px 9px; background: transparent; color: var(--hp-ink); font-size: 12px; font-weight: 600; }\n    .hpf-footer button svg { width: 14px; height: 14px; }\n    .hpf-sheet { position: absolute; z-index: 5; inset: auto 0 0; margin: 0; width: 100%; max-width: none; max-height: 100%; padding: 18px 22px 21px; border: 1px solid var(--hp-line); border-bottom: 0; border-radius: 23px 23px 0 0; background: var(--hp-paper); color: var(--hp-ink); box-shadow: 0 -15px 50px #00000022; overflow-y: auto; }\n    .hpf-sheet::backdrop { background: transparent; }\n    .hpf-sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }\n    .hpf-sheet h3 { margin: 0; font-size: 20px; font-weight: 650; letter-spacing: -.4px; }\n    .hpf-sheet-sub { display: block; margin-top: 4px; font-size: 12px; color: var(--hp-secondary); }\n    .hpf-close { display: grid; place-items: center; width: 44px; height: 44px; flex: 0 0 auto; border: 0; border-radius: 50%; background: var(--hp-soft); }\n    .hpf-close svg { width: 18px; height: 18px; }\n    .hpf-device-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }\n    .hpf-device { display: flex; align-items: center; gap: 11px; min-height: 68px; border: 0; border-radius: 16px; background: var(--hp-soft); padding: 13px 14px; text-align: left; }\n    .hpf-device > svg { width: 23px; height: 23px; flex: 0 0 auto; }\n    .hpf-device.is-lit { background: var(--hp-warm); color: var(--hp-amber); }\n    .hpf-device strong { display: block; font-size: 13px; font-weight: 600; }\n    .hpf-device small { display: block; margin-top: 4px; font-size: 12px; }\n    .hpf-cover { margin-top: 10px; padding: 13px 15px; border-radius: 16px; background: var(--hp-soft); }\n    .hpf-cover-caption { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }\n    .hpf-cover-caption svg { width: 17px; height: 17px; }\n    .hpf-cover-caption output { margin-left: auto; font-weight: 500; font-variant-numeric: tabular-nums; }\n    .hpf-cover input { width: 100%; margin: 9px 0 5px; min-height: 30px; accent-color: var(--hp-blue); }\n    .hpf-cover-actions { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; }\n    .hpf-cover-actions button { min-height: 40px; display: flex; align-items: center; justify-content: center; gap: 5px; border: 0; border-radius: 9px; background: var(--hp-paper); font-size: 12px; }\n    .hpf-cover-actions svg { width: 14px; height: 14px; }\n    .hpf-opening { display: flex; align-items: center; gap: 9px; padding: 12px 1px 2px; font-size: 12px; color: var(--hp-secondary); }\n    .hpf-opening svg { width: 17px; height: 17px; flex: 0 0 auto; }\n    .hpf-opening.is-open { color: var(--hp-orange); }\n    .hpf-opening strong { margin-left: auto; font-weight: 600; }\n    .hpf-sheet details { margin-top: 13px; border-top: 1px solid var(--hp-line); padding-top: 6px; }\n    .hpf-sheet summary { padding: 9px 0; font-size: 12px; color: var(--hp-secondary); }\n    .hpf-extra { display: flex; align-items: center; gap: 8px; padding: 7px 0; font-size: 12px; }\n    .hpf-extra svg { width: 16px; height: 16px; color: var(--hp-secondary); }\n    .hpf-extra span:last-child { margin-left: auto; color: var(--hp-secondary); }\n    .hpf-empty { padding: 20px 0 14px; font-size: 13px; color: var(--hp-secondary); }\n    .hpf-alerts { display: grid; gap: 8px; }\n    ha-state-icon { --mdc-icon-size:18px; width:18px; height:18px; display:inline-flex; flex-shrink:0; }\n    .hpf-device ha-state-icon { --mdc-icon-size:22px; width:22px; height:22px; }\n    .hpf-more > span:first-of-type { flex:1; min-width:0; overflow-wrap:anywhere; }\n    .hpf-more > span:last-child { flex:0 0 auto; max-width:44%; overflow-wrap:anywhere; }\n    .hpf-sheet .hpf-room-photo { height:106px; margin:10px 0; }\n    .hpf-sheet-tabs { display:flex; padding:3px; gap:3px; border-radius:11px; background:var(--hp-soft); margin:0 0 10px; }\n    .hpf-sheet-tabs button { flex:1; min-height:38px; padding:6px 8px; border:0; border-radius:8px; background:transparent; font-size:12px; }\n    .hpf-sheet-tabs button[aria-pressed="true"] { background:var(--hp-paper); }\n    .hpf-group { margin:9px 0; padding:10px 12px; border-radius:14px; background:var(--hp-selected); }\n    .hpf-group-caption { display:flex; justify-content:space-between; gap:8px; font-size:12px; margin-bottom:8px; }\n    .hpf-group-caption span { color:var(--hp-secondary); }\n    .hpf-group-actions { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:5px; }\n    .hpf-group-actions.two { grid-template-columns:repeat(2,minmax(0,1fr)); }\n    .hpf-group-actions button { display:flex; align-items:center; justify-content:center; gap:5px; border:0; border-radius:8px; background:var(--hp-paper); min-height:44px; padding:5px; font-size:12px; }\n    .hpf-group-actions ha-icon { --mdc-icon-size:15px; width:15px; height:15px; }\n    .hpf-position-control { display:grid; grid-template-columns:35px minmax(0,1fr); gap:12px; align-items:center; margin:4px 0 10px; }\n    .hpf-cover-preview { width:32px; height:41px; display:block; position:relative; overflow:hidden; background:var(--hp-paper); border:2px solid var(--hp-glass); border-radius:3px; }\n    .hpf-cover-preview::after { content:""; position:absolute; inset:0 0 auto; height:var(--closed); background:repeating-linear-gradient(to bottom,var(--hp-blue) 0 3px,var(--hp-selected) 3px 5px); }\n    .hpf-cover-preview.is-screen::after { top:auto; bottom:0; height:calc(100% - var(--closed)); background:var(--hp-blue); opacity:.65; }\n    .hpf-range-labels { display:flex; justify-content:space-between; gap:6px; color:var(--hp-secondary); font-size:11px; }\n    .hpf-cover .hpf-cover-caption { gap:6px; flex-wrap:nowrap; }\n    .hpf-cover .hpf-cover-caption > span { min-width:0; overflow-wrap:anywhere; }\n    .hpf-cover-info { display:grid; place-items:center; flex:0 0 auto; width:32px; height:38px; padding:0; border:0; border-radius:8px; background:transparent; }\n    .hpf-equipment-group > summary { display:flex; align-items:center; gap:10px; min-height:52px; list-style:none; }\n    .hpf-equipment-group > summary::-webkit-details-marker { display:none; }\n    .hpf-equipment-group > summary > span { flex:1; min-width:0; }\n    .hpf-equipment-group strong,.hpf-equipment-group small { display:block; overflow-wrap:anywhere; }\n    .hpf-equipment-group strong { color:var(--hp-ink); font-weight:500; font-size:13px; }\n    .hpf-equipment-group small { margin-top:3px; font-size:11px; }\n    .hpf-sheet details.hpf-equipment-group { margin:0; padding:0; }\n    .hpf-equipment-group[open] > summary > ha-icon { transform:rotate(180deg); }\n    .hpf-floor-covers { display:flex; align-items:center; justify-content:center; gap:8px; width:calc(100% - 32px); margin:0 16px 4px; min-height:38px; padding:5px 10px; border:0; border-radius:10px; background:var(--hp-selected); font-size:12px; }\n    .hpf-map .hpf-room-marker.is-light ha-state-icon { color:var(--hp-secondary); background:var(--hp-paper); padding:4px; border-radius:50%; width:25px; height:25px; box-sizing:content-box; box-shadow:0 1px 5px #0002; }\n    .hpf-map .hpf-room-marker.is-light.is-on ha-state-icon { color:var(--hp-amber); background:var(--hp-warm); box-shadow:0 0 14px var(--hp-warm); }\n    .hpf-map .hpf-room-marker:not(.is-light) ha-state-icon { color:var(--hp-secondary); padding:3px; border-radius:7px; background:var(--hp-paper); box-sizing:content-box; }\n    .hpf-map .hpf-room-marker.is-alert ha-state-icon { color:var(--error-color,#b3261e); background:var(--hp-alert-bg); }\n    .hpf-aperture-layer .aperture-swing { fill:none; stroke:var(--hp-wall); stroke-width:2; stroke-dasharray:4 4; opacity:.6; }\n    .hpf-aperture-layer .aperture-leaf { stroke:var(--hp-wall); }\n    .hpf-aperture-layer .aperture-leaf.is-open,.hpf-aperture-layer .aperture-swing.is-open { stroke:var(--hp-orange); }\n    .hpf-placement .hpf-map { width:100%; }\n    .hpf-placement .hpf-zone { pointer-events:none; }\n    .hpf-map.is-editing .hpf-aperture,.hpf-map.is-editing .hpf-room-marker { touch-action:none; cursor:grab; z-index:4; }\n    .hpf-map.is-editing [data-edit-selected="true"] { outline:2px solid var(--hp-blue); outline-offset:-2px; background:var(--hp-selected); }\n    .hpf-placement-caption { padding:5px 12px 10px; font-size:11px; text-align:center; color:var(--hp-secondary); }\n    .hpf-alert-item { display: flex; align-items: center; gap: 12px; min-height: 61px; padding: 11px 14px; background: var(--hp-alert-bg); border: 0; border-radius: 15px; text-align: left; }\n    .hpf-alert-item > svg { width: 20px; height: 20px; color: var(--hp-orange); }\n    .hpf-alert-item strong { display: block; font-size: 13px; font-weight: 600; }\n    .hpf-alert-item small { display: block; margin-top: 4px; font-size: 12px; color: var(--hp-orange); }\n    .hpf-announcement { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); }\n    @media (max-width: 460px) {\n      .hpf-head { padding: 18px 16px 10px; }\n      .hpf-tools { padding: 0 16px 7px; gap: 6px; }\n      .hpf-preview-mark { font-size: 11px; }\n      .hpf-room-grid { grid-template-columns: repeat(2,minmax(0,1fr)); padding: 6px 14px 14px; gap: 8px; }\n      .hpf-room-tile { min-height: 91px; padding: 12px; }\n      .hpf-footer { padding: 8px 15px 12px; }\n      .hpf-sheet { padding: 16px; }\n      .hpf-room-name strong { font-size: 11px; }\n      .hpf-view button { min-width: 35px; padding: 5px 7px; }\n      .hpf-glance { gap: 3px; }\n      .hpf-glance button { padding-inline: 5px; font-size: 11px; gap: 4px; }\n      .hpf-room-photo { height: 120px; }\n      .hpf-photo-caption { padding: 8px; font-size: 11px; }\n      .hpf-photo-shortcut { border-radius: 12px; }\n    }\n    @media (pointer: coarse) {\n      .hpf-glance button, .hpf-view button, .hpf-cover-actions button, .hpf-footer button { min-height: 44px; }\n      .hpf-view button { min-width: 42px; }\n    }\n    @media (max-width: 360px) {\n      .hpf-name-full { display: none; }\n      .hpf-name-micro { display: inline; }\n      .hpf-mode-long { display: none; }\n      .hpf-mode-short { display: inline; }\n    }\n    @media (prefers-reduced-motion: reduce) { .hpf-room-floor { transition: none; } }\n\n    .hpf-level-picker { display:flex; gap:12px; align-items:center; font-size:12px; margin:8px 0; }\n    .hpf-level-picker select { flex:1; min-width:0; min-height:44px; font:inherit; color:var(--hp-ink); background:var(--hp-soft); border:1px solid var(--hp-line); border-radius:10px; padding:8px; }\n    /* Keep the slatted shutter/screen illustration; range fill represents closure/deployment. */\n    .hpf-home :is(ha-icon,ha-state-icon) { display:inline-flex; align-items:center; justify-content:center; line-height:1; vertical-align:middle; flex-shrink:0; }\n    .hpf-home button :is(ha-icon,ha-state-icon) { align-self:center; }\n    .hpf-map .hpf-room-marker :is(ha-icon,ha-state-icon),.hpf-map .hpf-room-marker.is-light ha-state-icon,.hpf-map .hpf-room-marker:not(.is-light) ha-state-icon { --mdc-icon-size:18px; width:32px; height:32px; box-sizing:border-box; padding:0; display:flex; align-items:center; justify-content:center; }\n    .hpf-map .hpf-room-marker.is-maintenance ha-state-icon { color:var(--hp-amber); background:var(--hp-warm); }\n    .hpf-room-activity { display:inline-flex; align-items:center; justify-content:center; gap:3px; color:var(--hp-blue); font-size:11px; }\n    .hpf-room-activity ha-state-icon { --mdc-icon-size:12px; width:12px; height:12px; }\n    .hpf-home { --hp-danger:light-dark(#b3261e,#ffb4ab); --hp-danger-bg:light-dark(#ffedeb,#48272b); }\n    .hpf-notice-footer { display:flex; align-items:center; justify-content:flex-start; flex-wrap:wrap; gap:6px; min-height:53px; padding:8px 12px; border-top:1px solid var(--hp-line); }\n    .hpf-notice-footer .hpf-footer-copy:empty { display:none; }\n    .hpf-notice-chip { display:inline-flex; align-items:center; justify-content:center; gap:5px; min-height:36px; padding:5px 8px; border:0; border-radius:10px; background:var(--hp-soft); font-size:12px; color:var(--hp-secondary); }\n    .hpf-notice-chip ha-icon { --mdc-icon-size:15px; width:15px; height:15px; }\n    .hpf-notice-chip strong { font-weight:600; font-variant-numeric:tabular-nums; }\n    .hpf-notice-chip.priority { color:var(--hp-orange); background:var(--hp-alert-bg); }\n    .hpf-notice-chip.priority.is-critical { color:var(--hp-danger); background:var(--hp-danger-bg); }\n    .hpf-notice-chip.maintenance { color:var(--hp-amber); background:var(--hp-warm); }\n    .hpf-notice-chip.info { color:var(--hp-blue); background:var(--hp-selected); }\n    .hpf-room-notices { display:flex; flex-wrap:wrap; gap:5px; margin:0 0 10px; }\n    .hpf-notice-tabs { display:grid; grid-template-columns:none; grid-auto-flow:column; grid-auto-columns:minmax(74px,1fr); overflow-x:auto; gap:4px; padding:3px; border-radius:12px; background:var(--hp-soft); }\n    .hpf-notice-tabs button { display:grid; place-items:center; gap:2px; min-width:0; min-height:48px; padding:5px 2px; border:0; border-radius:9px; background:transparent; color:var(--hp-secondary); font-size:12px; }\n    .hpf-notice-tabs button[aria-pressed="true"] { background:var(--hp-paper); color:var(--hp-ink); }\n    .hpf-notice-tabs button span { font-size:11px; font-variant-numeric:tabular-nums; }\n    .hpf-notice-filters { display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:8px; margin:12px 0; }\n    .hpf-notice-filters label { display:grid; gap:5px; font-size:11px; color:var(--hp-secondary); }\n    .hpf-notice-filters select { width:100%; min-width:0; min-height:42px; padding:8px; border:1px solid var(--hp-line); border-radius:9px; background:var(--hp-soft); color:var(--hp-ink); font:inherit; font-size:12px; }\n    .hpf-notice-list { display:grid; gap:7px; }\n    .hpf-notice-row { display:flex; align-items:center; gap:10px; width:100%; min-height:72px; padding:12px; border:0; border-radius:12px; background:var(--hp-soft); text-align:left; }\n    .hpf-notice-row > span { display:grid; flex:1; min-width:0; gap:4px; }\n    .hpf-notice-row strong { font-weight:600; font-size:13px; overflow-wrap:anywhere; }\n    .hpf-notice-row .hpf-notice-reason { font-size:12px; overflow-wrap:anywhere; }\n    .hpf-notice-row small { font-size:11px; color:var(--hp-secondary); }\n    .hpf-notice-row.is-critical { background:var(--hp-danger-bg); }\n    .hpf-notice-row.is-critical > ha-icon,.hpf-notice-row.is-critical .hpf-notice-reason { color:var(--hp-danger); }\n    .hpf-notice-row.priority:not(.is-critical) > ha-icon { color:var(--hp-orange); }\n    .hpf-notice-row.maintenance > ha-icon { color:var(--hp-amber); }\n    .hpf-drawing .sliding-track { fill:none; stroke:var(--hp-glass); stroke-width:3; }\n    .hpf-drawing .sliding-panel { fill:none; stroke:var(--hp-glass); stroke-width:2; }\n\n    .hpf-notice-chip.ready { color:var(--success-color,light-dark(#237244,#8ed4a7)); background:light-dark(#eaf5ee,#203c2c); }\n    .hpf-notice-row.ready > ha-icon { color:var(--success-color,light-dark(#237244,#8ed4a7)); }\n    @media (max-width:460px) { .hpf-notice-tabs button { font-size:11px; } }\n\n    .hpf-notice-chip.battery { color:light-dark(#9a5900,#ffd18a); background:light-dark(#fff0da,#48351d); }\n    .hpf-notice-row.battery > ha-icon { color:light-dark(#9a5900,#ffd18a); }\n    .hpf-map .hpf-equipment-notice { --notice-color:var(--hp-amber); --notice-bg:var(--hp-warm); }\n    .hpf-map .hpf-equipment-notice.priority { --notice-color:var(--hp-orange); --notice-bg:var(--hp-alert-bg); }\n    .hpf-map .hpf-equipment-notice.is-critical { --notice-color:var(--hp-danger); --notice-bg:var(--hp-danger-bg); }\n    .hpf-map .hpf-equipment-notice.ready { --notice-color:light-dark(#237244,#8ed4a7); --notice-bg:light-dark(#eaf5ee,#203c2c); }\n    .hpf-map .hpf-equipment-notice.battery { --notice-color:light-dark(#9a5900,#ffd18a); --notice-bg:light-dark(#fff0da,#48351d); }\n    .hpf-map .hpf-equipment-notice ha-state-icon { color:var(--notice-color)!important; background:var(--notice-bg)!important; border:1px solid var(--notice-color); border-radius:11px; box-shadow:0 2px 6px #0002; }\n    .hpf-notice-count { position:absolute; top:0; right:0; display:grid; place-items:center; min-width:17px; height:17px; padding:0 3px; border:2px solid var(--hp-paper); border-radius:10px; background:var(--notice-color); color:light-dark(#fff,#20242b); font-size:10px; line-height:1; font-weight:700; }\n\n    .hpf-map .hpf-equipment-notice.info { --notice-color:var(--hp-blue); --notice-bg:var(--hp-selected); }\n    .hpf-map .hpf-equipment-notice.info ha-state-icon { opacity:.85; border:0; box-shadow:none; }\n    .hpf-equipment-notice.info .hpf-notice-count { display:none; }\n    .hpf-map .hpf-room-marker :is(ha-icon,ha-state-icon),.hpf-map .hpf-room-marker.is-light ha-state-icon,.hpf-map .hpf-room-marker:not(.is-light) ha-state-icon { --mdc-icon-size:14px; width:24px; height:24px; border-radius:7px; }\n    .hpf-map .hpf-room-marker.is-muted { opacity:.32; }\n    .hpf-map .hpf-room-marker.is-muted:is(:hover,:focus-visible) { opacity:1; }\n    .hpf-map .hpf-room-marker.is-muted .hpf-notice-count { box-shadow:none; }\n    .hpf-map .hpf-room-marker:not(.is-light) .hpf-notice-count { width:13px; height:13px; min-width:13px; font-size:9px; top:5px; right:5px; }\n    .hpf-levels { display:flex; flex-wrap:nowrap; flex-shrink:0; gap:2px; padding:3px; background:var(--hp-soft); border-radius:12px; }\n    .hpf-levels button { border:0; border-radius:9px; min-height:44px; padding:7px 9px; background:transparent; color:var(--hp-secondary); font:inherit; font-size:12px; font-weight:600; }\n    .hpf-levels button[aria-pressed="true"] { background:var(--hp-selected); color:var(--hp-ink); }\n    .hpf-home > .hpf-levels { margin:12px 16px; width:fit-content; }\n    .hpf-temperature-reading { display:inline-flex; align-items:center; gap:3px; }\n    .hpf-temperature-reading ha-icon { --mdc-icon-size:11px; width:11px; height:11px; }\n    .hpf-temperature-reading.is-heating { color:var(--hp-orange); }\n    .hpf-temperature-reading.is-conflict { color:var(--hp-amber); }\n    .hpf-room-name .hpf-heat-map-target { font-size:10px; color:var(--hp-blue); }\n    .hpf-climate-shortcut { width:100%; display:flex; align-items:center; gap:10px; min-height:58px; border:0; border-radius:15px; padding:12px; margin:0 0 10px; background:var(--hp-selected); color:var(--hp-ink); text-align:left; }\n    .hpf-climate-shortcut > span { flex:1; font-size:12px; }\n    .hpf-climate-shortcut strong { display:block; margin-top:3px; font-size:12px; color:var(--hp-secondary); font-weight:500; }\n    .hpf-climate-sheet .hpf-sheet-head { margin-bottom:12px; }\n    .hpf-thermostat { padding:14px; border-radius:20px; background:var(--hp-soft); margin-bottom:10px; }\n    .hpf-thermostat-head { display:flex; align-items:center; justify-content:space-between; gap:8px; }\n    .hpf-thermostat-head > span { display:flex; align-items:center; gap:8px; min-width:0; }\n    .hpf-thermostat-head strong { font-size:12px; line-height:1.3; }\n    .hpf-thermostat-head ha-state-icon { width:20px; height:20px; --mdc-icon-size:20px; color:var(--hp-secondary); }\n    .hpf-heat-status { display:flex; align-items:center; justify-content:center; gap:5px; margin:4px 0; font-size:12px; color:var(--hp-secondary); }\n    .hpf-heat-status ha-icon { width:14px; height:14px; --mdc-icon-size:14px; }\n    .hpf-heat-status.heating { color:var(--hp-orange); }\n    .hpf-heat-status.conflict { color:var(--hp-amber); }\n    .hpf-thermostat-dial { display:grid; grid-template-columns:48px 1fr 48px; align-items:center; gap:8px; max-width:340px; margin:10px auto 12px; }\n    .hpf-thermostat-dial > div { text-align:center; }\n    .hpf-thermostat-dial button { width:48px; height:48px; display:grid; place-items:center; border:0; border-radius:50%; background:var(--hp-paper); color:var(--hp-ink); }\n    .hpf-thermostat-dial button ha-icon { width:22px; height:22px; --mdc-icon-size:22px; }\n    .hpf-heat-setpoint-label { font-size:11px; color:var(--hp-secondary); }\n    .hpf-thermostat-dial output { display:block; font-size:clamp(38px,7vw,48px); line-height:1.2; font-weight:500; letter-spacing:-1.5px; font-variant-numeric:tabular-nums; }\n    .hpf-heat-measurement { display:flex; align-items:baseline; justify-content:center; flex-wrap:wrap; gap:4px 6px; font-size:11px; color:var(--hp-secondary); text-align:center; }\n    .hpf-heat-measurement strong { color:var(--hp-ink); font-size:14px; }\n    .hpf-heat-measurement > span { flex-basis:100%; font-size:10px; }\n    .hpf-heat-pending,.hpf-heat-conflict { margin:10px 0; font-size:11px; color:var(--hp-amber); text-align:center; line-height:1.4; }\n    .hpf-heat-presets,.hpf-heat-modes { display:grid; grid-template-columns:repeat(var(--preset-count,3),minmax(0,1fr)); gap:3px; margin-top:14px; padding:3px; border-radius:12px; background:var(--hp-paper); }\n    .hpf-heat-presets button,.hpf-heat-modes button { min-width:0; min-height:44px; padding:4px 2px; border:0; border-radius:9px; background:transparent; font-size:clamp(10px,2.6vw,11px); color:var(--hp-secondary); white-space:nowrap; }\n    .hpf-heat-presets button[aria-pressed="true"],.hpf-heat-modes button[aria-pressed="true"] { background:var(--hp-selected); color:var(--hp-blue); font-weight:650; }\n    .hpf-heat-overview { display:flex; flex-wrap:wrap; gap:10px; padding:4px 0 14px; font-size:12px; color:var(--hp-secondary); }\n    .hpf-heat-room { display:flex; align-items:center; gap:10px; text-align:left; width:100%; min-height:66px; border:0; border-bottom:1px solid var(--hp-line); background:transparent; padding:10px 0; }\n    .hpf-heat-room > span:first-of-type { flex:1; min-width:0; }\n    .hpf-heat-room strong { display:block; font-size:13px; }\n    .hpf-heat-room small { display:block; margin-top:4px; font-size:11px; color:var(--hp-secondary); }\n    .hpf-heat-room-values { text-align:right; font-variant-numeric:tabular-nums; }\n    .hpf-heat-room-values small { color:var(--hp-blue); }\n    .hpf-heat-room.heating > ha-icon { color:var(--hp-orange); }\n    .hpf-heat-room.conflict > ha-icon,.hpf-heat-room.conflict > span:first-of-type small { color:var(--hp-amber); }\n    .hpf-heat-batch { border:1px solid var(--hp-line); border-radius:14px; padding:0 12px 12px; margin-top:14px; }\n    .hpf-heat-batch summary { min-height:44px; padding:14px 0 6px; cursor:pointer; font-size:12px; }\n    .hpf-heat-batch label { display:flex; flex-direction:column; gap:6px; margin-top:8px; font-size:12px; }\n    .hpf-heat-batch select { min-height:44px; width:100%; border:1px solid var(--hp-line); border-radius:10px; background:var(--hp-paper); color:var(--hp-ink); padding:8px; }\n    .hpf-heat-batch p { font-size:11px; color:var(--hp-secondary); }\n    .hpf-heat-batch > button { width:100%; min-height:44px; border:0; border-radius:11px; color:var(--hp-blue); background:var(--hp-selected); }\n\n    .hpf-heat-modes { margin-top:10px; }\n    .hpf-heat-status.idle,.hpf-heat-status.enabled { color:var(--hp-good); }\n    .hpf-heat-profiles { margin-top:14px; border-top:1px solid var(--hp-line); padding-top:10px; }\n    .hpf-heat-profiles summary { font-size:11px; color:var(--hp-secondary); cursor:pointer; min-height:32px; align-content:center; }\n    .hpf-heat-profiles p { font-size:10px; line-height:1.4; color:var(--hp-secondary); }\n';

// src/candidate/home-plan-notices.js
var NOTICE_LEVELS = ["priority", "ready", "battery", "maintenance", "info"];
var RANK = { priority: 0, battery: 1, maintenance: 2, ready: 3, info: 4 };
var noticeOrder = (a3, b3) => (RANK[a3.level] ?? 5) - (RANK[b3.level] ?? 5) || Number(!!b3.critical) - Number(!!a3.critical) || a3.label.localeCompare(b3.label);
var CRITICAL = /* @__PURE__ */ new Set(["smoke", "gas", "moisture", "carbon_monoxide"]);
var BAD = /* @__PURE__ */ new Set(["unknown", "unavailable"]);
var ACTIVE = /* @__PURE__ */ new Set(["on", "playing", "paused", "buffering", "cleaning", "returning"]);
var POSITIVE = /* @__PURE__ */ new Set(["on", "true", "low", "empty", "replace", "required", "error", "fault", "problem"]);
var text = (value) => String(value ?? "").toLowerCase();
var known = (s5) => !!s5 && s5.state !== "" && !BAD.has(s5.state);
var number = (value) => value !== "" && value !== null && value !== void 0 && Number.isFinite(Number(value)) ? Number(value) : null;
function conditionMatches(condition, getState) {
  const s5 = getState(condition.entity);
  if (!known(s5)) return null;
  const value = condition.attribute ? s5.attributes?.[condition.attribute] : s5.state;
  if (value === void 0 || value === null || BAD.has(text(value))) return null;
  if (Array.isArray(condition.states)) return condition.states.some((v3) => text(v3) === text(value));
  const n5 = number(value);
  if (condition.below !== void 0 || condition.above !== void 0) return n5 !== null && (condition.below === void 0 || n5 <= condition.below) && (condition.above === void 0 || n5 >= condition.above);
  return POSITIVE.has(text(value));
}
function isEquipmentActive(s5) {
  if (!known(s5)) return false;
  const domain = s5.entity_id?.split(".")[0];
  if (domain === "media_player") {
    const art = s5.attributes?.art_mode_status;
    if (art === true || text(art) === "on") return false;
    if (art === void 0 && text(s5.attributes?.app_id) === "art") return false;
    return ["on", "playing", "paused", "buffering"].includes(s5.state);
  }
  if (domain === "fan") return s5.state === "on";
  if (domain === "vacuum") return s5.attributes?.docked !== true && text(s5.attributes?.docked) !== "true" && ["cleaning", "returning"].includes(s5.state);
  return false;
}
function baseNotice(s5, { opening = false, batteryThreshold = 20 } = {}) {
  if (!s5) return null;
  const cls = s5.attributes?.device_class, domain = s5.entity_id?.split(".")[0];
  if (s5.state === "unavailable" && (CRITICAL.has(cls) || opening)) return { level: "maintenance", kind: "unavailable", detail: "Capteur indisponible", icon: "mdi:connection" };
  if (!known(s5)) return null;
  if (domain === "binary_sensor" && CRITICAL.has(cls) && s5.state === "on") return { level: "priority", kind: cls, critical: true, detail: { smoke: "Fumée détectée", moisture: "Fuite d’eau détectée", gas: "Gaz détecté", carbon_monoxide: "Monoxyde de carbone détecté" }[cls], icon: { smoke: "mdi:smoke-detector-alert", moisture: "mdi:water-alert", gas: "mdi:gas-cylinder", carbon_monoxide: "mdi:molecule-co" }[cls] };
  if (opening && s5.state === "on") return { level: "priority", kind: "opening", detail: "Ouvrant ouvert", icon: "mdi:door-open" };
  if (cls === "battery") {
    const n5 = number(s5.state), low = domain === "binary_sensor" ? s5.state === "on" : n5 !== null ? n5 <= batteryThreshold : ["low", "very_low", "critical", "empty", "replace"].includes(text(s5.state));
    if (low) return { level: "battery", kind: "battery", detail: n5 !== null ? `Pile faible · ${n5} %` : "Pile faible", icon: "mdi:battery-alert-variant-outline" };
  }
  if (domain === "binary_sensor" && ["problem", "tamper", "safety"].includes(cls) && s5.state === "on") return { level: "maintenance", kind: cls === "tamper" ? "tamper" : "fault", detail: cls === "tamper" ? "Autoprotection à vérifier" : "Défaut à vérifier", icon: "mdi:wrench-outline" };
  if (domain === "sensor" && cls === "enum" && s5.state === "finished" && s5.attributes.options?.includes("finished")) return { level: "ready", kind: "finished", detail: "Cycle terminé · à récupérer", icon: "mdi:check-circle-outline" };
  if (isEquipmentActive(s5)) return { level: "info", kind: "activity", detail: domain === "vacuum" ? "Nettoyage en cours" : domain === "fan" ? "En fonctionnement" : "En service", icon: domain === "vacuum" ? "mdi:robot-vacuum" : domain === "fan" ? "mdi:fan" : "mdi:television" };
  return null;
}
function ruleNotice(rule, getState) {
  if (rule.level === "ignore") return null;
  const equipment = getState(rule.entity);
  if (rule.level === "info" && rule.entity?.startsWith("vacuum.") && (!known(equipment) || ["docked", "charging"].includes(equipment.state) || equipment.attributes?.docked === true || text(equipment.attributes?.docked) === "true")) return null;
  const source = rule.state_entity || rule.entity;
  const condition = { ...rule, entity: source };
  if (rule.states === void 0 && rule.below === void 0 && rule.above === void 0) condition.states = rule.level === "info" ? [...ACTIVE] : [...POSITIVE];
  if (conditionMatches(condition, getState) !== true) return null;
  if (rule.unless && conditionMatches(rule.unless, getState) !== false) return null;
  const sourceState = getState(source), value = rule.attribute ? sourceState?.attributes?.[rule.attribute] : sourceState?.state;
  const numericDetail = rule.below !== void 0 || rule.above !== void 0 ? ` · ${value}${sourceState?.attributes?.unit_of_measurement ? " " + sourceState.attributes.unit_of_measurement : ""}` : "";
  return { level: rule.level || "maintenance", kind: rule.kind || rule.id, detail: (rule.message || rule.label || "À vérifier") + numericDetail, icon: rule.icon || (rule.level === "info" ? "mdi:power" : rule.level === "priority" ? "mdi:alert-circle-outline" : "mdi:wrench-outline"), critical: rule.critical === true || rule.level === "priority" && CRITICAL.has(sourceState?.attributes?.device_class) };
}
function buildNotices({ states = {}, registry = {}, rooms = [], apertures = [], rules = [], scope = "plan", excludedAreas = [], excludedEntities = [], openingEntities = [], planFloor = "", getState = (id) => states[id] }) {
  const entities = registry.entities || {}, devices = registry.devices || {}, areas = registry.areas || {}, floors = registry.floors || {};
  const areaOf = (id) => {
    const e6 = entities[id];
    return e6?.area_id || devices[e6?.device_id]?.area_id || "";
  };
  const directRooms = /* @__PURE__ */ new Map();
  for (const r4 of rooms) for (const id of r4.entity_ids || []) if (!directRooms.has(id)) directRooms.set(id, r4);
  const location2 = (id, rule = {}) => {
    const areaId = areaOf(id), room = rooms.find((r4) => r4.id === rule.room) || rooms.find((r4) => areaId && r4.area_id === areaId) || directRooms.get(id), area = areas[areaId] || areas[room?.area_id], floorId = area?.floor_id || "", floor = floors[floorId];
    return { room: room?.id || areaId || "unassigned", room_name: room?.name || area?.name || "Pièce non renseignée", area_id: areaId || room?.area_id || "", floor_id: floorId || (room ? "plan" : "unassigned"), floor_name: floor?.name || (room ? planFloor : "Niveau non renseigné") };
  };
  const openings = new Set([...apertures.map((a3) => a3.opening_entity), ...openingEntities].filter(Boolean));
  const overrides = new Set(rules.flatMap((r4) => [r4.entity, ...r4.aliases || []]));
  const wanted = /* @__PURE__ */ new Set([...directRooms.keys(), ...openings]);
  const planAreas = new Set(rooms.map((r4) => r4.area_id).filter(Boolean));
  for (const e6 of Object.values(entities)) {
    if (e6.disabled_by || e6.hidden_by) continue;
    const area = areaOf(e6.entity_id), s5 = states[e6.entity_id], cls = s5?.attributes?.device_class, domain = e6.entity_id.split(".")[0];
    if (!s5 && ["sensor", "binary_sensor"].includes(domain)) {
      getState(e6.entity_id);
      continue;
    }
    if (scope !== "home" && !planAreas.has(area)) continue;
    if (excludedAreas.includes(area) || !area && !CRITICAL.has(cls)) continue;
    if (["media_player", "fan", "vacuum"].includes(domain) || domain === "binary_sensor" && (CRITICAL.has(cls) || ["battery", "problem", "tamper", "safety"].includes(cls)) || domain === "sensor" && (cls === "battery" || cls === "enum" && s5?.attributes?.options?.includes("finished"))) wanted.add(e6.entity_id);
  }
  const result = /* @__PURE__ */ new Map();
  const add = (id, notice, rule = {}) => {
    if (!notice || excludedEntities.includes(id)) return;
    const loc = location2(id, rule);
    if (excludedAreas.includes(loc.area_id)) return;
    const deviceId = entities[id]?.device_id || "", device = devices[deviceId], key = (rule.group || deviceId || id) + "|" + notice.kind;
    const item = { ...notice, key, entity: id, entities: [id], device_id: deviceId, equipment_key: rule.equipment_group || deviceId || rule.group || id, label: rule.label || device?.name_by_user || device?.name || states[id]?.attributes?.friendly_name || id, details: [notice.detail], location: loc };
    const previous = result.get(key);
    if (previous) {
      previous.entities = [.../* @__PURE__ */ new Set([...previous.entities, id])];
      previous.details = [.../* @__PURE__ */ new Set([...previous.details, notice.detail])];
      previous.critical ||= item.critical;
      if (noticeOrder(item, previous) < 0) {
        previous.level = item.level;
        previous.entity = id;
        previous.icon = item.icon;
      }
    } else result.set(key, item);
  };
  for (const id of wanted) {
    if (overrides.has(id) || excludedEntities.includes(id)) continue;
    const s5 = getState(id);
    add(id, baseNotice(s5, { opening: openings.has(id) }));
  }
  const evaluated = rules.map((rule) => ({ rule, item: ruleNotice(rule, getState) }));
  const specificActive = new Set(evaluated.filter(({ rule, item }) => item && !rule.fallback_for?.length).map(({ rule }) => rule.id));
  for (const { rule, item } of evaluated) {
    if (scope !== "home" && (areaOf(rule.entity) || rule.room) && !wanted.has(rule.entity) && !planAreas.has(areaOf(rule.entity)) && !rooms.some((r4) => r4.id === rule.room)) continue;
    if (rule.fallback_for?.some((id) => specificActive.has(id))) continue;
    add(rule.entity, item, rule);
  }
  return [...result.values()].sort(noticeOrder);
}
function groupEquipmentNotices(notices) {
  const groups = /* @__PURE__ */ new Map();
  for (const n5 of [...notices].sort(noticeOrder)) {
    const key = n5.equipment_key || n5.device_id || n5.entity;
    if (!groups.has(key)) groups.set(key, { key, label: n5.label, entity: n5.entity, device_id: n5.device_id, location: n5.location, level: n5.level, critical: n5.critical, icon: n5.icon, notices: [], entities: [] });
    const g2 = groups.get(key);
    g2.notices.push(n5);
    g2.entities = [.../* @__PURE__ */ new Set([...g2.entities, ...n5.entities])];
  }
  return [...groups.values()];
}

// src/candidate/home-plan-climate.js
var bad = /* @__PURE__ */ new Set(["unknown", "unavailable"]);
var presetLabel = (value) => ({ auto: "Auto", comfort: "Confort", eco: "Éco", anti_frost: "Hors-gel", frost_protection: "Hors-gel", stop: "STOP", off: "Arrêt", none: "Sans profil", away: "Absent", home: "Présent", sleep: "Nuit", boost: "Boost" })[String(value).toLowerCase()] || value;
var modeLabel = (value) => ({ heat: "Chauffage", auto: "Auto", off: "Éteint", cool: "Climatisation" })[value] || value;
var numeric = (v3) => typeof v3 === "number" && Number.isFinite(v3) ? v3 : null;
function climateInfo(state) {
  const a3 = state?.attributes || {}, available = !!state && !bad.has(state.state), f3 = a3.supported_features || 0, current = numeric(a3.current_temperature), target = numeric(a3.temperature), min = numeric(a3.min_temp), max = numeric(a3.max_temp), step = numeric(a3.target_temp_step) > 0 ? a3.target_temp_step : 0.5;
  const order = { auto: 0, comfort: 1, eco: 2, anti_frost: 3, frost_protection: 3, stop: 4, off: 4 };
  const presets = f3 & 16 && Array.isArray(a3.preset_modes) ? [...new Set(a3.preset_modes.filter((x2) => typeof x2 === "string" && x2.toLowerCase() !== "none"))].sort((a4, b3) => (order[a4.toLowerCase()] ?? 9) - (order[b3.toLowerCase()] ?? 9)) : [];
  const modes = Array.isArray(a3.hvac_modes) ? a3.hvac_modes.filter((x2) => ["heat", "auto", "off"].includes(x2)) : [];
  const stopped = state?.state === "off", enabled = available ? !stopped : null, action = a3.hvac_action, conflict = available && stopped && ["heating", "cooling"].includes(action);
  const status = !available ? "unavailable" : conflict ? "conflict" : stopped ? "off" : action === "heating" ? "heating" : action === "cooling" ? "cooling" : ["idle", "off"].includes(action) ? "idle" : "enabled";
  const label = { unavailable: state?.state === "unknown" ? "État inconnu" : "Indisponible", conflict: "Éteint · À vérifier", off: "Éteint", heating: "Activé · En chauffe", cooling: "Activé · Refroidit", idle: "Activé · Au repos", enabled: "Activé · Activité inconnue" }[status];
  return { available, enabled, current: available ? current : null, target: available ? target : null, min, max, step, presets, modes, status, label, preset: a3.preset_mode, action, canSet: available && !!(f3 & 1) && target !== null && min !== null && max !== null && max > min };
}
function climateCommand(state, action, data = {}) {
  const info = climateInfo(state);
  if (!info.available) return null;
  if (action === "set_temperature") return info.canSet && typeof data.temperature === "number" && Number.isFinite(data.temperature) && data.temperature >= info.min && data.temperature <= info.max ? { temperature: data.temperature } : null;
  if (action === "set_preset_mode") return info.presets.includes(data.preset_mode) ? { preset_mode: data.preset_mode } : null;
  if (action === "set_hvac_mode") return info.modes.includes(data.hvac_mode) ? { hvac_mode: data.hvac_mode } : null;
  return null;
}
function climateIncrement(state, direction, base) {
  const i7 = climateInfo(state);
  if (!i7.canSet || ![1, -1].includes(direction)) return null;
  const start = numeric(base) ?? i7.target;
  return Math.round(Math.min(i7.max, Math.max(i7.min, start + direction * i7.step)) * 1e3) / 1e3;
}

// src/candidate/home-plan-card.js
var VERSION = "0.6.0-rc.2";
var ENTITY = /^[a-z_]+\.[a-z0-9_]+$/;
var BAD2 = /* @__PURE__ */ new Set(["unknown", "unavailable"]);
var MODES = [["", "home", "Pièces"], ["lights", "lightbulb", "Lumières"], ["temperature", "thermometer", "Temp."], ["openings", "door-open", "Ouvertures"], ["covers", "blinds", "Volets"]];
var ICON = { home: "mdi:home-outline", house: "mdi:home-outline", lightbulb: "mdi:lightbulb-outline", thermometer: "mdi:thermometer", "door-open": "mdi:door-open", blinds: "mdi:blinds-horizontal", sofa: "mdi:sofa-outline", waves: "mdi:pool", sun: "mdi:white-balance-sunny", armchair: "mdi:seat-outline", bath: "mdi:bathtub-outline", "washing-machine": "mdi:washing-machine", "cooking-pot": "mdi:countertop-outline", utensils: "mdi:silverware-fork-knife", "briefcase-business": "mdi:desk", "bed-double": "mdi:bed-outline", "door-closed": "mdi:door-closed", x: "mdi:close", "chevron-right": "mdi:chevron-right", "chevron-up": "mdi:chevron-up", "chevron-down": "mdi:chevron-down", square: "mdi:stop", "shield-check": "mdi:shield-check-outline", "circle-alert": "mdi:alert-circle-outline", tv: "mdi:television", bot: "mdi:robot-vacuum", refrigerator: "mdi:fridge-outline", "panels-top-left": "mdi:window-closed-variant", smoke: "mdi:smoke-detector-variant", plus: "mdi:plus", settings: "mdi:cog-outline" };
var icon = (name) => b2`<ha-icon icon=${ICON[name] || name || "mdi:circle-small"} aria-hidden="true"></ha-icon>`;
var copy = (value) => structuredClone(value);
var LEVEL_FIELDS = ["floor", "level_name", "model", "model_url", "rooms", "apertures", "markers"];
function planLevels(config) {
  return [{ id: "primary", name: config.level_name || config.floor || "Niveau principal" }, ...(config.levels || []).map((l3) => ({ id: l3.id, name: l3.level_name || l3.floor || l3.id }))];
}
function levelConfig(config, id = "primary") {
  const result = { ...config, levels: [] };
  if (id === "primary") return result;
  const level = config.levels?.find((l3) => l3.id === id);
  if (!level) throw Error("Niveau introuvable.");
  for (const key of LEVEL_FIELDS) {
    delete result[key];
    if (level[key] !== void 0) result[key] = level[key];
  }
  for (const key of ["rooms", "apertures", "markers"]) result[key] ||= [];
  return result;
}
function validEntity(id) {
  return typeof id === "string" && ENTITY.test(id);
}
function known2(state) {
  return !!state && !BAD2.has(state.state);
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
  for (const key of ["rooms", "apertures", "markers", "cover_options", "cover_groups", "notification_rules"]) {
    if (result[key] !== void 0 && !Array.isArray(result[key])) throw Error(`${key} doit être une liste.`);
    result[key] ||= [];
    if (result[key].length > 200) throw Error("Trop d’éléments dans le plan.");
    const seen = /* @__PURE__ */ new Set();
    for (const item of result[key]) {
      const identity = key === "cover_options" ? item.entity : item.id;
      if (!identity || typeof identity !== "string" || seen.has(identity)) throw Error(`Identifiant ${key} absent ou dupliqué.`);
      seen.add(identity);
      if (key === "notification_rules") {
        if (!validEntity(item.entity) || !["priority", "ready", "battery", "maintenance", "info", "ignore"].includes(item.level || "maintenance")) throw Error("Règle de signalement invalide.");
        if (item.fallback_for && (!Array.isArray(item.fallback_for) || item.fallback_for.some((id) => typeof id !== "string"))) throw Error("Règles détaillées invalides.");
        if (item.aliases && (!Array.isArray(item.aliases) || item.aliases.some((e6) => !validEntity(e6)))) throw Error("Alias de signalement invalide.");
        if (item.unless && (!validEntity(item.unless.entity) || !Array.isArray(item.unless.states))) throw Error("Exception de signalement invalide.");
        if (item.states && (!Array.isArray(item.states) || item.states.some((v3) => typeof v3 !== "string"))) throw Error("États de signalement invalides.");
        if (["below", "above"].some((k2) => item[k2] !== void 0 && !Number.isFinite(item[k2]))) throw Error("Seuil de signalement invalide.");
      }
      if (key === "cover_groups" && item.id === "current") throw Error("Identifiant de groupe réservé.");
      if (key === "cover_options" && item.max_position !== void 0 && (!Number.isFinite(item.max_position) || item.max_position < 1 || item.max_position > 100)) throw Error("Limite de course invalide.");
      for (const [field, value] of Object.entries(item)) if (field.endsWith("_entity") && value && !validEntity(value)) throw Error(`Entité invalide : ${field}`);
      if (item.entity && !validEntity(item.entity)) throw Error("Équipement de repère invalide.");
      if (item.excluded_entities && (!Array.isArray(item.excluded_entities) || item.excluded_entities.some((e6) => !validEntity(e6)))) throw Error("Liste d’exclusions invalide.");
      if (item.climate_entities && (!Array.isArray(item.climate_entities) || item.climate_entities.some((e6) => !validEntity(e6) || !e6.startsWith("climate.")))) throw Error("Thermostats invalides.");
      if (item.favorite_entities && (!Array.isArray(item.favorite_entities) || item.favorite_entities.some((e6) => !validEntity(e6)))) throw Error("Liste d’accès rapides invalide.");
      if (item.entities && (!Array.isArray(item.entities) || item.entities.some((e6) => !validEntity(e6)))) throw Error("Liste d’équipements invalide.");
      if (item.shutter_offset !== void 0 && (!Number.isFinite(item.shutter_offset) || Math.abs(item.shutter_offset) > 40)) throw Error("Décalage de volet invalide.");
      if (item.point && (!Array.isArray(item.point) || item.point.length !== 2 || !item.point.every(Number.isFinite))) throw Error("Position de repère invalide.");
    }
  }
  if (result.notification_scope && !["plan", "home"].includes(result.notification_scope)) throw Error("Périmètre de signalements invalide.");
  for (const key of ["notification_excluded_entities", "notification_opening_entities"]) if (result[key] && (!Array.isArray(result[key]) || result[key].some((e6) => !validEntity(e6)))) throw Error("Liste de signalements invalide.");
  if (result.notification_excluded_areas && (!Array.isArray(result.notification_excluded_areas) || result.notification_excluded_areas.some((e6) => typeof e6 !== "string"))) throw Error("Zones exclues invalides.");
  if (result.levels !== void 0) {
    if (!Array.isArray(result.levels) || result.levels.length > 10) throw Error("Liste des niveaux invalide.");
    const ids = /* @__PURE__ */ new Set(["primary"]);
    result.levels = result.levels.map((level) => {
      if (!level || typeof level.id !== "string" || !level.id || ids.has(level.id) || Object.keys(level).some((k2) => !["id", ...LEVEL_FIELDS].includes(k2))) throw Error("Configuration de niveau invalide ou dupliquée.");
      ids.add(level.id);
      const checked = validateConfig(level);
      return Object.fromEntries(["id", ...LEVEL_FIELDS].filter((k2) => checked[k2] !== void 0).map((k2) => [k2, checked[k2]]));
    });
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
  static properties = { hass: {}, editMode: { type: Boolean }, _config: { state: true }, _model: { state: true }, _registry: { state: true }, _registryError: { state: true }, _selected: { state: true }, _quick: { state: true }, _view: { state: true }, _mode: { state: true }, _error: { state: true }, _feedback: { state: true }, _busy: { state: true }, _photoMode: { state: true }, _photos: { state: true }, _showAlerts: { state: true }, _noticeFilter: { state: true }, _noticeFloor: { state: true }, _noticeRoom: { state: true }, _noticeEquipmentKey: { state: true }, _floorCovers: { state: true }, _floorLights: { state: true }, _floorClimate: { state: true }, _heatPending: { state: true }, _heatBatchChoice: { state: true }, _floorGroup: { state: true }, _equipmentTab: { state: true }, _editSelection: { state: true } };
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
    this._heatPending = /* @__PURE__ */ new Map();
    this._heatTimers = /* @__PURE__ */ new Map();
    this._photoMode = /* @__PURE__ */ new Set();
    this._photos = {};
    this._epoch = 0;
    this._unsubs = [];
    this._pulseTimers = /* @__PURE__ */ new Set();
    this._observed = /* @__PURE__ */ new Set();
    this._registry = { entities: {}, devices: {}, areas: {}, floors: {} };
  }
  static getConfigElement() {
    return document.createElement("home-plan-card-editor");
  }
  static getStubConfig() {
    return { name: "Maison", floor: "Rez-de-chaussée", rooms: [], apertures: [], markers: [] };
  }
  setConfig(config) {
    this._rootConfig = validateConfig(config);
    if (!planLevels(this._rootConfig).some((l3) => l3.id === this._level)) this._level = "primary";
    this._activateLevel();
  }
  _switchLevel(id) {
    if (id === this._level) return;
    this._level = id;
    this._photos = {};
    this._photoMode = /* @__PURE__ */ new Set();
    this._editSelection = null;
    this._floorGroup = "current";
    this._activateLevel();
  }
  _activateLevel() {
    this._resetHeatPending();
    this._commandEpoch = (this._commandEpoch || 0) + 1;
    clearTimeout(this._feedbackTimer);
    this._pulseTimers.forEach(clearTimeout);
    this._pulseTimers.clear();
    this._busy = /* @__PURE__ */ new Set();
    this._feedback = "";
    this._config = levelConfig(this._rootConfig, this._level);
    this._selected = null;
    this._quick = null;
    this._showAlerts = false;
    this._floorCovers = false;
    this._floorLights = false;
    this._floorClimate = false;
    this._equipmentTab = false;
    this._drag = null;
    this._error = "";
    this._noticeCache = null;
    this._roomEntityCache = /* @__PURE__ */ new Map();
    if (this._config.model || this._loadedSource !== this._config.model_url) this._model = null;
    this.requestUpdate();
    this._loadModel();
  }
  _levelSelector() {
    return planLevels(this._rootConfig || this._config).length > 1 ? b2`<div class="hpf-levels" role="group" aria-label="Niveau affiché">${planLevels(this._rootConfig).map((l3) => b2`<button data-level=${l3.id} aria-pressed=${this._level === l3.id} @click=${() => this._switchLevel(l3.id)}>${l3.name}</button>`)}</div>` : A;
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
    this._resetHeatPending();
    this._drag = null;
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
      this._reconcileHeatPending();
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
    if (this._model && this._config.model_url && this._loadedSource === this._config.model_url && !this._config.model) return;
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
        const text2 = await response.text();
        if (text2.length > 3e6) throw Error("Plan trop volumineux.");
        model = JSON.parse(text2);
      }
      if (!model) model = { bounds: [0, 0, 100, 100], rooms: [], artwork: "" };
      const prepared = validateModel(model);
      if (abort.signal.aborted || epoch !== this._epoch || !this.isConnected) return;
      this._model = prepared;
      this._loadedSource = this._config.model_url;
      this._error = "";
      this.dispatchEvent(new CustomEvent("plan-model-loaded", { detail: { model: prepared }, bubbles: true, composed: true }));
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
        for (const type of ["entity_registry_updated", "device_registry_updated", "area_registry_updated", "floor_registry_updated"]) {
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
      const [entities, devices, areas, floors] = await Promise.all(["entity", "device", "area", "floor"].map((k2) => this.hass.callWS({ type: `config/${k2}_registry/list` })));
      if (epoch !== this._epoch || !this.isConnected) return;
      this._registry = { entities: Object.fromEntries(entities.map((e6) => [e6.entity_id, e6])), devices: Object.fromEntries(devices.map((d3) => [d3.id || d3.device_id, d3])), areas: Object.fromEntries(areas.map((a3) => [a3.area_id, a3])), floors: Object.fromEntries(floors.map((f3) => [f3.floor_id, f3])) };
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
  set editorConfig(value) {
    if (value !== this._editorConfig) {
      this._editorConfig = value;
      this.setConfig(value);
    }
  }
  _entityIcon(id, override) {
    return b2`<ha-state-icon .hass=${this.hass} .stateObj=${this._state(id)} .icon=${override || this._registry.entities[id]?.icon || void 0} aria-hidden="true"></ha-state-icon>`;
  }
  _name(id) {
    const s5 = this._state(id);
    return s5?.attributes?.friendly_name || id;
  }
  _format(id) {
    const rest = this._config.notification_rules.find((r4) => r4.idle_label && (r4.entity === id || r4.aliases?.includes(id)) && r4.unless && conditionMatches(r4.unless, (e6) => this._state(e6)) === true);
    if (rest) return rest.idle_label;
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
    const explicit = [...r4.entities || [], ...r4.favorite_entities || [], ...r4.climate_entities || [], r4.temperature_entity, r4.light_entity, ...this._apertures().filter((a3) => a3.room === r4.id).flatMap((a3) => [a3.cover_entity, a3.opening_entity, a3.command_entity]), ...this._markers().filter((a3) => a3.room === r4.id).map((a3) => a3.entity)];
    const reg = this._registry.entities, devices = this._registry.devices;
    if (r4.auto_area && r4.area_id) for (const e6 of Object.values(reg)) {
      if (e6.disabled_by || e6.hidden_by || e6.entity_category || r4.excluded_entities?.includes(e6.entity_id)) continue;
      const area = e6.area_id || devices[e6.device_id]?.area_id;
      if (area !== r4.area_id) continue;
      const d3 = e6.entity_id.split(".")[0];
      if (["light", "cover", "fan", "climate", "vacuum", "media_player", "sensor", "binary_sensor", "switch", "select", "number", "button", "scene", "humidifier", "water_heater", "lock"].includes(d3)) explicit.push(e6.entity_id);
    }
    const ids = [...new Set(explicit.filter(validEntity))];
    ids.forEach((id) => this._observed.add(id));
    this._roomEntityCache?.set(r4.id, ids);
    return ids;
  }
  _leaves(ids, domain, excluded = []) {
    const result = /* @__PURE__ */ new Set(), seen = /* @__PURE__ */ new Set();
    const visit = (id) => {
      if (seen.has(id) || excluded.includes(id) || !id.startsWith(domain + ".")) return;
      seen.add(id);
      const members = this._state(id)?.attributes?.entity_id;
      if (Array.isArray(members) && members.length) members.forEach(visit);
      else result.add(id);
    };
    ids.forEach(visit);
    return [...result];
  }
  _lights(r4) {
    return this._leaves(this._entities(r4), "light", r4.excluded_entities).filter((id) => {
      if (r4.entities?.includes(id) || this._markers().some((m3) => m3.entity === id && m3.room === r4.id)) return true;
      const e6 = this._registry.entities[id], area = e6?.area_id || this._registry.devices[e6?.device_id]?.area_id;
      return !r4.area_id || !area || area === r4.area_id;
    });
  }
  _covers(r4) {
    return this._leaves(this._entities(r4), "cover", r4.excluded_entities);
  }
  _openings(r4) {
    return [...new Set(this._apertures().filter((a3) => a3.room === r4.id && a3.opening_entity).map((a3) => a3.opening_entity))];
  }
  _climates(r4) {
    return [.../* @__PURE__ */ new Set([...r4.climate_entities || [], ...this._entities(r4).filter((id) => id.startsWith("climate."))])];
  }
  _climateRows(rooms) {
    const seen = /* @__PURE__ */ new Set();
    return rooms.flatMap((room) => this._climates(room).filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    }).map((id) => ({ id, room, info: climateInfo(this._state(id)) })));
  }
  _temperature(r4) {
    return r4.temperature_entity || this._climates(r4)[0];
  }
  _temperatureText(r4) {
    const id = this._temperature(r4), s5 = this._state(id);
    const attribute = r4.temperature_attribute || (id?.startsWith("climate.") ? "current_temperature" : null);
    if (!attribute || !known2(s5)) return this._format(id);
    const value = s5.attributes?.[attribute];
    return typeof value === "number" && Number.isFinite(value) ? new Intl.NumberFormat(this.hass?.locale?.language || "fr", { maximumFractionDigits: 1 }).format(value) + " " + (this.hass?.config?.unit_system?.temperature || "°C") : "Température inconnue";
  }
  _temperatureMapText(r4) {
    if (!this._model?.compact_temperatures) return this._temperatureText(r4);
    const s5 = this._state(this._temperature(r4)), attribute = r4.temperature_attribute || (this._temperature(r4)?.startsWith("climate.") ? "current_temperature" : null), raw = attribute ? s5?.attributes?.[attribute] : s5?.state, value = raw === null || raw === "" ? NaN : Number(raw);
    return known2(s5) && Number.isFinite(value) ? new Intl.NumberFormat(this.hass?.locale?.language || "fr", { maximumFractionDigits: 1 }).format(value) + "°" : "—";
  }
  _degree(value) {
    return typeof value === "number" && Number.isFinite(value) ? new Intl.NumberFormat(this.hass?.locale?.language || "fr", { maximumFractionDigits: 1 }).format(value) + "°" : "—";
  }
  _resetHeatPending() {
    this._heatTimers?.forEach(clearTimeout);
    this._heatTimers = /* @__PURE__ */ new Map();
    this._heatPending = /* @__PURE__ */ new Map();
  }
  _clearHeatPending(id) {
    clearTimeout(this._heatTimers.get(id));
    this._heatTimers.delete(id);
    if (this._heatPending.has(id)) {
      const next = new Map(this._heatPending);
      next.delete(id);
      this._heatPending = next;
    }
  }
  _reconcileHeatPending() {
    for (const [id, request] of this._heatPending || []) {
      const state = this.hass?.states?.[id], value = state?.attributes?.temperature;
      if (known2(state) && typeof value === "number" && Math.abs(value - request.target) < 1e-3) this._clearHeatPending(id);
    }
  }
  _expireHeatPending(id, request) {
    if (this._heatPending.get(id) !== request) return;
    this._heatTimers.delete(id);
    this._heatPending = new Map(this._heatPending).set(id, { ...request, status: "unconfirmed" });
  }
  async _changeClimate(id, direction) {
    if (this.editMode || this._busy.has(id)) return;
    const s5 = this._state(id), previous = this._heatPending.get(id), target = climateIncrement(s5, direction, previous?.status === "sent" ? previous.target : void 0);
    if (target === null) return;
    this._clearHeatPending(id);
    const request = { target, status: "sent" }, generation = this._commandEpoch;
    this._heatPending = new Map(this._heatPending).set(id, request);
    const sent = await this._send(id, "climate.set_temperature", { temperature: target });
    if (generation !== this._commandEpoch || !this.isConnected) return;
    if (!sent) {
      this._clearHeatPending(id);
      return;
    }
    this._reconcileHeatPending();
    if (this._heatPending.get(id) === request) this._heatTimers.set(id, setTimeout(() => this._expireHeatPending(id, request), 15e3));
  }
  async _climateMode(id, action, value) {
    const key = action === "set_preset_mode" ? "preset_mode" : "hvac_mode";
    if (!climateCommand(this._state(id), action, { [key]: value }) || this.editMode || this._busy.has(id)) return;
    this._clearHeatPending(id);
    return this._send(id, "climate." + action, { [key]: value });
  }
  _openFloorClimate(opener) {
    this._opener = opener;
    this._selected = null;
    this._quick = null;
    this._floorCovers = false;
    this._floorLights = false;
    this._showAlerts = false;
    this._floorClimate = true;
    this._heatBatchChoice = "";
    this._focusSheet();
  }
  _heatChoices(rows) {
    const available = rows.filter((r4) => r4.info.available && !this._busy.has(r4.id));
    if (!available.length) return [];
    const presets = available[0].info.presets.filter((p4) => available.every((r4) => r4.info.presets.includes(p4))), modes = available[0].info.modes.filter((m3) => available.every((r4) => r4.info.modes.includes(m3)));
    return [...modes.map((value) => ({ key: "mode:" + value, value, label: modeLabel(value), action: "set_hvac_mode" })), ...presets.map((value) => ({ key: "preset:" + value, value, label: presetLabel(value), action: "set_preset_mode" }))];
  }
  async _climateBatch(rows, choice) {
    if (this.editMode || !choice) return;
    const key = choice.action === "set_preset_mode" ? "preset_mode" : "hvac_mode", data = { [key]: choice.value }, ids = [...new Set(rows.map((r4) => r4.id))], allowed = ids.filter((id) => !this._busy.has(id) && climateCommand(this._state(id), choice.action, data)), generation = this._commandEpoch;
    if (!allowed.length) return;
    this._haptic("light");
    allowed.forEach((id) => this._clearHeatPending(id));
    const result = await Promise.all(allowed.map((id) => this._send(id, "climate." + choice.action, data, false)));
    if (generation !== this._commandEpoch || !this.isConnected) return;
    if (result.some((v3) => !v3)) this._haptic("failure");
    else if (allowed.length < ids.length) this._haptic("warning");
    this._feedback = `${result.filter(Boolean).length}/${ids.length} commande${ids.length > 1 ? "s" : ""} envoyée${ids.length > 1 ? "s" : ""} · ${choice.label}${allowed.length < ids.length ? " · zones indisponibles ignorées" : ""}${result.some((v3) => !v3) ? " · au moins un échec" : ""}`;
  }
  _climateMapReading(r4) {
    const infos = this._climates(r4).map((id) => climateInfo(this._state(id))), active = infos.some((i7) => i7.status === "heating"), conflict = infos.some((i7) => i7.status === "conflict"), targets = [...new Set(infos.map((i7) => i7.target).filter((t6) => t6 !== null))];
    return b2`<small class=${"hpf-temperature-reading " + (conflict ? "is-conflict" : active ? "is-heating" : "")}>${active || conflict ? icon(conflict ? "mdi:alert-circle-outline" : "mdi:fire") : A}${this._temperatureMapText(r4)}</small>${this._mode === "temperature" && infos.length ? b2`<small class="hpf-heat-map-target" aria-label=${targets.length === 1 ? "Consigne " + this._degree(targets[0]) : "Plusieurs thermostats"}>${targets.length === 1 ? "→ " + this._degree(targets[0]) : targets.length > 1 ? "Consignes multiples" : "Consigne inconnue"}</small>` : A}`;
  }
  _thermostat(id, showName = true) {
    const s5 = this._state(id), info = climateInfo(s5), pending = this._heatPending.get(id), base = pending?.status === "sent" ? pending.target : info.target, disabled = this._busy.has(id) || !info.canSet;
    return b2`<article class=${"hpf-thermostat " + info.status} data-thermostat=${id}>
      <div class="hpf-thermostat-head"><span>${this._entityIcon(id, "mdi:thermostat")}<strong>${showName ? this._name(id) : "Thermostat"}</strong></span><button class="hpf-cover-info" aria-label=${"Détails du thermostat " + this._name(id)} @click=${() => this._more(id)}>${icon("settings")}</button></div>
      <div class=${"hpf-heat-status " + info.status}>${icon(info.status === "conflict" ? "mdi:alert-circle-outline" : info.status === "heating" ? "mdi:fire" : info.enabled ? "mdi:power" : "mdi:power-off")}${info.label}</div>
      <div class="hpf-heat-modes" style=${"--preset-count:" + Math.max(1, info.modes.length)} role="group" aria-label="Activation du chauffage">${info.modes.map((value) => b2`<button data-heat-mode=${value} aria-pressed=${s5?.state === value} ?disabled=${!info.available || this._busy.has(id)} @click=${() => this._climateMode(id, "set_hvac_mode", value)}>${modeLabel(value)}</button>`)}</div>
      <div class="hpf-thermostat-dial"><button data-heat-minus aria-label="Baisser la consigne" ?disabled=${disabled || base === null || base <= info.min} @click=${() => this._changeClimate(id, -1)}>${icon("mdi:minus")}</button><div><span class="hpf-heat-setpoint-label">Consigne ${pending?.status === "sent" ? "demandée" : ""}</span><output data-setpoint>${this._degree(base)}</output></div><button data-heat-plus aria-label="Augmenter la consigne" ?disabled=${disabled || base === null || base >= info.max} @click=${() => this._changeClimate(id, 1)}>${icon("mdi:plus")}</button></div>
      <div class="hpf-heat-measurement">Mesurée par le thermostat <strong>${this._degree(info.current)}</strong><span>Pas de ${this._degree(info.step)}</span></div>
      ${pending ? b2`<p class="hpf-heat-pending" role="status">${pending.status === "sent" ? "En attente du retour de l’équipement" : "Demande " + this._degree(pending.target) + " sans retour confirmé"}</p>` : A}
      ${info.status === "conflict" ? b2`<p class="hpf-heat-conflict">Mode Éteint, mais une activité est signalée par l’équipement.</p>` : A}
      ${info.presets.length ? b2`<details class="hpf-heat-profiles"><summary>Profils du thermostat${info.preset ? " · " + presetLabel(info.preset) : ""}</summary><div class="hpf-heat-presets" style=${"--preset-count:" + Math.max(1, Math.min(5, info.presets.length))} role="group" aria-label="Profil du thermostat">${info.presets.map((value) => b2`<button data-heat-preset=${value} aria-pressed=${info.preset === value} ?disabled=${!info.available || this._busy.has(id)} @click=${() => this._climateMode(id, "set_preset_mode", value)}>${presetLabel(value)}</button>`)}</div><p>L’activation dépend du mode Chauffage ou Éteint ci-dessus.</p></details>` : A}
      ${!info.canSet && info.available ? b2`<p class="hpf-sheet-sub">Réglage de température non disponible · modes de l’équipement conservés.</p>` : A}
    </article>`;
  }
  _climateRoomSheet(r4, close) {
    return b2`<section class="hpf-sheet hpf-climate-sheet" role="region" aria-label=${"Chauffage · " + r4.name} @keydown=${(e6) => {
      if (e6.key === "Escape") this._close();
    }}><div class="hpf-sheet-head"><div><h3>${r4.name}</h3><span class="hpf-sheet-sub">Chauffage</span></div>${close()}</div>${c4(this._climates(r4), (id) => id, (id) => this._thermostat(id, this._climates(r4).length > 1))}<button class="hpf-quick-room" @click=${() => this._openFloorClimate(this._opener)}>${icon("mdi:thermostat")}Tous les chauffages du niveau${icon("chevron-right")}</button><button class="hpf-more" data-climate-other @click=${() => this._equipmentTab = true}>Autres équipements de la pièce${icon("chevron-right")}</button></section>`;
  }
  _climateFloorSheet(rooms, close) {
    const rows = this._climateRows(rooms), choices = this._heatChoices(rows), choice = choices.find((c5) => c5.key === this._heatBatchChoice), unavailable = rows.filter((r4) => !r4.info.available).length;
    return b2`<section class="hpf-sheet hpf-climate-sheet" role="region" aria-label="Chauffage du niveau" @keydown=${(e6) => {
      if (e6.key === "Escape") this._close();
    }}><div class="hpf-sheet-head"><div><h3>Chauffage</h3><span class="hpf-sheet-sub">${this._config.floor || this._model.floor} · ${rows.length} zones</span></div>${close()}</div><div class="hpf-heat-overview"><span>${rows.filter((r4) => r4.info.enabled === true).length} activé${rows.filter((r4) => r4.info.enabled === true).length > 1 ? "s" : ""}</span><span>${rows.filter((r4) => r4.info.status === "heating").length} en chauffe</span>${rows.some((r4) => r4.info.status === "conflict") ? b2`<span class="hpf-danger">${rows.filter((r4) => r4.info.status === "conflict").length} à vérifier</span>` : A}${unavailable ? b2`<span>${unavailable} indisponible${unavailable > 1 ? "s" : ""}</span>` : A}</div><div class="hpf-heat-room-list">${rows.map(({ id, room, info }) => b2`<button data-climate-room=${room.id} class=${"hpf-heat-room " + info.status} @click=${(e6) => this._select(room, e6.currentTarget)}>${icon("mdi:thermostat")}<span><strong>${room.name}</strong><small>${info.label}</small></span><span class="hpf-heat-room-values"><strong>${this._temperatureMapText(room)}</strong><small>→ ${this._degree(info.target)}</small></span>${icon("chevron-right")}</button>`)}</div>${choices.length ? b2`<details class="hpf-heat-batch"><summary>Réglage pour tout le niveau</summary><label>Choisir une action<select data-climate-batch-choice .value=${this._heatBatchChoice || ""} @change=${(e6) => this._heatBatchChoice = e6.target.value}><option value="">Choisir…</option>${["set_hvac_mode", "set_preset_mode"].map((action) => b2`<optgroup label=${action === "set_hvac_mode" ? "Activation" : "Profils du thermostat"}>${choices.filter((c5) => c5.action === action).map((c5) => b2`<option value=${c5.key}>${c5.label}</option>`)}</optgroup>`)}</select></label><p>${rows.length - unavailable} zone${rows.length - unavailable > 1 ? "s" : ""} disponible${rows.length - unavailable > 1 ? "s" : ""} · les consignes restent propres à chaque pièce.</p><button data-climate-batch-apply ?disabled=${!choice} @click=${() => this._climateBatch(rows, choice)}>Appliquer ${choice?.label || "le réglage"} au niveau</button></details>` : A}</section>`;
  }
  _notices(rooms = this._rooms()) {
    if (this._noticeCache) return this._noticeCache;
    this._noticeCache = buildNotices({ states: this.hass?.states, registry: this._registry, rooms: rooms.map((r4) => ({ ...r4, entity_ids: this._entities(r4) })), apertures: this._apertures(), rules: this._config.notification_rules, scope: this._config.notification_scope || "plan", excludedAreas: this._config.notification_excluded_areas, excludedEntities: this._config.notification_excluded_entities, openingEntities: this._config.notification_opening_entities, planFloor: this._config.floor || this._model?.floor, getState: (id) => this._state(id) });
    return this._noticeCache;
  }
  _roomNotices(r4, level) {
    return this._notices().filter((n5) => n5.location.room === r4.id && (!level || n5.level === level));
  }
  _problems(r4) {
    return this._roomNotices(r4, "priority").filter((n5) => n5.kind !== "opening").map((n5) => n5.entity);
  }
  _markerNotice(m3) {
    const device = this._registry.entities[m3.entity]?.device_id;
    return this._notices().find((n5) => ["priority", "battery", "maintenance"].includes(n5.level) && (n5.entities.includes(m3.entity) || device && n5.device_id === device));
  }
  _markerVisible(m3) {
    if (!m3.entity || !m3.point) return false;
    if (this.editMode) return true;
    if (m3.noticeGroup) return true;
    if (m3.notification_only) return false;
    const cls = this._state(m3.entity)?.attributes?.device_class;
    if (["smoke", "gas", "moisture", "carbon_monoxide"].includes(cls)) return !!this._markerNotice(m3);
    return !this._mode || this._mode === "openings" && !m3.entity.startsWith("light.") || this._mode === "lights" && m3.entity.startsWith("light.") || this._state(m3.entity)?.state === "on";
  }
  _markerMuted(m3) {
    if (this.editMode || !this._mode) return false;
    const ids = m3.noticeGroup?.entities || [m3.entity];
    return !ids.some((id) => this._mode === "lights" ? id.startsWith("light.") : this._mode === "covers" ? id.startsWith("cover.") : this._mode === "temperature" ? this._rooms().some((r4) => this._temperature(r4) === id) : this._mode === "openings" ? this._apertures().some((a3) => a3.opening_entity === id || a3.command_entity === id) : false);
  }
  _openNotices(level, opener, room = "") {
    this._noticeEquipmentKey = null;
    this._opener = opener;
    this._noticeFilter = level;
    this._noticeFloor = "";
    this._noticeRoom = room;
    this._showAlerts = true;
    this._floorCovers = false;
    this._floorLights = false;
    this._floorClimate = false;
    this._focusSheet();
  }
  _roomNoticeButtons(r4) {
    const list = this._roomNotices(r4);
    return list.length ? b2`<div class="hpf-room-notices">${NOTICE_LEVELS.map((level) => {
      const rows = list.filter((n5) => n5.level === level);
      return rows.length ? b2`<button class=${"hpf-notice-chip " + level} @click=${(e6) => this._openNotices(level, e6.currentTarget, r4.id)}>${icon(level === "priority" ? "circle-alert" : level === "ready" ? "mdi:check-circle-outline" : level === "battery" ? "mdi:battery-alert-variant-outline" : level === "maintenance" ? "mdi:wrench-outline" : "mdi:information-outline")}${rows.length} ${{ priority: "priorité", ready: "à récupérer", battery: "pile faible", maintenance: "entretien", info: "en service" }[level]}${rows.length > 1 && level === "priority" ? "s" : ""}</button>` : A;
    })}</div>` : A;
  }
  _noticeGroups() {
    return groupEquipmentNotices(this._notices());
  }
  _groupForMarker(m3, groups = this._noticeGroups()) {
    const device = this._registry.entities[m3.entity]?.device_id;
    return groups.find((g2) => g2.entities.includes(m3.entity) || device && g2.device_id === device);
  }
  _mapMarkers(rooms) {
    const markers = this._markers(), groups = this._noticeGroups(), claimed = /* @__PURE__ */ new Set(), result = [];
    for (const m3 of markers) {
      const group = m3.entity?.startsWith("light.") ? null : this._groupForMarker(m3, groups);
      if (group && !this.editMode && claimed.has(group.key)) continue;
      if (group) claimed.add(group.key);
      result.push({ ...m3, noticeGroup: group });
    }
    const perRoom = /* @__PURE__ */ new Map();
    for (const group of groups) {
      if (claimed.has(group.key)) continue;
      const r4 = rooms.find((r5) => r5.id === group.location.room);
      if (!r4) continue;
      const index = perRoom.get(r4.id) || 0;
      perRoom.set(r4.id, index + 1);
      const unit = this._model.bounds[2] / Math.max(Math.min((this.clientWidth || 350) - 24, 560), 250), point = group.level === "info" ? [(r4.label?.[0] || r4.x + r4.w / 2) + index * 32 * unit, (r4.label?.[1] || r4.y + r4.h / 2) + 28] : [r4.x + r4.w / 2 + (index % 2 ? 1 : -1) * 25 * unit, r4.y + 30 + Math.floor(index / 2) * 48 * unit];
      result.push({ id: "notice-" + group.key, room: r4.id, entity: group.entity, name: group.label, point, notification_only: true, generated: true, noticeGroup: group });
    }
    return result;
  }
  _openEquipmentNotices(group, opener) {
    this._openNotices(group.level, opener, group.location.room);
    this._noticeEquipmentKey = group.key;
  }
  _noticeRow(n5) {
    return b2`<button data-notice=${n5.key} class=${"hpf-notice-row " + n5.level + (n5.critical ? " is-critical" : "")} @click=${() => this._more(n5.entity)}>${icon(n5.icon)}<span><strong>${n5.label}</strong><span class="hpf-notice-reason">${n5.details.join(" · ")}</span><small>${n5.location.floor_name} · ${n5.location.room_name}</small></span>${icon("chevron-right")}</button>`;
  }
  _noticeSheet(rooms, close) {
    if (this._noticeEquipmentKey) {
      const group = this._noticeGroups().find((g2) => g2.key === this._noticeEquipmentKey);
      return b2`<section class="hpf-sheet hpf-notice-sheet" role="region" aria-label="Signalements de l’appareil" @keydown=${(e6) => {
        if (e6.key === "Escape") this._close();
      }}><div class="hpf-sheet-head"><div><h3>${group?.label || "Équipement"}</h3><span class="hpf-sheet-sub">${group ? `${group.notices.length} signalement${group.notices.length > 1 ? "s" : ""} · ${group.location.room_name}` : "Plus aucun signalement en cours"}</span></div>${close()}</div><div class="hpf-notice-list">${group?.notices.map((n5) => this._noticeRow(n5))}</div><button class="hpf-quick-room" @click=${(e6) => this._openNotices("priority", e6.currentTarget)}>Tous les signalements${icon("chevron-right")}</button></section>`;
    }
    const all = this._notices(rooms), floor = this._noticeFloor || "", room = this._noticeRoom || "", level = this._noticeFilter || "priority", scoped = all.filter((n5) => (!floor || n5.location.floor_id === floor) && (!room || n5.location.room === room)), shown = scoped.filter((n5) => n5.level === level);
    const floors = new Map(all.map((n5) => [n5.location.floor_id, n5.location.floor_name])), roomOptions = new Map(all.filter((n5) => !floor || n5.location.floor_id === floor).map((n5) => [n5.location.room, n5.location.room_name]));
    if (floor && !floors.has(floor)) floors.set(floor, this._registry.floors?.[floor]?.name || "Niveau sélectionné");
    if (room && !roomOptions.has(room)) roomOptions.set(room, rooms.find((r4) => r4.id === room)?.name || "Pièce sélectionnée");
    return b2`<section class="hpf-sheet hpf-notice-sheet" role="region" aria-label="Signalements" @keydown=${(e6) => {
      if (e6.key === "Escape") this._close();
    }}><div class="hpf-sheet-head"><h3>À suivre</h3>${close()}</div><div class="hpf-notice-tabs" role="group" aria-label="Niveau de signalement">${NOTICE_LEVELS.map((l3) => b2`<button data-notice-level=${l3} aria-pressed=${level === l3} @click=${() => this._noticeFilter = l3}>${{ priority: "Priorités", ready: "À récupérer", battery: "Piles", maintenance: "Entretien", info: "Infos" }[l3]}<span>${scoped.filter((n5) => n5.level === l3).length}</span></button>`)}</div><div class="hpf-notice-filters"><label>Niveau<select aria-label="Niveau de la maison" .value=${floor} @change=${(e6) => {
      this._noticeFloor = e6.target.value;
      this._noticeRoom = "";
    }}><option value="">Tous les niveaux</option>${[...floors].map(([id, name]) => b2`<option value=${id}>${name}</option>`)}</select></label><label>Pièce<select aria-label="Pièce des signalements" .value=${room} @change=${(e6) => this._noticeRoom = e6.target.value}><option value="">Toutes les pièces</option>${[...roomOptions].map(([id, name]) => b2`<option value=${id}>${name}</option>`)}</select></label></div><div class="hpf-notice-list">${shown.map((n5) => this._noticeRow(n5))}${!shown.length ? b2`<p class="hpf-empty">Aucun signalement en cours dans cette catégorie.</p>` : A}</div></section>`;
  }
  _matches(r4) {
    return !this._mode || this._mode === "lights" && this._lights(r4).length || this._mode === "covers" && this._covers(r4).length || this._mode === "temperature" && this._temperature(r4) || this._mode === "openings" && this._apertures().some((a3) => a3.room === r4.id && (a3.opening_entity || a3.command_entity));
  }
  _status(r4) {
    const p4 = this._problems(r4), o7 = this._openings(r4).filter((id) => this._state(id)?.state === "on"), temp = this._temperature(r4);
    if (p4.length) return `${p4.length} alerte${p4.length > 1 ? "s" : ""}`;
    if (o7.length) return `${o7.length} ouverture${o7.length > 1 ? "s" : ""}`;
    if (temp) return this._temperatureText(r4);
    const c5 = this._covers(r4);
    return c5.length === 1 ? this._coverLabel(c5[0]) : c5.length ? `${c5.length} volets` : this._entities(r4).length ? "Équipements de la pièce" : "Aucun équipement associé";
  }
  _photo(r4) {
    return safeImage(r4.illustration && !this._photoMode.has(r4.id) ? r4.illustration : r4.photos?.[this._photos[r4.id] || 0]);
  }
  _more(id) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true }));
  }
  _select(r4, opener) {
    if (this.editMode) return;
    this._opener = opener;
    this._selected = r4.id;
    this._quick = null;
    this._floorCovers = false;
    this._floorLights = false;
    this._floorClimate = false;
    this._equipmentTab = false;
    this._showAlerts = false;
    this._focusSheet();
  }
  _aperture(a3, opener) {
    if (this.editMode) return;
    this._opener = opener;
    this._selected = a3.room;
    this._quick = a3.id;
    this._floorCovers = false;
    this._floorLights = false;
    this._floorClimate = false;
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
    this._floorCovers = false;
    this._floorLights = false;
    this._floorClimate = false;
    this.updateComplete.then(() => this._opener?.isConnected && this._opener.focus({ preventScroll: true }));
  }
  _policy(entity) {
    return (this._config.cover_options || []).find((p4) => p4.entity === entity) || {};
  }
  _coverValue(entity) {
    const p4 = coverPosition(this._state(entity));
    return p4 === null ? null : this._policy(entity).invert_position ? 100 - p4 : p4;
  }
  _coverLabel(entity) {
    const s5 = this._state(entity), p4 = this._coverValue(entity);
    if (this._policy(entity).kind !== "screen") {
      if (!this._policy(entity).invert_position || !known2(s5) || p4 === null) return coverText(s5);
      return p4 === 0 ? "Fermé" : p4 === 100 ? "Ouvert" : `${p4} % ouvert`;
    }
    if (!known2(s5) || p4 === null) return !s5 ? "Entité introuvable" : s5.state === "unavailable" ? "Indisponible" : "Déploiement inconnu";
    return p4 === 0 ? "Rentré" : `${p4} % déployé`;
  }
  _shutters(ids) {
    return [...new Set(ids)].filter((id) => this._policy(id).kind !== "screen" && !["awning", "garage", "gate", "door"].includes(this._state(id)?.attributes?.device_class));
  }
  _windowCovers(rooms) {
    return this._shutters(rooms.flatMap((r4) => this._covers(r4)));
  }
  _coverGroups(rooms) {
    const groups = [{ id: "current", name: this._config.floor || this._model.floor || "Ce niveau", ids: this._windowCovers(rooms) }], currentFloors = new Set(rooms.map((r4) => this._registry.areas[r4.area_id]?.floor_id).filter(Boolean));
    const add = (g2) => {
      if (g2.ids.length && !groups.some((x2) => x2.ids.length === g2.ids.length && x2.ids.every((id) => g2.ids.includes(id)))) groups.push(g2);
    };
    for (const g2 of this._config.cover_groups || []) add({ ...g2, ids: this._shutters(this._leaves(g2.entities || [], "cover")) });
    for (const f3 of Object.values(this._registry.floors).sort((a3, b3) => (a3.level ?? 0) - (b3.level ?? 0))) {
      if (currentFloors.has(f3.floor_id)) continue;
      const areas = Object.values(this._registry.areas).filter((a3) => a3.floor_id === f3.floor_id), ids = this._shutters([...new Set(areas.flatMap((a3) => this._covers({ id: "area-" + a3.area_id, area_id: a3.area_id, auto_area: true, entities: [], excluded_entities: [] })))]);
      add({ id: "floor-" + f3.floor_id, name: f3.name, ids });
    }
    return groups;
  }
  _lightGroups(rooms) {
    const currentFloors = new Set(rooms.map((r4) => this._registry.areas[r4.area_id]?.floor_id).filter(Boolean));
    const groups = [{ id: "current", name: this._config.floor || this._model.floor || "Ce niveau", ids: [...new Set(rooms.flatMap((r4) => this._lights(r4)))] }];
    for (const f3 of Object.values(this._registry.floors).sort((a3, b3) => (a3.level ?? 0) - (b3.level ?? 0))) {
      if (currentFloors.has(f3.floor_id)) continue;
      const areas = Object.values(this._registry.areas).filter((a3) => a3.floor_id === f3.floor_id), ids = [...new Set(areas.flatMap((a3) => this._lights({ id: "area-" + a3.area_id, area_id: a3.area_id, auto_area: true, entities: [], excluded_entities: [] })))];
      if (ids.length) groups.push({ id: "floor-" + f3.floor_id, name: f3.name, ids });
    }
    return groups;
  }
  _haptic(type) {
    if (this.editMode || !this.isConnected) return;
    const event = new Event("haptic", { bubbles: true, composed: true });
    event.detail = type;
    this.dispatchEvent(event);
  }
  async _batch(ids, action) {
    const feature = { open_cover: 1, close_cover: 2, stop_cover: 8, turn_on: 0, turn_off: 0 }[action], unique = [...new Set(ids)], available = unique.filter((id) => {
      const s5 = this._state(id);
      return s5 && s5.state !== "unavailable" && (!id.startsWith("light.") || known2(s5)) && !this._busy.has(id) && (!feature || s5.attributes.supported_features & feature);
    }), epoch = this._epoch, generation = this._commandEpoch;
    if (available.length) this._haptic("light");
    const result = await Promise.all(available.map((id) => this._send(id, id.split(".")[0] + "." + action, {}, false)));
    if (epoch !== this._epoch || generation !== this._commandEpoch || !this.isConnected) return;
    if (result.some((v3) => !v3)) this._haptic("failure");
    else if (available.length < unique.length) this._haptic("warning");
    this._feedback = `${result.filter(Boolean).length}/${unique.length} commande${unique.length > 1 ? "s" : ""} envoyée${unique.length > 1 ? "s" : ""}${unique.length > available.length ? " · équipements indisponibles ou non compatibles ignorés" : ""}${result.some((v3) => !v3) ? " · au moins un échec" : ""}`;
  }
  async _send(entity, service, data = {}, haptic = true) {
    let [domain, action] = service.split(".");
    const state = this._state(entity);
    if (!validEntity(entity) || !state || state.state === "unavailable") return false;
    const allowed = { light: ["turn_on", "turn_off"], cover: ["open_cover", "close_cover", "stop_cover", "set_cover_position"], switch: ["turn_on", "turn_off"], climate: ["set_temperature", "set_preset_mode", "set_hvac_mode"] };
    if (!allowed[domain]?.includes(action) || entity.split(".")[0] !== domain) throw Error("Commande non autorisée.");
    if (domain === "climate") {
      const checked = climateCommand(state, action, data);
      if (!checked) return false;
      data = checked;
    }
    if (domain === "cover") {
      const policy = this._policy(entity), limit = policy.max_position || 100;
      if (action === "open_cover" && (limit < 100 || policy.invert_position)) {
        action = "set_cover_position";
        data = { position: limit };
      }
      if (action === "close_cover" && policy.invert_position) {
        action = "set_cover_position";
        data = { position: 0 };
      }
      if (action === "set_cover_position") {
        const p4 = Number(data.position);
        if (!Number.isFinite(p4)) return false;
        const logical = Math.max(0, Math.min(limit, p4));
        data = { ...data, position: policy.invert_position ? 100 - logical : logical };
      }
      const bit = { open_cover: 1, close_cover: 2, stop_cover: 8, set_cover_position: 4 }[action];
      if (!(state.attributes.supported_features & bit)) return false;
    }
    if (this._busy.has(entity) || this.editMode) return false;
    if (haptic) this._haptic("light");
    const epoch = this._epoch, generation = this._commandEpoch;
    this._busy = /* @__PURE__ */ new Set([...this._busy, entity]);
    this._feedback = "Envoi de la commande…";
    clearTimeout(this._feedbackTimer);
    try {
      await this.hass.callService(domain, action, data, { entity_id: entity });
      if (epoch === this._epoch && generation === this._commandEpoch && this.isConnected) this._feedback = domain === "switch" ? "Impulsion envoyée · état physique non suivi" : "Commande envoyée · état affiché selon le retour de l’équipement";
      return true;
    } catch (e6) {
      if (epoch === this._epoch && generation === this._commandEpoch && this.isConnected) {
        if (haptic) this._haptic("failure");
        this._feedback = "Échec de la commande : " + (e6.message || String(e6));
      }
      return false;
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
    const s5 = this._state(entity), p4 = this._coverValue(entity), f3 = s5?.attributes?.supported_features || 0, policy = this._policy(entity), screen = policy.kind === "screen", max = policy.max_position || 100, disabled = !s5 || s5.state === "unavailable" || this._busy.has(entity);
    return b2`<div class="hpf-cover" data-entity=${entity}><div class="hpf-cover-caption">${this._entityIcon(entity, screen ? "mdi:projector-screen-outline" : void 0)}<span>${name || this._name(entity)}</span><output>${this._coverLabel(entity)}</output><button class="hpf-cover-info" aria-label=${"Détails de " + this._name(entity)} @click=${() => this._more(entity)}>${icon("settings")}</button></div><div class="hpf-position-control"><span class=${"hpf-cover-preview " + (screen ? "is-screen" : "")} style=${`--closed:${p4 === null ? 50 : 100 - p4}%`} aria-hidden="true"></span><div><input aria-label=${(screen ? "Déploiement de " : "Fermeture de ") + (name || this._name(entity))} type="range" min="0" max=${screen ? max : 100} aria-valuetext=${this._coverLabel(entity)} .value=${String(p4 === null ? 50 : screen ? p4 : 100 - p4)} ?disabled=${disabled || p4 === null || !(f3 & 4)} @change=${(e6) => this._send(entity, "cover.set_cover_position", { position: screen ? Number(e6.target.value) : 100 - Number(e6.target.value) })}><div class="hpf-range-labels"><span>${screen ? "Rentré" : "Ouvert"}</span><span>${screen ? `Course limitée à ${max} %` : "Fermé"}</span></div></div></div><div class="hpf-cover-actions"><button ?disabled=${disabled || !(f3 & (max < 100 || policy.invert_position ? 4 : 1))} @click=${() => this._send(entity, "cover.open_cover")}>${icon(screen ? "chevron-down" : "chevron-up")}${screen ? "Déployer" : "Ouvrir"}</button><button ?disabled=${disabled || !(f3 & 8)} @click=${() => this._send(entity, "cover.stop_cover")}>${icon("square")}Arrêter</button><button ?disabled=${disabled || !(f3 & (policy.invert_position ? 4 : 2))} @click=${() => this._send(entity, "cover.close_cover")}>${icon(screen ? "chevron-up" : "chevron-down")}${screen ? "Rentrer" : "Fermer"}</button></div></div>`;
  }
  _groupControls(ids, label, domain = "cover") {
    if (ids.length < 2) return A;
    const actions = domain === "light" ? [["turn_on", "Tout allumer", "lightbulb"], ["turn_off", "Tout éteindre", "lightbulb"]] : [["open_cover", "Tout ouvrir", "chevron-up"], ["stop_cover", "Tout arrêter", "square"], ["close_cover", "Tout fermer", "chevron-down"]];
    return b2`<div class="hpf-group" data-group=${domain}><div class="hpf-group-caption"><strong>${label}</strong><span>${ids.length} ${domain === "light" ? "lumières" : "volets"}</span></div><div class=${"hpf-group-actions " + (domain === "light" ? "two" : "")}>${actions.map(([action, label2, i7]) => b2`<button ?disabled=${ids.every((id) => {
      const s5 = this._state(id);
      return !s5 || s5.state === "unavailable" || this._busy.has(id);
    })} @click=${() => this._batch(ids, action)}>${icon(i7)}${label2}</button>`)}</div></div>`;
  }
  _opening(entity, name) {
    const s5 = this._state(entity);
    return b2`<div class=${"hpf-opening " + (s5?.state === "on" ? "is-open" : "")}>${this._entityIcon(entity)}<span>${name || this._name(entity)}</span><strong>${known2(s5) ? s5.state === "on" ? "Ouverte" : "Fermée" : s5?.state === "unavailable" ? "Indisponible" : "État inconnu"}</strong></div>`;
  }
  _light(id) {
    const s5 = this._state(id);
    return b2`<button class=${"hpf-device " + (s5?.state === "on" ? "is-lit" : "")} data-light=${id} ?disabled=${!known2(s5) || this._busy.has(id)} aria-pressed=${s5?.state === "on"} @click=${() => this._send(id, s5.state === "on" ? "light.turn_off" : "light.turn_on")}>${this._entityIcon(id)}<span><strong>${this._name(id)}</strong><small>${this._format(id)}</small></span></button>`;
  }
  _equipment(id) {
    return b2`<button class="hpf-more" data-equipment=${id} @click=${() => this._more(id)}>${this._entityIcon(id)}<span>${this._name(id)}</span><span>${this._format(id)}</span></button>`;
  }
  _equipmentGroups(r4) {
    const groups = /* @__PURE__ */ new Map();
    for (const id of this._entities(r4)) {
      const e6 = this._registry.entities[id], d3 = this._registry.devices[e6?.device_id], key = d3?.id || d3?.device_id || (id.startsWith("light.") || id.startsWith("scene.") ? id.split(".")[0] : id), name = d3?.name_by_user || d3?.name || (key === "light" ? "Éclairages" : key === "scene" ? "Scènes" : this._name(id));
      if (!groups.has(key)) groups.set(key, { key, name, ids: [] });
      groups.get(key).ids.push(id);
    }
    return b2`<div class="hpf-equipment-groups">${[...groups.values()].sort((a3, b3) => a3.name.localeCompare(b3.name)).map((g2) => b2`<details class="hpf-equipment-group"><summary>${this._entityIcon(g2.ids[0])}<span><strong>${g2.name}</strong><small>${g2.ids.length} information${g2.ids.length > 1 ? "s" : ""}</small></span>${icon("chevron-down")}</summary>${g2.ids.map((id) => this._equipment(id))}</details>`)}</div>`;
  }
  _sheet(rooms) {
    const r4 = rooms.find((r5) => r5.id === this._selected), a3 = this._apertures().find((a4) => a4.id === this._quick);
    const close = () => b2`<button class="hpf-close" data-close aria-label="Revenir au plan" @click=${this._close}>${icon("x")}</button>`;
    if (this._floorClimate) return this._climateFloorSheet(rooms, close);
    if (this._floorCovers || this._floorLights) {
      const lights2 = this._floorLights, groups = lights2 ? this._lightGroups(rooms) : this._coverGroups(rooms), group = groups.find((g2) => g2.id === this._floorGroup) || groups[0], ids = group.ids;
      return b2`<section class="hpf-sheet" role="region" aria-label=${lights2 ? "Lumières du niveau" : "Volets du niveau"} @keydown=${(e6) => {
        if (e6.key === "Escape") this._close();
      }}><div class="hpf-sheet-head"><div><h3>${lights2 ? "Lumières" : "Volets"}</h3><span class="hpf-sheet-sub">${ids.length} ${lights2 ? "lumières" : "volets"}</span></div>${close()}</div>${groups.length > 1 ? b2`<label class="hpf-level-picker">Niveau<select aria-label=${lights2 ? "Niveau des lumières" : "Niveau des volets"} .value=${group.id} @change=${(e6) => this._floorGroup = e6.target.value}>${groups.map((g2) => b2`<option value=${g2.id}>${g2.name}</option>`)}</select></label>` : A}${this._groupControls(ids, group.name, lights2 ? "light" : "cover")}${lights2 ? b2`<div class="hpf-device-grid">${c4(ids, (id) => id, (id) => this._light(id))}</div>` : ids.map((id) => this._cover(id))}${!ids.length ? b2`<p class="hpf-empty">Aucun équipement associé à ce niveau.</p>` : A}</section>`;
    }
    if (this._showAlerts) return this._noticeSheet(rooms, close);
    if (!r4) return A;
    if (!a3 && this._mode === "temperature" && this._climates(r4).length && !this._equipmentTab) return this._climateRoomSheet(r4, close);
    const covered = a3?.cover_entity ? [a3.cover_entity] : this._covers(r4), opening = a3?.opening_entity ? [a3.opening_entity] : this._openings(r4), lights = this._lights(r4), photo = this._photo(r4), shutters = this._windowCovers([r4]);
    const favorite = r4.favorite_entities || this._entities(r4).filter((id) => ["fan", "vacuum", "media_player"].includes(id.split(".")[0])).slice(0, 3);
    return b2`<section class="hpf-sheet" role="region" aria-label=${a3?.name || r4.name} @keydown=${(e6) => {
      if (e6.key === "Escape") this._close();
    }}><div class="hpf-sheet-head"><div><h3>${a3?.name || r4.name}</h3><span class="hpf-sheet-sub">${a3 ? r4.name : this._temperature(r4) ? this._temperatureText(r4) : this._config.floor || this._model?.floor || ""}</span></div>${close()}</div>
      ${!a3 ? this._roomNoticeButtons(r4) : A}
      ${!a3 ? b2`<div class="hpf-sheet-tabs" role="group" aria-label="Vue de la pièce"><button aria-pressed=${!this._equipmentTab} @click=${() => this._equipmentTab = false}>Commandes</button><button aria-pressed=${!!this._equipmentTab} @click=${() => this._equipmentTab = true}>Équipements</button></div>` : A}
      ${!a3 && this._equipmentTab ? this._equipmentGroups(r4) : b2`
        ${!a3 && photo ? b2`<div class="hpf-room-photo"><img src=${photo} alt=${(r4.illustration && !this._photoMode.has(r4.id) ? "Illustration de " : "Photo de ") + r4.name}>${r4.illustration ? b2`<button class="hpf-photo-style" @click=${() => {
      const set = new Set(this._photoMode);
      set.has(r4.id) ? set.delete(r4.id) : set.add(r4.id);
      this._photoMode = set;
    }}>${this._photoMode.has(r4.id) ? "Voir l’illustration" : "Voir la photo"}</button>` : A}${r4.photos?.length > 1 && this._photoMode.has(r4.id) ? b2`<button class="hpf-photo-next" @click=${() => this._photos = { ...this._photos, [r4.id]: ((this._photos[r4.id] || 0) + 1) % r4.photos.length }}>${(this._photos[r4.id] || 0) + 1} / ${r4.photos.length}</button>` : A}</div>` : A}
        ${!a3 && this._climates(r4).length ? b2`<button class="hpf-climate-shortcut" data-room-climate @click=${() => {
      this._mode = "temperature";
      this._equipmentTab = false;
    }}>${icon("mdi:thermostat")}<span>Chauffage<strong>${this._climates(r4).map((id) => {
      const i7 = climateInfo(this._state(id));
      return i7.target === null ? i7.label : this._degree(i7.target) + " · " + i7.label;
    }).join(" · ")}</strong></span>${icon("chevron-right")}</button>` : A}
        ${!a3 ? this._groupControls(lights, "Éclairages", "light") : A}
        ${!a3 && lights.length ? b2`<div class="hpf-device-grid">${c4(lights, (id) => id, (id) => this._light(id))}</div>` : A}
        ${!a3 ? this._groupControls(shutters, "Volets de la pièce") : A}
        ${c4(covered, (id) => id, (id) => this._cover(id))}${opening.map((id) => this._opening(id))}
        ${a3?.command_entity ? b2`<div class="hpf-cover"><div class="hpf-cover-caption">${this._entityIcon(a3.command_entity)}<span>Porte motorisée</span></div><p class="hpf-sheet-sub">État physique non suivi · commande par impulsion</p><button class="hpf-device" data-command=${a3.command_entity} ?disabled=${!this._state(a3.command_entity) || this._state(a3.command_entity)?.state === "unavailable" || this._busy.has(a3.command_entity)} @click=${() => this._send(a3.command_entity, "switch.turn_on")}>${icon("door-open")}Actionner la porte</button><button class="hpf-more" @click=${() => this._more(a3.command_entity)}>${icon("settings")}Détails de l’équipement${icon("chevron-right")}</button></div>` : A}
        ${!a3 ? b2`<div class="hpf-favorites">${favorite.map((id) => this._equipment(id))}</div>` : b2`<button class="hpf-quick-room" @click=${(e6) => this._select(r4, e6.currentTarget)}>${icon(r4.icon)}Voir la pièce${icon("chevron-right")}</button>`}
      `}
      ${!this._entities(r4).length ? b2`<p class="hpf-empty">Aucun équipement associé. Ajoutez-les dans l’éditeur de la carte.</p>` : A}
    </section>`;
  }
  _markerTap(m3) {
    if (this.editMode) return;
    const s5 = this._state(m3.entity);
    if (m3.entity?.startsWith("light.") && known2(s5)) this._send(m3.entity, s5.state === "on" ? "light.turn_off" : "light.turn_on");
    else this._more(m3.entity);
  }
  _editPick(kind, item) {
    this._editSelection = kind + ":" + item.id;
    this.dispatchEvent(new CustomEvent("plan-item-selected", { detail: { kind, id: item.id, room: item.room }, bubbles: true, composed: true }));
  }
  _dragStart(e6, kind, item) {
    if (!this.editMode || e6.button > 0) return;
    e6.preventDefault();
    this._editPick(kind, item);
    const el = e6.currentTarget;
    el.setPointerCapture(e6.pointerId);
    this._drag = { id: item.id, kind, el, pointerId: e6.pointerId, startX: e6.clientX, startY: e6.clientY, originalStyle: el.getAttribute("style"), moved: false };
  }
  _dragMove(e6) {
    const d3 = this._drag;
    if (!d3 || d3.pointerId !== e6.pointerId) return;
    const box = this.renderRoot.querySelector(".hpf-map").getBoundingClientRect(), b3 = this._model.bounds;
    d3.moved ||= Math.hypot(e6.clientX - d3.startX, e6.clientY - d3.startY) > 3;
    if (!d3.moved) return;
    const x2 = Math.max(22, Math.min(box.width - 22, e6.clientX - box.left)), y3 = Math.max(22, Math.min(box.height - 22, e6.clientY - box.top));
    d3.point = [Math.round(b3[0] + x2 / box.width * b3[2]), Math.round(b3[1] + y3 / box.height * b3[3])];
    d3.el.style.left = x2 / box.width * 100 + "%";
    d3.el.style.top = y3 / box.height * 100 + "%";
  }
  _dragEnd(e6, cancel = false) {
    const d3 = this._drag;
    if (!d3 || d3.pointerId !== e6.pointerId) return;
    this._drag = null;
    if (d3.el.hasPointerCapture(e6.pointerId)) d3.el.releasePointerCapture(e6.pointerId);
    if (d3.moved && !cancel) this.dispatchEvent(new CustomEvent("plan-position-changed", { detail: { kind: d3.kind, id: d3.id, point: d3.point }, bubbles: true, composed: true }));
    else if (cancel) d3.el.setAttribute("style", d3.originalStyle);
  }
  _editKey(e6, kind, item) {
    if (!this.editMode) return;
    const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e6.key];
    if (!delta) return;
    e6.preventDefault();
    this._editPick(kind, item);
    const p4 = kind === "marker" ? item.point : item.control || [(item.segment[0] + item.segment[2]) / 2, (item.segment[1] + item.segment[3]) / 2], b3 = this._model.bounds, step = e6.shiftKey ? 1 : 5;
    this.dispatchEvent(new CustomEvent("plan-position-changed", { detail: { kind, id: item.id, point: p4.map((v3, i7) => Math.max(b3[i7], Math.min(b3[i7] + b3[i7 + 2], v3 + delta[i7] * step))) }, bubbles: true, composed: true }));
  }
  _map(rooms) {
    const b3 = this._model.bounds, apertures = this._apertures(), markers = this._mapMarkers(rooms), pct = (v3, i7) => (v3 - b3[i7]) / b3[i7 + 2] * 100;
    const pointStyle = (p4) => `left:clamp(22px,${pct(p4[0], 0)}%,calc(100% - 22px));top:${pct(p4[1], 1)}%`;
    const selected = rooms.find((r4) => r4.id === this._selected) || rooms.find((r4) => r4.id === this._model.preview?.room);
    return b2`<div class=${"hpf-map " + (this.editMode ? "is-editing" : "")} style=${`aspect-ratio:${b3[2]}/${b3[3]}`}>
      <svg class="hpf-drawing" viewBox=${b3.join(" ")} role="img" aria-label=${"Plan du " + (this._config.floor || this._model.floor || "niveau")}><title>Pièces et équipements</title>${rooms.map((r4) => w`<path class=${`hpf-room-floor ${this._lights(r4).some((id) => this._state(id)?.state === "on") ? "is-lit" : ""} ${r4.id === this._selected ? "is-selected" : ""} ${this._matches(r4) ? "" : "is-muted"}`} d=${r4.path || ""}/>`)}${o6(this._model.artwork)}</svg>
      ${c4(rooms, (r4) => r4.id, (r4) => {
      const [x2, y3, w2, h4] = r4.hit || [r4.x, r4.y, r4.w, r4.h], l3 = r4.label || [x2 + w2 / 2, y3 + h4 / 2], temp = this._temperature(r4), opens = this._openings(r4).some((id) => this._state(id)?.state === "on"), problems = this._problems(r4);
      return b2`<button class=${`hpf-zone ${opens ? "has-opening" : ""} ${this._matches(r4) ? "" : "is-muted"}`} style=${`left:${pct(x2, 0)}%;top:${pct(y3, 1)}%;width:${w2 / b3[2] * 100}%;height:${h4 / b3[3] * 100}%`} aria-label=${r4.name + ", " + this._status(r4)} aria-pressed=${r4.id === this._selected} @click=${(e6) => this._select(r4, e6.currentTarget)}><span class="hpf-room-name" ?hidden=${r4.hide_label} style=${`left:${(l3[0] - x2) / w2 * 100}%;top:${(l3[1] - y3) / h4 * 100}%`}><strong><span class="hpf-name-full">${r4.short || r4.name}</span><span class="hpf-name-micro">${r4.micro || r4.short || r4.name}</span>${opens || problems.length ? b2`<span class=${"hpf-room-alert " + (problems.length ? "hpf-problem" : "")}>!</span>` : A}</strong>${temp ? this._climateMapReading(r4) : this._lights(r4).some((id) => this._state(id)?.state === "on") ? b2`<span class="hpf-dot"></span>` : A}</span></button>`;
    })}
      <svg class="hpf-aperture-layer" viewBox=${b3.join(" ")} aria-hidden="true">${apertures.map((a3) => {
      const s5 = a3.segment;
      if (!s5 || s5.length !== 4) return A;
      const p4 = `M${s5[0]} ${s5[1]}L${s5[2]} ${s5[3]}`, o7 = this._state(a3.opening_entity), c5 = this._state(a3.cover_entity), pos = this._coverValue(a3.cover_entity), vertical = s5[0] === s5[2], shift = Number.isFinite(a3.shutter_offset) ? Math.max(-40, Math.min(40, a3.shutter_offset)) : vertical ? -12 : 12, parallel = `M${s5[0] + (vertical ? shift : 0)} ${s5[1] + (vertical ? 0 : shift)}L${s5[2] + (vertical ? shift : 0)} ${s5[3] + (vertical ? 0 : shift)}`;
      return w`${o7?.state === "on" ? w`<path class="aperture-halo" d=${p4}/>` : A}<path class=${"aperture-line " + (o7?.state === "on" ? "is-open" : "")} d=${p4} data-map-aperture=${a3.cover_entity || a3.command_entity || a3.opening_entity ? a3.id : A} @click=${(e6) => this._aperture(a3, this.renderRoot.querySelector(`[data-aperture="${CSS.escape(a3.id)}"]`))}/>${a3.leaf ? w`${a3.show_swing === false ? A : w`<path class=${"aperture-swing " + (o7?.state === "on" ? "is-open" : "")} d=${`M${s5[2]} ${s5[3]}Q${a3.leaf[2]} ${s5[3]} ${a3.leaf[2]} ${a3.leaf[3]}`}/>`}<path class=${"aperture-leaf " + (o7?.state === "on" ? "is-open" : "")} d=${o7?.state === "on" ? `M${a3.leaf[0]} ${a3.leaf[1]}L${a3.leaf[2]} ${a3.leaf[3]}` : p4}/>` : A}${a3.cover_entity ? w`<path class="shutter-track" d=${parallel}/>${pos !== null ? w`<path class="shutter-fill" d=${parallel} pathLength="100" stroke-dasharray=${`${100 - pos} 100`}/>` : A}${this._mode === "covers" && a3.control ? w`<path class="aperture-leader" d=${`M${(s5[0] + s5[2]) / 2} ${(s5[1] + s5[3]) / 2}L${a3.control[0]} ${a3.control[1]}`}/>` : A}` : A}`;
    })}</svg>
      ${apertures.filter((a3) => a3.cover_entity || a3.command_entity || a3.opening_entity).map((a3) => {
      const p4 = a3.control || [(a3.segment[0] + a3.segment[2]) / 2, (a3.segment[1] + a3.segment[3]) / 2], o7 = this._state(a3.opening_entity), c5 = this._state(a3.cover_entity), r4 = rooms.find((r5) => r5.id === a3.room);
      return b2`<button data-aperture=${a3.id} class=${`hpf-aperture ${a3.cover_entity ? "has-cover" : ""} ${this._mode === "covers" ? "show-value" : ""} ${o7?.state === "on" ? "is-open" : ""} ${r4 && this._matches(r4) ? "" : "is-muted"}`} style=${pointStyle(p4)} aria-label=${a3.name + (a3.cover_entity ? ", " + this._coverLabel(a3.cover_entity) : "")} @pointerdown=${(e6) => this._dragStart(e6, "aperture", a3)} @pointermove=${this._dragMove} @pointerup=${(e6) => this._dragEnd(e6)} @pointercancel=${(e6) => this._dragEnd(e6, true)} @keydown=${(e6) => this._editKey(e6, "aperture", a3)} @click=${(e6) => this._aperture(a3, e6.currentTarget)} data-edit-selected=${this._editSelection === "aperture:" + a3.id}><span class="hpf-aperture-mark">${icon(a3.cover_entity ? "blinds" : o7?.state === "off" ? "door-closed" : "door-open")}${a3.cover_entity ? b2`<span>${this._coverValue(a3.cover_entity) === 0 ? "Fermé" : this._coverValue(a3.cover_entity) === 100 ? "Ouvert" : this._coverValue(a3.cover_entity) !== null ? this._coverValue(a3.cover_entity) + " %" : "?"}</span>` : A}</span></button>`;
    })}
      ${markers.filter((m3) => this._markerVisible(m3)).map((m3) => {
      const state = this._state(m3.entity), light = m3.entity.startsWith("light."), group = m3.noticeGroup, level = group?.level, alert = level === "priority";
      return b2`<button data-marker=${m3.id} data-equipment-notice=${group?.key || A} data-edit-selected=${this._editSelection === "marker:" + m3.id} class=${"hpf-room-marker " + (this._markerMuted(m3) ? "is-muted " : "") + (alert ? "is-alert " : "") + (group ? "hpf-equipment-notice " + level + " " : "") + (group?.critical ? "is-critical " : "") + (light ? "is-light " : "") + (light && state?.state === "on" ? "is-on" : "")} style=${pointStyle(m3.point)} aria-label=${group ? `${m3.name || group.label}, ${group.notices.length} signalement${group.notices.length > 1 ? "s" : ""} : ${group.notices.map((n5) => n5.details.join(", ")).join("; ")}` : this._name(m3.entity) + ", " + this._format(m3.entity)} @pointerdown=${(e6) => this._dragStart(e6, "marker", m3)} @pointermove=${this._dragMove} @pointerup=${(e6) => this._dragEnd(e6)} @pointercancel=${(e6) => this._dragEnd(e6, true)} @keydown=${(e6) => this._editKey(e6, "marker", m3)} @click=${(e6) => group && !this.editMode ? this._openEquipmentNotices({ ...group, label: m3.name || group.label }, e6.currentTarget) : this._markerTap(m3)}>${this._entityIcon(m3.entity, m3.icon && m3.icon !== "smoke" ? ICON[m3.icon] || m3.icon : group?.icon)}${group ? b2`<span class="hpf-notice-count" aria-hidden="true">${group.notices.length}</span>` : A}</button>`;
    })}

      ${!this.editMode && selected && this._photo(selected) && this._model.preview ? b2`<button class="hpf-photo-shortcut" style=${`left:${pct(this._model.preview.x, 0)}%;top:${pct(this._model.preview.y, 1)}%;width:${this._model.preview.w / b3[2] * 100}%;height:${this._model.preview.h / b3[3] * 100}%`} @click=${(e6) => this._select(selected, e6.currentTarget)}><img src=${this._photo(selected)} alt=${selected.name}><span class="hpf-photo-caption">${selected.short || selected.name}${icon("chevron-right")}</span></button>` : A}
    </div>`;
  }
  render() {
    this._observed = /* @__PURE__ */ new Set();
    this._roomEntityCache = /* @__PURE__ */ new Map();
    this._noticeCache = null;
    if (!this._model) return b2`<ha-card><section class="hpf-home">${this._levelSelector()}<div class="hpf-empty" role="status">${this._error || "Chargement du plan…"}</div></section></ha-card>`;
    const rooms = this._rooms(), lights = [...new Set(rooms.flatMap((r4) => this._lights(r4)))].filter((id) => this._state(id)?.state === "on"), openingIds = [...new Set(rooms.flatMap((r4) => this._openings(r4)))], open = openingIds.filter((id) => this._state(id)?.state === "on"), unknown = openingIds.filter((id) => !known2(this._state(id))), problems = [...new Set(rooms.flatMap((r4) => this._problems(r4)))];
    if (this.editMode) return b2`<ha-card><section class="hpf-home hpf-placement">${this._map(rooms)}<div class="hpf-placement-caption">Glisser un repère · flèches du clavier pour ajuster</div></section></ha-card>`;
    const climateRows = this._climateRows(rooms), hasClimate = climateRows.length > 0, heatConflicts = climateRows.filter((r4) => r4.info.status === "conflict").length;
    return b2`<ha-card><section class="hpf-home" aria-label="Plan et commandes de la maison"><header class="hpf-head"><div class="hpf-heading"><span class="hpf-home-mark">${icon("house")}</span><div><h2>${this._config.name || "Maison"}</h2><span class="hpf-floor-name">${this._config.floor || this._model.floor}</span></div></div>${this._levelSelector()}</header>
      <div class="hpf-tools"><div class="hpf-glance"><button data-light-count aria-pressed=${this._mode === "lights"} @click=${() => this._mode = this._mode === "lights" ? "" : "lights"}>${icon("lightbulb")}${lights.length} lumière${lights.length > 1 ? "s" : ""}</button><button data-open-count aria-pressed=${this._mode === "openings"} @click=${() => this._mode = this._mode === "openings" ? "" : "openings"}>${icon("door-open")}${open.length} ouverture${open.length > 1 ? "s" : ""}${unknown.length ? " · " + unknown.length + " ?" : ""}</button></div><div class="hpf-view" role="group" aria-label="Présentation"><button aria-pressed=${this._view === "plan"} @click=${() => this._view = "plan"}>Plan</button><button aria-pressed=${this._view === "rooms"} @click=${() => this._view = "rooms"}>Pièces</button></div></div>
      <div class="hpf-modebar" role="group" aria-label="Informations sur le plan">${MODES.map(([mode, i7, rawLabel]) => {
      const climate = mode === "temperature" && hasClimate, label = climate ? "Chauffage" : rawLabel;
      return b2`<button data-mode=${mode} aria-pressed=${this._mode === mode} aria-label=${label} @click=${() => this._mode = mode}>${icon(climate ? "mdi:thermostat" : i7)}${mode === "openings" || climate ? b2`<span class="hpf-mode-long">${label}</span><span class="hpf-mode-short">${climate ? "Chauff." : "Ouv."}</span>` : label}</button>`;
    })}</div>
      ${this._mode === "lights" ? b2`<button class="hpf-floor-covers" data-floor-lights @click=${(e6) => {
      this._opener = e6.currentTarget;
      this._selected = null;
      this._quick = null;
      this._floorLights = true;
      this._floorClimate = false;
      this._floorCovers = false;
      this._floorGroup = "current";
      this._showAlerts = false;
      this._focusSheet();
    }}>${icon("lightbulb")}Toutes les lumières du niveau · ${this._lightGroups(rooms)[0].ids.length}${icon("chevron-right")}</button>` : A}
      ${this._mode === "temperature" && hasClimate ? b2`<button class="hpf-floor-covers" data-floor-climate @click=${(e6) => this._openFloorClimate(e6.currentTarget)}>${icon("mdi:thermostat")}Chauffage du niveau · ${this._climateRows(rooms).length} zones${icon("chevron-right")}</button>` : A}
      ${this._mode === "covers" ? b2`<button class="hpf-floor-covers" data-floor-covers @click=${(e6) => {
      this._opener = e6.currentTarget;
      this._selected = null;
      this._quick = null;
      this._floorCovers = true;
      this._floorClimate = false;
      this._floorLights = false;
      this._floorGroup = "current";
      this._showAlerts = false;
      this._focusSheet();
    }}>${icon("blinds")}Tous les volets du niveau · ${this._windowCovers(rooms).length}${icon("chevron-right")}</button>` : A}
      ${!rooms.length ? b2`<div class="hpf-empty">Ajoutez un plan local et ses pièces dans l’éditeur de la carte.</div>` : this._view === "plan" ? this._map(rooms) : b2`<div class="hpf-room-grid">${rooms.filter((r4) => this._matches(r4)).map((r4) => b2`<button class=${"hpf-room-tile " + (this._problems(r4).length ? "has-opening" : "")} data-room=${r4.id} @click=${(e6) => this._select(r4, e6.currentTarget)}>${icon(r4.icon)}<strong>${r4.name}</strong><small>${this._status(r4)}</small></button>`)}</div>`}
      ${this._view === "plan" ? b2`<div class="hpf-map-legend"><span class="opening-key">${icon("door-open")}Ouverture physique</span><span class="cover-key">${icon("blinds")}${this._mode === "covers" ? "Volet · % d’ouverture" : "Toucher pour commander"}</span></div>` : A}
      <footer class="hpf-notice-footer" aria-label="Résumé des signalements"><span class="hpf-footer-copy" aria-live="polite">${!this._notices(rooms).length ? heatConflicts ? `${heatConflicts} retour${heatConflicts > 1 ? "s" : ""} de chauffage à vérifier` : unknown.length ? `${unknown.length} état${unknown.length > 1 ? "s" : ""} d’ouverture inconnu${unknown.length > 1 ? "s" : ""}` : "Rien à signaler" : A}</span>${NOTICE_LEVELS.map((level) => {
      const rows = this._notices(rooms).filter((n5) => n5.level === level);
      return rows.length ? b2`<button data-alerts=${level === "priority" ? "" : A} data-notice-summary=${level} class=${"hpf-notice-chip " + level + (rows.some((n5) => n5.critical) ? " is-critical" : "")} @click=${(e6) => this._openNotices(level, e6.currentTarget)}>${icon(level === "priority" ? "circle-alert" : level === "ready" ? "mdi:check-circle-outline" : level === "battery" ? "mdi:battery-alert-variant-outline" : level === "maintenance" ? "mdi:wrench-outline" : "mdi:information-outline")}<span>${{ priority: "Alertes", ready: "À récupérer", battery: "Piles", maintenance: "Entretien", info: "Actifs" }[level]}</span><strong>${rows.length}</strong></button>` : A;
    })}</footer>
      ${this._sheet(rooms)}${this._feedback ? b2`<div class="hpf-state" role="status" aria-live="polite">${this._feedback}</div>` : A}${this._registryError ? b2`<div class="hpf-state">${this._registryError}</div>` : A}${this._error ? b2`<div class="hpf-state is-error" role="alert">${this._error}</div>` : A}
    </section></ha-card>`;
  }
};
var HomePlanCardEditor = class extends i4 {
  static properties = { hass: {}, _config: { state: true }, _room: { state: true }, _marker: { state: true }, _formReady: { state: true }, _formError: { state: true }, _baseModel: { state: true }, _apertureId: { state: true }, _coverEdit: { state: true }, _noticeDraft: { state: true } };
  static styles = i`:host{display:block} .fields{display:grid;gap:14px}.fields>home-plan-card{width:100%;min-width:0}.fields details{border-top:1px solid var(--divider-color);padding:8px 0}.fields summary{padding:8px 0;cursor:pointer}select,input{box-sizing:border-box;font:inherit;width:100%;min-height:44px;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;padding:8px}label{display:grid;gap:8px}h3{font-size:16px;margin:8px 0}p{font-size:13px;color:var(--secondary-text-color)}.row{display:flex;gap:8px}.row>*{flex:1}button{font:inherit;min-height:44px;border:0;border-radius:8px;padding:8px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}a{color:var(--primary-color)}`;
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
    this._rootConfig = validateConfig(config);
    if (!planLevels(this._rootConfig).some((l3) => l3.id === this._level)) this._level = "primary";
    this._config = levelConfig(this._rootConfig, this._level);
    if (!this._config.rooms.some((r4) => r4.id === this._room)) this._room = this._config.rooms[0]?.id || "";
  }
  _switchLevel(id) {
    this._level = id;
    this._baseModel = null;
    this._marker = "";
    this._apertureId = "";
    this._coverEdit = null;
    this.setConfig(this._rootConfig);
    this.requestUpdate();
  }
  _change(patch) {
    const local = {}, shared = {};
    for (const [k2, v3] of Object.entries(patch)) (LEVEL_FIELDS.includes(k2) ? local : shared)[k2] = v3;
    let root = { ...this._rootConfig, ...shared };
    if (this._level === "primary") root = { ...root, ...local };
    else root = { ...root, levels: root.levels.map((l3) => l3.id === this._level ? { ...l3, ...local } : l3) };
    this._rootConfig = root;
    this._config = levelConfig(root, this._level);
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: copy(root) }, bubbles: true, composed: true }));
  }
  _roomChange(patch) {
    this._change({ rooms: this._config.rooms.map((r4) => r4.id === this._room ? { ...r4, ...patch } : r4) });
  }
  _noticeChange(id, patch) {
    if ("entity" in patch && !validEntity(patch.entity)) return;
    this._change({ notification_rules: this._config.notification_rules.map((r4) => {
      if (r4.id !== id) return r4;
      const next = { ...r4, ...patch };
      if (next.states === null) next.states = [];
      for (const k2 of ["below", "above"]) if (next[k2] === null || next[k2] === "") delete next[k2];
      return next;
    }) });
  }
  _noticeEditor(form) {
    const draft = this._noticeDraft || { entity: "", level: "maintenance", label: "" };
    return b2`<details><summary>Alertes et informations</summary>${form(this._config, [{ name: "notification_scope", selector: { select: { options: [{ value: "plan", label: "Pièces du plan" }, { value: "home", label: "Toutes les zones de la maison" }] } } }, { name: "notification_excluded_areas", selector: { area: { multiple: true } } }, { name: "notification_excluded_entities", selector: { entity: { multiple: true } } }, { name: "notification_opening_entities", selector: { entity: { multiple: true, filter: { domain: "binary_sensor" } } } }], { notification_scope: "Périmètre du résumé", notification_excluded_areas: "Zones à exclure du résumé", notification_excluded_entities: "Équipements à exclure du résumé", notification_opening_entities: "Contacts physiques supplémentaires" }, (value) => this._change(value))}
      ${this._config.notification_rules.map((rule) => {
      const source = this.hass?.states[rule.state_entity || rule.entity], options = [...new Set([...source?.attributes?.options || [], ...rule.states || [], source?.state, "on", "off", "finished", "replace", "empty", "low"].filter(Boolean))], mode = rule.below !== void 0 ? "below" : rule.above !== void 0 ? "above" : "states";
      return b2`<details><summary>${rule.label || this.hass?.states[rule.entity]?.attributes.friendly_name || rule.entity}</summary>${form(rule, [{ name: "entity", selector: { entity: {} } }, { name: "state_entity", selector: { entity: {} } }, { name: "level", selector: { select: { options: [{ value: "priority", label: "Priorité" }, { value: "ready", label: "À récupérer" }, { value: "battery", label: "Piles" }, { value: "maintenance", label: "Entretien" }, { value: "info", label: "Information" }, { value: "ignore", label: "Ne pas signaler" }] } } }, { name: "label", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }], { icon: "Icône (facultative)", entity: "Équipement", state_entity: "Source de l’état (facultative)", level: "Catégorie", label: "Libellé" }, (value) => this._noticeChange(rule.id, value))}<label>Condition<select .value=${mode} @change=${(e6) => {
        const next = { ...rule };
        delete next.states;
        delete next.below;
        delete next.above;
        next[e6.target.value] = e6.target.value === "states" ? ["on"] : e6.target.value === "below" ? 20 : 0;
        this._change({ notification_rules: this._config.notification_rules.map((r4) => r4.id === rule.id ? next : r4) });
      }}><option value="states">État précis</option><option value="below">Valeur inférieure ou égale</option><option value="above">Valeur supérieure ou égale</option></select></label>${form(rule, mode === "states" ? [{ name: "states", selector: { select: { multiple: true, custom_value: true, options } } }] : [{ name: mode, selector: { number: { mode: "box", min: -1e5, max: 1e5, step: 0.1 } } }], { states: "États à signaler", below: "Seuil bas (≤)", above: "Seuil haut (≥)" }, (value) => this._noticeChange(rule.id, value))}${rule.unless ? b2`<p>Une exception d’état est configurée et conservée pour cet équipement.</p>` : A}<button @click=${() => this._change({ notification_rules: this._config.notification_rules.filter((r4) => r4.id !== rule.id) })}>Retirer cette règle</button></details>`;
    })}
      <h3>Ajouter un signalement</h3>${form(draft, [{ name: "entity", selector: { entity: {} } }, { name: "label", selector: { text: {} } }, { name: "level", selector: { select: { options: [{ value: "priority", label: "Priorité" }, { value: "ready", label: "À récupérer" }, { value: "battery", label: "Piles" }, { value: "maintenance", label: "Entretien" }, { value: "info", label: "Information" }] } } }], { entity: "Équipement", label: "Libellé", level: "Catégorie" }, (value) => this._noticeDraft = value)}<button ?disabled=${!validEntity(draft.entity)} @click=${() => {
      const id = "notice-" + Date.now().toString(36);
      this._change({ notification_rules: [...this._config.notification_rules, { ...draft, id, states: ["on"] }] });
      this._noticeDraft = null;
    }}>Ajouter la règle</button><p>Seuls les états en cours sont comptés. Les règles modifient ce résumé, sans créer de notification externe ni commander d’équipement.</p></details>`;
  }
  _allMarkers() {
    const map = new Map((this._baseModel?.markers || []).map((m3) => [m3.id, m3]));
    for (const m3 of this._config.markers) map.set(m3.id, { ...map.get(m3.id), ...m3 });
    const preview = this.renderRoot.querySelector("home-plan-card");
    for (const m3 of preview?._model ? preview._mapMarkers(preview._rooms()) : []) {
      if (m3.generated && !map.has(m3.id)) map.set(m3.id, { id: m3.id, room: m3.room, entity: m3.entity, name: m3.name, point: m3.point, notification_only: true });
    }
    return [...map.values()];
  }
  _allApertures() {
    const map = new Map((this._baseModel?.apertures || []).map((m3) => [m3.id, m3]));
    for (const m3 of this._config.apertures) map.set(m3.id, { ...map.get(m3.id), ...m3 });
    return [...map.values()];
  }
  _markerChange(patch) {
    const merged = this._allMarkers().find((m3) => m3.id === this._marker);
    if (!merged) return;
    this._change({ markers: [...this._config.markers.filter((m3) => m3.id !== this._marker), { ...merged, ...patch }] });
  }
  _apertureChange(id, patch) {
    const merged = this._allApertures().find((m3) => m3.id === id);
    if (!merged) return;
    this._change({ apertures: [...this._config.apertures.filter((m3) => m3.id !== id), { ...merged, ...patch }] });
  }
  _position(e6) {
    e6.stopPropagation();
    const { kind, id, point } = e6.detail;
    if (kind === "marker") {
      this._marker = id;
      this._markerChange({ point });
    } else {
      this._apertureId = id;
      this._apertureChange(id, { control: point });
    }
  }
  _picked(e6) {
    e6.stopPropagation();
    this._room = e6.detail.room;
    if (e6.detail.kind === "marker") {
      this._marker = e6.detail.id;
      this._apertureId = "";
    } else {
      this._apertureId = e6.detail.id;
      this._marker = "";
    }
  }
  _newMarker(entity) {
    const r4 = this._config.rooms.find((r5) => r5.id === this._room), base = this._baseModel?.rooms?.find((x2) => x2.id === this._room), id = "marker-" + (globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + "-" + Math.random().toString(36).slice(2)), point = copy(r4?.label || base?.label || [0, 0]);
    this._change({ markers: [...this._config.markers, { id, room: this._room, name: entity ? this.hass?.states[entity]?.attributes.friendly_name || entity : "Équipement", point, ...entity ? { entity } : {} }] });
    this._marker = id;
    this._apertureId = "";
  }
  _placeLights() {
    const preview = this.renderRoot.querySelector("home-plan-card"), r4 = preview?._rooms().find((r5) => r5.id === this._room);
    if (!r4) return;
    const existing = new Set(this._allMarkers().map((m3) => m3.entity)), ids = preview._lights(r4).filter((id) => !existing.has(id));
    const markers = ids.map((entity, i7) => ({ id: "light-" + entity.replaceAll(".", "-"), room: r4.id, entity, name: preview._name(entity), point: [(r4.label?.[0] || r4.x + r4.w / 2) + (i7 - (ids.length - 1) / 2) * 35, (r4.label?.[1] || r4.y + r4.h / 2) - 40] }));
    this._change({ markers: [...this._config.markers, ...markers] });
    if (markers.length) this._marker = markers[0].id;
  }
  render() {
    if (!this._formReady) return b2`<p>${this._formError || "Chargement de l’éditeur natif…"}</p>`;
    const r4 = this._config.rooms.find((r5) => r5.id === this._room), m3 = this._allMarkers().find((m4) => m4.id === this._marker), a3 = this._allApertures().find((a4) => a4.id === this._apertureId), cover = this._coverEdit || a3?.cover_entity, policy = this._config.cover_options.find((p4) => p4.entity === cover) || { entity: cover, kind: "shutter", max_position: 100 };
    const form = (data, schema, labels, change) => b2`<ha-form .hass=${this.hass} .data=${data} .schema=${schema} .computeLabel=${(s5) => labels[s5.name] || s5.name} @value-changed=${(e6) => {
      e6.stopPropagation();
      change(e6.detail.value);
    }}></ha-form>`;
    return b2`<div class="fields">
      ${planLevels(this._rootConfig || this._config).length > 1 ? b2`<label>Niveau<select data-editor-level .value=${this._level} @change=${(e6) => this._switchLevel(e6.target.value)}>${planLevels(this._rootConfig).map((l3) => b2`<option value=${l3.id}>${l3.name}</option>`)}</select></label>` : A}
      <label>Pièce<select .value=${this._room} @change=${(e6) => {
      this._room = e6.target.value;
      this._marker = "";
      this._apertureId = "";
    }}><option value="">Choisir une pièce</option>${this._config.rooms.map((r5) => b2`<option value=${r5.id}>${r5.name || r5.id}</option>`)}</select></label>
      <home-plan-card .editorConfig=${this._config} .hass=${this.hass} .editMode=${true} @plan-model-loaded=${(e6) => {
      e6.stopPropagation();
      this._baseModel = e6.detail.model;
    }} @plan-item-selected=${this._picked} @plan-position-changed=${this._position}></home-plan-card>
      ${r4 ? b2`<div class="row"><button @click=${() => this._newMarker()}>Ajouter un repère</button><button @click=${this._placeLights}>Placer les lumières</button></div>
        <label>Repère<select .value=${this._marker} @change=${(e6) => {
      this._marker = e6.target.value;
      this._apertureId = "";
    }}><option value="">Choisir sur le plan</option>${this._allMarkers().filter((m4) => m4.room === r4.id).map((m4) => b2`<option value=${m4.id}>${m4.name || m4.entity || m4.id}</option>`)}</select></label>
        ${m3 ? b2`${form(m3, [{ name: "name", selector: { text: {} } }, { name: "entity", selector: { entity: {} } }, { name: "icon", selector: { icon: {} } }, { name: "notification_only", selector: { boolean: {} } }], { name: "Libellé", entity: "Équipement", icon: "Icône personnalisée (facultative)", notification_only: "Afficher seulement si un signalement est actif" }, (value) => this._markerChange(value))}<div class="row"><label>Position X<input type="number" .value=${String(m3.point?.[0] ?? 0)} @change=${(e6) => this._markerChange({ point: [Number(e6.target.value), m3.point?.[1] || 0] })}></label><label>Position Y<input type="number" .value=${String(m3.point?.[1] ?? 0)} @change=${(e6) => this._markerChange({ point: [m3.point?.[0] || 0, Number(e6.target.value)] })}></label></div><button @click=${() => {
      this._change({ markers: this._config.markers.filter((x2) => x2.id !== m3.id), ...this._baseModel?.markers?.some((x2) => x2.id === m3.id) ? { markers: [...this._config.markers.filter((x2) => x2.id !== m3.id), { ...m3, entity: null }] } : {} });
      this._marker = "";
    }}>Retirer ce repère</button>` : A}
        <details><summary>Équipements et zone de la pièce</summary>${form(r4, [{ name: "name", selector: { text: {} } }, { name: "area_id", selector: { area: {} } }, { name: "auto_area", selector: { boolean: {} } }, { name: "entities", selector: { entity: { multiple: true } } }, { name: "favorite_entities", selector: { entity: { multiple: true } } }, { name: "excluded_entities", selector: { entity: { multiple: true } } }, { name: "temperature_entity", selector: { entity: { filter: { domain: ["sensor", "climate"] } } } }, { name: "temperature_attribute", selector: { select: { options: [{ value: "", label: "État du capteur" }, { value: "current_temperature", label: "Température ambiante du chauffage" }] } } }, { name: "climate_entities", selector: { entity: { multiple: true, filter: { domain: "climate" } } } }, { name: "light_entity", selector: { entity: { filter: { domain: "light" } } } }], { name: "Nom de la pièce", area_id: "Zone Home Assistant", auto_area: "Suivre les équipements de cette zone", entities: "Équipements ajoutés à cette pièce", favorite_entities: "Accès rapides dans la fiche", excluded_entities: "Équipements automatiques à masquer", temperature_entity: "Température ambiante (facultative)", temperature_attribute: "Valeur à afficher", climate_entities: "Thermostats ajoutés (facultatif)", light_entity: "Éclairage principal" }, (value) => this._roomChange(value))}<p>La température ambiante est explicitement choisie. Les mesures du four, du réfrigérateur et autres appareils restent dans leurs fiches.</p></details>
        <details ?open=${!!a3}><summary>Fenêtres et portes</summary><label>Ouverture<select .value=${this._apertureId || ""} @change=${(e6) => {
      this._apertureId = e6.target.value;
      this._marker = "";
    }}><option value="">Choisir une ouverture</option>${this._allApertures().filter((a4) => a4.room === r4.id).map((a4) => b2`<option value=${a4.id}>${a4.name || a4.id}</option>`)}</select></label>${a3 ? b2`${form(a3, [{ name: "opening_entity", selector: { entity: { filter: { domain: "binary_sensor" } } } }, { name: "cover_entity", selector: { entity: { filter: { domain: "cover" } } } }, { name: "command_entity", selector: { entity: { filter: { domain: "switch" } } } }], { opening_entity: "Contact physique", cover_entity: "Volet associé", command_entity: "Commande motorisée" }, (value) => this._apertureChange(a3.id, value))}<div class="row">${[0, 1].map((i7) => b2`<label>${i7 ? "Position Y" : "Position X"}<input type="number" .value=${String(a3.control?.[i7] ?? 0)} @change=${(e6) => {
      const p4 = copy(a3.control || [0, 0]);
      p4[i7] = Number(e6.target.value);
      this._apertureChange(a3.id, { control: p4 });
    }}></label>`)}</div>` : A}</details>
        <details><summary>Course et type d’un volet / écran</summary>${form({ entity: cover }, [{ name: "entity", selector: { entity: { filter: { domain: "cover" } } } }], { entity: "Volet ou écran" }, (value) => this._coverEdit = value.entity)}${cover ? form(policy, [{ name: "kind", selector: { select: { options: [{ value: "shutter", label: "Volet" }, { value: "screen", label: "Écran de projection" }] } } }, { name: "max_position", selector: { number: { min: 1, max: 100, mode: "box", unit_of_measurement: "%" } } }, { name: "invert_position", selector: { boolean: {} } }], { kind: "Type", max_position: "Course maximale depuis cette carte", invert_position: "Inverser le sens de la position" }, (value) => this._change({ cover_options: [...this._config.cover_options.filter((p4) => p4.entity !== cover), { ...policy, ...value }] })) : A}<p>Les écrans sont exclus des commandes de volets groupées. La limite s’applique aux commandes de cette carte.</p></details>
      ` : A}
      ${this._noticeEditor(form)}
      <details><summary>Groupes de volets par niveau</summary>${this._config.cover_groups.map((g2) => b2`${form(g2, [{ name: "name", selector: { text: {} } }, { name: "entities", selector: { entity: { multiple: true, filter: { domain: "cover" } } } }], { name: "Nom du niveau", entities: "Volets ou groupes de ce niveau" }, (value) => this._change({ cover_groups: this._config.cover_groups.map((x2) => x2.id === g2.id ? { ...x2, ...value } : x2) }))}<button @click=${() => this._change({ cover_groups: this._config.cover_groups.filter((x2) => x2.id !== g2.id) })}>Retirer ce niveau</button>`)}<button @click=${() => this._change({ cover_groups: [...this._config.cover_groups, { id: "level-" + Date.now().toString(36), name: "Autre niveau", entities: [] }] })}>Ajouter un niveau</button></details>
      <details><summary>Réglages de la carte</summary><label>Nom de la carte<input .value=${this._config.name || "Maison"} @change=${(e6) => this._change({ name: e6.target.value })}></label><label>Fichier du plan<input .value=${this._config.model_url || ""} placeholder="/local/maison/plan.json" @change=${(e6) => this._change({ model_url: e6.target.value })}></label></details>
      <p>Enregistrer la carte pour conserver les positions. Les associations ci-dessus concernent cette carte ; elles ne déplacent pas les appareils dans les zones HA.</p><a href=${this._config.documentation_url || "https://github.com/smornierHA/ha-board"} target="_blank" rel="noopener noreferrer">Documentation du plan</a>
    </div>`;
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
  known2 as known,
  levelConfig,
  planLevels,
  sanitizeArtwork,
  validEntity,
  validateConfig
};
