/*
data:
{
    "id": "001",
    "name": "james",
    "phone": "0843758345345"
}
SENSITIVE_FIELDS = ["password", "phone"];    
*/
exports.maskSensitiveData = (data, SENSITIVE_FIELDS) => {
    if (!data) return data; // Return if null or undefined

    // Handle array case
    if (Array.isArray(data)) {
        // Check if array contains only primitive values (string, number, boolean)
        if (data.every(item => typeof item !== "object")) {
            return data; // Return as is (prevents role array corruption)
        }
        return data.map(item => exports.maskSensitiveData(item, SENSITIVE_FIELDS));
    }

    // Handle Sequelize ORM (dataValues object)
    const obj = data.dataValues ? data.dataValues : data;

    return Object.keys(obj).reduce((masked, key) => {
        if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
            masked[key] = "******"; // Mask sensitive fields
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
            masked[key] = exports.maskSensitiveData(obj[key], SENSITIVE_FIELDS); // Recursively mask nested objects
        } else {
            masked[key] = obj[key];
        }
        return masked;
    }, {});
};
