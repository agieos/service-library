const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");

// Define fields to mask (e.g., password, phone)
const SENSITIVE_FIELDS = ["password", "phone", "token", "ssn"];

// Function to mask sensitive data in JSON
const maskSensitiveData = (data, fieldsToMask = SENSITIVE_FIELDS) => {
    if (!data || typeof data !== "object") return data;

    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            fieldsToMask.includes(key) ? "***MASKED***" : value
        )
    );
};

// Define custom logging format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

// Create a logger instance
const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winstonDaily({
            filename: 'logs/%DATE%-app.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '7d',
            zippedArchive: true,
            format: winston.format.combine(winston.format.uncolorize()),
        }),
    ],
});

const requestLogger = (req, res, next) => {
    const { method, url, headers, body } = req;
    const start = Date.now();

    // Mask sensitive fields
    const maskedBody = maskSensitiveData(body);
    const maskedHeaders = maskSensitiveData(headers);

    // Log the incoming request details
    winstonLogger.info(`Request: ${method} ${url}`);
    winstonLogger.info(`Headers: ${JSON.stringify(maskedHeaders)}`);
    if (maskedBody && Object.keys(maskedBody).length) {
        winstonLogger.info(`Body: ${JSON.stringify(maskedBody)}`);
    }

    // Intercept response body
    const originalWrite = res.write;
    const originalEnd = res.end;
    const chunks = [];

    res.write = function (chunk, encoding, callback) {
        chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
        return originalWrite.call(this, chunk, encoding, callback);
    };

    res.end = function (chunk, encoding, callback) {
        if (chunk) {
            chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
        }

        try {
            const responseBody = Buffer.concat(chunks).toString('utf8');
            const duration = Date.now() - start;

            winstonLogger.info(`Response: ${method} ${url} ${res.statusCode} - ${duration}ms`);

            // Try to parse JSON, otherwise log as-is
            try {
                const parsedBody = JSON.parse(responseBody);
                winstonLogger.info(`Response Body: ${JSON.stringify(maskSensitiveData(parsedBody))}`);
            } catch {
                // If not JSON, log the raw response (truncated if too long)
                winstonLogger.info(`Response Body: ${responseBody.length > 500 ? responseBody.substring(0, 500) + '...' : responseBody}`);
            }
        } catch (err) {
            winstonLogger.error(`Error logging response: ${err.message}`);
        }

        return originalEnd.call(this, chunk, encoding, callback);
    };

    next();
};

module.exports = { winstonLogger, requestLogger };