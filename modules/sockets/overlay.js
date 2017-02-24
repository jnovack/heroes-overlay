module.exports = function(myApp) {
    var nsp_overlay = myApp.webserver.io.of('/overlay');
    var debug = require('debug')('module:sockets:overlay');

    nsp_overlay.on('connection', function(socket){
        debug("connection on socket.io/overlay for socket " + socket.id);

        socket.custom = {
            room: null,
            isAdmin: false
        };

        socket.on('join', function(data) {
            // Ensure valid structure
            if ((typeof data !== "object") || (typeof data.room === "undefined") || (typeof data.key === "undefined")) {
                return;
            }

            // Validate data types
            if ( (myApp.utils.isHash(data.room) == null) || (myApp.utils.isUUID(data.key) == null) ) {
                return;
            }

            // If you are already in a room, leave it.
            if (socket.custom.room !== null) {
              debug("socket " + socket.id + " left " + socket.custom.room);
              socket.leave(socket.custom.room);
            }

            myApp.storage.get(data.room, function(err, json){
                if (err) {
                    debug("socket " + socket.id + " could not join " + data.room);
                    socket.emit('room-unavailable', true);
                    return;
                } else {
                    socket.join(data.room);
                    socket.custom.room = data.room;

                    debug("socket " + socket.id + " joined " + socket.custom.room);
                    socket.emit('joined', socket.custom.room);

                    json = myApp.utils.tryJSONParse(json);            // TODO Don't trust parsing.

                    if (json.admin === data.key) {
                        debug("socket " + socket.id + " in " + socket.custom.room + " is admin");
                        socket.custom.isAdmin = true;
                    }

                    debug("overlay: onJoin get", json);
                    if (json !== null) {
                        if (typeof json.setting !== "undefined") {
                            myApp.utils.each(json.setting, function(value) {
                                debug("overlay: onJoin get each: ", value);
                                socket.emit('setting', value);
                            });
                        }
                        if (typeof json.state !== "undefined") {
                            myApp.utils.each(json.state, function(value) {
                                debug("overlay: onJoin get each: ", value);
                                socket.emit('state', value);
                            });
                        }
                    }
                }
            });
        });

        socket.on('broadcast', function(message) {
            if (!socket.custom.isAdmin) {
                return;
            }
            if (message.event != "command") {
                myApp.storage.get(socket.custom.room, makeGetCallback(socket.custom.room, message));
            }
            nsp_overlay.in(socket.custom.room).emit(message.event, message.data);
        });

    });

    makeGetCallback = function(id, message) {
        debug("makeGetCallback", id, message);
        var passthru = { id: id, data: message };
        return function(err, json) {
            if (err === true) { json = {}; }            // If nothing was returned, set it to an empty object.
            json = myApp.utils.tryJSONParse(json);      // TODO Don't trust parsing.
            if (typeof json[message.event] == "undefined") {
                json[message.event] = {};
            }
            json[message.event][message.data.id] = message.data;
            debug("makeGetCallback: passthru: ", passthru);
            debug("makeGetCallback: json: ", json);
            myApp.storage.set(passthru.id, JSON.stringify(json));
        };
    };

    debug("loaded...");
};
