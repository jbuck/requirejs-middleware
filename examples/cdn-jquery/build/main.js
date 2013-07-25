
var require = requirejs.config({
  baseUrl: "/",
  paths: {
    jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min"
  }
});

define("config", function(){});

define('sub',['jquery'], function($) {
  var width = $("body").width();
  console.log("running sub", width);
});

require(["config", "jquery", "sub"], function(config, $, sub) {
  $("body").css("background-color", "red");
  console.log("running main");
});

define("main", function(){});
