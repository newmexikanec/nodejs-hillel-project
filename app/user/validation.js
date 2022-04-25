function accessValidation (req, res, next) {
    if (!req.cookies.loggedin) {
        return res.status(404).send('You don\'t have permission to access');
    }
    next();
}

module.exports = {
    accessValidation
}
