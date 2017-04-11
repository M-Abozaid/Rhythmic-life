const addActivity = require('./actions/addActivity')
const platformHelpers = require('./platformHelpers');
const GraphAPI = require('./graphAPI');

let takeAction = function(context,msg){
	let recipientId = context.userData.recipientId;
	if(msg == 'hi'){
		context.current = {};
		//context.current.sub = {};
		let data = platformHelpers.generateQuickReplies('Would you like to keep a note of what you\'re doning right now.✍️', ['Yes','No']);
		GraphAPI.sendPlainMessage(recipientId, 'Hello! 😍😍😍').then(  //+context.userData.first_name).then()
		()=>{GraphAPI.sendTemplateMessage(recipientId, data)})
	}

	if (Object.keys(context.current).length == 0){ // if No context 

		if (msg == "add activity"){
			addActivity(context,msg);

		}else{
			GraphAPI.sendPlainMessage(recipientId, 'I don\'t understant! ')
		}

		
	}else {
		if(context.current.main == 'addingActivity'){
			addActivity(context,msg);
		}else{
			GraphAPI.sendPlainMessage(recipientId, 'I\'m sorry I don\'t understant! 😐😕 try typing help or you could keep a diry log of what you\'re doing right now.')
		}

	}
	return new Promise(function(resolve, reject){
	resolve(context)
	})
}

module.exports = takeAction;