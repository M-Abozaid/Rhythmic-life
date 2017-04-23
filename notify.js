const platformHelpers = require('./platformHelpers');
const GraphAPI = require('./graphAPI');
const mongoose = require('mongoose');
const User = require('./schemas/user');
const sessionStore = require('./sessionStore');
const _ = require('lodash')
const moment = require('moment')
module.exports = function(){

	setInterval(function(){
		console.log('set int');
		User.find({recipientId : '659914587466737'},(err,users)=>{
			if (err) throw err;
			let sessionId;
			let session;
			let newSession;
			
			var nowUTC =  Date.now()

			for (var i = users.length - 1; i >= 0; i--) {
				let user = users[i]
				let recipientId = user.recipientId
				let lastActive

				if(user.activityLogs.length == 0 ){
					lastActive = 100
				}else {
					lastActive = user.activityLogs[user.activityLogs.length - 1].createdAt
				}

				nowLocal = moment(nowUTC).add(user.timezone , 'hours')

				console.log('moment(lastActive) ',moment(lastActive));
				lastLog =  moment.utc(lastActive).add(user.timezone , 'hours')

				console.log('lastLog ',lastLog);


				 if(nowLocal.hour()>1 && nowLocal.hour()<23 ){

				 	console.log('now hours ',nowLocal.hour());
				 	console.log(nowLocal.valueOf() ,'  ',lastLog.valueOf());
				 	if(moment.duration(nowLocal.valueOf() - lastLog.valueOf()).minute() > 26){  // last active
				 			sessionStore.findOrCreate(recipientId)
								.then(data => {
									
									sessionId = data.sessionId;
									session = data.session;
									newSession = data.newSession;
									let lastNot = session.lastNot || 100;
									let context = session.context;
									console.log('lastNot ',lastNot);
									let lasNotLocal = moment.utc(lastNot).add(user.timezone , 'hours')
									console.log('lasNotLocal ',lasNotLocal);
									console.log('nowLocal.valueOf() ',nowLocal.valueOf());
									console.log('nowLocal.valueOf() ',lasNotLocal.valueOf());
									let lastNotH = moment.duration(nowLocal.valueOf() - lasNotLocal.valueOf()).minutes()
									console.log('lastNotH ',lastNotH);
									console.log(' vars ','lastNotH ',lastNotH, 'nowLocal.hour() ',nowLocal.hour());
									if(lastNotH > 5 ){
										console.log('inside last if');
										let list = _.map(user.activities,(elem)=>{return elem.name})
										list.push('New activity')
										let numOfQuick = list.length 
										if(numOfQuick>11){
											let numOfVeiws = Math.floor(numOfQuick/10) 
											context.current.thisVeiw = context.current.thisVeiw || 0
											let view = list.splice(context.current.thisVeiw * 10 ,10)
											view.push("See more!")
											let data = platformHelpers.generateQuickReplies( user.firstName + '! would you like to add what your doing now', view);
											console.log('ifffff');
												GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
													if(context.current.thisVeiw != numOfVeiws ){context.current.thisVeiw += 1}else{context.current.thisVeiw = 0}
													context.current = {};
													context.current.main = "addingLog"
													context.current.chooseLog = true;
													session.context = context;
													session.lastNot = Date.now();
													sessionStore.saveSession(sessionId, session);
												})
											}else{
												let data = platformHelpers.generateQuickReplies(user.firstName + '! would you like to add what you\'re doing now', list);
												console.log(' else');
												platformHelpers.generateButtonsTemplate('Choose the activity ',[{butn:'option1',},{butn:'opti2'}])
												GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
													context.current = {};
													context.current.main = "addingLog";
													context.current.chooseLog = true;
													session.context = context;
													session.lastNot = Date.now();
													sessionStore.saveSession(sessionId, session);
												})
											}
									
									}
								
								})
				 		

			 	}

			}

			
			}
		})

	}, 30000);
}