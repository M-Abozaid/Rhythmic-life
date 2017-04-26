'use strict';
const platformHelpers = require('../platformHelpers');
const sessionStore = require('../sessionStore');
//const wit = require('../wit');
const GraphAPI = require('../graphAPI');
const takeAction = require('../takeAction')
const takeActionAr = require('../arabic/takeActionAr')

module.exports = function handleTextMessage (sessionId, session, msg) {
	
	const context = session.context;
	context.userData.recipientId =  session.fbid;

	context.msg = msg
	session.state = session.state  || 'new';

	if (!context.current) { context.current = {}};  
	if (session.state == 'new' || context.msg == 'GET_STARTED_PAYLOAD') { 
		let data = platformHelpers.generateQuickReplies('Language', ['English','عربي']);
		GraphAPI.sendTemplateMessage(context.userData.recipientId, data).then(()=>{
			session.context = context;
			sessionStore.saveSession(sessionId, session)
		})
		session.state = 'old'; 
	}

	if(context.msg === 'CHOOSE_LANGUAGE'){
		context.userData.lang = false;
		let data = platformHelpers.generateQuickReplies('Language', ['English','عربي']);
		GraphAPI.sendTemplateMessage(context.userData.recipientId, data).then(()=>{
			context.current.main = {}
			session.context = context;
			sessionStore.saveSession(sessionId, session)
		})
	}


	if(!context.userData.lang ){
		if (context.msg  == 'english' || context.msg == 'عربي'){
			if(session.state === 'old'){
				context.current.panel = true;
				context.userData.lang = context.msg
				context.current.main = {}
			}else{
				context.userData.lang = context.msg
				context.current.main = 'getStarted'
			}
	}else{
			let data = platformHelpers.generateQuickReplies('Please choose Language.', ['English','عربي']);
			GraphAPI.sendTemplateMessage(context.userData.recipientId, data).then(()=>{
				context.userData.lang = false;
				session.context = context;
				sessionStore.saveSession(sessionId, session)
			})
		}
	}



if(context.msg=='destroysession'){
		sessionStore.destroy(sessionId).then(()=>{
			GraphAPI.sendPlainMessage(recipientId, 'Session distroyed')
						
		})
	}else{

		if(session.state == 'old' && context.userData.lang){

			if(context.userData.lang == 'english'){
				takeAction(context).then((context)=>{

					if(context.current.continue){takeAction(context).then(()=>{
						console.log(' inside if in continue');
						context.current.continue = false
						session.context = context;
						sessionStore.saveSession(sessionId, session)
					})}else{
							if(Object.keys(context.current).length == 0){
								setTimeout(()=>{
									context.current.panel = true;
									takeAction(context).then(()=>{
										session.context = context;
										sessionStore.saveSession(sessionId, session)
									})
								}, 3000);
							}else{
								session.context = context;
								sessionStore.saveSession(sessionId, session)
								//sessionStore.destroy(sessionId)
							}
						}

						

					console.log('context inside  handleTextMessage ',JSON.stringify(context));
					console.log('messeging  ',msg);
					console.log('session  inside  handleTextMessage',JSON.stringify(session));
				})
				
			}

			if(context.userData.lang == 'عربي'){
				takeActionAr(context).then((context)=>{
					console.log('current main con',context.current.main);
					if(context.current.continue){takeActionAr(context).then(()=>{
						console.log(' inside if in continue');
						context.current.continue = false
						session.context = context;
						sessionStore.saveSession(sessionId, session)
					})}else{
							if(Object.keys(context.current).length == 0){
								setTimeout(()=>{
									context.current.panel = true;
									takeActionAr(context).then(()=>{
										session.context = context;
										sessionStore.saveSession(sessionId, session)
									})
								}, 3000);
							}else{
								session.context = context;
								sessionStore.saveSession(sessionId, session)
								//sessionStore.destroy(sessionId)
							}
						}

						

					console.log('context inside  handleTextMessage ',JSON.stringify(context));
					console.log('messeging  ',msg);
					console.log('session  inside  handleTextMessage',JSON.stringify(session));
				})
				
			}

		}
	


	}

};

//


//

	//if (!context.second) { context.second = {main:{},sub:{}}};

	
	

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



