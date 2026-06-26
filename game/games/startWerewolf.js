const {
    EmbedBuilder
} = require("discord.js");

const { assignRoles } = require("./werewolfRoles");

function startGame(client, room) {

    const players = room.players;

    const roles = assignRoles(players);

    // Gửi role cho từng người
    for (const userId of players) {

        const role = roles[userId];

        client.users.fetch(userId).then(user => {

            user.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2f3136")
                        .setTitle("🐺 MA SÓI - VAI TRÒ CỦA BẠN")
                        .setDescription(`🎭 Vai trò của bạn: **${role}**\n\n❗ Không tiết lộ vai trò của bạn!`)
                ]
            }).catch(() => {});

        });

    }

    // Thông báo trong server
    return {
        embed: new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🐺 MA SÓI BẮT ĐẦU")
            .setDescription(
                `🎮 Số người chơi: **${players.length}**\n` +
                `🌙 Game đã bắt đầu!\n\n` +
                `💀 Ban đêm hãy thực hiện hành động của bạn.`
            )
    };
}

module.exports = {
    startGame
};
