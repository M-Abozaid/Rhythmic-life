const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');
const mongoose = require('mongoose');
const User = require('../schemas/user');


module.exports = function(context){
return new Promise(function(resolve, reject){
	console.log('done');
	let recipientId = context.userData.recipientId;


	let saveActivity = function(){
		return new Promise(function(resolve, reject){
			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				//console.log('the user  ',JSON.stringify(user));
				let obj = {
					name: context.current.activityName,
					type: context.current.activityType,
					positivity: context.current.positivity,
					hebitual: context.current.hebitual
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
	console.log('inside  --- addActivity ---');
	if(context.current.main && !context.current.chooseActivity){ //  there is only main context 
		//context.first.sub.activityName = true
		
		console.log('activity ',context.msg,' saved');
		let data = platformHelpers.generateQuickReplies('Choose the Type ', {0:'work 🔧',1:'study 📖',2:'entertainment 💥'});
		GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
		context.current.chooseActivity = true ;
		resolve(context)
		})
		

	}else {
			if(context.current.chooseActivity && !context.current.activityType){
			context.current.activityType = context.msg	
			resolve(context)
			GraphAPI.sendPlainMessage(recipientId, 'Ok! tell me the name of the activity ')
		 	}else{
				if(context.current.activityType && !context.current.activityName){
					context.current.activityName = context.msg
					console.log('activity type ',context.msg,' saved');
					let data = platformHelpers.generateQuickReplies('is it positve or ngative', {0:'positive 👍🏼',1:'ngative 👎🏼',2:'other 🏼'});
					GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{resolve(context)})
					
				}else{
					if(context.current.activityName && !context.current.positivity){
						context.current.positivity = context.msg
						let data = platformHelpers.generateQuickReplies('Is it a habit 🔁', {0:'Yes 👈🏼',1:'👉🏼 NO'});
						GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{resolve(context)})
					}else{
						if(context.current.positivity && !context.current.hebitual){
							context.current.hebitual = context.msg
							saveActivity().then(()=>{
								GraphAPI.sendPlainMessage(recipientId, 'Activity added successfully!  ✌️').then(()=>{
								if (context.current.nextAddLog){
									context.msg =  context.current.activityName //  messge is only chnged here in this module its no passed as context 
									context.current = {}
									context.current.main = 'addingLog';
									context.current.chooseLog = true;
									context.current.continue = true;
									resolve(context)
								}else{
									if(context.current.nextGetStarted){ // if we came from get started we go back
										context.msg =  context.current.activityName;
										context.current = {}
										context.current.main = 'getStarted';
										context.current.chooseLog = true;
										context.current.continue = true;
										context.current.first = true; 
										context.current.name = true; 
										context.current.type = true; 
										context.current.positivity = true; 
										context.current.habit = true; 
										resolve(context)
									}else{
										context.current = {}
										resolve(context)
									}
									
								}
							})
							})
							
							//console.log('saving to the database.....',JSON.stringify(context.current));
							
						}
					}
				}
			}
		}
	console.log('context in addActivity ', JSON.stringify(context));


	})
	//  context.first.main = {};
}