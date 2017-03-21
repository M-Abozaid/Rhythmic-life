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
		console.log('entities '+ JSON.stringify(entities));
		let activityName = entities.activity_name[0].value;
		let activityType = entities.activity_type[0].value;

		console.log('entitiy1 value '+activityName+' entitiy2 value '+activityType);

		context.message = 'created activity '+activityName ;
			
		return GraphAPI.sendPlainMessage(recipientId, 'created activity '+activityName + 'of type: '+activityType);


		
	})
	.then(function() {
		return context;
	});
}