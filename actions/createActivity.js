'use strict';

const GraphAPI = require('../graphAPI');
const sessionStore = require('../sessionStore');
const debug = require('debug')('cbp:actions:sample');
const helper = require('../witHelpers');


module.exports = function({sessionId, context, text, entities}) {
	console.log('context in create'+JSON.stringify(context));
	console.log('entities in create '+ JSON.stringify(entities));
	return sessionStore.get(sessionId)
	.then(session => {
		const recipientId = session.fbid;
		debug(`Session ${sessionId} received ${text}`);
		debug(`The current context is ${JSON.stringify(context)}`);
		debug(`Wit extracted ${JSON.stringify(entities)}`);
		console.log('user '+context.userData.first_name);
		//let activityName = entities.activity_name[0].value;
		//let activityType = entities.activity_type[0].value;
		//let activityName = helper.getEntityValues(entities ,'acitvity_name' );
		let activityType = helper.getEntityValues(entities ,'activity_type' );
		context.activityType = activityType;
		
	})
	
		.then(function(){
		return new Promise(function(resolve, reject) {
			console.log('context in resolve in create'+JSON.stringify(context));
		return resolve(context);
		});
	});
}