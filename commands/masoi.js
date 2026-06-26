const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const rooms = new Map();

module.exports = {
    name: "masoi",

    async execute(client, message) {

        if (rooms.has(message.guild.id)) {
            return message.reply("❌ Máy chủ đã có một phòng Ma Sói.");
        }

        rooms.set(message.guild.id, {
            owner: message.author.id,
            players: [message.author.id]
        });

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🐺 MA SÓI - PHÒNG CHỜ")
            .setDescription(
                "**Chủ phòng:** <@" + message.author.id + ">\n\n" +
                "🌙 Hãy tập hợp người chơi để bắt đầu.\n\n" +
                "**Người chơi (1/16)**\n" +
                "<@" + message.author.id + ">\n\n" +
                "⚠️ Cần tối thiểu **5 người** để bắt đầu."
            );

        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ww_join")
                    .setLabel("✅ Tham Gia")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("ww_leave")
                    .setLabel("❌ Rời Khỏi")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("ww_cancel")
                    .setLabel("🗑️ Hủy")
                    .setStyle(ButtonStyle.Danger)
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ww_start")
                    .setLabel("🚀 Bắt Đầu")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("ww_help")
                    .setLabel("📖 Hướng Dẫn")
                    .setStyle(ButtonStyle.Secondary)
            );

        await message.reply({
            embeds: [embed],
            components: [row1, row2]
        });

    }
};

module.exports.rooms = rooms;
