const { getRoles } = require("./werewolfRoles");

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function startWerewolf(room, client) {

    const roles = shuffle(getRoles(room.players.length));
console.log("Players:", room.players.length);
console.log("Roles:", roles);
    room.roles = {};

    for (let i = 0; i < room.players.length; i++) {

        const userId = room.players[i];
        const role = roles[i];

        room.roles[userId] = role;

        try {

            const user = await client.users.fetch(userId);

            await user.send(
`🌙 GAME MA SÓI

Vai của bạn là:

${role}

⚠️ Không được tiết lộ vai trò cho người khác.`
            );

        } catch {

            console.log(`Không thể gửi DM tới ${userId}`);

        }

    }

    await room.channel.send({
        content:
"🌙 Đêm đầu tiên bắt đầu!\n\n🔇 Tất cả người chơi hãy im lặng.\n🐺 Sói hãy chuẩn bị hành động."
    });

}

module.exports = { startWerewolf };
