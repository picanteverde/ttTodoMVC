define([
  "app","jsSHA"
  ], function(app, jsSHA){

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
      var rnd = Math.random()*1000,
        sign = "publicKey=" + $("#login-username").val() + "rnd="+rnd,
        shaObj = new jsSHA(sign,"ASCII");
      evt.preventDefault();
      $("#login-error").hide();

      $.ajax({
        url: "/api/auth",
        type: "POST",
        dataType: "json",
        data: {
          publicKey: $("#login-username").val(),
          rnd: rnd,
          signature: shaObj.getHMAC($("#login-password").val(), "ASCII","HEX")
        },
        statusCode:{
          401: function(data){
            data = JSON.parse(data.responseText);
            $("#login-error").text(data.error).show();
          }
        },
        success: function(data){
          if(data.error){
            $("#login-error").text(data.error).show();
          }else{
            $("#login-error").text("Success!").show();
            app.setKeys($("#login-username").val(),$("#login-password").val());
            app.privateKey = $("#login-password").val();
            app.router.navigate("/todos",{trigger: true});
          }
        }
      });
    }
  });

  return Login;

});