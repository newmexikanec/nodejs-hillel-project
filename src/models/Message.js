const {Schema, SchemaTypes, model} = require('mongoose');

const MessageSchema = new Schema({
    chatID: {type: SchemaTypes.ObjectId, ref: 'Chat'},
    senderID: {type: SchemaTypes.ObjectId, ref: 'User'},
    text: String,
    date: {type: Date, default: Date.now()},
    isRead: {type: Boolean, default: false},
    editedDate: {type: Date, default: null},
});

const Message = model('Message', MessageSchema, 'messages');

module.exports = Message;
