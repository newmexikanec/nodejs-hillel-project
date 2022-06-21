const {User, Chat, Message} = require('../models');
const bcrypt = require("bcryptjs");
const config = require('config');
const nodemailer = require('nodemailer');

const sendEmail = async (email, html) => {
    const emailConf = config.get('email');
    const transporter = nodemailer.createTransport(emailConf);
    await transporter.sendMail({
        from: emailConf.auth.user, to: email, subject: 'User verification', html: html
    });
}

const login = (email, pass) => {
    return User
        .checkUserPass(email, pass)
        .then(user => {
            return {
                id: user._id, username: user.username, email
            }
        });
};

const signup = async data => {
    try {
        const {password, ...userData} = data;
        const user = new User({
            password: await bcrypt.hashSync(password, 10), ...userData
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

const getChatList = async (userID) => {
    let users;
    if (userID) {
        users = await User.find({
            verified: true, _id: {$ne: userID},
        }, ['id', 'username']);
        users = users.map(async user => {
            let hasMessages = false;
            const chat = await Chat.findOne({isPrivate: true, members: {'$all': [user.id, userID]}});
            if (chat) {
                hasMessages = await Message.countDocuments({
                    isRead: false,
                    chatID: chat.id,
                    senderID: user.id
                });
            }
            return {
                id: user._id,
                username: user.username,
                hasMessages
            };
        });
        users = await Promise.all(users);
    } else {
        users = await User.find({verified: true});
    }
    return users;
}

const getUserData = async (userID) => {
    return User.findById(userID);
};

module.exports = {
    login, signup, verify, getChatList, getUserData
};
