define([
  // Application.
  "app",
  "modules/login"//,
//  "modules/todo"
],

function(app, Login) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      app.useLayout("main");
      app.layout.setView('#main-content', new Login.Views.Form());
      app.layout.render();
    }
  });

  return Router;

});
