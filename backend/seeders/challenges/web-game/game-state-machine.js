export default {
  slug: "game-state-machine",
  trackId: "web-game",
  layerId: "web-game-4",
  type: "CODE",
  difficulty: "easy",
  title: "A finite state machine for game screens",
  summary:
    "Model menu / playing / paused / game-over as a state machine that rejects invalid transitions.",
  description:
    "\"Just use a string variable for the current screen\" works until someone triggers 'resume' from the main menu and the game crashes trying to unpause nothing. A real state machine makes invalid transitions impossible, not just unlikely.",
  task:
    "Write <code>createStateMachine(initial, transitions)</code>. <code>transitions</code> maps each state to the list of events valid from it, e.g. <code>{ menu: { start: 'playing' }, playing: { pause: 'paused', win: 'gameover', lose: 'gameover' }, paused: { resume: 'playing', quit: 'menu' }, gameover: { restart: 'menu' } }</code>. Return an object with <code>getState()</code>, <code>can(event)</code> (true/false, without changing state), and <code>send(event)</code> — which transitions to the new state and returns it if the event is valid from the current state, or throws if it isn't.",
  constraints: [
    "send() with an event not valid from the current state must throw, and must NOT change the current state.",
    "can() must never itself change state, regardless of the result.",
    "The state machine only needs to track one current state at a time — no history/back-stack required.",
  ],
  example: `const game = createStateMachine('menu', {
  menu: { start: 'playing' },
  playing: { pause: 'paused', win: 'gameover', lose: 'gameover' },
  paused: { resume: 'playing', quit: 'menu' },
  gameover: { restart: 'menu' },
});
game.send('start');   // 'playing'
game.can('resume');   // false — resume isn't valid from 'playing'
game.send('resume');  // throws`,
  tags: ["state-machines", "game-architecture"],
  estimatedMins: 20,
  xp: 35,
  starterFiles: [
    {
      name: "createStateMachine.js",
      lang: "js",
      code: `// createStateMachine.js
function createStateMachine(initial, transitions) {
  // your code here
}

module.exports = createStateMachine;`,
    },
  ],
  testFile: {
    name: "createStateMachine_test.js",
    lang: "test",
    code: `// createStateMachine_test.js
const createStateMachine = require('./createStateMachine');

test('starts_in_the_initial_state', () => {
  const sm = createStateMachine('menu', { menu: { start: 'playing' } });
  expect(sm.getState()).toBe('menu');
});`,
  },
  hints: [
    {
      order: 1,
      cost: 0,
      text: "Keep <code>current</code> as a closure variable. <code>getState()</code> just returns it — the whole machine is really about controlling the one place that's allowed to reassign it.",
    },
    {
      order: 2,
      cost: 5,
      text: "<code>can(event)</code> is just: does <code>transitions[current]</code> have an <code>event</code> key? Look it up without ever touching <code>current</code>.",
    },
    {
      order: 3,
      cost: 10,
      text: "<code>send(event)</code> reuses the same lookup as <code>can</code> — if it finds a valid next state, reassign <code>current</code> to it and return it; if not, throw before touching <code>current</code> at all.",
    },
  ],
  hiddenTests: [
    {
      name: "starts_in_initial_state",
      code: `const sm = createStateMachine('menu', { menu: { start: 'playing' }, playing: {} });
assert(sm.getState() === 'menu', 'expected initial state "menu", got ' + sm.getState());`,
    },
    {
      name: "valid_transition_changes_state",
      code: `const sm = createStateMachine('menu', { menu: { start: 'playing' }, playing: {} });
const result = sm.send('start');
assert(result === 'playing', 'send() should return the new state');
assert(sm.getState() === 'playing', 'getState() should reflect the transition, got ' + sm.getState());`,
    },
    {
      name: "invalid_transition_throws_and_does_not_change_state",
      code: `const sm = createStateMachine('menu', { menu: { start: 'playing' }, playing: { pause: 'paused' }, paused: {} });
let threw = false;
try { sm.send('resume'); } catch (e) { threw = true; }
assert(threw === true, 'sending an event not valid from the current state must throw');
assert(sm.getState() === 'menu', 'the state must be unchanged after a rejected transition, got ' + sm.getState());`,
    },
    {
      name: "can_reports_validity_without_changing_state",
      code: `const sm = createStateMachine('menu', { menu: { start: 'playing' }, playing: {} });
assert(sm.can('start') === true, 'start should be valid from menu');
assert(sm.can('pause') === false, 'pause should not be valid from menu');
assert(sm.getState() === 'menu', 'calling can() must never change the current state, got ' + sm.getState());`,
    },
    {
      name: "full_game_flow_matches_transition_table",
      code: `const game = createStateMachine('menu', {
  menu: { start: 'playing' },
  playing: { pause: 'paused', win: 'gameover', lose: 'gameover' },
  paused: { resume: 'playing', quit: 'menu' },
  gameover: { restart: 'menu' },
});
game.send('start');
game.send('pause');
assert(game.getState() === 'paused', 'expected paused after start+pause');
assert(game.can('resume') === true, 'resume should be valid from paused');
game.send('resume');
game.send('win');
assert(game.getState() === 'gameover', 'expected gameover after win');
game.send('restart');
assert(game.getState() === 'menu', 'expected back to menu after restart');`,
    },
  ],
  solution: {
    code: `function createStateMachine(initial, transitions) {
  let current = initial;

  function can(event) {
    const stateTransitions = transitions[current] || {};
    return Object.prototype.hasOwnProperty.call(stateTransitions, event);
  }

  function send(event) {
    if (!can(event)) {
      throw new Error('Invalid transition: "' + event + '" is not valid from state "' + current + '"');
    }
    current = transitions[current][event];
    return current;
  }

  return {
    getState: () => current,
    can,
    send,
  };
}

module.exports = createStateMachine;`,
    explanation:
      "Everything routes through one closure variable, current, and only send() is allowed to reassign it — that single point of control is what makes invalid states unreachable rather than just discouraged. can() and send() share the same lookup logic (does the transition table for the current state have this event as a key), which guarantees they can never disagree — send() literally calls can() first and throws before ever touching current if it returns false, so a rejected transition leaves the state exactly as it was. Because the transition table is data rather than a chain of if-statements, adding a new screen or a new valid transition is a one-line change to the table passed in, not a new branch in the state machine's own code.",
  },
};
