module.exports = function(myApp){
    var debug = require('debug')('module:storage:memory');

    if (typeof myApp.storage !== "undefined") {
        debug(':: WARN :: storage '+myApp.storage.module+' already loaded.  module not loaded...');
        return;
    }

    var storage = { module: "memory" };
    var memory = {};

    storage.initialize = function(){
        debug('initialized...');
    };

    storage.get = function(field, callback) {
        if (typeof memory[field] !== "undefined") {
            debug('get() - ' + field + ' exists');
            if (typeof callback === "function") {
                process.nextTick(function() { callback(null, memory[field]); });
            }
        } else {
            debug('get() - ' + field + ' does NOT exist');
            if (typeof callback === "function") {
                process.nextTick(function() { callback(true, undefined); });
            }
        }
        return;
    };

    storage.set = function(field, data, callback) {
        memory[field] = data;
        if (memory[field] === data) {
            debug('set() - success : ' + field);
            if (typeof callback === "function") {
                process.nextTick(function() { callback(null, memory[field]); });
            }
        } else {
            debug('set() - failed : ' + field);
            if (typeof callback === "function") {
                process.nextTick(function() { callback(true, undefined); });
            }
        }
        return;
    };

    myApp.storage = storage;
    debug('loaded...');
};
