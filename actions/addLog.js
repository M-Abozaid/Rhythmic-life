const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');
const mongoose = require('mongoose');
const User = require('../schemas/user');
const _ = require('lodash');


module.exports = function(context){
let recipientId = context.userData.recipientId; // here because it was not accessble at saveLog
	return new Promise(function(resolve, reject){
	let saveLog = function(){


			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				console.log('the user  ',JSON.stringify(user));

				

				let obj = {
					logName: context.current.logName,
					note: context.current.note,
					activityId: user.activities.find((elem)=>{return elem.name == context.current.logName })._id,
				}

				console.log('Obj  ', JSON.stringify(obj))
				user.activityLogs.push(obj)

				user.save(function (err, user) {
							if (err) throw err;
							context.current = {}
							resolve(context)
							GraphAPI.sendPlainMessage(recipientId, 'Log added successfully!  ✌️')
				});
			})
		

	}

	
		//context.current.main = 'addinnissangLog'
		console.log("adding logs %j");

		if(context.current.main && !context.current.chooseLog){
			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				list = _.map(user.activities,(elem)=>{return elem.name})
				console.log('list first  ', JSON.stringify(list))
				list.push('New activity')
				console.log('list sec ', JSON.stringify(list));
				//let data = platformHelpers.generateQuickReplies('Choose the activity ', list);
				let data = {

		    
		    "quick_replies": [
					    	 {
						        "content_type":"text",
						        "title": "fsda",
						        "payload": 4
						      }	
					    ],
		
					"attachment":{
				      "type":"template",
				      "payload":{
				        "template_type":"button",
				        "text":"what do you want?",
						"buttons": [
				     			{
						        "type":"postback",
						        "title":"opt1",
						        "webview_height_ratio": "compact",
						        "payload":0
						      },{
						        "type":"postback",
						        "title":"opt2",
						        "webview_height_ratio": "compact",
						        "payload":1
						      },{
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
				//platformHelpers.generateButtonsTemplate('Choose the activity ',[{butn:'option1',},{butn:'opti2'}])
				GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
					context.current.chooseLog = true;
					resolve(context)
				})

			})
		}else{
			if(context.current.chooseLog && !context.current.logName){
				if(context.msg == 'New activity'){
					context.current = {}
					context.current.main = 'addingActivity';
					context.current.nextAddLog = true;
					context.current.continue = true
					resolve(context);
				}else{
					let data = platformHelpers.generateQuickReplies('Type a note to be included if you like.', ['No thats it']);
					GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
						context.current.logName = context.msg;
						resolve(context)
					})
				}
			}else{
				if(context.current.logName && !context.current.note){
					if(context.msg == "No thats it"){
						context.current.note = " ";
					}else{
						context.current.note = context.msg;
					}

					saveLog();
				}
			}
		}
	})

}