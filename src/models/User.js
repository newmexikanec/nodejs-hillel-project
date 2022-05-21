const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    username: String,
    email: String,
    birthdayDate: Date,
    password: String,
    regDate: {type: Date, default: Date.now()}
});

const User = model('User', UserSchema, 'users');

module.exports = User;
