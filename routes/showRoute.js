
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../schemas/user');
const _ = require('lodash');


let showRouter = express.Router();
showRouter.use(bodyParser.json())



showRouter.get('/:id',  function(req, res, next) {
	let recipientId = req.params.id
	User.findOne({recipientId : recipientId},(err,user)=>{
		if (err) throw err;

		res.render('show', {cUser:user});
		console.log("id ",recipientId)

	})
	
});

showRouter.get('/logs/:id',function(req, res, next){
	let recipientId = req.params.id
	User.findOne({recipientId : recipientId},(err,user)=>{
		if (err) throw err;
		
		let Logs = _.map( user.activityLogs ,(elem)=>{
			//console.log('elem = ',elem);
			let vv ={ 
				logName: elem.logName,
				note: elem.note,
				activity: user.activities.id(elem.activityId),
				time: elem.time || 0
				}
			//vv.activity = user.activities.id(elem.activityId)
			vv.hh = '34';
			console.log('elem = ',vv.hh);
			console.log('elem vv = ',vv);
			console.log('elem keys = ',Object.keys(vv));
			return vv;
		})
		console.log("logsss ",Logs)
		res.json(Logs);
		console.log("id ",recipientId)
		

	})
})

module.exports = showRouter