const addActivity = require('./addActivity')
const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');
const mongoose = require('mongoose');
const User = require('../schemas/user');
const _ = require('lodash');


module.exports = function(context, msg){
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
				let data = platformHelpers.generateQuickReplies('Choose the activity ', list);
				GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
					context.current.chooseLog = true;
					resolve(context)
				})

			})
		}else{
			if(context.current.chooseLog && !context.current.logName){
				if(msg == 'New activity'){
					context.current = {}
					context.current.main = 'addingActivity';
					context.current.nextAddLog = true;
					console.log('addActivity ', addActivity);
					addActivity(context,msg).then((cont)=>{resolve(cont)});
				}else{
					let data = platformHelpers.generateQuickReplies('Type a note to be included if you like.', ['No thats it']);
					GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
						context.current.logName = msg;
						resolve(context)
					})
				}
			}else{
				if(context.current.logName && !context.current.note){
					if(msg == "No thats it"){
						context.current.note = " ";
					}else{
						context.current.note = msg;
					}

					saveLog();
				}
			}
		}
	})

}