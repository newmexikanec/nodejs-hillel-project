const {User} = require('../models');
const bcrypt = require("bcryptjs");
const config = require('config');
const nodemailer = require('nodemailer');

const sendEmail = async (email, html) => {
    const transporter = nodemailer.createTransport({
        service: config.get('email.service'),
        auth: {
            user: config.get('email.user'),
            pass: config.get('email.pass')
        }
    });
    await transporter.sendMail({
        from: config.get('email.user'),
        to: email,
        subject: 'User verification',
        html: html
    });
}

const login = (email, pass) => {
    return User.checkUserPass(email, pass)
        .then(user => {
            return {
                id: user._id,
                username: user.username,
                email
            }
        });
};

const signup = async data => {
    try {
        const {password, ...userData} = data;
        const user = new User({
            password: await bcrypt.hashSync(password, 10),
            ...userData
        });
        await user.save();
        const mailHtml = `Please follow <a href="${config.get('http.externalHost')}/verify/send/${user.verifyingKey}">this link</a> to verificate your account`;
        await sendEmail(user.email, mailHtml);
        return user._id
    } catch (e) {
        if (e.code === 11000) {
            throw new Error('Email and name must be unique');
        } else {
            throw e;
        }
    }
};

const verify = async verifyingKey => {
    const user = await User.findOne({verifyingKey});
    if (user) {
        if (!user.verified) {
            user.verified = true;
            await user.save();
            await sendEmail(user.email, 'Your email was verified. Thank you for the registration.');
        }
        return user;
    }
    throw new Error('Invalid verifying key');
}

const getChatList = async (username) => {
    let users;
    if (username) {
        users = await User.find({
            verified: true,
            username: {$ne: username},
        });
    } else {
        users = await User.find({ verified: true });
    }
    return users;
}

module.exports = {
    login,
    signup,
    verify,
    getChatList
};
