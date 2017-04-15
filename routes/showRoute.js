
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
		let array  = _.map(user.activityLogs,(elem)=>{
			elem.activity = user.activities.id(elem.activityId)
			return elem;
		})
		console.log('arrayyy ',JSON.stringify(array));
		  user.activityLogs = array
		
		res.json(user);
		console.log("id ",recipientId)
		console.log("logs ",JSON.stringify(user.activityLogs))

	})
})

module.exports = showRouter