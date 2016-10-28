"use strict";
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
/*******
	Event: 'newListener'
	The EventEmitter instance will emit its own 'newListener' event 
	before a listener is added to its internal array of listeners.
*******/
//Only do once so we don't loop forever

myEmitter.once('newListener', (event, listener)=> {
	console.log(event);
	console.log(listener);

	if(event === 'event1') {
		//Insert a new listener in front
		myEmitter.on('event1', ()=>{
			console.log('BBBBBB');
		});
	}
});

myEmitter.on('event1', ()=> {
	console.log('AAAAA');
});

myEmitter.emit('event1');
//This will trigger two listener for event1 event