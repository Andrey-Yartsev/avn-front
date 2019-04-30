const fs = require("fs");
let s = fs.readFileSync("dist/index.html").toString();

const meta = "<meta />";

s = s.replace("</head>", meta + "</head>");

fs.writeFileSync("spa.php", JSON.stringify(s));
console.log("spa.php generated");
