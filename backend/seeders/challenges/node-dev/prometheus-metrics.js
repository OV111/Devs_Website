export default {
  slug: "prometheus-metrics",
  trackId: "node-dev",
  layerId: "node-dev-10",
  type: "CODE",
  difficulty: "hard",
  title: "Prometheus metrics registry",
  summary: "Counters, gauges and histograms with labels, rendered in the Prometheus text exposition format.",
  description:
    "Prometheus scrapes a plain-text <code>/metrics</code> endpoint. Libraries like prom-client keep counters, gauges and histograms in memory and render them in a strict format: <code># HELP</code> and <code># TYPE</code> lines, labels in braces, histogram buckets that are cumulative. Writing it shows exactly what your dashboards are reading.",
  task:
    "Write <code>createMetrics()</code> returning <code>{ counter, gauge, histogram, render }</code>. <code>counter(name, help, labelNames = [])</code> returns <code>{ inc }</code>; <code>gauge(...)</code> returns <code>{ set, inc, dec }</code>; <code>histogram(name, help, { buckets, labelNames = [] })</code> returns <code>{ observe }</code>. Methods take an optional labels object first: <code>inc()</code>, <code>inc(5)</code>, <code>inc({ method: 'GET' })</code>, <code>inc({ method: 'GET' }, 5)</code> (increments default to 1); <code>set</code> and <code>observe</code> require a value: <code>set(10)</code> or <code>set({ a: 'x' }, 10)</code>.",
  constraints: [
    "Names must match <code>/^[a-zA-Z_:][a-zA-Z0-9_:]*$/</code> (<code>Error('Invalid metric name: x')</code>) and be unique (<code>Error('Metric already registered: x')</code>). Label names must match <code>/^[a-zA-Z_][a-zA-Z0-9_]*$/</code> and not start with <code>__</code> (<code>Error('Invalid label name: x')</code>); <code>le</code> is reserved for histograms. A label not declared throws <code>Error('Unknown label: x')</code>, one that is declared but missing throws <code>Error('Missing label: x')</code>. A counter only goes up: a negative increment throws <code>Error('Counter can only increase')</code>.",
    "Metrics without labels always exist with value 0 (histograms: all zeros) even before the first update. Labeled metrics only have the series that were used.",
    "<code>render()</code> outputs, per metric in registration order: <code># HELP name help</code> (backslash and newline escaped as <code>\\\\</code> and <code>\\n</code>), <code># TYPE name counter|gauge|histogram</code>, then one line per series, ordered by their label values. Series line: <code>name{l1=\"v1\",l2=\"v2\"} value</code> (labels in DECLARED order, values escaped: backslash, double quote and newline), or <code>name value</code> without labels. Numbers print with <code>String(n)</code>, except <code>Infinity</code> as <code>+Inf</code>, <code>-Infinity</code> as <code>-Inf</code> and <code>NaN</code> as <code>NaN</code>. The output ends with a newline (empty registry renders <code>''</code>).",
    "Histograms default to buckets <code>[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]</code>; custom buckets must be strictly increasing (<code>Error('Buckets must be strictly increasing')</code>). An observation belongs to the first bucket whose bound is &gt;= the value. Render per series: cumulative <code>name_bucket{labels,le=\"bound\"} count</code> for every bucket, then <code>le=\"+Inf\"</code> (the total count), then <code>name_sum</code> and <code>name_count</code>. The <code>le</code> label comes after the declared labels.",
  ],
  example: `const c = metrics.counter('http_requests_total', 'Total requests', ['method']); c.inc({ method: 'GET' }); metrics.render();`,
  tags: ["prometheus","metrics","observability","monitoring"],
  estimatedMins: 60,
  xp: 70,
  starterFiles: [
    {
      name: "createMetrics.js",
      lang: "js",
      code: `// createMetrics.js
function createMetrics() {
  // your code here
}

module.exports = createMetrics;`,
    },
  ],
  testFile: {
    name: "createMetrics_test.js",
    lang: "test",
    code: `const createMetrics = require('./createMetrics');

test('counter', () => {
  const m = createMetrics(); const c = m.counter('hits_total', 'Hits'); c.inc(); c.inc(2); expect(m.render()).toBe('# HELP hits_total Hits\\n# TYPE hits_total counter\\nhits_total 3\\n');
});

test('gauge', () => {
  const m = createMetrics(); m.gauge('temp', 'Temperature').set(21.5); expect(m.render()).toContain('temp 21.5');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep each metric as <code>{ name, help, type, labelNames, series: Map }</code>; a series is keyed by <code>JSON.stringify(labelValues)</code> and holds its values (and for histograms per-bucket counts, <code>sum</code>, <code>count</code>)." },
    { order: 2, cost: 5, text: "Write a <code>seriesFor(metric, labels)</code> that validates labels (unknown, missing) and creates the series on first use; create the zero series up front for metrics with no labels." },
    { order: 3, cost: 15, text: "For histograms store NON-cumulative counts per bucket plus an overflow count, and compute the cumulative sums while rendering." },
  ],
  hiddenTests: [
    { name: "counter_rendering_and_default_zero", code: `const m = createMetrics();
m.counter('jobs_total', 'Jobs processed');
assert(m.render() === '# HELP jobs_total Jobs processed\\n# TYPE jobs_total counter\\njobs_total 0\\n', 'an unlabeled counter starts at 0: ' + JSON.stringify(m.render()));
assert(createMetrics().render() === '', 'empty registry');` },
    { name: "counter_increments_forms", code: `const m = createMetrics();
const c = m.counter('c_total', 'c');
c.inc(); c.inc(); c.inc(5); c.inc(0.5);
assert(m.render().indexOf('c_total 7.5\\n') !== -1, 'default 1, explicit amounts, fractions: ' + m.render());
const l = m.counter('l_total', 'l', ['k']);
l.inc({ k: 'a' }); l.inc({ k: 'a' }, 4);
assert(m.render().indexOf('l_total{k="a"} 5\\n') !== -1, 'labels then amount');` },
    { name: "counter_cannot_decrease", code: `const c = createMetrics().counter('c_total', 'c');
let msg = null;
try { c.inc(-1); } catch (e) { msg = e.message; }
assert(msg === 'Counter can only increase', 'message: ' + msg);
c.inc(0);` },
    { name: "labeled_series_are_sorted_and_use_declared_label_order", code: `const m = createMetrics();
const c = m.counter('http_requests_total', 'Total HTTP requests', ['method', 'status']);
c.inc({ status: '500', method: 'POST' }, 3);
c.inc({ method: 'GET', status: '200' });
c.inc({ status: '200', method: 'GET' });
const expected = '# HELP http_requests_total Total HTTP requests\\n# TYPE http_requests_total counter\\nhttp_requests_total{method="GET",status="200"} 2\\nhttp_requests_total{method="POST",status="500"} 3\\n';
assert(m.render() === expected, m.render());` },
    { name: "labeled_metrics_without_samples_show_only_help_and_type", code: `const m = createMetrics();
m.counter('x_total', 'x', ['a']);
assert(m.render() === '# HELP x_total x\\n# TYPE x_total counter\\n', JSON.stringify(m.render()));` },
    { name: "label_validation", code: `const c = createMetrics().counter('x_total', 'x', ['a', 'b']);
const msg = (labels) => { try { c.inc(labels); return null; } catch (e) { return e.message; } };
assert(msg({ a: '1', b: '2', c: '3' }) === 'Unknown label: c', 'unknown: ' + msg({ a: '1', b: '2', c: '3' }));
assert(msg({ a: '1' }) === 'Missing label: b', 'missing: ' + msg({ a: '1' }));
assert(msg(undefined) === 'Missing label: a', 'no labels at all: ' + msg(undefined));
assert(msg({ a: 1, b: 2 }) === null, 'numbers are converted to strings');` },
    { name: "label_value_escaping", code: `const m = createMetrics();
const c = m.counter('e_total', 'e', ['path']);
c.inc({ path: 'a"b\\\\c\\nd' });
assert(m.render().indexOf('e_total{path="a\\\\"b\\\\\\\\c\\\\nd"} 1\\n') !== -1, 'escaped: ' + JSON.stringify(m.render()));` },
    { name: "help_text_escaping", code: `const m = createMetrics();
m.gauge('g', 'line one\\nline two with a \\\\ backslash');
assert(m.render().split('\\n')[0] === '# HELP g line one\\\\nline two with a \\\\\\\\ backslash', 'first line: ' + m.render().split('\\n')[0]);` },
    { name: "gauge_set_inc_dec", code: `const m = createMetrics();
const g = m.gauge('in_flight', 'Requests in flight', ['route']);
g.set({ route: '/a' }, 10); g.inc({ route: '/a' }); g.dec({ route: '/a' }, 4); g.inc({ route: '/b' }, 2); g.dec({ route: '/b' }, 5);
const out = m.render();
assert(out.indexOf('# TYPE in_flight gauge\\n') !== -1, 'type');
assert(out.indexOf('in_flight{route="/a"} 7\\n') !== -1 && out.indexOf('in_flight{route="/b"} -3\\n') !== -1, 'values: ' + out);
const plain = createMetrics(); const p = plain.gauge('up', 'up');
p.set(1); p.set(0);
assert(plain.render().indexOf('up 0\\n') !== -1, 'set replaces the value');` },
    { name: "special_values", code: `const m = createMetrics();
const g = m.gauge('v', 'v', ['k']);
g.set({ k: 'inf' }, Infinity); g.set({ k: 'ninf' }, -Infinity); g.set({ k: 'nan' }, NaN); g.set({ k: 'frac' }, 0.1);
const out = m.render();
assert(out.indexOf('v{k="inf"} +Inf\\n') !== -1 && out.indexOf('v{k="ninf"} -Inf\\n') !== -1 && out.indexOf('v{k="nan"} NaN\\n') !== -1 && out.indexOf('v{k="frac"} 0.1\\n') !== -1, out);` },
    { name: "histogram_rendering", code: `const m = createMetrics();
const h = m.histogram('request_seconds', 'Request duration', { buckets: [0.125, 0.5, 1] });
h.observe(0.0625); h.observe(0.25); h.observe(2);
const expected = '# HELP request_seconds Request duration\\n# TYPE request_seconds histogram\\nrequest_seconds_bucket{le="0.125"} 1\\nrequest_seconds_bucket{le="0.5"} 2\\nrequest_seconds_bucket{le="1"} 2\\nrequest_seconds_bucket{le="+Inf"} 3\\nrequest_seconds_sum 2.3125\\nrequest_seconds_count 3\\n';
assert(m.render() === expected, m.render());` },
    { name: "histogram_bucket_boundaries_are_inclusive", code: `const m = createMetrics();
const h = m.histogram('d', 'd', { buckets: [1, 2] });
h.observe(1); h.observe(2); h.observe(2.0000001);
const out = m.render();
assert(out.indexOf('d_bucket{le="1"} 1\\n') !== -1 && out.indexOf('d_bucket{le="2"} 2\\n') !== -1 && out.indexOf('d_bucket{le="+Inf"} 3\\n') !== -1, 'a value equal to a bound belongs to that bucket: ' + out);` },
    { name: "histogram_with_labels_and_default_buckets", code: `const m = createMetrics();
const h = m.histogram('latency_seconds', 'Latency', { labelNames: ['route'] });
h.observe({ route: '/a' }, 0.03);
const lines = m.render().split('\\n').filter((l) => l.indexOf('_bucket') !== -1);
assert(lines.length === 12, '11 default buckets plus +Inf: ' + lines.length);
assert(lines[0] === 'latency_seconds_bucket{route="/a",le="0.005"} 0', 'le comes after the declared labels: ' + lines[0]);
assert(lines[2] === 'latency_seconds_bucket{route="/a",le="0.025"} 0' && lines[3] === 'latency_seconds_bucket{route="/a",le="0.05"} 1', '0.03 first fits the 0.05 bucket: ' + lines[2] + ' | ' + lines[3]);
assert(lines[4] === 'latency_seconds_bucket{route="/a",le="0.1"} 1' && lines[11] === 'latency_seconds_bucket{route="/a",le="+Inf"} 1', 'and the counts are cumulative from there: ' + lines[4] + ' | ' + lines[11]);
assert(m.render().indexOf('latency_seconds_sum{route="/a"} 0.03\\n') !== -1 && m.render().indexOf('latency_seconds_count{route="/a"} 1\\n') !== -1, 'sum and count carry the labels');` },
    { name: "unlabeled_histogram_starts_at_zero", code: `const m = createMetrics();
m.histogram('h', 'h', { buckets: [1] });
assert(m.render() === '# HELP h h\\n# TYPE h histogram\\nh_bucket{le="1"} 0\\nh_bucket{le="+Inf"} 0\\nh_sum 0\\nh_count 0\\n', m.render());` },
    { name: "histogram_validation", code: `const msg = (opts) => { try { createMetrics().histogram('h', 'h', opts); return null; } catch (e) { return e.message; } };
assert(msg({ buckets: [1, 1] }) === 'Buckets must be strictly increasing', 'duplicate bounds');
assert(msg({ buckets: [2, 1] }) === 'Buckets must be strictly increasing', 'descending');
assert(msg({ labelNames: ['le'] }) === 'Invalid label name: le', 'le is reserved');
assert(msg({ buckets: [1, 2, 3] }) === null, 'ascending is fine');` },
    { name: "name_validation_and_duplicates", code: `const m = createMetrics();
const msg = (fn) => { try { fn(); return null; } catch (e) { return e.message; } };
assert(msg(() => m.counter('1bad', 'x')) === 'Invalid metric name: 1bad', 'leading digit');
assert(msg(() => m.counter('has-dash', 'x')) === 'Invalid metric name: has-dash', 'dash');
assert(msg(() => m.counter('ok:name_1', 'x')) === null, 'colons and underscores are allowed');
assert(msg(() => m.gauge('ok:name_1', 'y')) === 'Metric already registered: ok:name_1', 'duplicate across types');
assert(msg(() => m.counter('c', 'x', ['bad-label'])) === 'Invalid label name: bad-label', 'bad label name');
assert(msg(() => m.counter('d', 'x', ['__reserved'])) === 'Invalid label name: __reserved', 'double underscore prefix');` },
    { name: "metrics_render_in_registration_order", code: `const m = createMetrics();
m.gauge('zzz', 'z'); m.counter('aaa_total', 'a'); m.histogram('mmm', 'm', { buckets: [1] });
const types = m.render().split('\\n').filter((l) => l.indexOf('# TYPE') === 0).map((l) => l.split(' ')[2]).join();
assert(types === 'zzz,aaa_total,mmm', 'registration order, not alphabetical: ' + types);` },
    { name: "render_is_idempotent_and_live", code: `const m = createMetrics();
const c = m.counter('c_total', 'c');
assert(m.render() === m.render(), 'two renders match');
c.inc();
assert(m.render().indexOf('c_total 1\\n') !== -1, 'render reflects later updates');` },
  ],
  solution: {
    code: `function createMetrics() {
  const NAME = /^[a-zA-Z_:][a-zA-Z0-9_:]*$/;
  const LABEL = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  const DEFAULT_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
  const metrics = new Map();

  const escapeHelp = (s) => s.replace(/\\\\/g, '\\\\\\\\').replace(/\\n/g, '\\\\n');
  const escapeLabel = (s) => String(s).replace(/\\\\/g, '\\\\\\\\').replace(/"/g, '\\\\"').replace(/\\n/g, '\\\\n');
  const fmt = (n) => {
    if (n === Infinity) return '+Inf';
    if (n === -Infinity) return '-Inf';
    if (Number.isNaN(n)) return 'NaN';
    return String(n);
  };

  function seriesFor(metric, labels) {
    for (const key of Object.keys(labels)) {
      if (!metric.labelNames.includes(key)) throw new Error('Unknown label: ' + key);
    }
    for (const name of metric.labelNames) {
      if (!(name in labels)) throw new Error('Missing label: ' + name);
    }
    const values = metric.labelNames.map((name) => String(labels[name]));
    const key = JSON.stringify(values);
    let series = metric.series.get(key);
    if (!series) {
      series = { values, value: 0 };
      if (metric.type === 'histogram') {
        series.counts = metric.buckets.map(() => 0);
        series.overflow = 0;
        series.sum = 0;
        series.count = 0;
      }
      metric.series.set(key, series);
    }
    return series;
  }

  function register(name, help, type, labelNames, buckets) {
    if (!NAME.test(name)) throw new Error('Invalid metric name: ' + name);
    if (metrics.has(name)) throw new Error('Metric already registered: ' + name);
    for (const label of labelNames) {
      if (!LABEL.test(label) || label.startsWith('__') || (type === 'histogram' && label === 'le')) {
        throw new Error('Invalid label name: ' + label);
      }
    }
    const metric = { name, help, type, labelNames, buckets, series: new Map() };
    metrics.set(name, metric);
    if (labelNames.length === 0) seriesFor(metric, {});
    return metric;
  }

  function parse(args, defaultValue) {
    if (typeof args[0] === 'number') return [{}, args[0]];
    const value = args[1] === undefined ? defaultValue : args[1];
    return [args[0] || {}, value];
  }

  function labelString(metric, values, extra) {
    const parts = metric.labelNames.map((name, i) => name + '="' + escapeLabel(values[i]) + '"');
    if (extra !== undefined) parts.push('le="' + extra + '"');
    return parts.length > 0 ? '{' + parts.join(',') + '}' : '';
  }

  return {
    counter(name, help, labelNames = []) {
      const metric = register(name, help, 'counter', labelNames);
      return {
        inc(...args) {
          const [labels, value] = parse(args, 1);
          if (value < 0) throw new Error('Counter can only increase');
          seriesFor(metric, labels).value += value;
        },
      };
    },
    gauge(name, help, labelNames = []) {
      const metric = register(name, help, 'gauge', labelNames);
      return {
        set(...args) {
          const [labels, value] = parse(args, 0);
          seriesFor(metric, labels).value = value;
        },
        inc(...args) {
          const [labels, value] = parse(args, 1);
          seriesFor(metric, labels).value += value;
        },
        dec(...args) {
          const [labels, value] = parse(args, 1);
          seriesFor(metric, labels).value -= value;
        },
      };
    },
    histogram(name, help, { buckets = DEFAULT_BUCKETS, labelNames = [] } = {}) {
      for (let i = 1; i < buckets.length; i++) {
        if (!(buckets[i] > buckets[i - 1])) throw new Error('Buckets must be strictly increasing');
      }
      const metric = register(name, help, 'histogram', labelNames, [...buckets]);
      return {
        observe(...args) {
          const [labels, value] = parse(args, 0);
          const series = seriesFor(metric, labels);
          const index = metric.buckets.findIndex((bound) => value <= bound);
          if (index === -1) series.overflow++;
          else series.counts[index]++;
          series.sum += value;
          series.count++;
        },
      };
    },
    render() {
      const lines = [];
      for (const metric of metrics.values()) {
        lines.push('# HELP ' + metric.name + ' ' + escapeHelp(metric.help));
        lines.push('# TYPE ' + metric.name + ' ' + metric.type);
        const keys = [...metric.series.keys()].sort();
        for (const key of keys) {
          const series = metric.series.get(key);
          if (metric.type !== 'histogram') {
            lines.push(metric.name + labelString(metric, series.values) + ' ' + fmt(series.value));
            continue;
          }
          let cumulative = 0;
          metric.buckets.forEach((bound, i) => {
            cumulative += series.counts[i];
            lines.push(metric.name + '_bucket' + labelString(metric, series.values, String(bound)) + ' ' + cumulative);
          });
          lines.push(metric.name + '_bucket' + labelString(metric, series.values, '+Inf') + ' ' + series.count);
          lines.push(metric.name + '_sum' + labelString(metric, series.values) + ' ' + fmt(series.sum));
          lines.push(metric.name + '_count' + labelString(metric, series.values) + ' ' + series.count);
        }
      }
      return lines.length > 0 ? lines.join('\\n') + '\\n' : '';
    },
  };
}

module.exports = createMetrics;`,
    explanation:
      "Each series is a small record keyed by its label values. Counters and gauges render one line, histograms store per-bucket counts and turn them into cumulative totals only when rendering, since Prometheus expects each le bucket to include everything below it. Validating labels strictly stops a typo from silently creating a new series.",
  },
};
