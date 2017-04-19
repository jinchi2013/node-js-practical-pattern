const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
	input MessageInput {
		content: String
		author: String
	}

	type Message {
		id: ID!
		content: String
		author: String
	}

	type Mutation {
		createMessage(input: MessageInput): Message
		updateMessage(id: ID!, input: MessageInput): Message
	}

	type RandomDie {
		numSides: Int!
		rollOnce: Int!
		roll(numRolls: Int!): [Int]
	}

	type Query {
		rollDice(numDice: Int!, numSides: Int): [Int]
		getDie(numSides: Int): RandomDie
		getMessage(id: ID!): Message
	}
`);

// Use an exclamation point to indicate a type cannot be nullable, so String! is a non-nullable string
// To use a list type, surround the type in square brackets, so [Int] is a list of integers

class RandomDie {
	constructor(numSides) {
		this.numSides = numSides;
	}

	rollOnce() {
		return 1 + Math.floor(Math.random() * this.numSides);
	}

	roll({numRolls}) {
		var output = [];
		for(var i = 0; i < numRolls; i++) {
			output.push(this.rollOnce())
		}
		return output;
	}
}

const Message = (id, {content, author}) => ({
	id: id,
	content: content,
	author: author
})

// The root provides a resolver function for each API endpoint
// When a resolver takes arguments, they are passed as one “args” object, 
// as the first argument to the function.

var fakeDatabase = {};

var root = {
	rollDice: function({numDice, numSides}) {
		var output = [];
		for(var i = 0; i< numDice; i++) {
			output.push(1 + Math.floor(Math.random() * (numSides || 6)));
		}
		return output;
	},
	getDie: function({ numSides }) {
		return new RandomDie(numSides || 6)
	},
	getMessage: function({id}) {
		if(!fakeDatabase[id]) {
			throw new Error(`no message exists with id ${id}`);
		}
		return Message(id, fakeDatabase[id])
	},
	createMessage: function({input}) {
		// Create a random id for our "database"
		let id = require('crypto').randomBytes(10).toString('hex');

		fakeDatabase[id] = input;
		return Message(id, fakeDatabase[id])
	},
	updateMessage: function({id, input}) {
		if(!fakeDatabase[id]) {
			throw new Error(`no message exists with id ${id}`);
		}
		// This replaces all old data, but some app require to just update one field
		fakeDatabase[id] = Object.assign({},fakeDatabase[id], input);
		return Message(id, fakeDatabase[id])
	}
};

var app = express();

app.get('/', (req, res)=> {

	// must set root or serdFile methode will bump error with the path of the file
	var options = {
		root: __dirname
	}

	res.sendFile('./index.html', options, (err) => {

		console.log('Sent');
	})
})

app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: root,
	graphiql: true
}));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql')
