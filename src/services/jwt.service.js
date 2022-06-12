const jwt = require('jsonwebtoken');
const config = require('config');

const generateTocken = data => {
    return jwt.sign(data, config.get('jwt.secret'));
};

const verifyToken = token => {
    return jwt.verify(token, config.get('jwt.secret'));
};

module.exports = {
    generateTocken,
    verifyToken
};
