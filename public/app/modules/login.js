define([
  "app",
  ], function(app){

  var Login = app.module();

  Login.Views.Form = Backbone.View.extend({
    id: "login-form",
    template: "login-form",
    events: {
      "click #login-button": "login",
      "keypress #login-password": "loginOnEnter"
    },
    initialize: function() {
      
    },
    beforeRender: function() {
      
    },
    afterRender: function(){
      this.$("#login-username").focus();
    },
    loginOnEnter: function(e){
      if(e.keyCode == 13){
        this.login(e);
      }
    },
    login: function(evt){
      evt.preventDefault();
      $("#login-error").hide();
      $.ajax({
        url: "/api/login",
        type: "POST",
        dataType: "json",
        data: {
          username: $("#login-username").val(),
          password: $("#login-password").val()
        },
        success: function(data){
          if(data.error){
            $("#login-error").text(data.error).show();
          }else{
            $("#login-error").text("Success!").show();
            app.router.navigate("/todos",{trigger: true});
          }
        }
      });
    }
  });

  return Login;

});