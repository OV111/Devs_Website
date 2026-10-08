export default {
  slug: "create-menu-stack",
  trackId: "web-game",
  layerId: "web-game-4",
  type: "CODE",
  difficulty: "med",
  title: "UI menu stack (pause, options, confirm)",
  summary: "A stack of game menus where only the top one gets input, lower ones are notified when covered, and pause state follows the stack.",
  description:
    "Main menu, then Options, then 'Are you sure?': menus open on top of each other and 'back' returns to the previous one. Games model this as a stack. Only the top menu receives input and updates, a menu that gets covered must stop reacting (and resume when revealed), and the game stays paused as long as any pausing menu is open.",
  task:
    "Write <code>createMenuStack()</code> returning <code>{ push, pop, replace, clear, handleInput, update, top, depth, visible, isPaused }</code>. A menu is an object <code>{ id, transparent = false, pausesGame = false, closeOnBack = true, onEnter, onExit, onCover, onUncover, handle(action), update(dt) }</code>; all hooks are optional.",
  constraints: [
    "<code>push(menu)</code>: call <code>onCover()</code> on the current top (if any), add the menu, then call its <code>onEnter()</code>. Pushing a menu object that is already on the stack throws an <code>Error</code>.",
    "<code>pop()</code>: remove the top (calling its <code>onExit()</code>), then call <code>onUncover()</code> on the menu that is now on top. Returns the removed menu, or <code>undefined</code> when empty. <code>replace(menu)</code>: pop the top (<code>onExit</code> only, no <code>onUncover</code> for the menu below), then push the new one (<code>onEnter</code> only, no <code>onCover</code>); on an empty stack it behaves like <code>push</code>. <code>clear()</code> exits every menu from the top down (<code>onExit</code> only, no cover/uncover calls) and returns how many were removed.",
    "<code>handleInput(action)</code> sends the action to the TOP menu's <code>handle</code> only; a menu consumes it by returning exactly <code>true</code>. If it was not consumed and <code>action === 'back'</code> and the top's <code>closeOnBack</code> is not <code>false</code>, pop it. Returns whether the input was consumed or caused a pop. An empty stack returns <code>false</code>.",
    "<code>update(dt)</code> calls <code>update(dt)</code> on the top menu only. <code>top()</code> returns the top menu or <code>null</code>; <code>depth()</code> the stack size.",
    "<code>visible()</code> returns the menus to draw, bottom to top: start at the highest menu that is NOT <code>transparent</code> (everything below it is hidden) and include everything above it; if every menu is transparent, return the whole stack. <code>isPaused()</code> is true when ANY menu on the stack has <code>pausesGame: true</code>.",
  ],
  example: `menus.push(pauseMenu); menus.push(confirmQuit); menus.handleInput('back') // closes the confirm, pause menu is uncovered`,
  tags: ["ui", "menus", "stack", "game-state"],
  estimatedMins: 35,
  xp: 55,
  starterFiles: [
    {
      name: "createMenuStack.js",
      lang: "js",
      code: `// createMenuStack.js
function createMenuStack() {
  // your code here
}

module.exports = createMenuStack;`,
    },
  ],
  testFile: {
    name: "createMenuStack_test.js",
    lang: "test",
    code: `const createMenuStack = require('./createMenuStack');

test('back pops an unhandled menu', () => {
  const s = createMenuStack();
  s.push({ id: 'main' });
  s.push({ id: 'options' });
  expect(s.handleInput('back')).toBe(true);
  expect(s.top().id).toBe('main');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "An array is the stack. A helper <code>call(menu, hook, ...args)</code> that checks <code>typeof menu[hook] === 'function'</code> removes most of the noise." },
    { order: 2, cost: 5, text: "<code>pop</code> and <code>replace</code> differ only in whether the revealed menu gets <code>onUncover</code>: write one internal <code>removeTop()</code> and let each public method decide what else to call." },
    { order: 3, cost: 15, text: "<code>visible()</code>: scan from the top downward for the first non-transparent menu; slice from there. If none, slice from 0." },
  ],
  hiddenTests: [
    { name: "push_covers_the_previous_top_then_enters", code: `const log = [];
const mk = (id) => ({ id, onEnter() { log.push(id + ':enter'); }, onCover() { log.push(id + ':cover'); }, onExit() { log.push(id + ':exit'); }, onUncover() { log.push(id + ':uncover'); } });
const s = createMenuStack();
s.push(mk('a')); s.push(mk('b'));
assert(log.join(',') === 'a:enter,a:cover,b:enter', 'got ' + log);
assert(s.depth() === 2 && s.top().id === 'b', 'depth and top');` },
    { name: "pop_exits_then_uncovers_the_one_below", code: `const log = [];
const mk = (id) => ({ id, onExit() { log.push(id + ':exit'); }, onUncover() { log.push(id + ':uncover'); } });
const s = createMenuStack();
s.push(mk('a')); s.push(mk('b'));
const popped = s.pop();
assert(popped.id === 'b' && log.join(',') === 'b:exit,a:uncover', 'got ' + log);
assert(s.pop().id === 'a' && log.join(',') === 'b:exit,a:uncover,a:exit', 'last one has nobody to uncover: ' + log);
assert(s.pop() === undefined && s.top() === null && s.depth() === 0, 'empty stack');` },
    { name: "replace_swaps_without_cover_or_uncover", code: `const log = [];
const mk = (id) => ({ id, onEnter() { log.push(id + ':enter'); }, onExit() { log.push(id + ':exit'); }, onCover() { log.push(id + ':cover'); }, onUncover() { log.push(id + ':uncover'); } });
const s = createMenuStack();
s.push(mk('base')); s.push(mk('a'));
log.length = 0;
s.replace(mk('b'));
assert(log.join(',') === 'a:exit,b:enter', 'got ' + log);
assert(s.depth() === 2 && s.top().id === 'b', 'same depth');
const t = createMenuStack();
t.replace(mk('only'));
assert(t.depth() === 1 && t.top().id === 'only', 'replace on empty acts like push');` },
    { name: "clear_exits_from_the_top_without_uncovering", code: `const log = [];
const mk = (id) => ({ id, onExit() { log.push(id + ':exit'); }, onUncover() { log.push(id + ':uncover'); } });
const s = createMenuStack();
s.push(mk('a')); s.push(mk('b')); s.push(mk('c'));
assert(s.clear() === 3, 'count');
assert(log.join(',') === 'c:exit,b:exit,a:exit', 'got ' + log);
assert(s.depth() === 0 && s.clear() === 0, 'empty afterwards');` },
    { name: "pushing_the_same_menu_twice_throws", code: `const s = createMenuStack();
const m = { id: 'm' };
s.push(m);
let err = null;
try { s.push(m); } catch (e) { err = e; }
assert(err instanceof Error && s.depth() === 1, 'rejected');` },
    { name: "input_goes_to_the_top_menu_only", code: `const got = [];
const s = createMenuStack();
s.push({ id: 'a', handle(x) { got.push('a:' + x); return true; } });
s.push({ id: 'b', handle(x) { got.push('b:' + x); return true; } });
assert(s.handleInput('confirm') === true, 'consumed');
assert(got.join(',') === 'b:confirm', 'the covered menu never sees it: ' + got);
assert(createMenuStack().handleInput('x') === false, 'empty stack');` },
    { name: "unhandled_back_pops_unless_the_menu_opts_out", code: `const log = [];
const s = createMenuStack();
s.push({ id: 'main', onUncover() { log.push('main:uncover'); } });
s.push({ id: 'options', handle() { return false; }, onExit() { log.push('options:exit'); } });
assert(s.handleInput('back') === true, 'popped counts as handled');
assert(s.top().id === 'main' && log.join(',') === 'options:exit,main:uncover', 'got ' + log);
s.push({ id: 'dialog', closeOnBack: false });
assert(s.handleInput('back') === false && s.top().id === 'dialog', 'closeOnBack false keeps it open');
assert(s.handleInput('left') === false, 'other unhandled actions do nothing');` },
    { name: "a_menu_that_consumes_back_is_not_popped", code: `const s = createMenuStack();
s.push({ id: 'a' });
s.push({ id: 'b', handle(x) { return x === 'back'; } });
assert(s.handleInput('back') === true && s.top().id === 'b', 'handled by the menu itself');
const t = createMenuStack();
t.push({ id: 'x', handle() { return 'yes'; } });
assert(t.handleInput('back') === true && t.depth() === 0, 'only exactly true counts as consumed: it was popped instead');` },
    { name: "update_reaches_the_top_menu_only", code: `const log = [];
const s = createMenuStack();
s.push({ id: 'a', update(dt) { log.push('a' + dt); } });
s.update(16);
s.push({ id: 'b', update(dt) { log.push('b' + dt); } });
s.update(32);
assert(log.join(',') === 'a16,b32', 'got ' + log);` },
    { name: "visible_menus_stop_at_the_highest_opaque_one", code: `const s = createMenuStack();
s.push({ id: 'main' });
s.push({ id: 'options' });
s.push({ id: 'tooltip', transparent: true });
s.push({ id: 'toast', transparent: true });
assert(s.visible().map((m) => m.id).join(',') === 'options,tooltip,toast', 'got ' + s.visible().map((m) => m.id));
const t = createMenuStack();
t.push({ id: 'a', transparent: true }); t.push({ id: 'b', transparent: true });
assert(t.visible().map((m) => m.id).join(',') === 'a,b', 'all transparent shows everything');
assert(createMenuStack().visible().length === 0, 'empty');` },
    { name: "paused_while_any_pausing_menu_is_open", code: `const s = createMenuStack();
assert(s.isPaused() === false, 'empty');
s.push({ id: 'hud-popup' });
assert(s.isPaused() === false, 'non-pausing menu');
s.push({ id: 'pause', pausesGame: true });
s.push({ id: 'confirm' });
assert(s.isPaused() === true, 'pausing menu below a non-pausing one still pauses');
s.pop(); s.pop();
assert(s.isPaused() === false, 'unpaused once it is closed');` },
  ],
  solution: {
    code: `function createMenuStack() {
  const stack = [];
  const call = (menu, hook, ...args) => {
    if (menu && typeof menu[hook] === 'function') return menu[hook](...args);
    return undefined;
  };
  const topMenu = () => (stack.length ? stack[stack.length - 1] : null);

  const api = {
    push(menu) {
      if (stack.includes(menu)) throw new Error('Menu is already on the stack');
      call(topMenu(), 'onCover');
      stack.push(menu);
      call(menu, 'onEnter');
    },
    pop() {
      if (!stack.length) return undefined;
      const removed = stack.pop();
      call(removed, 'onExit');
      call(topMenu(), 'onUncover');
      return removed;
    },
    replace(menu) {
      if (stack.length) call(stack.pop(), 'onExit');
      stack.push(menu);
      call(menu, 'onEnter');
    },
    clear() {
      let count = 0;
      while (stack.length) {
        call(stack.pop(), 'onExit');
        count++;
      }
      return count;
    },
    handleInput(action) {
      const menu = topMenu();
      if (!menu) return false;
      if (call(menu, 'handle', action) === true) return true;
      if (action === 'back' && menu.closeOnBack !== false) {
        api.pop();
        return true;
      }
      return false;
    },
    update(dt) {
      call(topMenu(), 'update', dt);
    },
    top: topMenu,
    depth: () => stack.length,
    visible() {
      let start = 0;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (!stack[i].transparent) {
          start = i;
          break;
        }
      }
      return stack.slice(start);
    },
    isPaused: () => stack.some((m) => m.pausesGame === true),
  };
  return api;
}

module.exports = createMenuStack;`,
    explanation:
      "A stack gives 'back' its natural meaning, and the cover/uncover hooks are what let a covered menu stop animating or listening while something sits on top of it. pop and replace differ in exactly one call (onUncover), so replace is for transitions at the same level (settings tab to another tab) where the menu underneath shouldn't wake up. visible() walks downward and stops at the first opaque menu, the same early exit renderers use to skip drawing hidden layers.",
  },
};
