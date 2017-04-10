const addActivity = require('./actions/addActivity')
const platformHelpers = require('./platformHelpers');
const GraphAPI = require('./graphAPI');

let takeAction = function(context,msg){
	let recipientId = context.userData.recipientId;
	if(msg == 'hi'){
		context.first.main = {};
		let data = platformHelpers.generateQuickReplies('Would you like to add new activity', {0:'yes',1:'no'});
		GraphAPI.sendPlainMessage(recipientId, 'Hello! ').then(  //+context.userData.first_name).then()
		()=>{GraphAPI.sendTemplateMessage(recipientId, data)})
	}

	if (Object.keys(context.first.main).length == 0){ // if No context 

		if (msg == "add activity"){
			addActivity(context,msg);

		}

		
	}else {
		if(context.first.main.addingActivity){
			addActivity(context,msg);
		}

	}
	return new Promise(function(resolve, reject){
	resolve(context)
	})
}

module.exports = takeAction;