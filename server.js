var express = require('express'),
	mongo = require('mongodb'),
	driver = require('./todo.driver.mongo')(mongo),
	http = require('http'),
	path = require('path'),
	jsSHA = require('./sha1'),
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
		var container = null, key, sign,shaObj;
		if(req.body.publicKey && req.body.signature){
			container = req.body;
		}
		if(req.query.publicKey && req.query.signature){
			container = req.query;
		}
		if(!container){
			res.status(401);
			res.json({"error":"Authentication required!"});
		}else{
			db.getUser(container.publicKey,function(err, user){
				if(!user){
					res.status(401);
					res.json({"error":"Authentication required, invalid publicKey"});
				}else{
					sign = "";
					for(key in container){
						if(container.hasOwnProperty(key) && key !== "signature"){
							sign += key + "=" +container[key];
						}
					}
					shaObj = new jsSHA(sign, "ASCII");
					sign = shaObj.getHMAC(user.password,"ASCII","HEX");
					if(sign === container.signature){
						next();
					}else{
						res.status(401);
						res.json({"error":"Authentication required, Authentication failed!"});
					};
				}
			});
		}
	},
	sendApp = function(req, res, next){
		res.sendfile("./public/index.html");
	};
	app.post("/api/auth",[authorize], function(req, res, next){
		res.json({"auth":true, "username": req.body.username});
	});

	app.post("/api/register", function(req, res, next){
		if(req.body.username && req.body.password){
			db.createUser({
				username: req.body.username,
				password: req.body.password
			},
			function(err, created){
				if(created){
					res.json({"auth":true});
				}else{
					res.json({"error": "Username already exist!"});
				}
			});
		}else{
			res.json({"error":"Username and Password required!"});
		}
	});
	
	app.get("/api/todos",[authorize] ,function(req, res, next){
		db.getTodos(req.query.publicKey, function(err, todos){
			if(err){
				res.json({"error":err});
			}
			res.json({"todos":todos});
		});
	});
	app.post("/api/todos",[authorize],function(req, res, next){
		var todo = {
			username: req.body.publicKey,
			task: req.body.task,
			priority: req.body.priority,
			done: req.body.done
		};
		db.addTodo(req.body.publicKey,todo,
			function(err, result){
				todo._id = result;
				res.json(todo);
		});
	});
	app.put("/api/todos/:id",[authorize], function(req,res, next){
		var todo = {
			username: req.body.publicKey,
			task: req.body.task,
			priority: req.body.priority,
			done: req.body.done
		};
		db.updateTodo(req.body.publicKey, req.params.id, todo, function(err, result){
			res.json(result);
		});
	});
	app.delete("/api/todos/:id",[authorize], function(req, res, next){
		db.removeTodo(req.body.publicKey, req.params.id, function(err, result){
			res.json(result);
		});
	});
	app.get("/login",sendApp);
	app.get("/todos",sendApp);
	app.get("/register",sendApp);
	console.log("Database connection stablished!");
});

http.createServer(app).listen(app.get('port'),function(){
	console.log("Express server listening on port " + app.get('port'));
});