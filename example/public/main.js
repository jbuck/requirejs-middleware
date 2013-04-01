var require = requirejs.config({
  baseUrl: "/"
});

require(["sub"], function(sub) {
  console.log("running main");
});
