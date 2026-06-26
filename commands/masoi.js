const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const rooms = new Map();

module.exports = {
    name: "masoi",
    rooms,

    async execute(client, message) {

        if (rooms.has(message.guild.id)) {
            return message.reply("❌ Đã có một phòng Ma Sói.");
        }

        rooms.set(message.guild.id, {
            owner: message.author.id,
            players: [message.author.id],
            channel: message.channel,
            round: 1,
            deadPlayers: [],
            roles: {}
        });

        const embed = new EmbedBuilder()
            .setColor("DarkPurple")
            .setTitle("🐺 PHÒNG MA SÓI")
            .setDescription(
                `👑 Chủ phòng: <@${message.author.id}>\n\n` +
                `👥 Người chơi (1/16)\n<@${message.author.id}>\n\n` +
                `⚠️ Cần ít nhất 5 người để bắt đầu.`
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("ww_join")
                .setLabel("➕ Tham gia")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("ww_leave")
                .setLabel("➖ Rời phòng")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("ww_start")
                .setLabel("🚀 Bắt đầu")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("ww_cancel")
                .setLabel("❌ Hủy")
                .setStyle(ButtonStyle.Danger)
        );

        const msg = await message.channel.send({
            embeds: [embed],
            components: [row]
        });

        rooms.get(message.guild.id).message = msg;
    }
};
