module.exports = {
    http: {
        host: 'localhost',
        externalHost: process.env.EXTERNAL_HOST || 'http://localhost',
        port: process.env.PORT || 80
    },
    jwt: {
        secret: 'myjwtSecretKEY'
    },
    session: {
        secret: 'fsd534fd65sfs77df'
    },
    db: {
        connectionString: process.env.MONGO_URL
    },
    email: {
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }
};
