"use strict";
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
/*******
	Event: 'newListener'
	The EventEmitter instance will emit its own 'newListener' event 
	before a listener is added to its internal array of listeners.

	And

	The fact that the event is triggered 
	before adding the listener has a subtle but important side effect: 
	any additional listeners registered to the same name within the 'newListener' callback will be inserted 
	before the listener that is in the process of being added.

	which means in the example below, 
	if you don't add listener to event1 outside the newListener, 
	the listener for event1 inside the newListener will not be added.

	Once you add listener for event1 outside the newListener, 
	the listener in newListener will be inserted before the outside one.

	that is the reason why the listener inside triggered first!! 
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

console.log(myEmitter.listenerCount('event1'));