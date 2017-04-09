'use strict';
const platformHelpers = require('../platformHelpers');
const sessionStore = require('../sessionStore');
const wit = require('../wit');
const GraphAPI = require('../graphAPI');
module.exports = function handleTextMessage (sessionId, session, msg) {
	/*
	let context = session.context
	const recipientId = session.fbid;
	let mesLog = session.mesLog || [];
	mesLog.push(msg)
	session.mesLog = mesLog
	sessionStore.saveSession(sessionId, session)
	console.log('context inside  handleTextMessage ',JSON.stringify(context));
	console.log('messeging  ',msg);
	console.log('session  ',JSON.stringify(session));
	if(msg == 'hi'){

		 GraphAPI.sendPlainMessage(recipientId, 'Hello! ');  //+context.userData.first_name).then()
		

		let data = platformHelpers.generateQuickReplies('Would you like to add new activity', {0:'yes',1:'no'});
		 GraphAPI.sendTemplateMessage(recipientId, data);
	}
*/
	//return

	/*
	context.message = msg;
	console.log('inside handleTextMessage'+'context '+JSON.stringify(context))
	wit.runActions(sessionId, msg, context).then((context) => {
              // Our bot did everything it has to do.
              // Now it's waiting for further messages to proceed.
              console.log('Waiting for next user messages');
              console.log('context inside runAct then ',JSON.stringify(context));

              // Based on the session state, you might want to reset the session.
              // This depends heavily on the business logic of your bot.
              // Example:
              // if (context['done']) {
              //   delete sessions[sessionId];
              // }

              // Updating the user's current session state
              //sessions[sessionId].context = context;
            })
            .catch((err) => {
              console.error('Oops! Got an error from Wit: ', err.stack || err);
            })

	*/
/*
		(error, context) => {
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
*/

};


