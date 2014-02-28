/**
 * Module dependencies.
 */

var express  = require('express'),
    path     = require('path'),
    hbs      = require('express-hbs'),
    config   = require('./config'),
    routes   = require('./routes');

var app = express();

app.locals({
    dev: app.get('env') === 'development'
});

/**
 * Express configuration.
 *
 */
app.set('port', config.server.port);
app.engine('hbs', hbs.express3());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret code' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res) {
    res.status(404).render('404', {title: 'Not Found :('});
});
app.use(express.errorHandler());

routes(app);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

app.get('/logout', function (req, res) {
    var names = Object.keys(connections);
    names.splice(names.indexOf(req.session.user), 1);

    var msg = '{"names": ["' + names.join('","') + '"]}';

    if (connections[req.session.user] && connections[req.session.user].socket) {
        connections[req.session.user].socket.broadcast.emit('join', msg);
        connections[req.session.user].socket.disconnect();
    }
    delete connections[req.session.user];
    delete req.session.user;

    res.redirect('/');
});

var http = require('http');
var server = http.createServer(app);
server.listen(8080);
var io = require('socket.io').listen(server);

var connections = {};

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

    socket.on('join', function (message) {
        var data = JSON.parse(message);

        connections[data.name] = {'socket': socket, 'position': data.position};

        var names = Object.keys(connections);

        for (var i = 0; i < names.length; i++) {
            message[names[i]] = connections[names[i]].position;
        }

        var msg = '{"users": ' + JSON.stringify(message) + '}';

        socket.emit('join', msg);
        socket.broadcast.emit('join', msg);
    });

});


