const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');


module.exports = function(context, msg){

	console.log('done');
	let recipientId = context.userData.recipientId;
	let cleanSub = function(){
		context.second = context.first;
		context.first.sub = {};
	}
	context.first.main.addingActivity = true

	if(Object.keys(context.first.sub).length == 0){ //  there is no subcontext
		//context.first.sub.activityName = true
		console.log('activity ',msg,' saved');
		let data = platformHelpers.generateQuickReplies('Choose the Type ', {0:'work',1:'study',2:'entertainment'});
		GraphAPI.sendTemplateMessage(recipientId, data)
		cleanSub();
		context.first.sub.activityName = true

	}else {
			if(context.first.sub.activityName){
			GraphAPI.sendPlainMessage(recipientId, 'Ok tell me the name of the activity! ')
			cleanSub();
			context.first.sub.positivity = true	
			//return
			}else{
				if(context.first.sub.positivity){
					console.log('activity type ',msg,' saved');
					let data = platformHelpers.generateQuickReplies('is is positve or ngative', {0:'positive',1:'ngative',2:'other'});
					GraphAPI.sendTemplateMessage(recipientId, data)
					cleanSub();
					context.first.sub.hebitual = true
				}else{
					if(context.first.sub.hebitual){
						let data = platformHelpers.generateQuickReplies('Is it a habit ', {0:'Yes',1:'NO'});
						GraphAPI.sendTemplateMessage(recipientId, data)
						cleanSub();
						context.first.sub.done = true
					}else{
						if(context.first.sub.done){
						GraphAPI.sendPlainMessage(recipientId, 'Activity add successfully!')
						cleanSub();
						context.first.main = {}
						}
					}
				}
			}
	}
	console.log('context in addActivity ', JSON.stringify(context));


	
	//context.first.main = {};
}