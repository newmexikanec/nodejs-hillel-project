class MainRouter {
    controllers = [require('./controllers/ChatController'), require('./controllers/AuthController'), require('./controllers/ApiController')];

    constructor() {
        const Router = require("express");
        this.router = Router();
        this.init();
    }

    init() {
        this.controllers.forEach(controller => this.router.use('/', controller.router));
    }
}

const mainRouter = new MainRouter();

module.exports = mainRouter.router;
