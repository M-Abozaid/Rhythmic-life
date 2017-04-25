const platformHelpers = require('./platformHelpers');
const GraphAPI = require('./graphAPI');
const mongoose = require('mongoose');
const User = require('./schemas/user');
const sessionStore = require('./sessionStore');
const _ = require('lodash')
const moment = require('moment')
module.exports = function(){

	//setInterval(function(){
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
					 lastLog =  moment(100).add(user.timezone , 'hours')
				}else {
					 lastLog =  moment(user.activityLogs[user.activityLogs.length - 1].createdAt).add(user.timezone , 'hours')
				}
				nowLocal = moment(nowUTC).add(user.timezone , 'hours')


				 if(nowLocal.hour()>1 && nowLocal.hour()<23 ){
				 	var lastLogH = moment.duration(nowLocal.valueOf() - lastLog.valueOf()).asHours()
				 	if(lastLogH > 24){  // last active //
				 			
				 			sessionStore.findOrCreate(recipientId)
								.then(data => {
									sessionId = data.sessionId;
									session = data.session;
									newSession = data.newSession;
									let lastNot = session.lastNot || 100;
									let context = session.context;


									//  lastNot= moment(lastNot).add(user.timezone , 'hours')
									// let lastNotH = duration(nowLocal.valueOf() - moment(lastNot).valueOf()).asHours()

									let lastNotH = moment.duration(nowLocal.valueOf() - moment(lastNot)
										.add(user.timezone , 'hours').valueOf()).asHours()
										
										console.log('user ',user.firstName + user.lastName);
										console.log('lastNotH ',lastNotH);
										console.log('lastLogH  ',lastLogH);
										console.log('nowLocal   ',nowLocal);

									if(lastNotH > 24 && lastNotH > lastLogH){
										// let list = _.map(user.activities,(elem)=>{return elem.name})
										// list.push('نشاط جديد')
										// let numOfQuick = list.length 

										// if(numOfQuick>11){
										// 	let numOfVeiws = Math.floor(numOfQuick/10) 
										// 	context.current.thisVeiw = context.current.thisVeiw || 0
										// 	let view = list.splice(context.current.thisVeiw * 10 ,10)
										// 	view.push("المزيد!")
										// 	let data = platformHelpers.generateQuickReplies( user.firstName + '! would you like to add what you\'re doing now', view);
										// 	if(context.userData.lang == 'عربي'){ data = platformHelpers.generateQuickReplies( user.firstName + '! تحب تضيف اللي انت بتعمله دلوقت للمفكرة', view);}
										// 		GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
										// 			if(context.current.thisVeiw != numOfVeiws ){context.current.thisVeiw += 1}else{context.current.thisVeiw = 0}
										// 			context.current = {};
										// 			context.current.main = "addingLog"
										// 			context.current.chooseLog = true;
										// 			session.context = context;
										// 			session.lastNot = Date.now();
										// 			sessionStore.saveSession(sessionId, session);
										// 		})
										// 	}else{
										// 		let data = platformHelpers.generateQuickReplies(user.firstName + '! would you like to add what you\'re doing now', list);
										// 		if(context.userData.lang == 'عربي'){ data = platformHelpers.generateQuickReplies( user.firstName + '! تحب تضيف اللي انت بتعمله دلوقت للمفكرة', list);}
										// 		GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
										// 			context.current = {};
										// 			context.current.main = "addingLog";
										// 			context.current.chooseLog = true;
										// 			session.context = context;
										// 			session.lastNot = Date.now();
										// 			sessionStore.saveSession(sessionId, session);
										// 		})
										// 	}
									
									}
								
								})
				 		

			 	}

			}

			
			}
		})



		
		User.findOne({recipientId : "1221099964674152"},(err,user)=>{
			if (err) throw err;
			//console.log(user);
			let sessionId;
			let session;
			let newSession;
			var nowUTC =  Date.now()
			// console.log('user find');
			
				
				let recipientId = user.recipientId
				let lastActive
				let lastLog

				if(user.activityLogs.length == 0 ){
					 lastLog =  moment(100).add(user.timezone , 'hours')
				}else {
					 lastLog =  moment(user.activityLogs[user.activityLogs.length - 1].createdAt).add(user.timezone , 'hours')
				}
				nowLocal = moment(nowUTC).add(user.timezone , 'hours')

				// console.log('first if',lastLog);
				// console.log('first if v ',lastLog.valueOf());
				// console.log('first if v ',nowLocal);
				 if(nowLocal.hour()>3 && nowLocal.hour()<18 ){
				 	
				 	var lastLogH = moment.duration(nowLocal.valueOf() - lastLog.valueOf()).asMinutes()
				 	
				 	// console.log('first if',lastLogH);
				 	if(lastLogH > 40){  // last active
				 			
				 			sessionStore.findOrCreate(recipientId)
								.then(data => {
									sessionId = data.sessionId;
									session = data.session;
									newSession = data.newSession;
									let lastNot = session.lastNot || 100;
									let context = session.context;

									let lastNotH = moment.duration(nowLocal.valueOf() - moment(lastNot)
										.add(user.timezone , 'hours').valueOf()).asMinutes()
									// console.log('sec if' , lastNotH);
									

									if(lastNotH > 40 ){
										// console.log('thired if');
										let list = _.map(user.activities,(elem)=>{return elem.name})
										list.push('نشاط جديد')
										let numOfQuick = list.length 

										if(numOfQuick>11){
											let numOfVeiws = Math.floor(numOfQuick/10) 
											context.current.thisVeiw = context.current.thisVeiw || 0
											let view = list.splice(context.current.thisVeiw * 10 ,10)
											view.push("المزيد!")
											let data = platformHelpers.generateQuickReplies( user.firstName + '! would you like to add what you\'re doing now', view);
											if(context.userData.lang == 'عربي'){ data = platformHelpers.generateQuickReplies( user.firstName + '! تحب تضيف اللي انت بتعمله دلوقت للمفكرة', view);}
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
												if(context.userData.lang == 'عربي'){ data = platformHelpers.generateQuickReplies( user.firstName + '! تحب تضيف اللي انت بتعمله دلوقت للمفكرة', list);}
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

			
			
		})

	//}, 10*60*1000 );
}