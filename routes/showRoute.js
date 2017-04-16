
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
		
		_.map( user.activityLogs ,(elem)=>{
			//console.log('elem = ',elem);
			let vv = {
		        name:'muhammed',
		        age: 22
		      }

		      vv.hh = '34';
		      console.log('elemww = ',vv.hh);
		      console.log('elem vv = ',vv);
		//WTF....
		      return elem;
		})
		
		res.json(user);
		console.log("id ",recipientId)
		//console.log("logsss ",user.activityLogs)

	})
})

module.exports = showRouter