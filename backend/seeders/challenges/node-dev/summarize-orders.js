export default {
  slug: "summarize-orders",
  trackId: "node-dev",
  layerId: "node-dev-1",
  type: "CODE",
  difficulty: "med",
  title: "Summarize orders with array methods",
  summary: "Filter, group, sum in cents and sort a list of orders using filter, reduce, Map and sort.",
  description:
    "Real API code is mostly turning arrays of records into other shapes. This is the everyday toolkit: <code>filter</code>, <code>reduce</code>, <code>Map</code>, <code>sort</code> and <code>map</code>, plus the classic trap of adding decimals.",
  task:
    "Write <code>summarizeOrders(orders)</code>. An order is <code>{ customer, status, items: [{ price, qty }] }</code> with <code>price</code> in dollars. Return one <code>{ customer, orders, total }</code> per customer.",
  constraints: [
    "Only orders with <code>status === 'paid'</code> count.",
    "<code>orders</code> is the number of paid orders; <code>total</code> is the sum of <code>price * qty</code> in dollars, rounded to 2 decimals.",
    "Add up in whole cents (<code>Math.round(price * 100) * qty</code>) to avoid floating-point errors such as <code>0.1 * 3</code>.",
    "Sort by <code>total</code> descending, ties by <code>customer</code> ascending.",
    "An order with no items counts as an order with total 0. Do not mutate the input.",
  ],
  example: `summarizeOrders([{ customer: 'ann', status: 'paid', items: [{ price: 0.1, qty: 3 }] }]) // [{ customer: 'ann', orders: 1, total: 0.3 }]`,
  tags: ["arrays","reduce","sorting","javascript"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "summarizeOrders.js",
      lang: "js",
      code: `// summarizeOrders.js
function summarizeOrders(orders) {
  // your code here
}

module.exports = summarizeOrders;`,
    },
  ],
  testFile: {
    name: "summarizeOrders_test.js",
    lang: "test",
    code: `const summarizeOrders = require('./summarizeOrders');

test('groups', () => {
  const r = summarizeOrders([{ customer: 'a', status: 'paid', items: [{ price: 2, qty: 3 }] }, { customer: 'a', status: 'paid', items: [{ price: 1, qty: 1 }] }]); expect(r).toEqual([{ customer: 'a', orders: 2, total: 7 }]);
});

test('ignores_unpaid', () => {
  expect(summarizeOrders([{ customer: 'a', status: 'refunded', items: [] }])).toEqual([]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Start with <code>orders.filter(o =&gt; o.status === 'paid')</code>, then accumulate into a <code>Map</code> keyed by customer." },
    { order: 2, cost: 5, text: "Compute each order's cents with <code>reduce</code>; keep the running total in cents and divide by 100 only at the very end." },
    { order: 3, cost: 15, text: "A comparator <code>(a, b) =&gt; b.cents - a.cents || a.customer.localeCompare(b.customer)</code> handles both sort keys; spread the Map values into a new array before sorting." },
  ],
  hiddenTests: [
    { name: "groups_and_sums", code: `const r = summarizeOrders([
  { customer: 'ann', status: 'paid', items: [{ price: 10, qty: 2 }] },
  { customer: 'bob', status: 'paid', items: [{ price: 5, qty: 1 }] },
  { customer: 'ann', status: 'paid', items: [{ price: 3, qty: 3 }] },
]);
const ann = r.find((x) => x.customer === 'ann');
assert(r.length === 2, 'two customers');
assert(ann.orders === 2 && ann.total === 29, 'ann: ' + JSON.stringify(ann));` },
    { name: "only_paid_orders", code: `const r = summarizeOrders([
  { customer: 'a', status: 'paid', items: [{ price: 1, qty: 1 }] },
  { customer: 'a', status: 'pending', items: [{ price: 100, qty: 1 }] },
  { customer: 'b', status: 'refunded', items: [{ price: 50, qty: 1 }] },
]);
assert(r.length === 1 && r[0].customer === 'a' && r[0].orders === 1 && r[0].total === 1, 'unpaid ignored entirely: ' + JSON.stringify(r));` },
    { name: "float_safe_totals", code: `const r = summarizeOrders([{ customer: 'a', status: 'paid', items: [{ price: 0.1, qty: 3 }, { price: 0.2, qty: 1 }] }]);
assert(r[0].total === 0.5, '0.1*3 + 0.2 must be exactly 0.5, got ' + r[0].total);
const r2 = summarizeOrders([{ customer: 'a', status: 'paid', items: [{ price: 19.99, qty: 3 }] }]);
assert(r2[0].total === 59.97, '19.99*3 must be 59.97, got ' + r2[0].total);` },
    { name: "sorted_by_total_desc_then_name", code: `const mk = (customer, price) => ({ customer, status: 'paid', items: [{ price, qty: 1 }] });
const r = summarizeOrders([mk('carl', 5), mk('amy', 9), mk('bob', 5), mk('dan', 1)]);
assert(r.map((x) => x.customer).join(',') === 'amy,bob,carl,dan', 'order: ' + r.map((x) => x.customer));` },
    { name: "empty_and_no_paid", code: `assert(summarizeOrders([]).length === 0, 'empty input');
assert(summarizeOrders([{ customer: 'a', status: 'pending', items: [] }]).length === 0, 'nothing paid');` },
    { name: "order_without_items", code: `const r = summarizeOrders([{ customer: 'a', status: 'paid', items: [] }]);
assert(r.length === 1 && r[0].orders === 1 && r[0].total === 0, 'counted with total 0');` },
    { name: "does_not_mutate_input", code: `const input = [{ customer: 'b', status: 'paid', items: [{ price: 1, qty: 1 }] }, { customer: 'a', status: 'paid', items: [{ price: 9, qty: 1 }] }];
const copy = JSON.stringify(input);
summarizeOrders(input);
assert(JSON.stringify(input) === copy, 'input must be unchanged (order included)');` },
    { name: "output_shape", code: `const r = summarizeOrders([{ customer: 'a', status: 'paid', items: [{ price: 1, qty: 1 }] }]);
assert(Object.keys(r[0]).sort().join(',') === 'customer,orders,total', 'exactly customer, orders, total: ' + Object.keys(r[0]));` },
  ],
  solution: {
    code: `function summarizeOrders(orders) {
  const byCustomer = new Map();
  for (const order of orders.filter((o) => o.status === 'paid')) {
    const cents = order.items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.qty, 0);
    const current = byCustomer.get(order.customer) || { customer: order.customer, orders: 0, cents: 0 };
    current.orders += 1;
    current.cents += cents;
    byCustomer.set(order.customer, current);
  }
  return [...byCustomer.values()]
    .sort((a, b) => b.cents - a.cents || (a.customer < b.customer ? -1 : a.customer > b.customer ? 1 : 0))
    .map(({ customer, orders, cents }) => ({ customer, orders, total: cents / 100 }));
}

module.exports = summarizeOrders;`,
    explanation:
      "filter picks paid orders, a Map groups by customer, and reduce sums in integer cents so floating-point errors never appear. Sorting happens on a fresh array, so the input is untouched.",
  },
};
