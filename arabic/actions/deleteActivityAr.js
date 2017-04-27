const platformHelpers = require('../../platformHelpers');
const GraphAPI = require('../../graphAPI');
const mongoose = require('mongoose');
const User = require('../../schemas/user');
const _ = require('lodash');



module.exports = function(context){
let recipientId = context.userData.recipientId; // here because it was not accessble at saveLog
	
	return new Promise(function(resolve, reject){

		if(context.current.main && !context.current.chooseActivity){

			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				 list = _.map(user.activities,(elem)=>{return elem.name})
				console.log('list first  ', JSON.stringify(list))
				let numOfQuick = list.length 
				if(numOfQuick>11){
					let numOfVeiws = Math.floor(numOfQuick/10) 
					context.current.thisVeiw = context.current.thisVeiw || 0
					var view = list.splice(context.current.thisVeiw * 10 ,10)
					view.push("المزيد!")
					let data = platformHelpers.generateQuickReplies('اختار النشاط اللي تحب تمسحه او اكتب cancel.', view);
					GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
						if(context.current.thisVeiw != numOfVeiws ){context.current.thisVeiw += 1}else{context.current.thisVeiw = 0}
						context.current.chooseActivity = true;
						resolve(context)
					})
				}else{
					let data = platformHelpers.generateQuickReplies('اختار النشاط اللي تحب تمسحه او اكتب  cancel.', list);
					//platformHelpers.generateButtonsTemplate('Choose the activity ',[{butn:'option1',},{butn:'opti2'}])
					GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
						context.current.chooseActivity = true;
						resolve(context)
					})
				}
				console.log('list sec ', JSON.stringify(list));
				

			})
		}else{
			if(context.current.chooseActivity && !context.current.logName){
					if(context.msg == "المزيد!"){
						context.current.chooseActivity = false
						context.current.continue = true;
						resolve(context)
					}else{
						User.findOne({recipientId : recipientId},(err,user)=>{
							if (err) throw err;
							 list = _.map(user.activities,(elem)=>{return elem.name})
							
						if(list.indexOf(context.msg) >= 0){
							context.current.logName = context.msg;
							user.activities.splice(list.indexOf(context.msg),3)
							user.save(function (err, user) {
							if (err) throw err;
							context.current = {}
							resolve(context)
							GraphAPI.sendPlainMessage(recipientId, 'تم مسح النشاط!  ✌️')
							});
						}else{
							GraphAPI.sendPlainMessage(recipientId,'النشاط ده مش موجود. ').then(()=>{
								context.current.chooseActivity = false;
								context.current.continue = true;
								resolve(context)
							})
						}
						})
					}
				}
			}
		
	})

}