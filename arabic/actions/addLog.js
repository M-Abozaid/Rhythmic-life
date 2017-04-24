const platformHelpers = require('../../platformHelpers');
const GraphAPI = require('../../graphAPI');
const mongoose = require('mongoose');
const User = require('../../schemas/user');
const _ = require('lodash');


module.exports = function(context){
let recipientId = context.userData.recipientId; // here because it was not accessble at saveLog
	return new Promise(function(resolve, reject){
	var list
	let saveLog = function(){


			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				console.log('the user  ',JSON.stringify(user));
				let howLongInMil 
				switch(context.current.howLong){
					case '30 دق':
					howLongInMil = 30 * 60 *1000
					break;
					case '1 س':
					howLongInMil = 1   * 60 * 60 *1000
					break;
					case '1.5 س':
					howLongInMil = 1.5 * 60 * 60 *1000
					break;
					case '2 س':
					howLongInMil = 2   * 60 * 60 *1000
					break;
					case '2.5 س':
					howLongInMil = 2.5 * 60 * 60 *1000
					break;
					case '3 س':
					howLongInMil = 3   * 60 * 60 *1000
					break;
					case '3.5 س':
					howLongInMil = 3.5 * 60 * 60 *1000
					break;
					case '4 س':
					howLongInMil = 4   * 60 * 60 *1000
					break;
					case '5 س':
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
							GraphAPI.sendPlainMessage(recipientId, 'تم اضافة الملاحظة بنجاح!  ✌️')
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
				list.push('نشاط جديد')
				let numOfQuick = list.length 
				if(numOfQuick>11){
					let numOfVeiws = Math.floor(numOfQuick/10) 
					context.current.thisVeiw = context.current.thisVeiw || 0
					let view = list.splice(context.current.thisVeiw * 10 ,10)
					view.push("المزيد!")
					let data = platformHelpers.generateQuickReplies('اختار النشاط اللي انت هتعمله دلوقت ', view);
					GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
						if(context.current.thisVeiw != numOfVeiws ){context.current.thisVeiw += 1}else{context.current.thisVeiw = 0}
						context.current.chooseLog = true;
						resolve(context)
					})
				}else{
					let data = platformHelpers.generateQuickReplies('اختار النشاط اللي انت هتعمله دلوقت ', list);
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
				if(context.msg == 'نشاط جديد'){
					context.current = {}
					context.current.main = 'addingActivity';
					context.current.nextAddLog = true;
					context.current.continue = true;
					resolve(context);
				}else{
					if(context.msg == "المزيد!"){
						context.current.chooseLog = false
						context.current.continue = true;
						resolve(context)
					}else{
						User.findOne({recipientId : recipientId},(err,user)=>{
							if (err) throw err;
							 list = _.map(user.activities,(elem)=>{return elem.name})
							})
						if(list.indexOf(context.msg) >= 0 ){
							context.current.logName = context.msg;
							let data = platformHelpers.generateQuickReplies('هتفضل قد ايه تـ '+ context.current.logName+' ⌚.. اختار أو اكتب الوقت بالدقيقة.', ['30 دق','1 س','1.5 س','2 س','2.5 س','3 س','3.5 س','4 س','5 س']);
							GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
								resolve(context)
							})
						}else{
							GraphAPI.sendPlainMessage(recipientId,'النشاط ده مش موجود في القايمة اختار نشاط جديد لو عاوز تضيفه').then(()=>{
								context.current.chooseLog = false;
								context.current.continue = true;
								resolve(context)
							})
						}
						
					}
				}
			}else{
				if(context.current.logName && !context.current.howLong){
					let data = platformHelpers.generateQuickReplies('اكتب ملاحظة تضيفها لو تحب.📝', ['لا مش ضروري']);
						GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
							context.current.howLong = context.msg;
							resolve(context)
						})
				}else{
					if(context.current.howLong && !context.current.note){
						if(context.msg == "لا مش ضروري"){
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