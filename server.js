var express = require('express'),
	mongo = require('mongodb'),
	http = require('http'),
	path = require('path'),
	app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 5000);

	app.use(express.favicon());
	app.use(express.logger('dev'));

	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(app.router);

	app.use(express.static(path.join(__dirname, process.argv[2] || 'public')));

});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpException: true,
        showStack: true
    }));
});

http.createServer(app).listen(app.get('port'),function(){
	console.log("Express server listening on port " + app.get('port'));
});