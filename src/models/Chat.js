const {Schema, SchemaTypes, model} = require('mongoose');

const ChatSchema = new Schema({
    createdBy: {type: SchemaTypes.ObjectId, ref: 'User'},
    members: [{type: SchemaTypes.ObjectId, ref: 'User'}],
    name: {type: String, default: 'New Chat'},
    date: {type: Date, default: Date.now},
    isPrivate: {type: Boolean, default: false}
});

ChatSchema.statics.getChatCreatorIDByChatID = async function(id) {
    const chat = await this.findById(id);
    return chat.createdBy.toString();
};

const Chat = model('Chat', ChatSchema, 'chats');

module.exports = Chat;
