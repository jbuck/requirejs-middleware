var fs = require("fs"),
    path = require("path"),
    requirejs = require("requirejs");

function compile(opts, next) {
  requirejs.optimize(opts,
  function success() {
    console.log("success");
    next();
  }, function error() {
    console.log("error");
    console.log(arguments);
    next();
  });
}

module.exports = function(opts) {
  opts = opts || {};

  if (!opts.src) {
    throw "requirejs-middleware: You must specify a `src` directory";
  }
  if (!opts.dest) {
    throw "requirejs-middleware: You must specify a `dest` directory";
  }
  if (!opts.modules) {
    throw "requirejs-middleware: You must specify atleast one module in `modules`";
  }

  Object.keys(opts.modules).forEach(function(module) {
    opts.modules[module].name = path.relative(opts.modules[module].baseUrl, __dirname + "/almond");
    opts.modules[module].out = path.join(opts.dest, module);
  });

  return function(req, res, next) {

    // Only deal with GET or HEAD requests
    if (req.method.toUpperCase() != "GET" && req.method.toUpperCase() != "HEAD") {
      return next();
    }

    // If this isn't a require module we're aware of
    if (Object.keys(opts.modules).indexOf(req.path) == -1) {
      return next();
    }

    var srcPath = path.join(opts.src, req.path),
        destPath = path.join(opts.dest, req.path);

    fs.stat(srcPath, function(err, srcStats) {
      // Ignore ENOENT to fall through as 404
      if (err) {
        return next(err.code == "ENOENT" ? null : err);
      }

      fs.stat(destPath,  function(err, destStats) {
        if (err && err.code != "ENOENT") {
          next(err);
        }

        compile(opts.modules[req.path], next);
      });
    });
  };
}
