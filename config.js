var config = {
    development: {
        server: {
            port: 8080
        }
    },
    testing: {
        server: {
            port: 8080
        }
    },
    production: {
        server: {
            port: 8080
        }
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];
