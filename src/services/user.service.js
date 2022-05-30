const {User} = require('../models');
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const config = require('config');

const sendEmail = async (email, html) => {
    const testEmailAcc = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testEmailAcc.user,
            pass: testEmailAcc.pass
        }
    });
    const info = await transporter.sendMail({
        from: 'service@email.com',
        to: email,
        subject: 'User verification',
        html: html
    });
    console.log(nodemailer.getTestMessageUrl(info));// click to show email content
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
        const mailHtml = `Please follow <a href="http://${config.get('http.host')}:3000/verify/send/${user.verifyingKey}">this link</a> to verificate your account`;
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
