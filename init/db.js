'use strict';
/**
 * Initializes the database instance.
 * @author Alexander Adamyan
 */

const fs = require('fs');
const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
const debug = require('debug')('cbp:init:db');
const path = require('path');

var dbInitialized = false;

/**
 * Initialize Database connection
 * @param  {Object} config current environment configuration
 * @param forceNoDebug
 */
exports.init = function (config, forceNoDebug) {
    //Preventing the module to be initialize more than one time
    if (dbInitialized) {
        return;
    }
    dbInitialized = true;

    //Connecting to the database
    debug('initializing database connection');
    mongoose.connect(config.db);

    // code from corsera
    var db1 = mongoose.connection;
    db1.on('error', console.error.bind(console, 'connection error:'));
    db1.once('open', function () {
        // we're connected!
        console.log("Connected correctly to server");
    });
    
    //Set debug mode for dev environment
    var env = process.env.NODE_ENV || 'development';
    if (env === 'development' && !forceNoDebug) {
        mongoose.set('debug', true);
    }

    //Init model schemas
    debug('initializing model schemas');
    var schemasPath = path.join(__dirname, '../schemas');
    var schemaFiles = fs.readdirSync(schemasPath);

    schemaFiles.forEach(function (file) {
        require(schemasPath + '/' + file);
        debug('model schema initialized: %s', file);
    });
};