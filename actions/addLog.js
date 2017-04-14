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
				let numOfQuick = list.length 
				if(numOfQuick>11){
					let numOfVeiws = Math.floor(numOfQuick/10) 
					context.current.thisVeiw = context.current.thisVeiw || 0
					let view = list.splice(context.current.thisVeiw * 10 ,10)
					view.push("See more!")
					let data = platformHelpers.generateQuickReplies('Choose the activity ', view);
					GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
						if(context.current.thisVeiw != numOfVeiws ){context.current.thisVeiw += 1}else{context.current.thisVeiw = 0}
						context.current.chooseLog = true;
						resolve(context)
					})
				}else{
					let data = platformHelpers.generateQuickReplies('Choose the activity ', list);
					//platformHelpers.generateButtonsTemplate('Choose the activity ',[{butn:'option1',},{butn:'opti2'}])
					GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
						context.current.chooseLog = true;
						resolve(context)
					})
				}
				console.log('list sec ', JSON.stringify(list));
				

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
					if(context.msg == "See more!"){
						context.current.chooseLog = false
						context.current.continue = true;
						resolve(context)
					}else{
						let data = platformHelpers.generateQuickReplies('Type a note to be included if you like.', ['No thats it']);
						GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
							context.current.logName = context.msg;
							resolve(context)
						})
					}
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