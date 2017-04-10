const platformHelpers = require('../platformHelpers');
const GraphAPI = require('../graphAPI');


module.exports = function(context, msg){

	console.log('done');

	context.first.main.addingActivity = true

	console.log('context in addActivity ', JSON.stringify(context));
}