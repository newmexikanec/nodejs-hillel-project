const {Schema, SchemaTypes, model} = require('mongoose');

const MessageSchema = new Schema({
    chatID: SchemaTypes.ObjectId,
    senderID: SchemaTypes.ObjectId,
    text: String,
    date: {type: Date, default: Date.now()},
    isRead: {type: Boolean, default: false},
    editedDate: {type: Date, default: null},
});

const Message = model('Message', MessageSchema, 'messages');

module.exports = Message;
