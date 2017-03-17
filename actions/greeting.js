'use strict';

const GraphAPI = require('../graphAPI');
const sessionStore = require('../sessionStore');
const debug = require('debug')('cbp:actions:sample');


module.exports = function({sessionId, context, text, entities}) {
	console.log('context '+JSON.stringify(context));
	return sessionStore.get(sessionId)
	.then(session => {
		const recipientId = session.fbid;
		debug(`Session ${sessionId} received ${text}`);
		debug(`The current context is ${JSON.stringify(context)}`);
		debug(`Wit extracted ${JSON.stringify(entities)}`);
		console.log('user'+context.userData.first_name);
		console.log('entities'+ JSON.stringify(entities));
		return GraphAPI.sendPlainMessage(recipientId, 'Hello '+context.userData.first_name);
	})
	.then(function() {
		return context;
	});
}