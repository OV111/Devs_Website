export default {
  slug: "parse-prisma-schema",
  trackId: "node-dev",
  layerId: "node-dev-5",
  type: "CODE",
  difficulty: "hard",
  title: "Parse a Prisma schema",
  summary: "Read model and enum blocks, fields with ?, [] and @attributes, and classify each field as scalar, enum or relation.",
  description:
    "A <code>schema.prisma</code> file is the source of truth for your database and your generated client. Prisma's tooling starts by parsing it into models and fields. Doing a small version teaches how relations, optionality and attributes are represented.",
  task:
    "Write <code>parsePrismaSchema(text)</code> returning <code>{ models, enums }</code>. <code>models[Name] = { fields, blockAttributes }</code>; <code>enums[Name]</code> is an array of value names.",
  constraints: [
    "Strip <code>//</code> comments and blank lines. Blocks look like <code>keyword Name {</code> ... <code>}</code> on their own lines; only <code>model</code> and <code>enum</code> blocks are read, other blocks (<code>datasource</code>, <code>generator</code>) are skipped. An unclosed block throws <code>Error('Unclosed block: Name')</code>; a repeated name throws <code>Error('Duplicate model: Name')</code> or <code>Error('Duplicate enum: Name')</code>.",
    "A field line is <code>name Type</code> optionally followed by <code>?</code> (optional) or <code>[]</code> (list) and then attributes. A field is <code>{ name, type, optional, list, kind, attributes }</code>.",
    "<code>kind</code> is <code>'scalar'</code> for <code>String Int BigInt Float Decimal Boolean DateTime Json Bytes</code>, <code>'enum'</code> for a declared enum, <code>'object'</code> for another model (a relation). Any other type throws <code>Error('Unknown type \"X\" in Model.field')</code>. Models and enums may be declared in any order.",
    "Attributes are <code>@name</code> or <code>@name(args)</code>: <code>{ name, args }</code> where <code>args</code> are the raw trimmed strings split on commas at the top level only (commas inside <code>()</code>, <code>[]</code> or quotes do not split). Lines starting with <code>@@</code> are block attributes, stored the same way in <code>blockAttributes</code>.",
    "Enum bodies list one value per line (ignore any attributes after the value). A model line that is not a valid field throws <code>Error('Invalid field in Model: &lt;line&gt;')</code>.",
  ],
  example: `parsePrismaSchema('model User {\\n  id Int @id\\n  name String?\\n}').models.User.fields[1] // { name: 'name', type: 'String', optional: true, list: false, kind: 'scalar', attributes: [] }`,
  tags: ["prisma","schema","parsing","relations"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "parsePrismaSchema.js",
      lang: "js",
      code: `// parsePrismaSchema.js
function parsePrismaSchema(text) {
  // your code here
}

module.exports = parsePrismaSchema;`,
    },
  ],
  testFile: {
    name: "parsePrismaSchema_test.js",
    lang: "test",
    code: `const parsePrismaSchema = require('./parsePrismaSchema');

test('basic', () => {
  const s = parsePrismaSchema('model User {\\n  id Int @id\\n  name String?\\n}'); expect(s.models.User.fields.length).toBe(2); expect(s.models.User.fields[1].optional).toBe(true);
});

test('enum', () => {
  expect(parsePrismaSchema('enum Role {\\n  USER\\n  ADMIN\\n}').enums.Role).toEqual(['USER', 'ADMIN']);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Do two passes: first read all blocks into raw models and enums, then classify each field's <code>kind</code> once every model and enum name is known." },
    { order: 2, cost: 5, text: "Write a <code>splitTopLevel(str)</code> helper that walks the characters, tracking <code>()</code>/<code>[]</code> depth and whether you're inside quotes, and only splits on commas at depth 0." },
    { order: 3, cost: 15, text: "Parse the field line with one regular expression for <code>name</code>, <code>Type</code> and the optional <code>?</code>/<code>[]</code>, then scan the remainder for <code>@name</code> and its balanced parentheses." },
  ],
  hiddenTests: [
    { name: "fields_types_and_modifiers", code: `const s = parsePrismaSchema('model Post {\\n  id Int @id\\n  title String\\n  subtitle String?\\n  tags String[]\\n}');
const f = s.models.Post.fields;
assert(f.map((x) => x.name).join() === 'id,title,subtitle,tags', 'names in order');
assert(f[1].type === 'String' && f[1].optional === false && f[1].list === false, 'plain');
assert(f[2].optional === true && f[2].list === false, 'optional');
assert(f[3].list === true && f[3].optional === false, 'list');` },
    { name: "attributes_with_and_without_args", code: `const s = parsePrismaSchema('model User {\\n  id Int @id @default(autoincrement())\\n  email String @unique\\n}');
const [id, email] = s.models.User.fields;
assert(id.attributes.length === 2 && id.attributes[0].name === 'id' && id.attributes[0].args.length === 0, 'plain attribute');
assert(id.attributes[1].name === 'default' && id.attributes[1].args.join() === 'autoincrement()', 'default arg: ' + JSON.stringify(id.attributes[1]));
assert(email.attributes[0].name === 'unique', 'unique');` },
    { name: "args_split_only_at_top_level", code: `const s = parsePrismaSchema('model Post {\\n  id Int @id\\n  authorId Int\\n  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)\\n  note String @default("a,b")\\n}\\nmodel User {\\n  id Int @id\\n}');
const rel = s.models.Post.fields[2].attributes[0];
assert(rel.name === 'relation' && rel.args.length === 3, 'three args: ' + JSON.stringify(rel.args));
assert(rel.args[0] === 'fields: [authorId]' && rel.args[1] === 'references: [id]' && rel.args[2] === 'onDelete: Cascade', 'raw strings: ' + JSON.stringify(rel.args));
const note = s.models.Post.fields[3].attributes[0];
assert(note.args.length === 1 && note.args[0] === '"a,b"', 'comma inside quotes: ' + JSON.stringify(note.args));` },
    { name: "kinds_scalar_enum_object", code: `const s = parsePrismaSchema('enum Role {\\n  USER\\n  ADMIN\\n}\\nmodel User {\\n  id Int @id\\n  role Role @default(USER)\\n  posts Post[]\\n  profile Profile?\\n}\\nmodel Post {\\n  id Int @id\\n}\\nmodel Profile {\\n  id Int @id\\n}');
const kinds = s.models.User.fields.map((f) => f.kind).join();
assert(kinds === 'scalar,enum,object,object', 'kinds: ' + kinds);
assert(s.models.User.fields[2].list === true && s.models.User.fields[3].optional === true, 'relation modifiers');` },
    { name: "all_scalar_types_are_known", code: `const t = ['String', 'Int', 'BigInt', 'Float', 'Decimal', 'Boolean', 'DateTime', 'Json', 'Bytes'];
const body = t.map((x, i) => '  f' + i + ' ' + x).join('\\n');
const s = parsePrismaSchema('model M {\\n' + body + '\\n}');
assert(s.models.M.fields.every((f) => f.kind === 'scalar'), 'all scalar');` },
    { name: "block_attributes", code: `const s = parsePrismaSchema('model Membership {\\n  userId Int\\n  teamId Int\\n  @@id([userId, teamId])\\n  @@index([teamId])\\n  @@map("memberships")\\n}');
const m = s.models.Membership;
assert(m.fields.length === 2, 'block attributes are not fields');
assert(m.blockAttributes.length === 3 && m.blockAttributes[0].name === 'id' && m.blockAttributes[0].args[0] === '[userId, teamId]', 'block attrs: ' + JSON.stringify(m.blockAttributes));
assert(m.blockAttributes[2].name === 'map' && m.blockAttributes[2].args[0] === '"memberships"', 'map');` },
    { name: "comments_blank_lines_and_other_blocks_are_ignored", code: `const s = parsePrismaSchema('// header\\ngenerator client {\\n  provider = "prisma-client-js"\\n}\\n\\ndatasource db {\\n  provider = "postgresql"\\n  url = env("DATABASE_URL")\\n}\\n\\nmodel User {\\n  // the key\\n  id Int @id // trailing comment\\n\\n  name String\\n}\\n');
assert(Object.keys(s.models).join() === 'User' && Object.keys(s.enums).length === 0, 'only the model');
assert(s.models.User.fields.length === 2 && s.models.User.fields[0].attributes.length === 1, 'comments stripped');` },
    { name: "enum_values_with_attributes", code: `const s = parsePrismaSchema('enum Status {\\n  ACTIVE @map("active")\\n  DISABLED\\n}');
assert(s.enums.Status.join() === 'ACTIVE,DISABLED', 'values only: ' + s.enums.Status);` },
    { name: "empty_and_multiple_models_keep_order", code: `const e = parsePrismaSchema('');
assert(Object.keys(e.models).length === 0 && Object.keys(e.enums).length === 0, 'empty');
const s = parsePrismaSchema('model B {\\n  id Int\\n}\\nmodel A {\\n  id Int\\n}');
assert(Object.keys(s.models).join() === 'B,A', 'declaration order');` },
    { name: "crlf_line_endings", code: `const s = parsePrismaSchema('model A {\\r\\n  id Int @id\\r\\n  name String?\\r\\n}\\r\\n');
assert(s.models.A.fields.length === 2 && s.models.A.fields[1].optional === true, 'works with CRLF');` },
    { name: "errors", code: `const msg = (text) => { try { parsePrismaSchema(text); return null; } catch (e) { return e.message; } };
assert(msg('model A {\\n  id Int') === 'Unclosed block: A', 'unclosed: ' + msg('model A {\\n  id Int'));
assert(msg('model A {\\n  x Strng\\n}') === 'Unknown type "Strng" in A.x', 'unknown type: ' + msg('model A {\\n  x Strng\\n}'));
assert(msg('model A {\\n  id Int\\n}\\nmodel A {\\n  id Int\\n}') === 'Duplicate model: A', 'duplicate model');
assert(msg('enum E {\\n  X\\n}\\nenum E {\\n  Y\\n}') === 'Duplicate enum: E', 'duplicate enum');
assert(msg('model A {\\n  justoneword\\n}') === 'Invalid field in A: justoneword', 'invalid field: ' + msg('model A {\\n  justoneword\\n}'));` },
  ],
  solution: {
    code: `function parsePrismaSchema(text) {
  const SCALARS = ['String', 'Int', 'BigInt', 'Float', 'Decimal', 'Boolean', 'DateTime', 'Json', 'Bytes'];
  const lines = text.split(/\\r?\\n/).map((l) => l.replace(/\\/\\/.*$/, '').trim());

  function splitTopLevel(str) {
    const parts = [];
    let depth = 0;
    let quote = null;
    let current = '';
    for (const ch of str) {
      if (quote) {
        current += ch;
        if (ch === quote) quote = null;
      } else if (ch === '"') {
        quote = ch;
        current += ch;
      } else if (ch === '(' || ch === '[') {
        depth++;
        current += ch;
      } else if (ch === ')' || ch === ']') {
        depth--;
        current += ch;
      } else if (ch === ',' && depth === 0) {
        parts.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim() !== '') parts.push(current.trim());
    return parts;
  }

  function parseAttributes(str) {
    const attrs = [];
    let i = 0;
    while (i < str.length) {
      if (str[i] !== '@') {
        i++;
        continue;
      }
      while (str[i] === '@') i++;
      const start = i;
      while (i < str.length && /\\w/.test(str[i])) i++;
      const name = str.slice(start, i);
      let args = [];
      if (str[i] === '(') {
        let depth = 0;
        let quote = null;
        const open = i;
        for (; i < str.length; i++) {
          const ch = str[i];
          if (quote) {
            if (ch === quote) quote = null;
          } else if (ch === '"') {
            quote = ch;
          } else if (ch === '(') {
            depth++;
          } else if (ch === ')') {
            depth--;
            if (depth === 0) break;
          }
        }
        args = splitTopLevel(str.slice(open + 1, i));
        i++;
      }
      attrs.push({ name, args });
    }
    return attrs;
  }

  const models = {};
  const enums = {};
  let i = 0;
  while (i < lines.length) {
    const header = /^(\\w+)\\s+(\\w+)\\s*\\{$/.exec(lines[i]);
    if (!header) {
      i++;
      continue;
    }
    const [, keyword, name] = header;
    const body = [];
    i++;
    while (i < lines.length && lines[i] !== '}') {
      if (lines[i] !== '') body.push(lines[i]);
      i++;
    }
    if (i >= lines.length) throw new Error('Unclosed block: ' + name);
    i++;

    if (keyword === 'enum') {
      if (enums[name]) throw new Error('Duplicate enum: ' + name);
      enums[name] = body.map((line) => line.split(/\\s+/)[0]);
    } else if (keyword === 'model') {
      if (models[name]) throw new Error('Duplicate model: ' + name);
      const fields = [];
      const blockAttributes = [];
      for (const line of body) {
        if (line.startsWith('@@')) {
          blockAttributes.push(...parseAttributes(line));
          continue;
        }
        const m = /^(\\w+)\\s+(\\w+)(\\[\\]|\\?)?\\s*(.*)$/.exec(line);
        if (!m) throw new Error('Invalid field in ' + name + ': ' + line);
        fields.push({
          name: m[1],
          type: m[2],
          optional: m[3] === '?',
          list: m[3] === '[]',
          kind: 'scalar',
          attributes: parseAttributes(m[4]),
        });
      }
      models[name] = { fields, blockAttributes };
    }
  }

  for (const [modelName, model] of Object.entries(models)) {
    for (const field of model.fields) {
      if (SCALARS.includes(field.type)) field.kind = 'scalar';
      else if (enums[field.type]) field.kind = 'enum';
      else if (models[field.type]) field.kind = 'object';
      else throw new Error('Unknown type "' + field.type + '" in ' + modelName + '.' + field.name);
    }
  }
  return { models, enums };
}

module.exports = parsePrismaSchema;`,
    explanation:
      "Parsing is two steps: split the text into blocks, then parse each line. Attribute arguments contain commas inside brackets and quotes, so a depth- and quote-aware splitter is needed. Classifying kinds only after everything is read is what allows models to reference each other in any order.",
  },
};
