const {jwtService} = require('../services');

const jwtHook = (req, res, next) => {
    const header = req.get('Authorization');
    if (!header) {
        return res.status(401).json({errorMessage: 'Unauthorized '});
    }
    req.user = jwtService.verifyToken(header.split(' ')[1]);
    next();
};

module.exports = jwtHook;
