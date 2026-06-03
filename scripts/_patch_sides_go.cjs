const fs = require("fs"), path = require("path");
const FILE = path.join(__dirname, "../src/data/roadmaps/languages.json");
const SIDES = path.join(__dirname, "_go_sides.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
const sides = JSON.parse(fs.readFileSync(SIDES, "utf8"));
for (const layer of data["go"]) {
  if (sides[layer.id]) {
    layer.sideLeft = sides[layer.id].sideLeft;
    layer.sideRight = sides[layer.id].sideRight;
  }
}
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log("Go sides patched OK");
