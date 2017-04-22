const platformHelpers = require('./platformHelpers');
const GraphAPI = require('./graphAPI');
const mongoose = require('mongoose');
const User = require('./schemas/user');
const sessionStore = require('./sessionStore');

module.exports = function(){
	let recipientId = "1221099964674152";

	setInterval(function(){


		User.findOne({recipientId : "1221099964674152"},(err,user)=>{
			if (err) throw err;
		
			let sessionId;
			let session;
			let newSession;

			sessionStore.findOrCreate(recipientId)
				.then(data => {

					sessionId = data.sessionId;
					session = data.session;
					newSession = data.newSession;
				
					let context = session.context;

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
							context.current.main = "addingLog"
							context.current.chooseLog = true;
							session.context = context;
							sessionStore.saveSession(sessionId, session);
						})
					}else{
						let data = platformHelpers.generateQuickReplies('Choose the activity ', list);
						//platformHelpers.generateButtonsTemplate('Choose the activity ',[{butn:'option1',},{butn:'opti2'}])
						GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
							context.current.main = "addingLog";
							context.current.chooseLog = true;
							session.context = context;
							sessionStore.saveSession(sessionId, session);
						})
					}
					console.log('list sec ', JSON.stringify(list));
				

				
				})
		})

	}, 60000);
}