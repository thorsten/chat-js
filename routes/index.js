var indexController = require('../controllers/index');
var chatController = require('../controllers/chat');

module.exports = function (app) {
    app.get('/', indexController.index);

    app.post('/login', chatController.login);

    app.get('/chat', chatController.checkAuth, chatController.chat);
};
