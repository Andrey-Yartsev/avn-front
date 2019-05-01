const fs = require("fs");
let s = fs.readFileSync("dist/index.html").toString();

const meta = "<?php include '/var/www/stars.avn.com/current/public_html/meta.php'; ?>";

s = s.replace("</head>", meta + "</head>");

fs.writeFileSync("dist/spa.php", s);
console.log("spa.php generated");
