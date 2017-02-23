module.exports = function(myApp){

    /* Environment: The following variables are to be set via the environment:
         * REDIS_PORT
         * REDIS_HOST
         * REDIS_PASS (optional)
    */

    // TODO Test this

    if (typeof myApp.storage !== "undefined") {
        myApp.utils.consoleOutput('module/storage/redis :: WARN :: storage '+myApp.storage.module+' already loaded.  module not loaded...');
        return;
    }
    if (typeof myApp.config.REDIS_HOST === "undefined") {
        myApp.utils.consoleOutput('module/storage/redis :: INFO :: REDIS_HOST value not found.  module not loaded...');
        return;
    }
    if (typeof myApp.config.REDIS_PORT === "undefined") {
        myApp.utils.consoleOutput('module/storage/redis :: INFO :: REDIS_PORT value not found.  module not loaded...');
        return;
    }

    var storage = { module: "redis" };
    var redis = require('redis');
    var client = redis.createClient(myApp.config.REDIS_PORT, myApp.config.REDIS_HOST, {no_ready_check: true});

    storage.initialize = function(){

        client.auth(myApp.config.REDIS_PASS, function (err) {
            if (err) {
                throw err;
            }
        });

        client.on('connect', function() {
            myApp.utils.consoleOutput('module/storage/redis :: INFO :: connected to '+myApp.config.REDIS_HOST);
        });

        client.get('app', function (err, reply) {
            if (err) {
                throw err;
            } else {
                if (myApp.package.name !== reply) {
                    myApp.utils.consoleOutput("module/storage/redis :: WARN :: redis database belongs to "+reply+", expected "+myApp.package.name, undefined, false);
                } else {
                    myApp.utils.consoleOutput("module/storage/redis :: INFO :: redis database belongs to "+reply, undefined, false);
                }
            }
        });

        myApp.utils.consoleOutput("module/storage/redis has been initialized...");
    };

    storage.get = function(field, callback) {
        client.get(field, function(err, json) {
            callback(err, myApp.utils.tryJSONParse(json));
        });
    };

    storage.set = function(field, data, callback) {
        // NOTE: node_redis will accept an undefined callback.
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        client.set(field, data, callback);
    };

    myApp.storage = storage;
    myApp.utils.consoleOutput("module/storage/redis has been loaded...");
};