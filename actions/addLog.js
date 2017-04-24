const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');
const mongoose = require('mongoose');
const User = require('../schemas/user');
const _ = require('lodash');


module.exports = function(context){
let recipientId = context.userData.recipientId; // here because it was not accessble at saveLog
	
	return new Promise(function(resolve, reject){
		var list;
	let saveLog = function(){


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
					activityId: user.activities.find((elem)=>{return elem.name.toLowerCase() == context.current.logName })._id,  // ading to lower case temporarly because the bb have some activiy upper
					time: Date.now(), //+ (user.timezone *60*60*1000),
					span: howLongInMil
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
					var view = list.splice(context.current.thisVeiw * 10 ,10)
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
				if(context.msg == 'new activity'){
					context.current = {}
					context.current.main = 'addingActivity';
					context.current.nextAddLog = true;
					context.current.continue = true;
					resolve(context);
				}else{
					if(context.msg == "see more!"){
						context.current.chooseLog = false
						context.current.continue = true;
						resolve(context)
					}else{
						if(list.indexOf(context.msg) >= 0 && !context.current.nextAddLog){
							context.current.logName = context.msg;
							let data = platformHelpers.generateQuickReplies('For how long You will be '+ context.current.logName+' ⌚.. Choose or type the exact time in minutes.', ['30 min','1 hr','1.5 hr','2 hr','2.5 hr','3 hr','3.5 hr','4 hr','5 hr']);
							GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
								resolve(context)
							})
						}else{
							GraphAPI.sendPlainMessage(recipientId,'This activity doesn\'t exist on your list if you want to add it choose new activity').then(()=>{
								context.current.chooseLog = false;
								context.current.continue = true;
								resolve(context)
							})
						}
						
					}
				}
			}else{
				if(context.current.logName && !context.current.howLong){
					let data = platformHelpers.generateQuickReplies('Type a note to be included if you like.📝', ['No thats it']);
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

						saveLog();
					}
				}
			}
		}
	})

}