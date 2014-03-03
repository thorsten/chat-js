/**
 * Module dependencies.
 */

var express  = require('express'),
    path     = require('path'),
    hbs      = require('express-hbs'),
    config   = require('./config'),
    routes   = require('./routes'),
    websockets = require('./websocket');

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

var connections = {};

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

websockets(server, connections);

