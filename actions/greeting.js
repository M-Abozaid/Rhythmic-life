'use strict';

const GraphAPI = require('../graphAPI');
const sessionStore = require('../sessionStore');
const debug = require('debug')('cbp:actions:sample');


module.exports = function({sessionId, context, text, entities}) {
	console.log('context in greeting'+JSON.stringify(context));
	return sessionStore.get(sessionId)
	.then(session => {
		console.log('sessionId in greeting '+sessionId);
		const recipientId = session.fbid;
		debug(`Session ${sessionId} received ${text}`);
		debug(`The current context is ${JSON.stringify(context)}`);
		debug(`Wit extracted ${JSON.stringify(entities)}`);
		console.log('user'+context.userData.first_name);
		console.log('entities '+ JSON.stringify(entities));
		let greeting = entities.greetings[0].value;
		console.log('entitiy value '+greeting);

		switch(greeting){
			case 'good afternoon':
			return GraphAPI.sendPlainMessage(recipientId, 'Good afternoon '+context.userData.first_name);

			case "good morning":
			return GraphAPI.sendPlainMessage(recipientId, 'Good morning '+context.userData.first_name);

			case 'good evening':
			return GraphAPI.sendPlainMessage(recipientId, 'Good evening '+context.userData.first_name);

			default:
			return GraphAPI.sendPlainMessage(recipientId, 'Hello! '+context.userData.first_name);
		}

		
	})
	.then(function() {
		return //context;
	});
}