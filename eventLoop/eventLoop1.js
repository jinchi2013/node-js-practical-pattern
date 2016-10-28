"use strict";
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
/*******
	Event: 'newListener'
*******/
//Only do once so we don't loop forever
myEmitter.once('newListener', (event, listener)=> {
	if(event === 'event') {
		//Insert a new listener in front
		myEmitter.on('event', ()=>{
			console.log('BBBBBB');
		});
	}
});

myEmitter.on('event', ()=> {
	//callback for event, which will 
	console.log('AAAAA');
});

myEmitter.emit('event');