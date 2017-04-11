const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');
const mongoose = require('mongoose');
const User = require('../schemas/user');


module.exports = function(context, msg){

	console.log('done');
	let recipientId = context.userData.recipientId;


	let saveActivity = function(){
		return new Promise(function(resolve, reject){
			User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;
				console.log('the user  ',JSON.stringify(user));
				let obj = {
					name: context.current.activityName,
					type: context.current.activityType,
					positivity: context.current.positivity,
					hebitual: context.current.hebitual
				}
				console.log('Obj  ', JSON.stringify(obj))
				user.activities.push(obj)
				console.log('Pushed ', JSON.stringify(user),' user.activities ',JSON.stringify(user.activities));
				user.save(function (err, user) {
	                        if (err) throw err;
	                        //res.json(user);
	                        
							resolve()
							
	                    });
			})
		})

	}

	if(Object.keys(context.current).length == 1){ //  there is only main context 
		//context.first.sub.activityName = true
		context.current.choose = true ;
		console.log('activity ',msg,' saved');
		let data = platformHelpers.generateQuickReplies('Choose the Type ', {0:'work',1:'study',2:'entertainment'});
		GraphAPI.sendTemplateMessage(recipientId, data)
		context.current.choose = true ;
		

	}else {
			if(context.current.choose && !context.current.activityType){
			context.current.activityType = msg	
			GraphAPI.sendPlainMessage(recipientId, 'Ok tell me the name of the activity! ')
		 	}else{
				if(context.current.activityType && !context.current.activityName){
					context.current.activityName = msg
					console.log('activity type ',msg,' saved');
					let data = platformHelpers.generateQuickReplies('is is positve or ngative', {0:'positive',1:'ngative',2:'other'});
					GraphAPI.sendTemplateMessage(recipientId, data)
					
				}else{
					if(context.current.activityName && !context.current.positivity){
						context.current.positivity = msg
						let data = platformHelpers.generateQuickReplies('Is it a habit ', {0:'Yes',1:'NO'});
						GraphAPI.sendTemplateMessage(recipientId, data)
					}else{
						if(context.current.positivity && !context.current.hebitual){
							context.current.hebitual = msg
							saveActivity().then(()=>{
								context.current = {}
							})
							GraphAPI.sendPlainMessage(recipientId, 'Activity added successfully!  ✌️')
							//console.log('saving to the database.....',JSON.stringify(context.current));
							
						}
					}
				}
			}
		}
	console.log('context in addActivity ', JSON.stringify(context));


	
	//  context.first.main = {};
}