
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
		if (err) next(err);

		res.render('index', {cUser:user});
		console.log("id ",recipientId)

	})
	
});

showRouter.get('/:id/ar',  function(req, res, next) {
	let recipientId = req.params.id
	User.findOne({recipientId : recipientId},(err,user)=>{
		if (err) next(err);

		res.render('indexar', {cUser:user});
		console.log("id ",recipientId)

	})
	
});

showRouter.get('/',  function(req, res, next) {
		res.render('show');
	});

showRouter.get('/ar',  function(req, res, next) {
		res.render('showar');
	});
	


showRouter.get('/logs/:id',function(req, res, next){
	let recipientId = req.params.id
	User.findOne({recipientId : recipientId},(err,user)=>{
		if (err) next(err);

		// this is the best solution so far 
		let Logs = _.map( user.activityLogs ,(elem)=>{
			let temp ={ 
				logName: elem.logName,
				note: elem.note,
				activity: user.activities.id(elem.activityId),
				time: elem.time || 0,
				span: elem.span
				}

			return temp;
		})

		res.json(Logs);
		console.log("id ",recipientId)

	})
})



module.exports = showRouter
