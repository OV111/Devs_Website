export default {
  slug: "create-emitter",
  trackId: "web-game",
  layerId: "web-game-3",
  type: "CODE",
  difficulty: "med",
  title: "Particle emitter",
  summary: "A deterministic particle system: fractional spawn rate, random speed/angle/lifespan from an injected RNG, gravity and expiry.",
  description:
    "Explosions, sparks, smoke and rain are particle emitters: spawn small short-lived objects with random velocities, push them with gravity every frame, remove them when they die. Using a seeded random source (instead of <code>Math.random</code>) makes the effect reproducible, which also makes it testable.",
  task:
    "Write <code>createEmitter(config)</code> where <code>config</code> is <code>{ x = 0, y = 0, rate, lifespan, speed, angle, gravity = { x: 0, y: 0 }, maxParticles = Infinity, rng }</code>. Return <code>{ update, burst, setPosition, getParticles }</code>.",
  constraints: [
    "<code>lifespan</code> (ms), <code>speed</code> (pixels per second) and <code>angle</code> (degrees) are each either a number or <code>{ min, max }</code>. A new particle draws, IN THIS ORDER, three numbers from <code>rng()</code> (each in [0, 1)): lifespan, speed, angle. A range value is <code>min + r * (max - min)</code>; a plain number still consumes its draw.",
    "A particle is <code>{ x, y, vx, vy, age, life, progress }</code>: starts at the emitter position with <code>vx = cos(angle) * speed</code>, <code>vy = sin(angle) * speed</code>, <code>age 0</code>. <code>progress = age / life</code>.",
    "<code>update(dt)</code> (dt in ms) FIRST moves the existing particles: <code>age += dt</code>, then in seconds <code>vx += gravity.x * s</code>, <code>vy += gravity.y * s</code>, <code>x += vx * s</code>, <code>y += vy * s</code> (velocity updated before position); particles with <code>age &gt;= life</code> are removed. THEN it spawns new particles: it adds <code>rate * dt / 1000</code> to a fractional accumulator and spawns <code>floor</code> of it, keeping the remainder. New particles are not moved until the next update.",
    "<code>burst(n)</code> spawns up to <code>n</code> particles immediately. Total live particles never exceed <code>maxParticles</code>; when the cap stops spawning, the particles that did not fit are simply dropped (only the fractional remainder is carried over, so there is no catch-up burst later). <code>setPosition(x, y)</code> only affects particles spawned afterwards. <code>getParticles()</code> returns the live particle objects.",
  ],
  example: `const fx = createEmitter({ x: 100, y: 100, rate: 20, lifespan: 800, speed: { min: 50, max: 150 }, angle: { min: 0, max: 360 }, gravity: { x: 0, y: 200 }, rng: Math.random });`,
  tags: ["particles", "effects", "random", "simulation"],
  estimatedMins: 40,
  xp: 65,
  starterFiles: [
    {
      name: "createEmitter.js",
      lang: "js",
      code: `// createEmitter.js
function createEmitter(config) {
  // your code here
}

module.exports = createEmitter;`,
    },
  ],
  testFile: {
    name: "createEmitter_test.js",
    lang: "test",
    code: `const createEmitter = require('./createEmitter');

test('spawns at the configured rate', () => {
  const e = createEmitter({ rate: 10, lifespan: 1000, speed: 0, angle: 0, rng: () => 0 });
  e.update(100);
  expect(e.getParticles().length).toBe(1);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write a <code>draw(value)</code> helper: <code>const r = rng(); return typeof value === 'number' ? value : value.min + r * (value.max - value.min);</code> (always call <code>rng()</code>, even for numbers)." },
    { order: 2, cost: 5, text: "<code>spawn()</code> calls draw for lifespan, then speed, then angle, converts the angle with <code>angle * Math.PI / 180</code>, and pushes the particle." },
    { order: 3, cost: 15, text: "In <code>update</code>, mutate the existing particles first, filter out the dead, THEN run the spawn loop; that is what keeps new particles at age 0." },
  ],
  hiddenTests: [
    { name: "spawns_at_the_configured_rate_with_a_fractional_accumulator", code: `const e = createEmitter({ rate: 10, lifespan: 1000, speed: 0, angle: 0, rng: () => 0 });
e.update(50);
assert(e.getParticles().length === 0, 'half a particle is not spawned yet');
e.update(50);
assert(e.getParticles().length === 1, 'the halves add up');
e.update(250);
assert(e.getParticles().length === 3, 'floor(2.5) more (0.5 carried over), got ' + e.getParticles().length);
e.update(50);
assert(e.getParticles().length === 4, 'carry-over produced one more: ' + e.getParticles().length);` },
    { name: "new_particles_start_at_the_emitter_with_age_zero", code: `const e = createEmitter({ x: 40, y: 60, rate: 10, lifespan: 1000, speed: 100, angle: 0, rng: () => 0 });
e.update(100);
const p = e.getParticles()[0];
assert(p.x === 40 && p.y === 60 && p.age === 0 && p.life === 1000 && p.progress === 0, 'got ' + JSON.stringify(p));
assert(Math.abs(p.vx - 100) < 1e-9 && Math.abs(p.vy) < 1e-9, 'velocity from speed and angle: ' + JSON.stringify(p));` },
    { name: "angle_is_in_degrees_and_y_points_down", code: `const mk = (angle) => { const e = createEmitter({ rate: 1000, lifespan: 1000, speed: 10, angle, rng: () => 0 }); e.burst(1); return e.getParticles()[0]; };
const down = mk(90);
assert(Math.abs(down.vx) < 1e-9 && Math.abs(down.vy - 10) < 1e-9, '90deg: ' + JSON.stringify(down));
const left = mk(180);
assert(Math.abs(left.vx + 10) < 1e-9 && Math.abs(left.vy) < 1e-9, '180deg: ' + JSON.stringify(left));` },
    { name: "rng_draws_happen_in_a_fixed_order_and_ranges_interpolate", code: `const draws = [0.5, 0.25, 0.75];
let i = 0;
const e = createEmitter({ rate: 1000, lifespan: { min: 100, max: 300 }, speed: { min: 0, max: 100 }, angle: { min: 0, max: 360 }, rng: () => draws[i++ % 3] });
e.burst(1);
const p = e.getParticles()[0];
assert(p.life === 200, 'lifespan 100 + 0.5 * 200, got ' + p.life);
assert(Math.abs(Math.hypot(p.vx, p.vy) - 25) < 1e-9, 'speed 0.25 * 100: ' + Math.hypot(p.vx, p.vy));
assert(Math.abs(p.vx) < 1e-9 && Math.abs(p.vy + 25) < 1e-9, 'angle 270deg points up: ' + JSON.stringify(p));
assert(i === 3, 'exactly three draws per particle, got ' + i);` },
    { name: "plain_numbers_still_consume_a_draw", code: `let calls = 0;
const e = createEmitter({ rate: 1000, lifespan: 500, speed: 5, angle: 0, rng: () => { calls++; return 0; } });
e.burst(2);
assert(calls === 6, 'three draws per particle even for constants, got ' + calls);` },
    { name: "movement_uses_semi_implicit_euler", code: `const e = createEmitter({ rate: 0, lifespan: 5000, speed: 0, angle: 0, gravity: { x: 10, y: 100 }, rng: () => 0 });
e.burst(1);
e.update(1000);
const p = e.getParticles()[0];
assert(Math.abs(p.vx - 10) < 1e-9 && Math.abs(p.vy - 100) < 1e-9, 'velocity first: ' + JSON.stringify(p));
assert(Math.abs(p.x - 10) < 1e-9 && Math.abs(p.y - 100) < 1e-9, 'then position with the NEW velocity: ' + JSON.stringify(p));
assert(p.age === 1000 && Math.abs(p.progress - 0.2) < 1e-9, 'age and progress');` },
    { name: "particles_spawned_in_an_update_are_not_moved_until_the_next", code: `const e = createEmitter({ rate: 10, lifespan: 5000, speed: 100, angle: 0, rng: () => 0 });
e.update(100);
const p = e.getParticles()[0];
assert(p.x === 0 && p.age === 0, 'untouched this frame: ' + JSON.stringify(p));
e.update(100);
assert(Math.abs(e.getParticles()[0].x - 10) < 1e-9, 'moves 100 px/s for 0.1s');` },
    { name: "dead_particles_are_removed", code: `const e = createEmitter({ rate: 0, lifespan: 100, speed: 0, angle: 0, rng: () => 0 });
e.burst(3);
e.update(99);
assert(e.getParticles().length === 3, 'alive at 99ms');
e.update(1);
assert(e.getParticles().length === 0, 'age >= life removes them');` },
    { name: "max_particles_caps_both_update_and_burst", code: `const e = createEmitter({ rate: 100, lifespan: 10000, speed: 0, angle: 0, maxParticles: 5, rng: () => 0 });
e.burst(10);
assert(e.getParticles().length === 5, 'burst capped');
e.update(1000);
assert(e.getParticles().length === 5, 'update capped');
const f = createEmitter({ rate: 10, lifespan: 100, speed: 0, angle: 0, maxParticles: 2, rng: () => 0 });
f.update(1000);
assert(f.getParticles().length === 2, 'spawns stop when full');
f.update(100);
assert(f.getParticles().length === 1, 'the old ones die and only one new particle is spawned (no catch-up burst)');` },
    { name: "set_position_only_affects_new_particles", code: `const e = createEmitter({ x: 0, y: 0, rate: 0, lifespan: 1000, speed: 0, angle: 0, rng: () => 0 });
e.burst(1);
e.setPosition(50, 70);
e.burst(1);
const [a, b] = e.getParticles();
assert(a.x === 0 && a.y === 0 && b.x === 50 && b.y === 70, 'got ' + JSON.stringify([a, b]));` },
  ],
  solution: {
    code: `function createEmitter(config) {
  const { rate = 0, lifespan, speed, angle, gravity = { x: 0, y: 0 }, maxParticles = Infinity, rng } = config;
  let x = config.x ?? 0;
  let y = config.y ?? 0;
  let particles = [];
  let carry = 0;

  const draw = (value) => {
    const r = rng();
    return typeof value === 'number' ? value : value.min + r * (value.max - value.min);
  };

  const spawn = () => {
    const life = draw(lifespan);
    const spd = draw(speed);
    const rad = (draw(angle) * Math.PI) / 180;
    particles.push({
      x,
      y,
      vx: Math.cos(rad) * spd,
      vy: Math.sin(rad) * spd,
      age: 0,
      life,
      progress: 0,
    });
  };

  return {
    update(dt) {
      const s = dt / 1000;
      for (const p of particles) {
        p.age += dt;
        p.vx += gravity.x * s;
        p.vy += gravity.y * s;
        p.x += p.vx * s;
        p.y += p.vy * s;
        p.progress = p.age / p.life;
      }
      particles = particles.filter((p) => p.age < p.life);

      carry += (rate * dt) / 1000;
      let count = Math.floor(carry);
      carry -= count;
      while (count > 0 && particles.length < maxParticles) {
        spawn();
        count--;
      }
    },
    burst(n) {
      for (let i = 0; i < n && particles.length < maxParticles; i++) spawn();
    },
    setPosition(nx, ny) {
      x = nx;
      y = ny;
    },
    getParticles: () => particles,
  };
}

module.exports = createEmitter;`,
    explanation:
      "Particles are plain data updated in a loop: integrate velocity then position (semi-implicit Euler, the stable cheap choice for games), age them, drop the dead. The fractional accumulator is what makes a rate of 10/sec work at 60 fps, where each frame only 'owes' 0.16 of a particle. Injecting rng instead of calling Math.random is a general testing trick: the same seed always replays the same explosion.",
  },
};
