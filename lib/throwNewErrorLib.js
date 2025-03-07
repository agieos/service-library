const logger = require("../lib/loggerLib").winstonLogger;

exports.throwNewError = (message) => {
    logger.error(message);
    throw new Error(message);
};