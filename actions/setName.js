'use strict';

const GraphAPI = require('../graphAPI');
const sessionStore = require('../sessionStore');
const debug = require('debug')('cbp:actions:sample');
const platformHelpers = require('../platformHelpers');
const helper = require('../witHelpers');

module.exports = function({sessionId, context, text, entities}) {
	console.log('context in setName '+JSON.stringify(context));
	return sessionStore.get(sessionId)
	.then(session => {
		console.log('sessionId in setName '+sessionId);
		const recipientId = session.fbid;
		debug(`Session ${sessionId} received ${text}`);
		debug(`The current context is ${JSON.stringify(context)}`);
		debug(`Wit extracted ${JSON.stringify(entities)}`);
		console.log('user'+context.userData.first_name);
		console.log('entities '+ JSON.stringify(entities));
		
		return new Promise(function(resolve, reject) {
			let activityName = helper.getEntityValues(entities ,'acitvity_name' );
			context.activityName = activityName;
		return resolve(context);
		});
		
	})
}