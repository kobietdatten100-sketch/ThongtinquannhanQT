const { EmbedBuilder } = require("discord.js");

const cooldown = new Map();

async function wolfKill(client, wolf, target) {

    try {

        const user = await client.users.fetch(wolf);

        await user.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("🐺 Hành động")
                    .setDescription(`Bạn đã chọn giết <@${target}>`)
            ]
        });

    } catch {}

    return target;

}

async function seerCheck(client, seer, target, role) {

    try {

        const user = await client.users.fetch(seer);

        await user.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("🔮 Tiên Tri")
                    .setDescription(
                        `<@${target}> có vai trò:\n\n**${role}**`
                    )
            ]
        });

    } catch {}

}

async function guardProtect(client, guard, target) {

    try {

        const user = await client.users.fetch(guard);

        await user.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("🛡️ Bảo Vệ")
                    .setDescription(
                        `Bạn đã bảo vệ <@${target}>`
                    )
            ]
        });

    } catch {}

    return target;

}

async function witchHeal(client, witch) {

    if (cooldown.get(`${witch}_heal`))
        return false;

    cooldown.set(`${witch}_heal`, true);

    return true;

}

async function witchPoison(client, witch, target) {

    if (cooldown.get(`${witch}_poison`))
        return false;

    cooldown.set(`${witch}_poison`, true);

    return target;

}

async function hunterShoot(client, hunter, target) {

    return target;

}

async function cupidLink(player1, player2) {

    return {
        lover1: player1,
        lover2: player2
    };

}

module.exports = {

    wolfKill,
    seerCheck,
    guardProtect,
    witchHeal,
    witchPoison,
    hunterShoot,
    cupidLink

};
