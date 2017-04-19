const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
	type Query {
		hello: String
		quoteOfTheDay: String
		random: Float!
		rollThreeDice: [Int]
		rollDice(numDice: Int!, numSides: Int): [Int]
	}
`);

// Use an exclamation point to indicate a type cannot be nullable, so String! is a non-nullable string
// To use a list type, surround the type in square brackets, so [Int] is a list of integers

// The root provides a resolver function for each API endpoint
var root = {
	hello: () => {
		return 'Hello World!';
	},
	quoteOfTheDay: () => {
		return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
	},
	random: ()=>{
		return Math.random();
	},
	rollThreeDice: () => {
		return [1,2,3].map( num => 1 + Math.floor(Math.random() * 6))
	},
	rollDice: function({numDice, numSides}) {
		var output = [];
		for(var i = 0; i< numDice; i++) {
			output.push(1 + Math.floor(Math.random() * (numSides || 6)));
		}
		return output;
	}
};

var app = express();

app.get('/', (req, res)=> {
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
