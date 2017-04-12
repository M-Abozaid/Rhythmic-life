const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');
const mongoose = require('mongoose');
const User = require('../schemas/user');
const _ = require('lodash');

module.exports = function(context, msg){

	let saveLog = function(){

			let query = User.findOne({recipientId : recipientId})

			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				console.log('the user  ',JSON.stringify(user));

				query.find({'activities.name':context.current.logName},(err,activity)=>{
					if (err) throw err;
					context.current.activityId = activity._id
				})

				let obj = {
					logName: context.current.logName,
					note: context.current.note,
					activityId: context.current.activityId,
				}

				console.log('Obj  ', JSON.stringify(obj))
				user.activityLogs.push(obj)

				user.save(function (err, user) {
							if (err) throw err;
							context.current = {}
							resolve(context)
				});
			})
		

	}

	return new Promise(function(resolve, reject){
		//context.current.main = 'addingLog'
		console.log("adding logs");
		let recipientId = context.userData.recipientId;

		if(Object.keys(context.current).length == 1){
			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				let data = platformHelpers.generateQuickReplies('Choose the activity ', _.map(user.activities,(elem)=>{return elem.name}));
				GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
					context.current.choose = true;
					resolve(context)
				})

			})
		}else{
			if(context.current.choose && !context.current.logName){
				
				let data = platformHelpers.generateQuickReplies('Type a note to be included if you like.', ['No thats it']);
				GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
					context.current.logName = msg;
					resolve(context)
				})
			}else{
				if(context.current.logName && !contxt.current.note){
					if(msg == "No thats it"){
						contxt.current.note = " ";
					}else{
						contxt.current.note = msg;
					}

					saveLog();
				}
			}
		}
	})

}