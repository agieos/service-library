const jwt = require("jsonwebtoken");

exports.generateToken = (payload = {}, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn: expiresIn });
};

exports.verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};

exports.decodedToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (err) {
        throw new Error("Invalid token");
    }
};