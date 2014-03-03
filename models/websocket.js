module.exports = function (server, connections) {

    var io = require('socket.io').listen(server);

    function getName(connections, socket) {
        'use strict';

        var name, key;

        for (key in connections) {
            if (socket === connections[key].socket) {
                name = key;
            }
        }

        return name;
    }

    io.sockets.on('connection', function (socket) {

        socket.on('msg', function (message) {
            var data = JSON.parse(message),
                name = getName(connections, socket);

            var msg = '{"name": "' + name + '", "msg":"' + data.msg + '"}';

            socket.emit('msg', msg);
            socket.broadcast.emit('msg', msg);
        });

        socket.on('join', function (input) {
            var data = JSON.parse(input);

            connections[data.name] = {'socket': socket, 'position': data.position};

            var message = {};

            var names = Object.keys(connections);

            for (var i = 0; i < names.length; i++) {
                message[names[i]] = connections[names[i]].position;
            }

            var msg = '{"users": ' + JSON.stringify(message) + '}';

            socket.emit('join', msg);
            socket.broadcast.emit('join', msg);
        });

    });

};