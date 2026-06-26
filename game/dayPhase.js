const { EmbedBuilder } = require("discord.js");

async function dayPhase(client, room) {

    // Nếu không có ai bị giết
    if (!room.pendingKill) {

        return room.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("🌞 BAN NGÀY")
                    .setDescription("🌅 Không có ai chết trong đêm qua.")
            ]
        });

    }

    const victim = room.pendingKill;

    // Xóa người chết khỏi danh sách sống
    room.players = room.players.filter(id => id !== victim);

    delete room.pendingKill;

    await room.channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Red")
                .setTitle("☠️ BAN NGÀY")
                .setDescription(
                    `💀 <@${victim}> đã bị Sói giết trong đêm.\n\n` +
                    `👥 Người còn sống: **${room.players.length}**`
                )
        ]
    });

    // Kiểm tra thắng
    const wolves = Object.entries(room.roles)
        .filter(([id, role]) =>
            role.includes("Sói") &&
            room.players.includes(id)
        );

    const villagers = room.players.filter(id => {

        const role = room.roles[id];

        return !role.includes("Sói");

    });

    // Dân thắng
    if (wolves.length === 0) {

        await room.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("🎉 DÂN LÀNG CHIẾN THẮNG")
            ]
        });

        return true;
    }

    // Sói thắng
    if (wolves.length >= villagers.length) {

        await room.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("DarkRed")
                    .setTitle("🐺 SÓI CHIẾN THẮNG")
            ]
        });

        return true;
    }

    // Chưa kết thúc
    await room.channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("🗳️ THẢO LUẬN")
                .setDescription(
                    "⏳ Người chơi có **60 giây** để thảo luận.\n\n" +
                    "Sau đó sẽ tiến hành bỏ phiếu."
                )
        ]
    });

    return false;

}

module.exports = {
    dayPhase
};
