const logger = require("../lib/loggerLib").winstonLogger;

exports.success = (res, message, data = {}) => {
    logger.info(message + (Object.keys(data).length > 0 ? (' ' + JSON.stringify(data)) : ''));
    res.status(200).json({ success: true, message, data });
};

exports.error = (res, message, statusCode = 500) => {
    logger.error(message);
    res.status(statusCode).json({ success: false, message });
};