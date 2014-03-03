module.exports = {
    checkAuth: function (req, res, next) {
        'use strict';
        if (!req.session.user) {
            res.redirect('/');
        } else {
            next();
        }
    },
    index: function (req, res) {
        'use strict';
        if (req.session.user) {
            res.redirect('/chat');
        }

        res.render('login');
    },
    login: function (req, res) {
        'use strict';
        var user = req.body.username,
            pw = req.body.password;

        if (user === 'u1' && pw === 'test') {
            req.session.user = 'u1';
        } else if (user === 'u2' && pw === 'test') {
            req.session.user = 'u2';
        }

        res.redirect('/chat');
    },
    chat: function (req, res) {
        'use strict';
        res.render('chat', {user: req.session.user});
    },

    logout: function (connections, req, res) {
        var names = Object.keys(connections);
        names.splice(names.indexOf(req.session.user), 1);

        var message = {};

        for (var i = 0; i < names.length; i++) {
            message[names[i]] = connections[names[i]].position;
        }

        var msg = '{"users": ' + JSON.stringify(message) + '}';


        if (connections[req.session.user] && connections[req.session.user].socket) {
            connections[req.session.user].socket.broadcast.emit('join', msg);
            connections[req.session.user].socket.disconnect();
        }
        delete connections[req.session.user];
        delete req.session.user;

        res.redirect('/');
    }
};