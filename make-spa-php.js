const fs = require("fs");
let s = fs.readFileSync("dist/index.html").toString();

require("dotenv").config({ path: ".env.local" });

const meta = "<?php include " + process.env.META_PHP_PATH + "; ?>";

s = s.replace("</head>", meta + "</head>");

fs.writeFileSync("dist/spa.php", s);
console.log("spa.php generated with " + process.env.META_PHP_PATH);
