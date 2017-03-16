'use strict';

/**
 * Function for working with Redis DB
 * @author Alexander A.
 */

const Q = require('q');
const redis = require('redis');
const debug = require('debug')('cbp:lib:redis');
const error = require('debug')('cbp:lib:redis:error');
error.log = console.error.bind(console);

var redisIsReady = false;

//config 
 
const configport = 3844;
const confighost = '50.30.35.9';
const configpass = '5e6b16047caeb75191d9c0cb77bbb9a6';
const configdb = 16;
        

// Redis client object
var client;

var methods = ['eval', 'del', 'hdel', 'expire', 'get', 'set', 'del','keys'];
function createClientQ(client) {
    methods.forEach(function (method) {
        client[method + 'Q'] = Q.nbind(client[method], client);
    });

    return client;
}

function createClient(config, returnBuffers) {
    debug('connecting to %s:%s', confighost, configport);
    var client;

    client = redis.createClient(configport, confighost, {return_buffers: returnBuffers});
    client = createClientQ(client);

    if (configpass) {
        client.auth(configpass);
    }

    if (configdb) {
        client.select(configdb);
    }

    client.on('error', function (err) {
        error(err);
    });

    client.on('connect', function() {
        redisIsReady = true;
    });

    return client;
}

exports.redisIsReady = function () {
    return redisIsReady;
};

/**
 * Initializing Redis
 * @param {Object} config configuration with host, port, pass
 */
exports.init = function initRedis(config) {
    client = createClient( {
            port: 3844,
            host: '50.30.35.9',
            pass: '5e6b16047caeb75191d9c0cb77bbb9a6',
            db: 16
        });
};


/**
 * Deletes hash from Redis
 * @param {String} hashName hash that will be deleted
 */
exports.deleteHash = function (hashName) {
    return client.delQ(hashName);
};

/**
 * Deletes key from hash
 * @param {String} hashName  hash where key is located
 * @param {String} key       key name of entry that will be deleted
 */
exports.deleteHashKey = function (hashName, key) {
    return client.hdelQ(hashName, key);
};

/**
 * Setting expire for key after which it will be deleted
 * @description http://redis.io/commands/expire
 * @param {String} keyName     name of the key
 * @param {Number} expireTime expire time in seconds
 */
exports.setExpire = function (keyName, expireTime) {
    return client.expireQ(keyName, expireTime);
};

exports.setKey = function (keyName, value) {
    return client.setQ(keyName, value);
};

exports.getKey = function (keyName) {
    return client.getQ(keyName);
};

exports.findFirstKey = function(pattern) {
    return client.keysQ(pattern)
    .then(function(keys) {
        console.log('findFirstKey inside');
        return keys && keys.length && keys[0];
    });
}

/**
 * Returns redis client
 * @returns {*}
 */
exports.getClient = function() {
    return client;
};

