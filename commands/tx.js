const {
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
} = require("discord.js");

module.exports = {
name: "tx",

async execute(client, message) {

const embed = new EmbedBuilder()
.setColor("#f1c40f")
.setTitle("🎲 MINI GAME TÀI XỈU")
.setDescription(
"**Chọn cửa cược của bạn**\n\n" +
"🔴 **TÀI** (11 - 18)\n" +
"🔵 **XỈU** (3 - 10)\n\n" +
"💰 Sử dụng PSCOIN để đặt cược."
)
.setFooter({
text: `Người chơi: ${message.author.username}`
});

const row = new ActionRowBuilder()
.addComponents(
new ButtonBuilder()
.setCustomId(`tai_${message.author.id}`)
.setLabel("🔴 TÀI")
.setStyle(ButtonStyle.Danger),

new ButtonBuilder()
.setCustomId(`xiu_${message.author.id}`)
.setLabel("🔵 XỈU")
.setStyle(ButtonStyle.Primary)
);

await message.reply({
embeds: [embed],
components: [row]
});

}
};
