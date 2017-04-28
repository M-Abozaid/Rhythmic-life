const getStarted = require('./actions/getStarted')
const addActivity = require('./actions/addActivity')
const deleteActivity = require('./actions/deleteActivity')
const addLog = require('./actions/addLog')
const getLogs = require('./actions/getLogs')
const platformHelpers = require('./platformHelpers');
const GraphAPI = require('./graphAPI');
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
							        "title": 'Add a diary entry' ,
							        "payload": 1
							      }	,
							      {
							        "content_type":"text",
							        "title": "Add a new activity",
							        "payload": 3
							      }],

							"attachment":{
						      "type":"template",
						      "payload":{
						        "template_type":"button",
						        "text":"What would you like to do?",
								"buttons":[
							      {
							        "type":"web_url",
							        "url":"https://salty-plains-47076.herokuapp.com/show/"+recipientId,
							        "title":"View your diary 📜",
							        "webview_height_ratio": "compact",
							        "messenger_extensions": true
							      },
							      {
							        "type":"web_url",
							        "url":"https://salty-plains-47076.herokuapp.com/show/"+recipientId + "/#!/statistics",
							        "title":"View your statistics 📈",
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
		var greetings = ['hi' ,'hello',	'good morning',	'good evening'	,'hey'	,'good afternoon',	'what',	'how\'s	it going', 'what\'s up?'	,	'what\'s new'	,'cheers mate'];

		let max = fuzzChech(greetings,context.msg);
		console.log('max ',max);
		if (max['1'] > 70){
			GraphAPI.sendPlainMessage(recipientId, max['0'] +' '+ context.userData.first_name + ' How are you؟').then(()=>{
						context.current.main = 'howAreYou';
						resolve(context);	
					})
				
				}else{
					let howAre = ['how you doin','how are you','how are feelings','Whassup','how have you been','What\'s going on? ','What\'s new?','sup dude','sup','What are you up to?','where are you']
					let max = fuzzChech(howAre,context.msg);
					console.log('max ',max);
					if (max['1'] > 70){
						let howAreRes = ['Fine, thanks. Yourself?','I\'m doing great today - and you?' ,'Not bad, yourself?','Doing well, thanks. How about you? ' ,'Thanks for asking, I\'m doing fine. ','rad','I\'m feeling fabulous today.']
						GraphAPI.sendPlainMessage(recipientId, generateRandom(howAreRes) ).then(()=>{
							context.current.main = 'howAreYou';
							resolve(context);
						})
					}else{
						let thank = ['thank you ','thanks ','you\'re good' ,'amazing','brilliant','useful','thanks alot','funny','cool','you smart','you rock','very good']
						let max = fuzzChech(thank,context.msg);
						if(max['1'] > 70){
								let thenkRes = ['That\'s very kind of you.😊','Thank you','Aww you\'re so cute','Aww you such an angel 😊😊 ','Thank you. I appreciate your saying that.','That\'s encouraging. ','Thank you you are so sweet ','(Y)']
								GraphAPI.sendPlainMessage(recipientId, generateRandom(thenkRes) +'😍😍').then(()=>{
								offer();
							})
						}else{
							let  insult = ['faggot','cunt','fuck','fuck you','shit ','asshole','dick','you are stupid','pice of shit ','crap','fuckin useless','stupid','fag','basterd','shitty bot','airhead']
							let max = fuzzChech(insult,context.msg);
							if(max['1'] > 70){
								let insultRes = ['Dude don\'nt be rude','watch your language 😡😡 ','this is inappropriate 😡😡','keep it cool man 😡😡','calm down don\'nt be rude 😡😡','don\'nt use such language with me 😡😡 ','you\'re a bad person']
								GraphAPI.sendPlainMessage(recipientId, generateRandom(insultRes)+' 😒😒').then(()=>{
								offer();
								})
							}else{
								let confusedRes = ['Dude! seriously','What made you think of that','Oh no do I have to think again. ','I\'m not into roket physics','Not following you. ','Be easy on me. ','I\'m sorry I did\'n understand you 😵','Oh my god why is it so complicated.','Why does it have to be so complicated. ','Explain more 😵😵.','alright alrght.','consider it done ','Oops I did\'nt git that 😵','Yes sair.','As you wish','(Y)']
								GraphAPI.sendPlainMessage(recipientId, generateRandom(confusedRes)+' 😨😨 Why don\'t you try one of these?.').then(()=>{
									offer();
								})
							}
							
						}
						
					}
				}
		}

		if (context.current.notifiy === true && !context.current.logName) {
			let notifyRes = ['no','nope','fuck off','no thanks','go away']
			let max = fuzzChech(notifyRes,context.msg);
			if(max['1'] > 70){
				context.current = {}
				GraphAPI.sendPlainMessage(recipientId, generateRandom(confusedRes)+' 😨 Okey my friend as you wish.').then(()=>{
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
	    
	  

		if(context.msg == 'cancel' || context.msg == 'stop'){
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
					case 'add a diary entry': 
					context.current.main = 'addingLog';
					context.current.future = true;
					addLog(context).then((cont)=>{resolve(cont)});
					break;
					case 'see you diary': 
					context.current.main = 'gettingLogs';
					getLogs(context);
					break;
					case 'add a new activity': 
					context.current.main = 'addingActivity';
					addActivity(context).then((cont)=>{resolve(cont)});
					break;
					case 'DELETE_ACTIVITY': 
					context.current.main = 'deleteActivity';
					deleteActivity(context).then((cont)=>{resolve(cont)});
					break;
					default:
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
									var imFine =  ['Great ','Good ','Awesome','Nice' ,'cool','wonderful','im fine','im feeling great','rad','never better']
									let max = fuzzChech(imFine,context.msg);
									console.log('maxx ',max);
									if (max['1'] > 50){
										GraphAPI.sendPlainMessage(recipientId,'Awesome').then(()=>{
											//console.log('maxx ',max);
											let max = fuzzChech(howAre, context.msg);
											if(max['1'] > 50 || context.msg.indexOf("and you") >= 0){
												GraphAPI.sendPlainMessage(recipientId,'Never better ').then(()=>{
													offer();
												})
											}else{
												offer();
											}
														
												})//
											
									}else{
										cool = ['Great ','Good ','Awesome','Nice' ,'cool','wonderful']
										GraphAPI.sendPlainMessage(recipientId,generateRandom(cool)).then(()=>{
													offer();
												})
									}
								}else{
									if(context.current.main === 'deleteActivity'){
										deleteActivity(context).then((cont)=>{resolve(cont)});
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



