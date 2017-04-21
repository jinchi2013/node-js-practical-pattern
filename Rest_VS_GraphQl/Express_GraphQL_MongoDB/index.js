const graphql = require('graphql').graphql;
const express = require('express');
const graphQLHTTP = require('express-graphql');
const Schema = require('./schema');

// This is just an internal test
// var query = `query {
// 	todos {
// 		id
// 		completed
// 	}
// }`;
// graphql(Schema, query).then( function(result) {
// 	console.log(JSON.stringify(result, null, " "));
// });

var app = express()
	.use('/graphql', graphQLHTTP({
		schema: Schema,
		pretty: true
	}))
	.listen(8080, function(err) {
		console.log('GraphQL server is now running on localhost:8080');
	});
