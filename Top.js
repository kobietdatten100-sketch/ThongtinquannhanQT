const { EmbedBuilder } = require("discord.js");
const { loadData } = require("../utils/database");

module.exports = {
name: "top",

async execute(client, message) {

const data = loadData();

const users = Object.entries(data)
.sort((a, b) => b[1].coins - a[1].coins)
.slice(0, 10);

let desc = "";

for (let i = 0; i < users.length; i++) {

const userId = users[i][0];
const coins = users[i][1].coins;

desc += `#${i + 1} <@${userId}> — ${coins.toLocaleString()} PSCOIN\n`;
}

const embed = new EmbedBuilder()
.setColor("Yellow")
.setTitle("🏆 TOP ĐẠI GIA PSCOIN")
.setDescription(desc || "Chưa có dữ liệu.");

message.reply({
embeds: [embed]
});

}
};
