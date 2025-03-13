// Define sensitive fields to mask
// const SENSITIVE_FIELDS = ["password", "token", "authorization", "apiKey", "secret", "refreshToken"];
exports.maskSensitiveData = (data, SENSITIVE_FIELDS) => {
    if (!data || typeof data !== "object") return data;

    return Object.keys(data).reduce((masked, key) => {
        masked[key] = SENSITIVE_FIELDS.includes(key.toLowerCase()) ? "******" : data[key];
        return masked;
    }, {});
};