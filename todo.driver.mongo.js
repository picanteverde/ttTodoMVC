module.exports = function(mongo){
	var Db = mongo.Db,
		Connection = mongo.Connection,
		Server = mongo.Server,
		config = config || {},
		db = config.db || "ttTodoMVC",
		port = config.port || 27017,
		host = config.host || 'localhost',
		collections = config.collections || {},
		profilesColl = collections.profiles || "profiles",
		todoColl = collections.todos || "todos",
		ids = config.ids || {},
		profilesId = ids.profilesId || "username",
		client = new Db(db, new Server(host, parseInt(port, 10)), {safe: true});

	return {
		open: function(cb){
			client.open(function(err, p_client){
				if(err){
					cb(err);
				}
				cb(err,{
					login: function(username, password, cb){
						client.collection(profilesColl, function(err, collection){
							if(err){
								cb(err);
							}
							var query = {
								username: username,
								password: password
							};
							collection.findOne(query, 
								function(err, doc){
									if(err){
										cb(err);
									}
									if(doc){
										cb(err, true);
									}else{
										cb(err, false);
									}
							});
						});
					},
					getTodos: function(username, cb){
						client.collection(todoColl,function(err, collection){
							if(err){
								cb(err);
							}
							collection.find({username: username}, function(err,cursor){
								if(err){
									cb(err);
								}
								cursor.toArray(function(err, todos){
									cb(err,todos);
								});
							});
						});
					}
				});
			});
		},
		client: client
	};
};