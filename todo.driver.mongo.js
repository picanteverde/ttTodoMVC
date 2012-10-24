module.exports = function(mongo){
	var Db = mongo.Db,
		Connection = mongo.Connection,
		ObjectID = mongo.ObjectID,
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
					createUser: function(user, cb){
						client.collection(profilesColl, function(err, collection){
							if(err){
								cb(err);
							}
							collection.findOne({
								username: user.username
							}, function(err, o_user){
								if(err){
									cb(err);
								}
								if(!o_user){
									collection.insert({
										username: user.username,
										password: user.password
									},{ safe: true },
									function(err, result){
										cb(err,true);
									});
								}else{
									cb(err,false);
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
					},
					addTodo: function(username, todo, cb){
						client.collection(todoColl, function(err, collection){
							if(err){
								cb(err);
							}
							collection.insert({
									username: username,
									task: todo.task,
									priority: todo.priority,
									done: todo.done
								},
								{safe:true}, function(err, result){
								if(err){
									cb(err);
								}
								cb(err, result[0]._id.toString());
							});
						});
					},
					removeTodo: function(username, id, cb){
						client.collection(todoColl, function(err, collection){
							if(err){
								cb(err);
							}
							collection.remove({
								username: username,
								"_id": new ObjectID.createFromHexString(id)
							}, {safe: true},
							function(err, result){
								cb(result);
							});
						});
					},
					updateTodo: function(username, id, todo, cb){
						client.collection(todoColl, function(err, collection){
							if(err){
								cb(err);
							}
							collection.update({
								username: username,
								"_id": new ObjectID.createFromHexString(id)
							},
							{
								"$set": {
									task: todo.task,
									priority: todo.priority,
									done: todo.done
								}
							}, {safe: true},
							function(err, result){
								cb(err, result);
							});
						});
					}
				});
			});
		},
		client: client
	};
};