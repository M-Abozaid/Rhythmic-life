const getStarted = require('./actions/getStarted')
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
		let data = {
							"quick_replies":  [
						    		{
							        "content_type":"text",
							        "title": 'Add a diary entry' ,
							        "payload": 1
							      }	,
							      {
							        "content_type":"text",
							        "title": "Add a new activity",
							        "payload": 3
							      }],

							"attachment":{
						      "type":"template",
						      "payload":{
						        "template_type":"button",
						        "text":"What do you want to do?",
								"buttons":[
							      {
							        "type":"web_url",
							        "url":"https://salty-plains-47076.herokuapp.com/show/"+recipientId,
							        "title":"View your diary",
							        "webview_height_ratio": "compact",
							        "messenger_extensions": true
							      },
							      {
							        "type":"web_url",
							        "url":"https://salty-plains-47076.herokuapp.com/show/"+recipientId + "/#!/statistics",
							        "title":"View your statistics",
							        "webview_height_ratio": "compact",
							        "messenger_extensions": true
							      }
							    ]
								}
							}
						}

						GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
							context.current.main = 'offered';
							context.current.panel = false;
							resolve(context)})
	}
	// deleting context for debugging
		if(context.msg == 'delete.context'){
		  GraphAPI.sendPlainMessage(recipientId, 'context deleted')
		  .then(()=>{context.current = {};
		 	context.current.deleted = true;
		  	resolve(context)}); };
	    
	    if(context.msg == 'hi' || context.msg == 'hello' || context.msg == 'hey' || context.msg == 'good morning' || context.msg == 'you' ||context.msg == 'good evening'|| context.msg == 'hey rhythmic' || context.msg == 'hello rhythmic' || context.msg == 'hi rhythmic' || context.msg == 'sup'){
				context.current = {};
				GraphAPI.sendPlainMessage(recipientId, 'Hello! '+context.userData.first_name+' 😍😍').then(()=>{console.log('Hello panal'); offer();})
			}



		if (context.msg == 'GET_STARTED_PAYLOAD' || context.current.newUser ) { // first msg ever
				context.current.main = 'getStarted'
				getStarted(context).then((cont)=>{resolve(cont)});
			} 
		// if context 
		else { if(context.current.main == 'offered'){
				switch(context.msg){
					case 'add a diary entry': 
					context.current.main = 'addingLog';
					context.current.future = true;
					addLog(context).then((cont)=>{resolve(cont)});
					break;
					case 'see you diary': 
					context.current.main = 'gettingLogs';
					getLogs(context);
					break;
					case 'add a new activity': 
					context.current.main = 'addingActivity';
					addActivity(context).then((cont)=>{resolve(cont)});
					break;
					default:
					// create some fuzzy matching here
					GraphAPI.sendPlainMessage(recipientId, 'I\'m sorry I don\'t understant! 😐😕  Try choose on of these.').then(()=>{
						offer();
					})
				}

			}
				else {
					if (context.current.panel){ // Send the panel
						console.log("panal offer");
						offer();
					}
				else{
					//  there is a context going on
					console.log('inside the last else n take action',JSON.stringify(context));
					if(context.current.main == 'addingActivity'){
						addActivity(context).then((cont)=>{resolve(cont)});
					}else{
						if(context.current.main == 'addingLog'){
							addLog(context).then((cont)=>{resolve(cont)});
						}else{
							if(context.current.main == 'getStarted'){
								context.current.main = 'getStarted'
								getStarted(context).then((cont)=>{resolve(cont)});
							}
						}
					}
				}
			

			}
	}
	//resolve(context)
	
	})
}

module.exports = takeAction;