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
    }
};