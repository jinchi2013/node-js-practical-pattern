"use strict";
// /The following example shows a simple EventEmitter instance with a single listener. 
//The eventEmitter.on() method is used to register listeners, 
//while the eventEmitter.emit() method is used to trigger the event.

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b)=>{
	console.log(a, b, this);
});
myEmitter.emit('event', 'a', 'b');

//The EventListener calls all listeners synchronously in the order in which they were registered. 
//This is important to ensure the proper sequencing of events and to avoid race conditions or logic errors. 
//When appropriate, 
//listener functions can switch to an asynchronous mode of operation using the setImmediate() or process.nextTick() methods:

const myEmitterAsync = new MyEmitter();
myEmitterAsync.on('asynEvent', ()=>{
	setImmediate(()=>{
		console.log('this happens asynchronous');
	});
});
myEmitter.emit('event', 'a1', 'b', new Error('whoops!'));

myEmitterAsync.emit('asynEvent', new Error('whoops!'));

myEmitter.emit('event', 'a2', 'b', new Error('whoops!'));
myEmitter.emit('event', 'a3', 'b', new Error('whoops!'));