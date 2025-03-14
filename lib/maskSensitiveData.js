exports.maskSensitiveData = (data, SENSITIVE_FIELDS) => {
    if (!data || typeof data !== "object") return data;

    if (Array.isArray(data)) {
        return data.map((item) => exports.maskSensitiveData(item, SENSITIVE_FIELDS));
    }

    return Object.keys(data).reduce((masked, key) => {
        if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
            masked[key] = "******"; // Mask sensitive fields
        } else if (typeof data[key] === "object" && data[key] !== null) {
            masked[key] = exports.maskSensitiveData(data[key], SENSITIVE_FIELDS); // Recursive masking
        } else {
            masked[key] = data[key];
        }
        return masked;
    }, {});
};
