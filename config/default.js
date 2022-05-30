module.exports = {
    ...require('./production'),
    db: {
        connectionString: 'mongodb://db:27017/online_chat_db'
    }
}
