const getStarted = require('./actions/getStarted')
const addActivity = require('./actions/addActivity')
const addLog = require('./actions/addLog')
const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');
const fuzz = require('fuzzball');
const _ = require('lodash');

let takeAction = function(context){

	return new Promise(function(resolve, reject){
	
	let recipientId = context.userData.recipientId;
	console.log('inside takeAction() ---- ');	
	

	var generateRandom = function(list){
		return list[Math.floor(Math.random() * list.length )]
	}

	let offer = function(){
		let data = {
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
						        "text":"تحب تعمل ايه ؟ اختر اضافة مفكرة جديدة عشان تضيف اللي انت بتعمله دلوقت",
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
							        "title":"شوف الاحصائيات 📈",
							        "webview_height_ratio": "compact",
							        "messenger_extensions": true
							      }
							    ]
								}
							}
						}

						GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
							context.current.main = 'offered';
							context.current.panel = false;
							resolve(context)})
	}
	var fuzzChech = function(choices,query){

		return _.maxBy(fuzz.extract(query, choices), function(o) { 
		  return o['1']; });
		//console.log('',);
	}

	var others = function(mess){
		var greetings = ['اهلا' ,'سلام عليكم',	'السلام عليكم',	'هلو'	,'الو'	,'يابوت',	'صباح الخير',	'مساء الخير'	, 'صبح'	,	'هاي'	];

		let max = fuzzChech(greetings,context.msg);
		console.log('max ',max);
		if (max['1'] > 70){
			GraphAPI.sendPlainMessage(recipientId, max['0'] +' يا '+ context.userData.first_name + ' عامل ايه؟').then(()=>{
						context.current.main = 'howAreYou';
						resolve(context);	
					})
				
				}else{
					let howAre = ['انت عامل ايه','اخبارك','ازيك','ايه الاحوال','عامل ايه','الدنيا عامله معاك ايه','انت عامل ايه','وانت اخبارك','وانت عامل ايه','كيفك','انت ازيك','انت عامل ايه','انت اخبارك ايه','انت كيفك','باشا']
					let max = fuzzChech(howAre,context.msg);
					console.log('max ',max);
					if (max['1'] > 70){
						let howAreRes = ['الحمد لله وانت انت عامل ايه يا','كويس انت عامل ايه يا '+ context.userData.first_name + 'يا عثل؟','انا بأفضل حال؟','جعان شوية يا '+ context.userData.first_name +' ' ,'انا بخير طول ما انت بخير يا '+ context.userData.first_name + ' يا جميل 😊😊 ','انا كويس شكرا علي السؤال','عاوز انام 😴 ']
						GraphAPI.sendPlainMessage(recipientId, generateRandom(howAreRes) +'اخبارك 😀😀 ').then(()=>{
							context.current.main = 'howAreYou';
							resolve(context);
						})
					}else{
						let thank = ['شكرا ','الف شكر ','الله ينور ','شغل عالي','برافو','احسنت','بوت ممتاز','رائع','انت رائع','كويس','انت برنس','ايه الحلاوة دي']
						let max = fuzzChech(thank,context.msg);
						if(max['1'] > 70){
								let thenkRes = ['حبيبي دا بس من زوقك يا غالي 😊','ربنا يخليك يا قلبي','والله انت اللي برنس وكلك زوق ','متكسفنيش بقي 😊😊 ','حبيب قلبي','دا كدتير علي والله ','انت اللي محترم ']
								GraphAPI.sendPlainMessage(recipientId, generateRandom(thenkRes) +'😍😍').then(()=>{
								offer();
							})
						}else{
							let  insult = ['خول','يا خول ','يا متناك','ياع عرص','يا علق ','كسمك','متناك','عرص','اهبل ','هبيط','حمار','انت حمار','بقرة','حموسة','غبي','انت غبي','طيزك','طيزك حمرا','كس اختك','كلب','انت مبتفهمش']
							let max = fuzzChech(insult,context.msg);
							if(max['1'] > 70){
								let insultRes = ['عيب كده احترم نفسك','متحترم نفسك يا عم انت 😡😡 ','مينفعش كده خليك محترم 😡😡','الله يسمحك 😡😡','الشتيمة بتلف تلف وترجع لصاحبها 😡😡','متحترم نفسك يا جدع انت 😡😡 ','عيب كده اله','ملكش دعوة 😛😛 ','ليه بس كده يا حمادة بتزعلني منك ليه.','اللي انت بتقوله ده عيب وحرام','عيب عيب يا بابا','ليه الغلط بقا متخليك كووول']
								GraphAPI.sendPlainMessage(recipientId, generateRandom(insultRes)+' 😒😒').then(()=>{
								offer();
								})
							}else{
								let confusedRes = ['مش فاهم انت تقصد ايه, متجرب حاجة من دول','اكدب عليك لو قولتلك فهمت حرف من اللي انت قولته','انا قرات كل حاجة اني افهم كلمm. ','معلش اخوك فهمة علي قده شوية. 👶👶','ايه اللي خلاك تفكر في الحجات الوحشة دي. ','ودا من ايه لمؤخذة. ','فسر اكتر 😵','ايه يا عم اللي انت بتقوله ده انا مفهمتش حاجة.','مليش في الكيميا الصراحة','لا كده الموضوع بقي معقد قوي 😵😵.','طيب حاضر.','ماشي ','حصل 😵','من عنيا.','انت تؤمر','ازاي يا جدع 😮 ','(Y)']
								GraphAPI.sendPlainMessage(recipientId, generateRandom(confusedRes)+' 😨😨 اختار حاجة من دول.').then(()=>{
									offer();
								})
							}
							
						}
						
					}
				}
		}

	
	// deleting context for debugging
		if(context.msg == 'delete.context'){
		  GraphAPI.sendPlainMessage(recipientId, 'context deleted')
		  .then(()=>{context.current = {};
		 	context.current.deleted = true;
		  	resolve(context)}); };
	    
	  

		if(context.msg == 'cancel'){
			context.current = {};
			offer();
		}else{

		
		

	 //  if(  context.msg == 'hi' || context.msg == 'hello' || context.msg == 'hey' || context.msg == 'good morning' || context.msg == 'you' ||context.msg == 'good evening'|| context.msg == 'hey rhythmic' || context.msg == 'hello rhythmic' || context.msg == 'hi rhythmic' || context.msg == 'sup' || context.msg == 'هاي' ||  context.msg == 'هاى'  ){
		// context.current = {};
		// GraphAPI.sendPlainMessage(recipientId, 'اهلا! '+context.userData.first_name+' 😃').then(()=>{console.log('Hello panal'); offer();})
		// }
		// if context 
		if(context.current.main == 'offered'){
				switch(context.msg){
					case 'اضافة مفكرة جديدة': 
					context.current.main = 'addingLog';
					context.current.future = true;
					addLog(context).then((cont)=>{resolve(cont)});
					break;
					case 'see you diary': 
					context.current.main = 'gettingLogs';
					getLogs(context);
					break;
					case 'اضافة نشاط جديد': 
					context.current.main = 'addingActivity';
					addActivity(context).then((cont)=>{resolve(cont)});
					break;
					default:
					console.log('context in default ',context);
					others(context.msg)
					break;
					// create some fuzzy matching here
					
				}

			}
				else {
					if (context.current.panel){ // Send the panel
						console.log("panal offer");
						offer();
					}
				else{
					//  there is a context going on
					console.log('inside the last else n take action',JSON.stringify(context));
					if(context.current.main == 'addingActivity'){
						addActivity(context).then((cont)=>{resolve(cont)});
					}else{
						if(context.current.main == 'addingLog'){
							addLog(context).then((cont)=>{resolve(cont)});
						}else{
							if(context.current.main == 'getStarted'){
								context.current.main = 'getStarted'
								getStarted(context).then((cont)=>{resolve(cont)});
							}else{
								if(context.current.main == 'howAreYou'){
									console.log('inside how are you');
									var imFine =  ['الحمد لله ','تمام ','بخير','الحمد لله بخير' ,' انا كويس الحمد لله ','كله تمام','اشطه','عنب',' حمادة' ,'حمادة بالجنزبيل','لوكس','نحمد الله']
									let max = fuzzChech(imFine,context.msg);
									console.log('maxx ',max);
									if (max['1'] > 50){
										GraphAPI.sendPlainMessage(recipientId,'يا رب ديما').then(()=>{
											//console.log('maxx ',max);
											let max = fuzzChech(howAre, context.msg);
											if(max['1'] > 50 || context.msg.indexOf("وانت") >= 0){
												GraphAPI.sendPlainMessage(recipientId,'انا بخير الحمد لله ').then(()=>{
													offer();
												})
											}else{
												offer();
											}
														
												})//
											
									}else{
										GraphAPI.sendPlainMessage(recipientId,'تمام ').then(()=>{
													offer();
												})
									}
								}
							}
						}
					}
				}
			

			}
	
	
}
	//resolve(context)
	
	})
}

module.exports = takeAction;
//