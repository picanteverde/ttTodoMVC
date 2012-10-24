define([
  "app",
  ], function(app){

  var RegisterView = Backbone.View.extend({
    id: "register-form",
    template: "register/form",
    events: {
      "click #register-button": "register",
      "click #register-login": "goToLogin"
    },
    initialize: function() {
      
    },
    beforeRender: function() {
      
    },
    register: function(evt){
      evt.preventDefault();
      $("#register-error").hide();
      $.ajax({
        url: "/api/register",
        type: "POST",
        dataType: "json",
        data: {
          username: $("#register-username").val(),
          password: $("#register-password").val()
        },
        success: function(data){
          if(data.error){
            $("#register-error").text(data.error).show();
          }else{
            $("#register-error").text("Success! now click on the Login button to Login").show();
            $("#register-login").show();
          }
        }
      });
    },
    goToLogin: function(){
      app.router.navigate("/login",{trigger: true});
    }
  });

  return RegisterView;

});