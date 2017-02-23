module.exports = function(myApp) {
    var nsp_template = myApp.webserver.io.of('/template');
    var debug = require('debug')('module:sockets:audit');

    nsp_template.on('connection', function(socket){
        debug("connection on socket.io/template for socket " + socket.id);

        socket.custom = {
            room: null,
            isAdmin: false
        };

        socket.on('join', function(data) {
            // Slight obfuscation for clients
            if (typeof data === "string") { data = { room: data }; }

            if (socket.custom.room) {
              debug("socket " + socket.id + " left " + socket.custom.room);
              socket.leave(socket.custom.room);
            }

            socket.join(data.room);
            socket.custom.room = data.room;

            debug("socket " + socket.id + " joined " + socket.custom.room);
            socket.emit('joined', socket.custom.room);

            if ((typeof data === "object") && (data.admin === true)) {
                debug("socket " + socket.id + " in " + socket.custom.room + " is admin");
                socket.custom.isAdmin = true;
            }

            myApp.storage.get(socket.custom.room, function(err, json) {
                if (!err) {
                    json = myApp.utils.tryJSONParse(json);            // TODO Don't trust parsing.
                    debug("template: onJoin get", json);
                    if (json !== null) {
                        if (typeof json.setting !== "undefined") {
                            myApp.utils.each(json.setting, function(value) {
                                debug("template: onJoin get each: ", value);
                                socket.emit('setting', value);
                            });
                        }
                        if (typeof json.state !== "undefined") {
                            myApp.utils.each(json.state, function(value) {
                                debug("template: onJoin get each: ", value);
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
            nsp_template.in(socket.custom.room).emit(message.event, message.data);
        });

    });

    makeGetCallback = function(id, message) {
        debug("makeGetCallback", id, message);
        var passthru = { id: id, data: message };
        return function(err, json) {
            json = myApp.utils.tryJSONParse(json);    // TODO Don't trust parsing.
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
