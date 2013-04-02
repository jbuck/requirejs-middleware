# Installation

`npm install requirejs-middleware`

# Usage

```
var express = require("express"),
    requirejsMiddleware = require("requirejs-middleware");

var app = express();

app.use(express.logger("dev"));
app.use(requirejsMiddleware({
  src: __dirname + "/public",
  dest: __dirname + "/build",
  modules: {
    "/main.js": {
      baseUrl: __dirname + "/public",
      include: "main"
    }
  }
}));
app.use(express.static(__dirname + "/build"));
app.use(express.static(__dirname + "/public"));

app.listen(3000);
```

See the full example in [example/server.js](example/server.js).

# Options

* `src` - Source directory containing the RequireJS modules. **Required**
* `dest` - Destination directory to write built RequireJS modules to. **Required**
* `build` - Compile modules with almond. Recommended for production deployments. Default *false*
* `once` - Compile modules once. Recommended for production deployments. Default *false*
* `debug`
* `modules` - Object containing module paths and RequireJS optimizer options. **Required**
  * *string* - Path to RequireJS module
    * `baseUrl` - All modules are located relative to this path. **Required**
    * `include` - Include this module in the output file. You can't use `name` since that's used by almond.js **Required**

