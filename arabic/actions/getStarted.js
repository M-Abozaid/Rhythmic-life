const platformHelpers = require('../../platformHelpers');
const GraphAPI = require('../../graphAPI');
const mongoose = require('mongoose');
const User = require('../../schemas/user');

module.exports = function(context, msg){
// getting started
return new Promise(function(resolve, reject){
console.log("getting logsssssssssssss");
	let recipientId = context.userData.recipientId;

	let saveActivity = function(){
		return new Promise(function(resolve, reject){
			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				console.log('the user  ',JSON.stringify(user));
				let obj = {
					name: context.current.name,
					type: context.current.type,
					positivity: context.current.positivity,
					hebitual: context.current.habit
				}
				console.log('Obj  ', JSON.stringify(obj))
				user.activities.push(obj)
				//console.log('Pushed ', JSON.stringify(user),' user.activities ',JSON.stringify(user.activities));
				user.save(function (err, user) {
	                        if (err) throw err;
	                        resolve()
	                    });
			})
		
		})
	}


	let saveLog = function(){

		return new Promise(function(resolve, reject){
			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				console.log('the user  ',JSON.stringify(user));
				let howLongInMil = 1   * 60 * 60 *1000;
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
					activityId: user.activities.find((elem)=>{return elem.name.toLowerCase() == context.current.logName.toLowerCase() })._id,  // ading to lower case temporarly because the bb have some activiy upper
					time: Date.now(), //+ (user.timezone *60*60*1000),
					span: howLongInMil
				}

				console.log('Obj  ', JSON.stringify(obj))
				user.activityLogs.push(obj)

				user.save(function (err, user) {
							if (err) throw err;
							
							 GraphAPI.sendPlainMessage(recipientId, 'تم اضافة المفكرة بنجاح!  ✌️').then(()=>{resolve()})
				});
			})
		
		})
	}


	

	if(context.current.main == 'getStarted' && !context.current.first){

		GraphAPI.sendPlainMessage(recipientId, 'أهلا '+context.userData.first_name+'! 😃 خليني اساعدك تحافظ علي وقتك.')
		setTimeout(()=>{
		GraphAPI.sendPlainMessage(recipientId, ' انا هساعدك بسهولة تكتب مفكرة بأي نشاط انت بتعمله و اديك إحصائيات مفيدة عن وقتك.')
		}, 3000);
		setTimeout(()=>{
		GraphAPI.sendPlainMessage(recipientId, ' الاول خلينا نضيف نشاط.')
		}, 6500);
		setTimeout(()=>{
		GraphAPI.sendPlainMessage(recipientId, ' أكتب اسم نشاط تحب تتابع الوقت اللي بيستهلكه مثلا ( تمرين, شغل علي مشروع معين أو مذاكرة موضوع معين )')
		}, 7500);
		context.current.first = true
		resolve(context)
	}else{
		if(context.current.first && !context.current.name){
			let data = platformHelpers.generateQuickReplies('👌🏼 تمام دلوقت اختار نوع النشاط.', {0:'عمل 🔧',1:'تعلم 📖',2:'تسلية 💥'});
			GraphAPI.sendTemplateMessage(recipientId, data)
			context.current.name = context.msg
			resolve(context)
		}else{
			if(context.current.name && !context.current.type){
				let data = platformHelpers.generateQuickReplies('هل النشاط ده مفيد؟', {0:'نعم 👍🏼',1:'لا 👎🏼',2:'شئ اخر ☝🏼'});
				GraphAPI.sendTemplateMessage(recipientId, data)
				context.current.type = context.msg
				resolve(context)
			}else{
				if(context.current.type && !context.current.positivity){
					let data = platformHelpers.generateQuickReplies('هل النشاط ده عادة 🔁', {0:'نعم 👈🏼',1:'👉🏼 لا'});
					GraphAPI.sendTemplateMessage(recipientId, data)
					context.current.positivity = context.msg
					resolve(context)
				}else{
					if(context.current.positivity && !context.current.habit){
						context.current.habit = context.msg
						saveActivity().then(()=>{
								GraphAPI.sendPlainMessage(recipientId, 'تم اضافة النشاط بنجاح!  👌🏼').then(()=>{
								
								let data = platformHelpers.generateQuickReplies('✋🏼 تمام دلوقت قولي ايه هي الحاجة اللي انت هتعملها دلوقت.', [context.current.name,'نشاط جديد']);
								//platformHelpers.generateButtonsTemplate('Choose the activity ',[{butn:'option1',},{butn:'opti2'}])
								GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
									context.current.chooseLog = true
									resolve(context)
								})
									
								
							})
					})
				}else{
				if(context.current.chooseLog && !context.current.logName){
					if(context.msg == 'نشاط جديد'){
						context.current = {}
						context.current.main = 'addingActivity';
						context.current.nextGetStarted = true;
						context.current.continue = true;
						resolve(context);
					}else{
							context.current.logName = context.msg;
							let data = platformHelpers.generateQuickReplies('هتفضل قد ايه تـ '+ context.current.logName+' ⌚. اختار او اكتب الوقت بالدقايق', ['30 دق','1 س','1.5 س','2 س','2.5 س','3 س','3.5 س','4 س','5 س']);
							GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
								
								resolve(context)
							})					
					}
				}else{
					if(context.current.logName && !context.current.howLong){
						let data = platformHelpers.generateQuickReplies('أخيرا تقدر تضيف ملحوظة لو تحب  📝. ', ['مش ضروري']);
							GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
								context.current.howLong = context.msg;
								resolve(context)
							})
					}else{
						if(context.current.howLong && !context.current.note){
							if(context.msg == "مش ضروري"){
								context.current.note = " ";
							}else{
								context.current.note = context.msg;
							}

							saveLog().then(()=>{
							let	data = {
								"quick_replies":  [
							    		{
								        "content_type":"text",
								        "title": 'اضافة مفكرة جديدة' ,
								        "payload": 1
								      }	,
								      {
								        "content_type":"text",
								        "title": "اضافة نشاط جديد",
								        "payload": 3
								      }],

								"attachment":{
							      "type":"template",
							      "payload":{
							        "template_type":"button",
							        "text":"تمام دلوقت ممكن تشوف المفكرة و الاحصاءيات من هنا ",
									"buttons":[
								      {
								        "type":"web_url",
								        "url":"https://salty-plains-47076.herokuapp.com/show/"+recipientId,
								        "title":"شوف المفكرة 📜",
								        "webview_height_ratio": "compact",
								        "messenger_extensions": true
								      },
								      {
								        "type":"web_url",
								        "url":"https://salty-plains-47076.herokuapp.com/show/"+recipientId + "/#!/statistics",
								        "title":"شوف الاحصاءيات 📈",
								        "webview_height_ratio": "compact",
								        "messenger_extensions": true
								      }
								    ]
									}
								}
							}

							GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
								context.current = {}
								context.current.main = 'offered';
								context.current.panel = false;
								resolve(context)})
								
							});
						}
					}
					} 
			}
		}

	}




}
}
})
}