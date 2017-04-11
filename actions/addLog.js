const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');
const mongoose = require('mongoose');
const User = require('../schemas/user');

module.exports = function(context, msg){

	//context.current.main = 'addingLog'
	console.log("adding logs");
	User.findOne({recipientId : recipientId},(err,user)=>{
		if (err) throw err;
		let data = platformHelpers.generateQuickReplies('Choose the activity ', map(user.activities,(elem)=>{return elem.name}));
		GraphAPI.sendTemplateMessage(recipientId, data).then(()=>{
			context.current = {} 
		})

	})

}