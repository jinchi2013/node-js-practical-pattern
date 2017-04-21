const graphql = require('graphql');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The promise of mongoose is deprecated, so reference mongoose.Promise to global.Promise
mongoose.Promise = global.Promise;

// Mongoose Schema definition
var TODO = mongoose.model('Todo', new Schema({
	id: mongoose.Schema.Types.ObjectId,
	title: String,
	completed: Boolean
}))

// Connect to mongoLab
var COMPOSE_URI_DEFAULT = 'mongodb://graphqltodos:1234qwer@ds153657.mlab.com:53657/mongo_play_ground';
mongoose.connect(process.env.COMPOSE_URI || COMPOSE_URI_DEFAULT, (error) => {
	error ? 
		console.log(error) : 
		console.log('mongolab connected!')
})

// First define a type of each attribute: id, title, and completed
const TodoType = new graphql.GraphQLObjectType({
	name: 'todo',
	fields: function() {
		return {
			id: { type: graphql.GraphQLID, description: 'Todo id' },
			title: { type: graphql.GraphQLString, description: 'Task title' },
			completed: { type: graphql.GraphQLBoolean, description: 'Flag to mark if the Task is completed' }
		}
	}
});

// ID type is a content-agnostic type for carrying unique IDs
/*
	Now we have defined the todo object and described the types for the three fields

	The next step is that we need to show how to resolve a query by returning the data through a query type
*/

var queryType = new graphql.GraphQLObjectType({
	name: "Query",
	fields: function() {
		return {
			todos: {
				type: new graphql.GraphQLList(TodoType), // GraphQLList defines a list of TodoType
				// resolve: function() {
				// 	return TODOs;
				// } 
				// for the case of async process
				resolve: function() {
					return new Promise(function(resolve, reject) {
						TODO.find((err, todos) => {
							err ? reject(err) :
								resolve(todos)
						} )
					});
				}
			}
		}
	}
});

/*
	GraphQL handles adding or changing data as a side-effect of a query.
	Any operation that intends to have side-effects is called a mutation
	Your resolve method can act on the data before returning results

	The idea is that if something was modified as part of a mutation, then the mutation also returns whatever was modified.
*/

/*
	First mutation type, which will add a newTodo
*/

var MutationAdd = {
	type: TodoType,
	descripttion: 'Add a Todo',
	args: {
		title: {
			name: 'Todo title',
			type: new graphql.GraphQLNonNull(graphql.GraphQLString)
		}
	},
	resolve: (root, {title}) => {
		var newTodo = new TODO({
			title: title,
			completed: false
		})

		newTodo.id = newTodo._id;
		return new Promise((resolve, reject) => {
			// .save(callback) will return a promise this is where the warning come from
			// in mongodb driver like insertOne
			newTodo.save((err) => {
				if(err) {
					reject(err)
				} else {
					resolve(newTodo)
				} 
			})
		})
	}
};

var MutationToggle = {
	type: TodoType,
	description: 'Toggle the todo',
	args: {
		id: {
			name: 'Todo Id',
			type: new graphql.GraphQLNonNull(graphql.GraphQLString)
		}
	},
	resolve: (root, {id}) => {
		return new Promise((resolve, reject) => {
			TODO.findById(id, (err, todo) => {
				if(err) {
					reject(err)
					return
				}

				if(!todo) {
					reject('Todo NOT found')
					return
				} else {
					todo.completed = !todo.completed;
					todo.save((err) => {
						err ? reject(err) :
							resolve(todo)
					})
				}
			})
		})
	}
};

var MutationDestory = {
	type: TodoType,
	description: 'Destory the todo',
	args: {
		id: {
			name: 'Todo Id',
			type: new graphql.GraphQLNonNull(graphql.GraphQLString)
		}
	},
	resolve:(root, {id}) => {
		return new Promise((resolve, reject) => {
			TODO.findById(id, (err, todo) => {
				if(err) {
					reject(err)
				} else if (!todo) {
					reject('Todo NOT found')
				} else {
					todo.remove((err) => {
						err ? reject(err) :
							resolve(todo)
					})
				}
			})
		})
	}
}

var MutationToggleAll = {
	type: new graphql.GraphQLList(TodoType),
	description: 'Toggle all todos',
	args: {
		checked: {
			name: 'Todos check',
			type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean)
		}
	},
	resolve: (root, {checked}) => {
		return new Promise((resolve, reject) => {
			TODO.find((err, todos)=> {
				if(err) {
					reject(err)
					return
				}

				TODO.update({
					_id: {
						$in: todos.map(todo => todo._id)
					}
				},
				{
					completed: checked
				},
				{
					multi: true
				}, (err) => {
					if(err) reject(err)
						else TODO.find((err, updatedTodos) => {
							if(err) {
								reject(err)
							} else {
								resolve(updatedTodos)
							}
						})
				})
			} )
		})
	}
}

var MutationType = new graphql.GraphQLObjectType({
	name: 'Mutation',
	fields: {
		add: MutationAdd,
		toggle: MutationToggle,
		destory: MutationDestory,
		toggleAll: MutationToggleAll
	}
});



/*
	The resolver is defined in a resolve property and is a function that returns an array of todos.
*/

// Finally we export the queryType
module.exports = new graphql.GraphQLSchema({
	query: queryType,
	mutation: MutationType
})
