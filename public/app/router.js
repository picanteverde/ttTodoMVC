define([
  // Application.
  "app",
  "modules/login",
  "modules/todos"
],

function(app, Login, Todos) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "login": "login",
      "todos": "todos"
    },

    index: function() {
      var router = this;
      if(!app.loggedIn){
        $.ajax({
          url: "/api/login",
          type: "GET",
          dataType: "json",
          success: function(data){
            if(data.auth){
              router.navigate("/todos",{trigger: true});
              app.loggedIn=data.auth;
            }else{
              router.navigate("/login",{trigger: true});
            }
          }
        });
      }else{
        this.navigate("/todos",{trigger: true});
      }
    },
    login: function(){
      app.useLayout("main");
      app.layout.setView('#main-content', new Login.Views.Form());
      app.layout.render();
    },
    todos: function(){
      app.useLayout("main");
      app.layout.setView('#main-content', new Todos());
      app.layout.render();
    }
  });

  return Router;

});
