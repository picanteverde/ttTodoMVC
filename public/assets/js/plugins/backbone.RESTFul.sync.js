(function(window){
	var Backbone = window.Backbone,
		jsSHA = window.jsSHA,
		_ = window._;

	Backbone.sync = function(method, model, options) {
    var publicKey = Backbone.sync.publicKey,
    	privateKey = Backbone.sync.privateKey,
    	getValue = function(object, prop) {
			if (!(object && object[prop])) return null;
			return _.isFunction(object[prop]) ? object[prop]() : object[prop];
		},
  		methodMap = {
			'create': 'POST',
			'update': 'PUT',
			'delete': 'DELETE',
			'read':   'GET'
		},
  		type = methodMap[method];

    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update' || method == 'delete')) {
      params.contentType = 'application/json';
      var data = model.toJSON();
      if(publicKey && privateKey){
	      var key, sign ="", shaObj;
	      data.publicKey = publicKey;
	      for(key in data){
	      	if(data.hasOwnProperty(key)){
	      		sign += key + "=" + data[key];
	      	}
	      }
	      shaObj = new jsSHA(sign, "ASCII");
	      sign = shaObj.getHMAC(privateKey,"ASCII","HEX");
	      data.signature = sign;
      }
      params.data = JSON.stringify(data);
    }

    if(method=='read' && publicKey && privateKey){
    	var rnd = Math.random()*1000,
	    	sign = "publicKey=" + publicKey + "rnd="+rnd,
	        shaObj = new jsSHA(sign,"ASCII");
	        if(!params.data){
	        	params.data ={};
	        }
	        params.data.publicKey = publicKey;
	        params.data.rnd = rnd;
	        params.data.signature = shaObj.getHMAC(privateKey, "ASCII", "HEX");
    }
    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };
}(this));