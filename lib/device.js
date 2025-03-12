const { v4: uuidv4 } = require("uuid");

exports.getDeviceId = async = () => {
    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
        deviceId = uuidv4(); // Generate unique ID
        localStorage.setItem("device_id", deviceId);
    }
    return deviceId;
};
