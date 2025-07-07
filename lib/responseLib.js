const logger = require("../lib/loggerLib").winstonLogger;

exports.success = (res, message, data = {}) => {
    logger.info(typeof message === "object" ? JSON.stringify(message) : message + (Object.keys(data).length > 0 ? (' ' + JSON.stringify(data)) : ''));
    res.status(200).json({ success: true, message: message, payload: data });
};

exports.error = (res, message, statusCode = 500) => {
    logger.error(typeof message === "object" ? JSON.stringify(message) : message);
    res.status(statusCode).json({ success: false, message: message });
};