var extend = require("extend"),
    fs = require("fs"),
    gaze = require("gaze"),
    path = require("path"),
    requirejs = require("requirejs");

function compile(opts, callback) {
  log("compiling now");
  requirejs.optimize(opts,
  function success(build) {
    var deps = build.split("\n").filter(function(line, index) {
      return !!line && index > 2;
    }).map(function(file) {
      return path.normalize(file);
    });

    log("compilation succeeded");
    callback(null, deps);
  }, function error(err) {
    log("compilation failed");
    callback(err);
  });
}

// Shhhhh don't say a word
var debugMessages = false;
function log() {
  if (debugMessages) {
    console.log.apply(this, arguments);
  }
}

function setWatchers(module, deps) {
  module._watched = true;

  gaze(deps, function(err, watcher) {
    log("watching %j", watcher.watched());
    watcher.on("all", function(event, filepath) {
      log("%s was %s", filepath, event);
      module._compiled = false;
    });
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

  // TODO figure out a less crappy way of setting this
  debugMessages = !!opts.debug;

  opts.defaults = opts.defaults || {};

  Object.keys(opts.modules).forEach(function(key) {
    var module = opts.modules[key];
    module = extend(true, module, opts.defaults);
    module.name = path.relative(module.baseUrl, __dirname + "/almond");
    module.out = path.join(opts.dest, key);

    if (opts.once) {
      log("`once` set");
      compile(module, function(err) {
        if (err) {
          throw err;
        }
      });
    }
  });

  return function(req, res, next) {
    if (opts.once || !opts.build) {
      return next();
    }

    // Only deal with GET or HEAD requests
    if (req.method.toUpperCase() != "GET" && req.method.toUpperCase() != "HEAD") {
      return next();
    }

    var module = opts.modules[req.path];

    // Is this a require module we're aware of
    if (!module || module._compiled) {
      return next();
    }

    var srcPath = path.join(opts.src, req.path);

    fs.stat(srcPath, function(err, srcStats) {
      // Ignore ENOENT to fall through as 404
      if (err) {
        return next(err.code == "ENOENT" ? null : err);
      }

      compile(module, function(err, deps) {
        if (err) {
          return next(err);
        }

        module._compiled = true;

        if (!module._watched) {
          setWatchers(module, deps);
        }

        next();
      });
    });
  };
}
