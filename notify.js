const platformHelpers = require('./platformHelpers');
const GraphAPI = require('./graphAPI');
const mongoose = require('mongoose');
const User = require('./schemas/user');
const sessionStore = require('./sessionStore');
const _ = require('lodash')
const moment = require('moment')
module.exports = function(){
	//let recipientId = "1221099964674152";
	//setInterval(function(){
//{recipientId : "1221099964674152"}

		User.find({},(err,users)=>{
			if (err) throw err;
			let sessionId;
			let session;
			let newSession;
			
			var nowUTC =  Date.now()
			for (var i = users.length - 1; i >= 0; i--) {
				let user = users[i]
				nowLocal = moment(nowUTC).add(user.timezone , 'hours')
				lastLog =  moment(user.activityLogs[0].createdAt).add(user.timezone , 'hours')
				 if(nowLocal.hour()>10 && nowLocal.hour()<23 ){
				 	console.log('now hours ',nowLocal.hour());
				 	if(moment.duration(nowLocal.valueOf() - lastLog.valueOf()).hours() > 1){
				 			sessionStore.findOrCreate(user.recipientId)
								.then(data => {
					
									sessionId = data.sessionId;
									session = data.session;
									newSession = data.newSession;
									let timeSinceLastNot = session.timeSinceLastNot || 100;
									let context = session.context;

									if(timeSinceLastNot > 1 ){

										let list = _.map(user.activities,(elem)=>{return elem.name})
										list.push('New activity')
										let numOfQuick = list.length 
										if(numOfQuick>11){
											let numOfVeiws = Math.floor(numOfQuick/10) 
											context.current.thisVeiw = context.current.thisVeiw || 0
											let view = list.splice(context.current.thisVeiw * 10 ,10)
											view.push("See more!")
											let data = platformHelpers.generateQuickReplies( user.firstName + '! would you like to add what your doing now', view);
											GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
												if(context.current.thisVeiw != numOfVeiws ){context.current.thisVeiw += 1}else{context.current.thisVeiw = 0}
												context.current.main = "addingLog"
												context.current.chooseLog = true;
												session.context = context;
												session.timeSinceLastNot = timeSinceLastNot;
												sessionStore.saveSession(sessionId, session);
											})
											}else{
												let data = platformHelpers.generateQuickReplies(user.firstName + '! would you like to add what you\'re doing now', list);
												//platformHelpers.generateButtonsTemplate('Choose the activity ',[{butn:'option1',},{butn:'opti2'}])
												GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
													context.current.main = "addingLog";
													context.current.chooseLog = true;
													session.context = context;
													session.timeSinceLastNot = timeSinceLastNot;
													sessionStore.saveSession(sessionId, session);
												})
											}
									
									}
								
								})
				 		

			 	}

			 }

			
			}
		})

	//}, 3600000);
}