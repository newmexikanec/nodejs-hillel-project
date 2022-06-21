const {chatService, userService, messageService} = require("../services");
const {chatIDParamValidation} = require("../validations");

class ChatController {
    name = 'chat';

    constructor() {
        const Router = require("express");
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', this.chatList);
        this.router.get(`/${this.name}`, this.chatList);
        this.router.get(`/${this.name}/:id`, chatIDParamValidation, this.chat);
    }

    async chatList(req, res) {
        try {
            if (res.locals.loggedin){
                return res.render('users', {
                    title: 'Users',
                    users: await userService.getChatList(req.session.user.id),
                    headerUserName: req.session.user.username,
                    userID: res.locals.loggedin ? req.session.user.id : null
                });
            }
            res.render('users', {
                title: 'Users',
                users: await userService.getChatList()
            });
        } catch (e) {
            res.status(400).send(e.message);
        }
    }

    async chat(req, res) {
        try {
            if (!res.locals.loggedin) {
                return res.render('chat', {title: 'Error'});
            }
            const chat = await chatService.getPrivateChat(req.session.user.id, req.params.id);
            const companionRec = await userService.getUserData(req.params.id);
            const companion = companionRec.username || chat.name;

            if (chat._id) {
                const messages = await messageService.getAllByChatID(chat._id);
                await messageService.readAllMessage(chat._id, companionRec._id);

                res.render('chat', {
                    title: companion,
                    headerUserName: req.session.user.username,
                    companion,
                    chatID: chat._id,
                    userID: req.session.user.id,
                    messages
                });
            }
        } catch (e) {
            res.status(400).send(e.message);
        }
    }
}

module.exports = new ChatController();
