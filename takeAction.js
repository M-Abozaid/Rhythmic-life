const addActivity = require('./actions/addActivity')
const addLog = require('./actions/addLog')
const getLogs = require('./actions/getLogs')
const platformHelpers = require('./platformHelpers');
const GraphAPI = require('./graphAPI');

let takeAction = function(context){
	return new Promise(function(resolve, reject){
	let recipientId = context.userData.recipientId;
	console.log('inside takeAction() ---- ');
	let offer = function(){
		let data = platformHelpers.generateQuickReplies('What would you like to do? ', ['Add diary log','See you diary','Add a new activity']);
		GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{resolve(context)})
	}

	if(context.msg == 'show'){
		data = {
			"attachment":{
		      "type":"template",
		      "payload":{
		        "template_type":"button",
		        "text":"What do you want to do next?",
				"buttons":[
			      {
			        "type":"web_url",
			        "url":"https://salty-plains-47076.herokuapp.com/show/"+recipientId,
			        "title":"View Item",
			        "webview_height_ratio": "compact",
			        "messenger_extensions": true
			      }
			    ]
				}
			}
		}

		GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{resolve(context)})

	}
	if(context.msg == 'hi'){
			context.current = {};
			context.current.main = 'offered'
			//context.current.sub = {};
			GraphAPI.sendPlainMessage(recipientId, 'Hello! '+context.userData.first_name+' 😍😍').then(()=>{offer()})
		}else{
	

	if (Object.keys(context.current).length == 0){ // if No context 
		
			if (context.msg == "add activity"){
				context.current.main = 'addingActivity';
				addActivity(context).then((cont)=>{resolve(cont)});

			}else{
				GraphAPI.sendPlainMessage(recipientId, 'I\'m sorry I don\'t understant! 😐😕 try typing help or you could keep a diry log of what you\'re doing right now.')
				.then(()=>{resolve(context)})
			}
		

		
	}else {   // if context 
		if(context.current.main == 'offered'){
			switch(context.msg){
				case 'Add diary log': 
				context.current.main = 'addingLog';
				addLog(context).then((cont)=>{resolve(cont)});
				break;
				case 'See you diary': 
				context.current.main = 'gettingLogs';
				getLogs(context);
				break;
				case 'Add a new activity': 
				context.current.main = 'addingActivity';
				addActivity(context).then((cont)=>{resolve(cont)});
				break;
				default:
				GraphAPI.sendPlainMessage(recipientId, 'I\'m sorry I don\'t understant! 😐😕 try typing help or you could keep a diry log of what you\'re doing right now.')
			}
		}else{
			//  there is a context going on
			console.log('inside the last else n take action',JSON.stringify(context));
			if(context.current.main == 'addingActivity'){
				addActivity(context).then((cont)=>{resolve(cont)});
			}else{
				if(context.current.main == 'addingLog'){
					addLog(context).then((cont)=>{resolve(cont)});
				}
			}
		}
		

	}
	}
	//resolve(context)
	})
}

module.exports = takeAction;