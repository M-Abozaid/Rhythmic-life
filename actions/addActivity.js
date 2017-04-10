const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');


module.exports = function(context, msg){

	console.log('done');
	let recipientId = context.userData.recipientId;
	
	context.current.main = 'addingActivity' ;

	if(Object.keys(context.current).length == 1){ //  there is only main in the current context 
		//context.first.sub.activityName = true
		console.log('activity ',msg,' saved');
		let data = platformHelpers.generateQuickReplies('Choose the Type ', {0:'work',1:'study',2:'entertainment'});
		GraphAPI.sendTemplateMessage(recipientId, data)
		context.current.activityType = msg

	}else {
			if(context.current.activityType && !context.current.positivity){
			GraphAPI.sendPlainMessage(recipientId, 'Ok tell me the name of the activity! ')
			context.current.positivity = msg	
			//return
			}else{
				if(context.current.positivity && !context.current.hebitual){
					console.log('activity type ',msg,' saved');
					let data = platformHelpers.generateQuickReplies('is is positve or ngative', {0:'positive',1:'ngative',2:'other'});
					GraphAPI.sendTemplateMessage(recipientId, data)
					context.current.hebitual = msg
				}else{
					if(context.current.hebitual&& !context.current.done){
						let data = platformHelpers.generateQuickReplies('Is it a habit ', {0:'Yes',1:'NO'});
						GraphAPI.sendTemplateMessage(recipientId, data)
						context.current.done = true
					}else{
						if(context.current.done){
						GraphAPI.sendPlainMessage(recipientId, 'Activity added successfully!')
						console.log('saving to the database.....',JSON.stringify(context.current));
						context.current = {}
						}
					}
				}
			}
	}
	console.log('context in addActivity ', JSON.stringify(context));


	
	//context.first.main = {};
}