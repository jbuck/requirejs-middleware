var express = require("express"),
    requirejsMiddleware = require("../index.js");

var app = express();

app.use(express.logger("dev"));
app.use(requirejsMiddleware({
  src: path.join(__dirname + "/public"),
  dest: path.join(__dirname + "/build"),
  build: true,
  debug: true,
  defaults: {
    preserveLicenseComments: false
  },
  modules: {
    "/main.js": {
      baseUrl: path.join(__dirname + "/public"),
      include: "main",
      optimize: "none"
    }
  }
}));
app.use(express.static(path.join(__dirname + "/build")));
app.use(express.static(path.join(__dirname + "/public")));

app.listen(3000);
