const fs = require("fs");

const path = "./data/users.json";

function loadData() {
return JSON.parse(fs.readFileSync(path));
}

function saveData(data) {
fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function createUser(id) {
const data = loadData();

if (!data[id]) {
data[id] = {
coins: 0,
daily: 0
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
