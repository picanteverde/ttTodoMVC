define([
  // Application.
  "app",
  "modules/login",
  "modules/todos",
  "modules/register"
],

function(app, Login, Todos, Register) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "login": "login",
      "todos": "todos",
      "register": "register"
    },

    index: function() {
      var router = this;
      if(!app.loggedIn){
        router.navigate("/login",{trigger: true});
      }else{
        this.navigate("/todos",{trigger: true});
      }
    },
    login: function(){
      app.useLayout("main");
      app.layout.setView('#main-content', new Login.Views.Form()).render();
    },
    todos: function(){
      app.useLayout("main");
      app.layout.setView('#main-content', new Todos()).render();
    },
    register: function(){
      app.useLayout("main");
      app.layout.setView('#main-content', new Register()).render();
    }
  });

  return Router;

});
