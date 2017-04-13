'use strict';
const platformHelpers = require('../platformHelpers');
const sessionStore = require('../sessionStore');
//const wit = require('../wit');
const GraphAPI = require('../graphAPI');
const takeAction = require('../takeAction')

module.exports = function handleTextMessage (sessionId, session, msg) {
	const recipientId = session.fbid;
	const context = session.context;
	let mesLog = session.mesLog || [];
	mesLog.push(msg)
	session.mesLog = [] //mesLog


	if (!context.current) { context.current = {}};  
	//if (!context.second) { context.second = {main:{},sub:{}}};

	takeAction(context, msg).then((context)=>{
		if(context.current.continue){takeAction(context, msg).then(()=>{
			console.log(' inside if in continue');
			context.current.continue = false})}else{
		session.context = context;
		sessionStore.saveSession(sessionId, session)
		//sessionStore.destroy(sessionId)
		}
		console.log('context inside  handleTextMessage ',JSON.stringify(context));
		console.log('messeging  ',msg);
		console.log('session  inside  handleTextMessage',JSON.stringify(session));
	})
	

	
	

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


	data   {"sessionId":"cs32174f60-1cbb-11e7-865b-d17b0e22f62c1221099964674152"
	,"newSession":true,"session":{"fbid":"1221099964674152","context":
	{"userData":{"first_name":"Mohammed","last_name":"Abo-zaid","locale":"en_US",
	"timezone":2,"gender":"male","recipientId":"1221099964674152"}}}}
*/

};


