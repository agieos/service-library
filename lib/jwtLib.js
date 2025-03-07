const jwt = require("jsonwebtoken");

exports.generateToken = (payload = {}, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn: expiresIn });
};

exports.verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        throw new Error("Invalid token");
    }
};