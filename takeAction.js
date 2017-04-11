const addActivity = require('./actions/addActivity')
const addLog = require('./actions/addLog')
const getLogs = require('./actions/getLogs')
const platformHelpers = require('./platformHelpers');
const GraphAPI = require('./graphAPI');

let takeAction = function(context,msg){
	let recipientId = context.userData.recipientId;

	let offer = function(){
		let data = platformHelpers.generateQuickReplies('What would you like to do? ', ['Add diary log','See you diary','Add a new activity']);
		GraphAPI.sendTemplateMessage(recipientId, data)
	}

	
	if(msg == 'hi'){
		context.current.main = 'offered'
		//context.current.sub = {};
		GraphAPI.sendPlainMessage(recipientId, 'Hello! '+context.userData.first_name+' 😍😍😍').then(()=>{offer()})
	}

	if (Object.keys(context.current).length == 0){ // if No context 

		if (msg == "add activity"){
			context.current.main = 'addingActivity';
			addActivity(context,msg);

		}else{
			GraphAPI.sendPlainMessage(recipientId, 'I\'m sorry I don\'t understant! 😐😕 try typing help or you could keep a diry log of what you\'re doing right now.')
		}

		
	}else {
		if(context.current.main == 'offered'){
			switch(msg){
				case 'Add diary log': 
				context.current.main = 'addingLog';
				addLog(context,msg);
				break;
				case 'See you diary': 
				context.current.main = 'gettingLogs';
				getLogs(context,msg);
				break;
				case 'Add a new activity': 
				context.current.main = 'addingActivity';
				addActivity(context,msg);
				break;
				default:
				GraphAPI.sendPlainMessage(recipientId, 'I\'m sorry I don\'t understant! 😐😕 try typing help or you could keep a diry log of what you\'re doing right now.')
			}
		}else{
			//  there is a context going on
			if(context.current.main == 'addingActivity'){
				addActivity(context,msg);
			}else{
				if(context.current.main == 'addingLog'){
					addLog(context,msg)
				}
			}
		}
		

	}
	return new Promise(function(resolve, reject){
	resolve(context)
	})
}

module.exports = takeAction;