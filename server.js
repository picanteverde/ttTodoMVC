var express = require('express'),
	mongo = require('mongodb'),
	driver = require('./todo.driver.mongo')(mongo),
	http = require('http'),
	path = require('path'),
	app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 5000);

	app.use(express.favicon());
	app.use(express.logger('dev'));

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret:"keySecretPhrase", key:"sid", cookie:{secgure:true}}));
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

driver.open(function(err,db){
	var authorize = function(req, res, next){
		if(!req.session.username){
			res.status(401);
			res.json({"error":"Authentication required!"});
		}else{
			next();
		}
	};
	app.post('/api/login', function(req, res, next){
		if(req.body.username && req.body.password){
			db.login(req.body.username, req.body.password,function(err, auth){
				if(auth){
					req.session.username = req.body.username;
					res.json({"auth":true, "username": req.body.username});
				}else{
					res.json({"error":"Username or Password not found!"});
				}
			});
		}else{
			res.json({"error":"Username and Password required"});
		}
	});

	app.get("/api/todos",[authorize] ,function(req, res, next){
		db.getTodos(req.session.username, function(err, todos){
			if(err){
				res.json({"error":err});
			}
			res.json({"todos":todos});
		});
	});
	console.log("Database connection stablished!");
});

http.createServer(app).listen(app.get('port'),function(){
	console.log("Express server listening on port " + app.get('port'));
});