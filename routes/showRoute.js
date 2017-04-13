
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const User = require('../schemas/user');


let showRouter = express.Router();
showRouter.use(bodyParser.json())

let idi = req.params.id

showRouter.get('/:id',  function(req, res, next) {
	User.findOne({recipientId : recipientId},(err,user)=>{
				if (err) throw err;

				res.render('show', { userId: user });
				console.log("id ",idi)

	})
	
});

module.exports = showRouter