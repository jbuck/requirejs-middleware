var express = require("express"),
    requirejsMiddleware = require("../index.js");

var app = express();

app.use(express.logger("dev"));
app.use(requirejsMiddleware({
  src: __dirname + "/public",
  dest: __dirname + "/build",
  build: true,
  debug: true,
  defaults: {
    preserveLicenseComments: false
  },
  modules: {
    "/main.js": {
      baseUrl: __dirname + "/public",
      include: "main",
      optimize: "none"
    }
  }
}));
app.use(express.static(__dirname + "/build"));
app.use(express.static(__dirname + "/public"));

app.listen(3000);
