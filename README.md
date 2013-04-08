# requirejs-middleware

Middleware for [Express](http://expressjs.com) that runs the [RequireJS optimizer](http://requirejs.org/docs/optimization.html) on demand. Production-ready and used by [Mozilla Popcorn Maker](https://popcorn.webmaker.org).

# Installation

`npm install requirejs-middleware`

# Usage

```javascript
var express = require("express"),
    path = require("path"),
    requirejsMiddleware = require("requirejs-middleware");

var app = express();

app.use(express.logger("dev"));
app.use(requirejsMiddleware({
  src: path.join(__dirname + "/public"),
  dest: path.join(__dirname + "/build"),
  build: true,
  debug: true,
  modules: {
    "/main.js": {
      baseUrl: path.join(__dirname + "/public"),
      include: "main"
    }
  }
}));
app.use(express.static(path.join(__dirname + "/build")));
app.use(express.static(path.join(__dirname + "/public")));

app.listen(3000);
```

See the full example in [example/server.js](example/server.js).

# Options

* `src` - Source directory containing the RequireJS modules. **Required**
* `dest` - Destination directory to write built RequireJS modules to. **Required**
* `build` - Compile modules with almond. When disabled, the module will be served up unchanged. Default *false*
* `once` - Compile modules once. Recommended for production deployments. Default *false*
* `debug` - Output debugging information on the console. Default *false*
* `modules` - Object containing module paths and RequireJS optimizer options. **Required**
  * *string* - Path to RequireJS module
    * `baseUrl` - All modules are located relative to this path. **Required**
    * `include` - Include this module in the output file. You can't use `name` since that's used by almond.js **Required**

