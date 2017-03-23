'use strict';

const GraphAPI = require('../graphAPI');
const platformHelpers = require('../platformHelpers');
const sessionStore = require('../sessionStore');
const wit = require('../wit');

module.exports = function handleQuickReply(sender, sessionId, context, payload) {
	//context.message = msg;

	console.log('inside handleQuickReply '+'context '+JSON.stringify(context)+'payload '+ JSON.stringify(payload));

	let payloadTokens = payload.split(':');
	const msg = payloadTokens[0];
	context.message = msg;
	wit.runActions(sessionId, msg, context, (error, context) => {
		if (error) {
			console.log('Oops! Got an error from Wit:', error);
			return;
		} 
		
		console.log('Waiting for futher messages.');

		if (context['done']) {
			console.log('context done inside runActions');
		   	sessionStore.destroy(sessionId);
		}			
	});

/*	
	let payloadTokens = payload.split(':');
	const action = payloadTokens[0];
	const data = payloadTokens[1];

	switch(action) {
		
		case 'sampleLocation':	
			return sendShareLocationSample(sender);
			break;
		case 'sampleList':
			return sendListSample(sender);
			break;
		case 'sampleGenericCards':
			return sendGenericCardsSample(sender);
			break;
	}
*/
}


function sendShareLocationSample(sender) {
	let data = platformHelpers.generateSendLocation('Please share your location');
	return GraphAPI.sendTemplateMessage(sender, data);	
}


function sendListSample(sender) {
	return GraphAPI.sendPlainMessage(sender, 'coming soon');
}


function sendGenericCardsSample(sender) {
	return GraphAPI.sendPlainMessage(sender, 'coming soon');	
}