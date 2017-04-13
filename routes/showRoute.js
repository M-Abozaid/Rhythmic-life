
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const User = require('../schemas/user');


let showRouter = express.Router();
showRouter.use(bodyParser.json())



showRouter.get('/:id',  function(req, res, next) {
	let recipientId = req.params.id
	User.findOne({recipientId : recipientId},(err,user)=>{
		if (err) throw err;

		res.render('show', { userId: user });
		console.log("id ",recipientId)

	})
	
});

module.exports = showRouter