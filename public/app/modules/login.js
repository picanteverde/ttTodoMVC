define([
  "app",
  ], function(app){

  var Login = app.module();

  Login.Views.Form = Backbone.View.extend({
    id: "login-form",
    template: "login-form",
    initialize: function() {
      
    },
    beforeRender: function() {
      
    }
  });

  return Login;

});