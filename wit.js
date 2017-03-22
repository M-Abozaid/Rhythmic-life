'use strict';

const debug = require('debug')('cbp:wit');
const fs = require('fs');
const path = require('path');
const Q = require('q');

const Wit = require('node-wit').Wit;

const GraphAPI = require('./graphAPI');
const sessionStore = require('./sessionStore');
const config = require('./config');



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
				console.log('user said...', request.text);
				console.log('sending...', JSON.stringify(response));
				recipientId = session.fbid;
				
				return GraphAPI.sendTemplateMessage(recipientId, response);
			}) //.then(function() {
			//return context;
			//})
			.catch((err) => {
				console.log('Oops! An error occurred while forwarding the response to', recipientId, ':', err);
			});

	},

	pass ({sessionId, context, text, entities}) {
	console.log('context '+JSON.stringify(context));
	console.log('inside select-joke');
	return sessionStore.get(sessionId)
	.then(function(){
		return new Promise(function(resolve, reject) {
			// const category = firstEntityValue(entities, 'category') || 'default';
			// const sentiment = firstEntityValue(entities, 'sentiment');
			// if (sentiment) {
			//   context.ack = sentiment === 'positive' ? 'Glad you liked it.' : 'Hmm.';
			// } else {
			//   delete context.ack;
			// }

			//const jokes = allJokes[context.cat || 'default'];
			//context.joke = jokes[Math.floor(Math.random() * jokes.length)];
			return resolve(context);
		});
	}
	)}


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