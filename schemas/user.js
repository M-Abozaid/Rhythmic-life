'use strict';

const mongoose = require('mongoose-q')(require('mongoose'));
const Schema = mongoose.Schema;
const ActivitySchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    type:{
        type: String
    },
    positivity:{
        type: String
    },
    // period:{
    //     type: Number,
    //     required: true
    // },
    hebitual:{
        type: String
    }
},{
    timestamps: true
});

const LogsSchema = new Schema({
    logName:{
        type: String,
    },
    activityId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User.activities'
    },
    note:{
        type: String,
        default: " "  
    },
    time:{ type: Number, default: Date.now },
},{
    timestamps: true

})

const UserSchema = new Schema({

    recipientId: {type: String, unique: true},

    firstName: String, 
    lastName: String, 
    profilePic: String, 
    locale: String,
    timezone: Number,
    gender: String,

    lastLocation: {
        title: String,
        lat: Number, 
        lon: Number,
        when: Date
    },

    locations: [
        {
            title: String, 
            lat: Number, 
            lon: Number,
            when: Date
        }    
    ],
    activities:[ActivitySchema],
    activityLogs:[LogsSchema],

    lastActivity: {type: Date, default: Date.now, index: true},

    created: {type: Date, default: Date.now, index: true},
    updated: {type: Date, default: Date.now}
});



let User = mongoose.model('User', UserSchema);

module.exports = User;

