// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["modernizr","main","jsSHA"],

  paths: {
    // JavaScript folders.
    libs: "../assets/js/libs",
    plugins: "../assets/js/plugins",
    vendor: "../assets/vendor",

    // Libraries.
    jquery: "../assets/js/libs/jquery",
    lodash: "../assets/js/libs/lodash",
    backbone: "../assets/js/libs/backbone",
    handlebars: "../assets/js/libs/handlebars",
    modernizr: "../assets/js/libs/modernizr",
    jsSHA: "../assets/js/libs/sha1"
  },

  shim: {
    modernizr: {
      exports: "Modernizr"
    },
    'handlebars': {
      exports: "Handlebars"
    },
    'jsSHA':{
      exports: "jsSHA"
    },
    // Backbone library depends on lodash and jQuery.
    backbone: {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },

    // Backbone.LayoutManager depends on Backbone.
    "plugins/backbone.layoutmanager": ["backbone"],
    "plugins/backbone.RESTFul.sync": ["backbone","jsSHA"]
  }

});
