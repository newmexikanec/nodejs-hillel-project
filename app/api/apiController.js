class ApiController {
    async login(req, res) {
        res.json({'loggedin': true});
    }

    async signup(req, res) {
        res.json({'signedup': true});
    }

    async getUsers(req, res) {
        res.json({'rout': 'getUsers'});
    }

    async getUsersByID(req, res) {
        res.json({'rout': 'getUsersByID', id: req.params.id});
    }

    async createUser(req, res) {
        res.json({'rout': 'createUser'});
    }

    async updateUser(req, res) {
        res.json({'rout': 'updateUser', id: req.params.id});
    }

    async deleteUser(req, res) {
        res.json({'rout': 'deleteUser', id: req.params.id});
    }

    async getChats(req, res) {
        res.json({'rout': 'getChats'});
    }

    async getChatByID(req, res) {
        res.json({'rout': 'getChatByID', id: req.params.id});
    }

    async createChatMessage(req, res) {
        res.json({'rout': 'createChatMessage'});
    }

    async updateChatMessage(req, res) {
        res.json({'rout': 'updateChatMessage', id: req.params.id});
    }

    async deleteChat(req, res) {
        res.json({'rout': 'deleteChat', id: req.params.id});
    }
}

module.exports = new ApiController();
