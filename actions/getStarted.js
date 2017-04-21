const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');
const mongoose = require('mongoose');
const User = require('../schemas/user');

module.exports = function(context, msg){
// getting started
return new Promise(function(resolve, reject){
console.log("getting logsssssssssssss");

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


	let recipientId = context.userData.recipientId;

	if(context.current.main == 'getStarted' && !context.current.first){

		GraphAPI.sendPlainMessage(recipientId, 'Oh Hello '+context.userData.first_name+'! let\'t  help keep track of your productivity.')
		setTimeout(()=>{
		GraphAPI.sendPlainMessage(recipientId, ' I can help you keep a diary of any activity you do, and give you a useful statistics about your time.')
		}, 2000);
		setTimeout(()=>{
		GraphAPI.sendPlainMessage(recipientId, ' First lets add a new activity.')
		}, 2000);
		setTimeout(()=>{
		GraphAPI.sendPlainMessage(recipientId, ' type a name of activity you\'d like to keep track of. (e.g. working out, studying)')
		}, 2000);
		context.current.first = true
	}else{
		if(context.current.first && !context.current.name){
			let data = platformHelpers.generateQuickReplies('Good now choose a type for the activity.', {0:'work',1:'study',2:'entertainment'});
			GraphAPI.sendTemplateMessage(recipientId, data)
			context.current.name = context.msg
		}else{
			if(context.current.name && !context.current.type){
				let data = platformHelpers.generateQuickReplies('Is it a positive thing?', {0:'positive',1:'ngative',2:'other'});
				GraphAPI.sendTemplateMessage(recipientId, data)
				context.current.type = context.msg
			}else{
				if(context.current.type && !context.current.positivity){
					let data = platformHelpers.generateQuickReplies('Do you think you do this activity as a habit?', {0:'Yes',1:'NO'});
					GraphAPI.sendTemplateMessage(recipientId, data)
					context.current.positivity = context.msg
				}else{
					if(context.current.positivity && !context.current.habit){
						context.current.habit = context.msg
						saveActivity().then(()=>{
								GraphAPI.sendPlainMessage(recipientId, 'Activity created successfully!  ✌️').then(()=>{
								
									context.current = {}
									resolve(context)
								
								})
							})
					}
				}
			}
		}

	}




})

}