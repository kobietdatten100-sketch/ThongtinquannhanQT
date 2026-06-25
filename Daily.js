const { EmbedBuilder } = require("discord.js");
const {
loadData,
saveData,
createUser
} = require("../utils/database");

module.exports = {
name: "daily",

async execute(client, message) {

const data = loadData();

createUser(message.author.id);

const user = data[message.author.id];

const cooldown = 3 * 60 * 60 * 1000;

if (Date.now() - user.daily < cooldown) {

const remain = cooldown - (Date.now() - user.daily);

const hours = Math.floor(remain / 3600000);
const mins = Math.floor((remain % 3600000) / 60000);

return message.reply(
`⏰ Bạn cần chờ ${hours} giờ ${mins} phút nữa.`
);
}

const reward = 500000;

user.coins += reward;
user.daily = Date.now();

saveData(data);

const embed = new EmbedBuilder()
.setColor("Green")
.setTitle("🎁 NHẬN THƯỞNG HẰNG NGÀY")
.setDescription(
`Bạn nhận được **${reward.toLocaleString()} PSCOIN**\n\n💰 Số dư hiện tại: **${user.coins.toLocaleString()} PSCOIN**`
);

message.reply({ embeds: [embed] });

}
};
