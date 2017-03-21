'use strict';

const GraphAPI = require('../graphAPI');
const platformHelpers = require('../platformHelpers');
const helper = require('../witHelpers');
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
		const diary = helper.getEntityValues(entities ,diary );
		//let addActivity = entities.diary[0].value;
		console.log('entitiy value '+diary);
		//const replies = [];
		//if(diary){
		replies = ['habit','occasional'];
		const text = 'allright! tell me the name of the activity?';
		//}

		//let data = platformHelpers.generateQuickReplies(text, replies);
		let data = { 
		    "text": 'allright! tell me the name of the activity?',
		    "quick_replies":[
		    	 {
			        "content_type":"text",
			        "title": 'habit',
			        "payload": key
			      },
			      {

			        "content_type":"text",
			        "title": 'occasional',
			        "payload": key
			      }	]
		   }

		return GraphAPI.sendTemplateMessage(recipientId, data);
		

		
	})
	.then(function() {
		return context;
	});
}