const {chatService, userService} = require("../services");

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
        this.router.get(`/${this.name}/:id`, this.chat);
    }

    async chatList(req, res) {
        try {
            let username = res.locals.loggedin ? req.session.user.username : null;
            res.render('users', {
                title: 'Users', users: await userService.getChatList(username), headerUserName: username
            });
        } catch (e) {
            res.status(400).send(e.message);
        }
    }

    async chat(req, res) {
        try {
            if (!res.locals.loggedin) {
                return res.status(404).send("You don't have permission for access");
            }
            const chat = await chatService.getPrivateChat(req.session.user.id, req.params.id);
            res.send(`Chat window for "${chat._id}"`);
        } catch (e) {
            res.status(400).send(e.message);
        }
    }
}

module.exports = new ChatController();
