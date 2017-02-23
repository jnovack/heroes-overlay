module.exports = function(myApp){
    var utils = {},
        path = require('path'),
        fs = require("fs");

    utils.stringify = require('json-stringify-safe');
    utils.memcache = require('expire-memory');

    utils.console = {};

    utils.noop = function(){};

    utils.handlePromiseError = function(error){
        this.console.logLine();
        console.log(error.stack);
        this.console.logLine();
    };

    utils.console.logLine = function(){
        var line = "";
        if (!process.stdout.isTTY) {
            process.stdout.columns = 70;
        }
        while(line.length < process.stdout.columns){
            line += "#";
        }
        console.log(line);
    };

    utils.console.logLeft = function(whatToLog, outSideEdge){
        var emptyNeeded = (process.stdout.columns - (whatToLog.length + 1));

        if(outSideEdge) emptyNeeded += 2;
        var line = "";
        while(line.length < emptyNeeded){
            line += " ";
        }
        var output = whatToLog+line;
        if(outSideEdge) output = "# "+output+"#";
        console.log(output);
    };

    utils.console.logCenter = function(whatToLog, outSideEdge){
        var emptyNeeded = ((process.stdout.columns - whatToLog.length) / 2);
        if(outSideEdge){
            emptyNeeded = ((process.stdout.columns - (whatToLog.length + 2)) / 2);
        }
        var line = "";
        while(line.length < emptyNeeded){
            line += " ";
        }
        var output = line+whatToLog+line;
        if((output.length + 2) > process.stdout.columns){
            output = line+whatToLog;
            line = line.substring(0, line.length - 1);
            output += line;
        }
        if(outSideEdge){
            output = "#"+output+"#";
        }
        console.log(output);
    };

    utils.consoleOutput = function(whatToOutput, textAlign, outSideEdge){
        if(whatToOutput === "line") return this.console.logLine();
        if(textAlign === undefined) textAlign = "Left";
        if(outSideEdge === undefined) outSideEdge = false;
        this.console["log"+textAlign](whatToOutput, outSideEdge);
    };

    utils.mkdir = function(dir) {
        if (path.relative(myApp.root, dir).substring(0,2) == ".." ) {
            throw new RangeError("Directory out of scope. '" + dir + "'");
            // return false;
        }
        // TODO: Check the directory is within our scope.
        if ( !fs.existsSync(dir) ) {
            fs.mkdirSync(dir);
        }
    };

    utils.deleteFolderRecursive = function(dir) {
        if (path.relative(myApp.root, dir).substring(0,2) == ".." ) {
            throw new RangeError("Directory out of scope. '" + dir + "'");
            // return false;
        }
        if( fs.existsSync(dir) ) {
            fs.readdirSync(dir).forEach(function(file,index) {
                var curDir = dir + "/" + file;
                if(fs.statSync(curDir).isDirectory()) { // recurse
                    myApp.utils.deleteFolderRecursive(curDir);
                } else { // delete file
                    fs.unlinkSync(curDir);
                }
            });
            fs.rmdirSync(dir);
        }
    };

    utils.customSort = function(array, field, direction) {
        if(direction === undefined) direction = "desc";
        array.sort(function(a, b) {
            if (a[field] === undefined || b[field] === undefined)
                throw new Error('Invalid field to sort on');
            if (a[field] > b[field])
                return -1;
            if (a[field] < b[field])
                return 1;
            return 0;
        });
        if(direction === "asc") array.reverse();
    };

    utils.epoch = function(){
        var date = new Date();
        return Math.floor(date.getTime() / 1000);
    };

    utils.tryJSONParse = function(str) {
        if (str === null) {
            return {};
        }
        try {
            JSON.parse(str);
        } catch (e) {
            return str;
        }
        return JSON.parse(str);
    };

    /** underscore.js functions **/
    var ArrayProto    = Array.prototype,
        nativeForEach = ArrayProto.forEach,
        nativeKeys    = Object.keys,
        nativeEvery   = ArrayProto.every;

    var isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= Math.pow(2, 53) - 1;
    };

    var property = function(key) {
        return function(obj) {
            return obj === null ? void 0 : obj[key];
        };
    };

    var getLength = property('length');

    utils.has = function(obj, key) {
        return obj !== null && hasOwnProperty.call(obj, key);
    };

    utils.identity = function(value) {
        return value;
    };

    utils.isArray = function(obj) {
        return toString.call(obj) == '[object Array]';
    };

    utils.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    utils.keys = function(obj) {
        if (!utils.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (utils.has(obj, key)) keys.push(key);
            // if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    utils.values = function(obj) {
        var keys = utils.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    utils.each = utils.forEach = function(obj, iterator, context) {
        var i, length;
        if (isArrayLike(obj)) {
          for (i = 0, length = obj.length; i < length; i++) {
            iterator(obj[i], i, obj);
          }
        } else {
          var keys = utils.keys(obj);
          for (i = 0, length = keys.length; i < length; i++) {
            iterator(obj[keys[i]], keys[i], obj);
          }
        }
        return obj;
    };

    utils.every = function(obj, predicate, context) {
        predicate || (predicate = utils.identity);                  // jshint ignore:line
        var result = true;
        if (obj === null) return result;
        if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
        utils.each(obj, function(value, index, list) {
            if (!(result = result && predicate.call(context, value, index, list))) return breaker;
        });
        return !!result;
    };

    utils.flatten = function(input, shallow, output) {
        if (output === undefined) { output = []; }
        if (shallow && utils.every(input, utils.isArray)) {
            return concat.apply(output, input);
        }
        utils.each(input, function(value) {
            if (utils.isArray(value)) {
                shallow ? push.apply(output, value) : utils.flatten(value, shallow, output);            // jshint ignore:line
            } else {
                output.push(value);
            }
        });
        return output;
    };

    utils.isEmpty = function(obj) {
        if (obj === null) return true;
        if (isArrayLike(obj) && (utils.isArray(obj)) ) return obj.length === 0;
        return utils.keys(obj).length === 0;
    };

    /**
     * Converts decimal number to hex with zero padding
     *
     * @private
     * @method decimalToHex
     * @param {Number} d Decimal number to convert
     * @param {Number} padding How many zeros to use for padding
     * @return {String} Decimal number converted to hex string
    */
    utils.decimalToHex = function(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
        while (hex.length < padding) {
            hex = "0" + hex;
        }
        return hex;
    };

    /** end underscore.js functions **/

    myApp.utils = utils;
};
