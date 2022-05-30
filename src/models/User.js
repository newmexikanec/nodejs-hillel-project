const {Schema, model, Types} = require('mongoose');
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    username: {type: String, unique: true, require: true},
    email: {type: String, unique: true, index: true, required: true},
    password: {type: String, required: true, select: false},
    birthdayDate: Date,
    regDate: {type: Date, default: Date.now},
    verified: {type: Boolean, default: false},
    verifyingKey: {
        type: String,
        default: () => new Types.ObjectId()
    }
});

UserSchema.statics.checkUserPass = async function(email, password) {
    const user = await this.findOne({
        email,
        verified: true
    }, '+password');
    if (user) {
        const valid = await bcrypt.compareSync(password, user.password);
        if (valid) {
            return user;
        }
    }
    throw new Error('Email or password is not correct');
};

const User = model('User', UserSchema, 'users');

module.exports = User;
