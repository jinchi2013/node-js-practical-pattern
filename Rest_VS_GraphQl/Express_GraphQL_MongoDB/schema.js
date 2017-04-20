const graphql = require('graphql');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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


let TODOs = [
	{
		"id": 1446412739542,
		"title": "Read emails",
		"completed": false
	},
	{
		"id": 1446412740883,
	    "title": "Buy orange",
	    "completed": true
	}
];

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
				type: new graphql.GraphQLList(TodoType),
				// resolve: function() {
				// 	return TODOs;
				// } 
				// for the case of async process
				resolve: function() {
					return new Promise(function(resolve, reject) {
						setTimeout(function() {
							resolve(TODOs);
						}, 1500);
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
			newTodo.save((err) => {
				if(err) {
					reject(err)
				} else {
					resolve(newTodo)
				} 
			})
		})
	}
}

var MutationType = new graphql.GraphQLObjectType({
	name: 'Mutation',
	fields: {
		add: MutationAdd
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
