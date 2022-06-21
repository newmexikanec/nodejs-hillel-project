const {Chat} = require('../models');

// get private chat for two users
const getPrivateChat = async (senderId, recipientId) => {
    let chat = await Chat
        .findOne({isPrivate: true, members: {'$all': [senderId, recipientId]}});
    if (!chat) {
        chat = new Chat({
            createdBy: senderId,
            members: [senderId, recipientId],
            isPrivate: true
        });
        await chat.save();
    }
    return chat;
};

module.exports = {
    getPrivateChat
}
