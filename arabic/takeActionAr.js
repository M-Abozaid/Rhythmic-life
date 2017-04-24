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
	var howAre = ['انت عامل ايه','اخبارك','ازيك','ايه الاحوال','عامل ايه','الدنيا عامله معاك ايه','انت عامل ايه','وانت اخبارك','وانت عامل ايه']
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
		
		if (max['0'] > 70){
			GraphAPI.sendPlainMessage(recipientId, max['1'] +' يا '+ context.userData.first_name + 'عامل ايه').then(()=>{
						context.current.main == 'howAreYou';	
					})
				
				}else{
					GraphAPI.sendPlainMessage(recipientId, 'اسف انا مش فاهم انت تقصد ايه اختار حاجة من دول.').then(()=>{
						offer();
					})
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
		else { if(context.current.main == 'offered'){
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
					others(context.msg)

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
									var imFine =  ["الحمد لله ","تمام ","بخير","الحمد لله بخير" ," انا كويس الحمد لله ","كله تمام","اشطه","عنب"," حمادة" ,"حمادة بالجنزبيل","لوكس","نحمد الله"]
									let max = fuzzChech(imFine,context.msg);
									if (max['1'] > 50){
										GraphAPI.sendPlainMessage('يا رب دايما').then(()=>{
											let max = fuzzChech(howAre,context.msg);
											if(max['1'] > 50){
												GraphAPI.sendPlainMessage('انا بخير الحمد لله ').then(()=>{
													offer();
												})
											}else{
												offer();
											}
														
												})
											
									}
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