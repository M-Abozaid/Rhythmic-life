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
		User.find({},(err,users)=>{
			if (err) throw err;
			let sessionId;
			let session;
			let newSession;
			var nowUTC =  Date.now()

			for (var i = users.length - 1; i >= 0; i--) {
				let user = users[i]
				let recipientId = user.recipientId
				let lastActive
				let lastLog

				if(user.activityLogs.length == 0 ){
					 lastLog =  moment.utc(100).add(user.timezone , 'hours')
				}else {
					 lastLog =  moment.utc(user.activityLogs[user.activityLogs.length - 1].createdAt).add(user.timezone , 'hours')
				}
				nowLocal = moment(nowUTC).add(user.timezone , 'hours')


				 if(nowLocal.hour()>10 && nowLocal.hour()<23 ){

				 	if(moment.duration(nowLocal.valueOf() - lastLog.valueOf()).hours() > 24){  // last active
				 			
				 			sessionStore.findOrCreate(recipientId)
								.then(data => {
									sessionId = data.sessionId;
									session = data.session;
									newSession = data.newSession;
									let lastNot = session.lastNot || 100;
									let context = session.context;

									let lastNotH = moment.duration(nowLocal.valueOf() - moment.utc(lastNot)
										.add(user.timezone , 'hours').valueOf()).hours()
									
									if(lastNotH > 24 ){
										let list = _.map(user.activities,(elem)=>{return elem.name})
										list.push('New activity')
										let numOfQuick = list.length 

										if(numOfQuick>11){
											let numOfVeiws = Math.floor(numOfQuick/10) 
											context.current.thisVeiw = context.current.thisVeiw || 0
											let view = list.splice(context.current.thisVeiw * 10 ,10)
											view.push("See more!")
											let data = platformHelpers.generateQuickReplies( user.firstName + '! would you like to add what you\'re doing now', view);
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

	}, 5*60*1000 );
}