define([
	"app"
	], function(app){
		var Todo = Backbone.Model.extend({
				idAttribute: "_id",
				urlRoot: "/api/todos"
			}),
			TodosList = Backbone.Collection.extend({
				model: Todo,
				url: "/api/todos",
				parse: function(resp){
					return resp.todos;
				},
				comparator: function(todo){
					return todo.get("priority");
				}
			}),
			TodoView = Backbone.View.extend({
				template: "todos/todo",
				events:{
					"click input.todo-edit": "edit",
					"click input.todo-delete": "del"
				},
				serialize: function(){
					var data = this.model.toJSON();
					return {
						task: data.task,
						done: data.done ? "checked=\"checked\"" : "",
						priority: data.priority
					};
				},
				edit: function(){
					if(this.editing){
						this.$("input.todo-edit").val("Edit");
						this.editing = false;
						this.model.set({
							task: this.$(".todo-task").val(),
							priority: this.$(".todo-priority").val(),
							done: this.$(".todo-done").is(":checked")
						});
						this.model.save();
					}else{
						this.$("input.todo-edit").val("Save");
						this.editing = true;
					}
				},
				del: function(){
					this.model.destroy();
					this.remove();
				}
			}),
			TodoListView = Backbone.View.extend({
				tagName: "ul",
				className: "todos-list",
				addOne: function(todo){
					var view = new TodoView({model: todo});
					this.insertView(view).render();
					console.log("insertView");
				},
				addAll: function(){
					var that = this;
					that.collection.each(function(item){
						that.addOne(item);
					});
				},
				beforeRender: function(){
					console.log("br TodoLisView");
				}
			}),
			TodosView = Backbone.View.extend({
				template: "todos/todos",
				events: {
					"click input.todos-add": "add"
				},
				initialize: function(){
					this.collection = new TodosList();
					this.todoList = new TodoListView({
						collection: this.collection
					});
					this.collection.on("add", this.todoList.addOne, this.todoList);
					this.collection.on('reset',this.todoList.addAll, this.todoList);
					
				},
				beforeRender: function(){
					this.setView(".list", this.todoList);
					console.log("br TodosView");
				},
				afterRender: function(){
					this.collection.fetch();
					console.log("fetch");
				},
				add: function(){
					if(!$("#todo-new").val()) return;
					var todo = new Todo({
						task: $("#todo-new").val(),
						done: false,
						priority: 1
					});
					todo.save();
					this.collection.add(todo);
					$("#todo-new").val('');
				}
			});
			return TodosView;
});