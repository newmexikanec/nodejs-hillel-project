const {Message} = require('../models');

const create = async (data) => {
    const message = new Message(data);
    await message.save();
};

const getAllByChatID = chatID => {
    return Message.find({chatID});
};

const readAllMessage = (chatID, senderID) => {
    return Message.updateMany({
        isRead: false,
        chatID,
        senderID
    }, {isRead: true});
}

module.exports = {
    create,
    getAllByChatID,
    readAllMessage
};
