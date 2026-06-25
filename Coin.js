const { EmbedBuilder } = require("discord.js");
const {
loadData,
createUser
} = require("../utils/database");

module.exports = {
name: "coins",

async execute(client, message) {

const data = loadData();

createUser(message.author.id);

const user = data[message.author.id];

const embed = new EmbedBuilder()
.setColor("Gold")
.setTitle("💰 SỐ DƯ PSCOIN")
.setDescription(
`Bạn hiện có:\n\n**${user.coins.toLocaleString()} PSCOIN**`
);

message.reply({
embeds: [embed]
});

}
};
