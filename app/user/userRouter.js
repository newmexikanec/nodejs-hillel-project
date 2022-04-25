const Router = require('express');
const router = new Router();
const {accessValidation} = require('./validation');

router.get('/chat/:id', accessValidation, (req, res) => {
    res.send(`user ${req.params.id}`);
});

module.exports = router;
