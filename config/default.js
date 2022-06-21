module.exports = {
    ...require('./production'),
    db: {
        connectionString: 'mongodb://localhost:27017/online_chat_db'
    },
    email: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'murray.schinner37@ethereal.email',
            pass: 'trg9wfTr7qZDb2KEM4'
        }
    }
}
