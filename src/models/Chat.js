const {Schema, SchemaTypes, model} = require('mongoose');

const ChatSchema = new Schema({
    createdBy: SchemaTypes.ObjectId,
    members: SchemaTypes.Array,
    name: {type: String, default: 'New Chat'},
    date: {type: Date, default: Date.now()}
});

ChatSchema.statics.getChatCreatorIDByChatID = async function(id) {
    const chat = await this.findById(id);
    return chat.createdBy.toString();
};

const Chat = model('Chat', ChatSchema, 'chats');

module.exports = Chat;
