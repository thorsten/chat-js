/**
 * Module dependencies.
 */

var express  = require('express'),
    path     = require('path'),
    hbs      = require('express-hbs'),
    config   = require('./config'),
    routes   = require('./routes'),
    websockets = require('./models/websocket');

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

var connections = {};

routes(app, connections);

var http = require('http');
var server = http.createServer(app);
server.listen(app.get('port'));

websockets(server, connections);

