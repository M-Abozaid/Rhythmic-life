const platformHelpers = require('./platformHelpers');
const GraphAPI = require('./graphAPI');
const mongoose = require('mongoose');
const User = require('./schemas/user');
const sessionStore = require('./sessionStore');
const _ = require('lodash')
const moment = require('moment')
module.exports = function(){

	var notify = function(user){
		
		let sessionId;
		let session;
		let newSession;
		let nowUTC = moment();

		
		let recipientId = user.recipientId
		let lastLog

		if(user.activityLogs.length == 0 ){
			 lastLog =  moment(10000).add(user.timezone , 'hours')
		}else {
			 lastLog =  moment(user.activityLogs[user.activityLogs.length - 1].createdAt).add(user.timezone , 'hours')
		}
		const nowLocal = nowUTC.add(user.timezone , 'hours')

		 if(nowLocal.hour()>10 && nowLocal.hour()<23 ){
		 	let lastLogH = moment.duration(nowLocal.valueOf() - lastLog.valueOf()).asHours()
		 		if(lastLogH > 24 ){  // last active //
		 			
		 			sessionStore.findOrCreate(recipientId)
						.then(data => {
							sessionId = data.sessionId;
							session = data.session;
							newSession = data.newSession;
							const lastNot = session.lastNot || 90;
							let context = session.context;



							let lastNotH = moment.duration(nowLocal.valueOf() - moment(lastNot)
								.add(user.timezone , 'hours').valueOf()).asHours()
								
								console.log('lastNotH ',lastNotH,user.firstName+ user.lastName);
								console.log('lastLogH  ',lastLogH,user.firstName+ user.lastName);
							if((lastNotH > 4 && lastNotH > lastLogH) || lastNotH > 10*24){



								console.log(user.firstName +  user.lastName+' is elig ');


								let list = _.map(user.activities,(elem)=>{return elem.name})
								//console.log(JSON.stringify(context.userData));
								if(context.userData.lang){
								if(context.userData.lang == 'عربي'){list.push('نشاط جديد')}else{list.push('New activity')}
								}

								let numOfQuick = list.length 
								if(numOfQuick>11){
									let numOfVeiws = Math.floor(numOfQuick/10) 
									context.current.thisVeiw = context.current.thisVeiw || 0
									let view = list.splice(context.current.thisVeiw * 10 ,10)
									if(context.userData.lang == 'عربي'){view.push("المزيد!")}else{view.push("see more!")}
									let data = platformHelpers.generateQuickReplies( user.firstName + '! would you like to add what you\'re doing now to your dairy', view);
									if(context.userData.lang == 'عربي'){ data = platformHelpers.generateQuickReplies( user.firstName + '! تحب تضيف اللي انت بتعمله دلوقت للمفكرة', view);}
										GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
											if(context.current.thisVeiw != numOfVeiws ){context.current.thisVeiw += 1}else{context.current.thisVeiw = 0}
											context.current = {};
											context.current.main = "addingLog"
											context.current.chooseLog = true;
											context.current.notifiy = true;
											session.context = context;
											session.lastNot = Date.now();
											sessionStore.saveSession(sessionId, session);
										}).catch((err) => {
											console.log('Oops! An error occurred while forwarding the response to', user.firstName + user.lastName );
										});
									}else{
										let data = platformHelpers.generateQuickReplies(user.firstName + '! would you like to add what you\'re doing now to your diary', list);
										if(context.userData.lang == 'عربي'){ data = platformHelpers.generateQuickReplies( user.firstName + '! تحب تضيف اللي انت بتعمله دلوقت للمفكرة', list);}
										GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
											context.current = {};
											context.current.main = "addingLog";
											context.current.chooseLog = true;
											context.current.notifiy = true;
											session.context = context;
											session.lastNot = Date.now();
											sessionStore.saveSession(sessionId, session);
										})
										.catch((err) => {
											console.log('Oops! An error occurred while forwarding the response to', user.firstName + user.lastName );

										});
									}
							
							}
						
						}).catch((err) => {
											console.log('Oops! An error occurred while getting ', user.firstName + user.lastName );

										});
		 		

	 	
				}

			}
	}
	setInterval(function(){
	 console.log('set int');
		User.find({},(err,users)=>{
			if (err) throw err;
		

			for (let i = users.length - 1; i >= 0; i--) {
				let user = users[i]
				notify(user);
			
			}
		})



		
		User.findOne({recipientId : "1221099964674152"},(err,user)=>{
			if (err) throw err;
			//console.log(user);
			let sessionId;
			let session;
			let newSession;
			const nowUTC = moment();
			// console.log('user find');
			
				
				let recipientId = user.recipientId
				let lastActive
				let lastLog

				if(user.activityLogs.length == 0 ){
					 lastLog =  moment(100).add(user.timezone , 'hours')
				}else {
					 lastLog =  moment(user.activityLogs[user.activityLogs.length - 1].createdAt).add(user.timezone , 'hours')
				}
				const nowLocal = moment().add(user.timezone , 'hours')

				// console.log('first if',lastLog);
				// console.log('first if v ',lastLog.valueOf());
				// console.log('first if v ',nowLocal);
				 if(nowLocal.hour()>3 && nowLocal.hour()<24 ){
				 	
				 	let lastLogH = moment.duration(nowLocal.valueOf() - lastLog.valueOf()).asMinutes()
				 	
				 	// console.log('first if',lastLogH);
				 	if(lastLogH > 1 ){  // last active
				 			
				 			sessionStore.findOrCreate(recipientId)
								.then(data => {
									sessionId = data.sessionId;
									session = data.session;
									newSession = data.newSession;
									let lastNot = session.lastNot || 100;
									let context = session.context;

									let lastNotH = moment.duration(nowLocal.valueOf() - moment(lastNot)
										.add(user.timezone , 'hours').valueOf()).asMinutes()
									// console.log('sec if' , lastNotH,' ',lastLogH);
									

									if(lastNotH > 1 && lastNotH > lastLogH){
										// console.log('thired if');
										let list = _.map(user.activities,(elem)=>{return elem.name})
										if(context.userData.lang == 'عربي'){list.push('نشاط جديد')}else{list.push('New activity')}
										let numOfQuick = list.length 

										if(numOfQuick>11){
											let numOfVeiws = Math.floor(numOfQuick/10) 
											context.current.thisVeiw = context.current.thisVeiw || 0
											let view = list.splice(context.current.thisVeiw * 10 ,10)
											if(context.userData.lang == 'عربي'){view.push("المزيد!")}else{view.push("see more!")}
											let data = platformHelpers.generateQuickReplies( user.firstName + '! would you like to add what you\'re doing now', view);
											if(context.userData.lang == 'عربي'){ data = platformHelpers.generateQuickReplies( user.firstName + '! تحب تضيف اللي انت بتعمله دلوقت للمفكرة', view);}
												GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
													if(context.current.thisVeiw != numOfVeiws ){context.current.thisVeiw += 1}else{context.current.thisVeiw = 0}
													context.current = {};
													context.current.main = "addingLog"
													context.current.chooseLog = true;
													context.current.notifiy = true;
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
													context.current.notifiy = true;
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

	}, 10*60*1000 );
}

//