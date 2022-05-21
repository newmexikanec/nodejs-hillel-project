function accessValidation (req, res, next) {
    if (!req.session.user) {
        return res.status(404).send('You don\'t have permission to access');
    }
    next();
}

module.exports = {
    accessValidation
}
