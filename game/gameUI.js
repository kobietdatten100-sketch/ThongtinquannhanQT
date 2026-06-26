const {
    EmbedBuilder
} = require("discord.js");

function createGameEmbed(room) {

    const alive = room.players
        .map(id => `🟢 <@${id}>`)
        .join("\n") || "Không có";

    const dead = (room.deadPlayers || [])
        .map(id => `⚫ <@${id}>`)
        .join("\n") || "Chưa có";

    const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle("🐺 MA SÓI")
        .setDescription(
            "🌙 **Trạng thái trận đấu**"
        )
        .addFields(
            {
                name: "👥 Người còn sống",
                value: alive,
                inline: true
            },
            {
                name: "☠️ Người đã chết",
                value: dead,
                inline: true
            },
            {
                name: "🎮 Thông tin",
                value:
                    `👑 Chủ phòng: <@${room.owner}>\n` +
                    `🔄 Vòng: ${room.round || 1}\n` +
                    `📊 Còn sống: ${room.players.length}`,
                inline: false
            }
        )
        .setFooter({
            text: "PSCOIN Werewolf"
        })
        .setTimestamp();

    return embed;
}

async function updateGameMessage(room) {

    if (!room.message) return;

    try {

        await room.message.edit({
            embeds: [
                createGameEmbed(room)
            ]
        });

    } catch (err) {
        console.error(err);
    }

}

module.exports = {
    createGameEmbed,
    updateGameMessage
};
