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
        type: Boolean
    },
    // period:{
    //     type: Number,
    //     required: true
    // },
    hebitual:{
        type: Boolean
    },

});

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
    

    lastActivity: {type: Date, default: Date.now, index: true},

    created: {type: Date, default: Date.now, index: true},
    updated: {type: Date, default: Date.now}
});



mongoose.model('User', UserSchema);

