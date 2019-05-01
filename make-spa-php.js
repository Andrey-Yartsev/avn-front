const fs = require("fs");
let s = fs.readFileSync("dist/index.html").toString();

const meta = "<?php include __DIR__ . '/meta.php'; ?>";

s = s.replace("</head>", meta + "</head>");

fs.writeFileSync("spa.php", s);
console.log("spa.php generated");
