const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');
const mongoose = require('mongoose');
const _ = require('lodash');
const User = require('../schemas/user');

module.exports = function(context, msg){
// getting started
return new Promise(function(resolve, reject){
console.log("getting logsssssssssssss");
	let recipientId = context.userData.recipientId;

	let saveActivity = function(){
		return new Promise(function(resolve, reject){
			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				console.log('the user  ',JSON.stringify(user));
				let obj = {
					name: context.current.name,
					type: context.current.type,
					positivity: context.current.positivity,
					hebitual: context.current.habit
				}
				console.log('Obj  ', JSON.stringify(obj))
				user.activities.push(obj)
				//console.log('Pushed ', JSON.stringify(user),' user.activities ',JSON.stringify(user.activities));
				user.save(function (err, user) {
	                        if (err) throw err;
	                        resolve()
	                    });
			})
		
		})
	}


	let saveLog = function(){

		return new Promise(function(resolve, reject){
			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				console.log('the user  ',JSON.stringify(user));
				let howLongInMil 
				switch(context.current.howLong){
					case '30 min':
					howLongInMil = 30 * 60 *1000
					break;
					case '1 hr':
					howLongInMil = 1   * 60 * 60 *1000
					break;
					case '1.5 hr':
					howLongInMil = 1.5 * 60 * 60 *1000
					break;
					case '2 hr':
					howLongInMil = 2   * 60 * 60 *1000
					break;
					case '2.5 hr':
					howLongInMil = 2.5 * 60 * 60 *1000
					break;
					case '3 hr':
					howLongInMil = 3   * 60 * 60 *1000
					break;
					case '3.5 hr':
					howLongInMil = 3.5 * 60 * 60 *1000
					break;
					case '4 hr':
					howLongInMil = 4   * 60 * 60 *1000
					break;
					case '5 hr':
					howLongInMil = 5   * 60 * 60 *1000
					break;
				}
				let obj = {
					logName: context.current.logName,
					note: context.current.note,
					activityId: user.activities.find((elem)=>{return elem.name.toLowerCase() == context.current.logName.toLowerCase() })._id,  // ading to lower case temporarly because the bb have some activiy upper
					time: Date.now(), //+ (user.timezone *60*60*1000),
					span: howLongInMil
				}

				console.log('Obj  ', JSON.stringify(obj))
				user.activityLogs.push(obj)

				user.save(function (err, user) {
							if (err) throw err;
							
							 GraphAPI.sendPlainMessage(recipientId, 'Log added successfully!  ✌️').then(()=>{resolve()})
				});
			})
		
		})
	}


	

	if(context.current.main == 'getStarted' && !context.current.first){

		GraphAPI.sendPlainMessage(recipientId, 'Oh Hello '+context.userData.first_name+'! 😃 let\'s  help You keep track of your productivity.')
		setTimeout(()=>{
		GraphAPI.sendPlainMessage(recipientId, ' I can help you keep a diary of any activity you do, and give you a useful statistics about your time.')
		}, 3000);
		setTimeout(()=>{
		GraphAPI.sendPlainMessage(recipientId, ' First lets add a new activity.')
		}, 6500);
		setTimeout(()=>{
		GraphAPI.sendPlainMessage(recipientId, ' Type a name of activity you\'d like to keep track of. (e.g. working out, studying physics)')
		}, 7500);
		context.current.first = true
		resolve(context)
	}else{
		if(context.current.first && !context.current.name){
			let data = platformHelpers.generateQuickReplies('👌🏼 Good now choose a type for the activity.', {0:'work 🔧',1:'study 📖',2:'entertainment 💥'});
			GraphAPI.sendTemplateMessage(recipientId, data)
			context.current.name = context.msg
			resolve(context)
		}else{
			if(context.current.name && !context.current.type){
				let data = platformHelpers.generateQuickReplies('Is it a positive thing?', {0:'positive 👍🏼',1:'ngative 👎🏼',2:'other ☝🏼'});
				GraphAPI.sendTemplateMessage(recipientId, data)
				context.current.type = context.msg
				resolve(context)
			}else{
				if(context.current.type && !context.current.positivity){
					let data = platformHelpers.generateQuickReplies('Do you think you do this activity as a habit? 🔁', {0:'Yes 👈🏼',1:'👉🏼 NO'});
					GraphAPI.sendTemplateMessage(recipientId, data)
					context.current.positivity = context.msg
					resolve(context)
				}else{
					if(context.current.positivity && !context.current.habit){
						context.current.habit = context.msg
						saveActivity().then(()=>{
								GraphAPI.sendPlainMessage(recipientId, 'Activity created successfully!  👌🏼').then(()=>{
								
								let data = platformHelpers.generateQuickReplies('✋🏼 Now let\'s add your first diary. What activity  you\'re going to do now.', [context.current.name,'New Activity']);
								//platformHelpers.generateButtonsTemplate('Choose the activity ',[{butn:'option1',},{butn:'opti2'}])
								GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
									context.current.chooseLog = true
									resolve(context)
								})
									
								
							})
					})
				}else{
				if(context.current.chooseLog && !context.current.logName){
					if(context.msg == 'new activity'){
						context.current = {}
						context.current.main = 'addingActivity';
						context.current.nextGetStarted = true;
						context.current.continue = true;
						resolve(context);
					}else{	
						User.findOne({recipientId : recipientId},(err,user)=>{
							if (err) throw err;
							 list = _.map(user.activities,(elem)=>{return elem.name})
							console.log('here');
						if(list.indexOf(context.msg) >= 0){
							context.current.logName = context.msg;
							let data = platformHelpers.generateQuickReplies('For how long do you intend to '+ context.current.logName+' ⌚. Choose or type the exact time in minutes.', ['30 min','1 hr','1.5 hr','2 hr','2.5 hr','3 hr','3.5 hr','4 hr','5 hr']);
							GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
								
								resolve(context)
							})	
						}else{
							GraphAPI.sendPlainMessage(recipientId,'You haven\'t created this activity choose new activity to create it').then(()=>{
								context.current.main = 'addingLog'
								context.current.chooseLog = false;
								context.current.continue = true;
								resolve(context)
							})
						}
						})				
					}
				}else{
					if(context.current.logName && !context.current.howLong){
						let data = platformHelpers.generateQuickReplies('Finally you can add a note to your diary 📝. type a note to be included if you like', ['No thats it']);
							GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
								context.current.howLong = context.msg;
								resolve(context)
							})
					}else{
						if(context.current.howLong && !context.current.note){
							if(context.msg == "no thats it"){
								context.current.note = " ";
							}else{
								context.current.note = context.msg;
							}

							saveLog().then(()=>{
							let	data = {
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
							        "text":"Done, now if you want to view your diary and statistics, have a nice day.",
									"buttons":[
								      {
								        "type":"web_url",
								        "url":"https://salty-plains-47076.herokuapp.com/show/"+recipientId,
								        "title":"View your diary 📜",
								        "webview_height_ratio": "compact",
								        "messenger_extensions": true
								      },
								      {
								        "type":"web_url",
								        "url":"https://salty-plains-47076.herokuapp.com/show/"+recipientId + "/#!/statistics",
								        "title":"View your statistics 📈",
								        "webview_height_ratio": "compact",
								        "messenger_extensions": true
								      }
								    ]
									}
								}
							}

							GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
								context.current = {}
								context.current.main = 'offered';
								context.current.panel = false;
								resolve(context)})
								
							});
						}
					}
					} 
			}
		}

	}




}
}
})
}