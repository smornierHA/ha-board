import fs from 'node:fs';
import vm from 'node:vm';
const registered = new Map();
class HTMLElement { attachShadow(){ this.shadowRoot = {}; } }
const window = { customCards: [] };
const context = vm.createContext({HTMLElement, window, customElements:{get:n=>registered.get(n),define:(n,c)=>registered.set(n,c)}, console});
vm.runInContext(fs.readFileSync('dist/ha-board.js','utf8'), context, {filename:'ha-board.js'});
for (const name of ['person-history-map-card-v14','person-rich-card-v34']) if (!registered.has(name)) throw new Error(`missing ${name}`);
if (window.customCards.length !== 2) throw new Error(`expected 2 cards, got ${window.customCards.length}`);
console.log('HACS bundle registers both cards exactly once.');
