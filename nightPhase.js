const {
    EmbedBuilder
} = require("discord.js");

/**
 * room:
 * {
 *   owner,
 *   players,
 *   roles,
 *   status
 * }
 */

async function nightPhase(client, room) {

    const wolves = [];
    let seer = null;
    let guard = null;

    // Tìm vai trò
    for (const [userId, role] of Object.entries(room.roles)) {

        if (role.includes("Sói")) wolves.push(userId);
        if (role.includes("Tiên Tri")) seer = userId;
        if (role.includes("Bảo Vệ")) guard = userId;

    }

    // ===== THÔNG BÁO BAN ĐÊM =====
    const embed = new EmbedBuilder()
        .setColor("#2c3e50")
        .setTitle("🌙 ĐÊM XUỐNG")
        .setDescription(
            "🐺 Sói đang chọn nạn nhân...\n" +
            "🔮 Tiên tri đang kiểm tra...\n" +
            "🛡️ Bảo vệ đang canh gác..."
        );

    await room.channel.send({ embeds: [embed] });

    // ===== LOGIC ĐƠN GIẢN =====
    // (phiên bản 1: random nạn nhân sói)

    const alivePlayers = room.players;

    const victim =
        alivePlayers[Math.floor(Math.random() * alivePlayers.length)];

    room.pendingKill = victim;

    // DM cho sói
    for (const wolf of wolves) {

        client.users.fetch(wolf).then(u => {
            u.send(`🐺 Đêm nay mục tiêu: <@${victim}>`).catch(() => {});
        });

    }

    // DM cho tiên tri
    if (seer) {
        const check =
            alivePlayers[Math.floor(Math.random() * alivePlayers.length)];

        client.users.fetch(seer).then(u => {
            u.send(`🔮 Bạn đã soi: <@${check}>`).catch(() => {});
        });
    }

    // DM cho bảo vệ
    if (guard) {
        client.users.fetch(guard).then(u => {
            u.send("🛡️ Chọn người bảo vệ (tính năng sẽ nâng cấp ở File 6)").catch(() => {});
        });
    }

    return victim;
}

module.exports = {
    nightPhase
};
