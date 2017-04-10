const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');


module.exports = function(context, msg){

	console.log('done');

	context.first.main.addingActivity = true

	if(Object.keys(context.first.sub)length == 0){ //  there is no subcontext
		//context.first.sub.activityName = true
		GraphAPI.sendPlainMessage(recipientId, 'Ok tell me the name of the activity! ')
		context.first.sub.activityType = true
	}else {
			if(context.first.sub.activityType){
			console.log('activity ',msg,' saved');
			let data = platformHelpers.generateQuickReplies('Choose the Type ', {0:'work',1:'study',2:'entertainment'});

			GraphAPI.sendTemplateMessage(recipientId, data)
			context.second.sub = context.first.sub;
			context.first.sub = {};
			context.first.sub.positivity = true	
			//return
			}else{
				if(context.first.sub.positivity){
					console.log('activity type ',msg,' saved');
					let data = platformHelpers.generateQuickReplies('is is positve or ngative', {0:'positive',1:'ngative',2:'other'});

					GraphAPI.sendTemplateMessage(recipientId, data)
					context.second = context.first;
					context.first = {};
				}
			}
	}
	console.log('context in addActivity ', JSON.stringify(context));

	//context.first.main = {};
}