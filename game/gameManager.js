const { nightPhase } = require("./nightPhase");
const { dayPhase } = require("./dayPhase");
const { votePhase } = require("./votePhase");

const { loadData, saveData } = require("../Database");

async function gameLoop(client, room) {

    room.status = "playing";

    while (true) {

        // ===== BAN ĐÊM =====
        await nightPhase(client, room);

        // Chờ 20 giây
        await wait(20000);

        // ===== BAN NGÀY =====
        const end1 = await dayPhase(client, room);

        if (end1) {
            reward(room);
            break;
        }

        // Thảo luận
        await wait(60000);

        // ===== BỎ PHIẾU =====
        await votePhase(client, room);

        // Chờ vote kết thúc
        await wait(65000);

        // Kiểm tra thắng sau vote
        const end2 = checkWinner(room);

        if (end2) {
            reward(room);
            break;
        }

    }

}

function checkWinner(room) {

    const wolves = room.players.filter(id =>
        room.roles[id].includes("Sói")
    );

    const villagers = room.players.filter(id =>
        !room.roles[id].includes("Sói")
    );

    if (wolves.length === 0)
        return "villager";

    if (wolves.length >= villagers.length)
        return "wolf";

    return null;

}

function reward(room) {

    const winner = checkWinner(room);

    if (!winner) return;

    const data = loadData();

    room.players.forEach(id => {

        const role = room.roles[id];

        const wolf = role.includes("Sói");

        const win =
            (winner === "wolf" && wolf) ||
            (winner === "villager" && !wolf);

        if (!data[id]) return;

        if (win) {

            data[id].coins += 5000;

            data[id].win = (data[id].win || 0) + 1;

        } else {

            data[id].lose = (data[id].lose || 0) + 1;

        }

    });

    saveData(data);

}

function wait(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

module.exports = {
    gameLoop
};
