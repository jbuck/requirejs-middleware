var express = require("express"),
    requirejsMiddleware = require("../.."),
    path = require("path");

var app = express();

var PUBLIC_DIR = path.join(__dirname, "public");

app.use(express.logger("dev"));
app.use(requirejsMiddleware({
  src: PUBLIC_DIR,
  dest: path.join(__dirname, "build"),
  build: "requirejs",
  debug: true,
  defaults: {
    preserveLicenseComments: false,
    mainConfigFile: PUBLIC_DIR + '/config.js',
    optimize: "none",
    baseUrl: PUBLIC_DIR
  },
  modules: {
    "/main.js": {
      name: "main",
    }
  }
}));
app.use("/requirejs", express.static("../../node_modules/requirejs"));
app.use(express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "public")));

app.listen(1987);
