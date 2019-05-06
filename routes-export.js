const fs = require("fs");
const s = fs.readFileSync("src/router/index.js").toString();

const re = /path: "([^"]+)",/g;
let m;
const a = [];
do {
  m = re.exec(s);
  if (m) {
    if (m[1] === "/") {
      continue;
    }
    a.push(m[1].replace(new RegExp("/([^/]+)/?.*"), "$1"));
  }
} while (m);

const b = a.filter(function(item, pos, self) {
  return self.indexOf(item) === pos;
});

fs.writeFileSync("reserved-words.json", JSON.stringify(b));
console.log("routes generated");
