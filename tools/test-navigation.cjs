const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const entries = [null];
let position = 0;
let popstate;
let context;
let elements;
let cards;
function element() {
    return {
        hidden: false, children: [], textContent: '', focused: false,
        append(...children) { this.children.push(...children); },
        replaceChildren() { this.children = []; },
        focus() { this.focused = true; },
        addEventListener() {}
    };
}
const history = {
    get state() { return entries[position]; },
    pushState(state) { entries.splice(position + 1); entries.push(state); position++; },
    replaceState(state) { entries[position] = state; },
    back() { if (position > 0) { position--; popstate({state: this.state}); } },
    forward() { if (position + 1 < entries.length) { position++; popstate({state: this.state}); } }
};
function loadPage() {
    elements = Object.fromEntries(['main-view', 'detail-view', 'detail-title', 'problem-content', 'download-area'].map(id => [id, element()]));
    elements['detail-view'].hidden = true;
    cards = Array.from({length: 7}, () => element());
    context = vm.createContext({
        window: {history, scrollTo() {}, addEventListener(name, handler) { if (name === 'popstate') popstate = handler; }},
        document: {
            getElementById: id => elements[id],
            querySelector: selector => cards[Number(selector.match(/"(\d+)"/)[1]) - 1],
            querySelectorAll: () => cards,
            createElement: element
        }
    });
    vm.runInContext(script, context);
}
function expectMain() {
    assert.equal(elements['main-view'].hidden, false);
    assert.equal(elements['detail-view'].hidden, true);
}
function expectDetail(id) {
    assert.equal(elements['main-view'].hidden, true);
    assert.equal(elements['detail-view'].hidden, false);
    assert.equal(history.state.physics2Chapter, id);
    assert.equal(elements['download-area'].children.length, 1);
}
loadPage();
expectMain();
assert.equal(entries.length, 1, 'Loading the list must not add a history entry');
for (let id = 1; id <= 7; id++) {
    context.showDetail(String(id));
    expectDetail(id);
    assert.equal(position, 1);
    context.showDetail(id);
    assert.equal(position, 1, 'Repeated rendering must not add entries');
    history.back();
    expectMain();
    assert.equal(cards[id - 1].focused, true);
    history.forward();
    expectDetail(id);
    loadPage();
    expectDetail(id);
    context.showMain();
    expectMain();
    assert.equal(position, 0);
    assert.equal(entries.length, 2, 'In-page Back must reuse browser history');
}
context.showDetail(999);
expectMain();
assert.equal(position, 0);
entries.splice(1, entries.length - 1, {unrelated: true});
history.forward();
expectMain();
console.log('PASS: all 7 chapters, browser Back/Forward, in-page Back, reload, focus, duplicate/invalid navigation');
