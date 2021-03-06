'use strict';

const debug = require('debug')('cbp:wit');
const fs = require('fs');
const path = require('path');
const Q = require('q');
const helper = require('./witHelpers');
const Wit = require('./node-wit').Wit;

const GraphAPI = require('./graphAPI');
const sessionStore = require('./sessionStore');
const config = require('./config');
const platformHelpers = require('./platformHelpers');


// bot actions
const actions = {
	send(request, response) {
		/*
		const {
			sessionId,
			context,
			entities
		} = request;
		const {
			text,
			quickreplies
		} = response;
		return new Promise(function(resolve, reject) {
			console.log('user said...', request.text);
			console.log('sending...', JSON.stringify(response));

			return resolve();
		});
		*/

		const {
			sessionId,
			context,
			entities
		} = request;
		const {
			text,
			quickreplies
		} = response;
		debug('saying', response);

		let recipientId;
		return sessionStore.get(request.sessionId)
			.then(session => {
				console.log('context in send '+JSON.stringify(context));
				console.log('sessionId in send '+sessionId);
				recipientId = session.fbid;
				return recipientId;
			}).then(function(recipientId){
				return new Promise(function(resolve, reject) {
				console.log('user said...', request.text);
				console.log('sending...', JSON.stringify(response));
				if(quickreplies){
					var replies = {0:'habit',1:'occasional'};
					const text1 = 'Choose the activity type';
					let data = platformHelpers.generateQuickReplies(text1, replies);
					return GraphAPI.sendTemplateMessage(recipientId, data);
				}else{				
					GraphAPI.sendTemplateMessage(recipientId, response);
					console.log('after sendTemplateMessage insid send action');
				}
				return resolve();
    		});
			})
			.catch((err) => {
				console.log('Oops! An error occurred while forwarding the response to', recipientId, ':', err);
			});

	}
};



(function initCustomActions() {
	var actionsPath = path.join(__dirname, 'actions');
	var actionsFile = fs.readdirSync(actionsPath);

	actionsFile.forEach(function(js) {
		const actionName = path.basename(js, '.js');
		debug(`Initializing wit action [${actionName}]`);
		actions[actionName] = require(path.join(actionsPath, js));
	});
})();



// Setting up our bot
module.exports = new Wit({
	accessToken: config.witToken,
	actions: actions
});