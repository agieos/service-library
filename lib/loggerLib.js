const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file"); // Import winston-daily-rotate-file

// Define custom logging format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

// Create a logger instance
const winstonLogger = winston.createLogger({
    level: 'info', // Default logging level
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to logs
        winston.format.colorize(),  // Colorize logs in the console
        logFormat                   // Custom log format
    ),
    transports: [
        // Console transport for logging to the console
        new winston.transports.Console(),
        /*
        // File transport for logging to a file (e.g., 'logs/app.log')
        new winston.transports.File({ filename: "logs/app.log" }),
        */
        // Daily rotate file transport for logging to a file
        new winstonDaily({
            filename: 'logs/%DATE%-app.log',  // Log file pattern with date
            datePattern: 'YYYY-MM-DD',         // Date format for log file naming
            maxFiles: '7d',                    // Keep logs for the last 7 days
            zippedArchive: true,               // Compress archived logs
            format: winston.format.combine(winston.format.uncolorize()),
        }),
    ],
});

const requestLogger = (req, res, next) => {
    const { method, url, headers, body } = req;
    const start = Date.now();
    // Log the incoming request details
    winstonLogger.info(`Request: ${method} ${url}`);
    winstonLogger.debug(`Headers: ${JSON.stringify(headers)}`);
    if(body != null) {
        winstonLogger.debug(`Body: ${JSON.stringify(body)}`);
    }    
    // Capture response details
    res.on('finish', () => {
        const { statusCode } = res;
        const duration = Date.now() - start;
        winstonLogger.info(`Response: ${method} ${url} ${statusCode} - ${duration}ms`);
    });

    next();
};

// Export the logger for use in other files
module.exports = { winstonLogger, requestLogger };