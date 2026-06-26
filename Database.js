const fs = require("fs");
const path = require("path");

const dataFolder = "./data";
const dataFile = path.join(dataFolder, "users.json");

// Tự tạo thư mục data nếu chưa có
if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

// Tự tạo users.json nếu chưa có
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "{}", "utf8");
}

function loadData() {
    try {
        return JSON.parse(fs.readFileSync(dataFile, "utf8"));
    } catch {
        return {};
    }
}

function saveData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function createUser(id) {
    const data = loadData();

    if (!data[id]) {
        data[id] = {
            coins: 1000,     // Coin mặc định
            daily: 0,
            win: 0,
            lose: 0
        };

        saveData(data);
    }

    return data[id];
}

module.exports = {
    loadData,
    saveData,
    createUser
};
