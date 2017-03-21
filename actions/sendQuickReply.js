'use strict';

const GraphAPI = require('../graphAPI');
const platformHelpers = require('../platformHelpers');
const helper = require('../witHelpers');
const sessionStore = require('../sessionStore');
const debug = require('debug')('cbp:actions:sample');


module.exports = function({sessionId, context, text, entities}) {
	console.log('context in sendQuick'+JSON.stringify(context));
	return sessionStore.get(sessionId)
	.then(session => {
		const recipientId = session.fbid;
		debug(`Session ${sessionId} received ${text}`);
		debug(`The current context is ${JSON.stringify(context)}`);
		debug(`Wit extracted ${JSON.stringify(entities)}`);
		console.log('user '+context.userData.first_name);
		console.log('entities '+ JSON.stringify(entities));
		
		//const diary = helper.getEntityValues(entities ,'diary' );
		//let addActivity = entities.diary[0].value;
		//console.log('entitiy value '+diary);
		//const replies = [];
		//if(diary){
		var replies = {0:'habit',1:'occasional'};
		const text1 = 'Choose the activity type';
		//}

		let data = platformHelpers.generateQuickReplies(text1, replies);
		
		return GraphAPI.sendTemplateMessage(recipientId, data);
		
		//return GraphAPI.sendPlainMessage(recipientId, 'Good evening '+context.userData.first_name);

		
	})
	.then(function() {
		return context;
	});
}