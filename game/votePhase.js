const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ComponentType
} = require("discord.js");

async function votePhase(client, room) {

    const alive = room.players;

    const options = alive.map(id => ({
        label: `Người chơi ${id}`,
        value: id,
        description: "Bỏ phiếu treo người này"
    }));

    const menu = new StringSelectMenuBuilder()
        .setCustomId("ww_vote")
        .setPlaceholder("🗳️ Chọn người muốn treo")
        .addOptions(options);

    const row = new ActionRowBuilder().addComponents(menu);

    const embed = new EmbedBuilder()
        .setColor("#f1c40f")
        .setTitle("🗳️ BỎ PHIẾU")
        .setDescription(
            "Mỗi người chỉ được bỏ phiếu **1 lần**.\n\n" +
            "⏰ Thời gian: **60 giây**."
        );

    const msg = await room.channel.send({
        embeds: [embed],
        components: [row]
    });

    const votes = {};
    const voted = new Set();

    const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 60000
    });

    collector.on("collect", async interaction => {

        if (!alive.includes(interaction.user.id)) {
            return interaction.reply({
                content: "❌ Bạn không còn sống.",
                ephemeral: true
            });
        }

        if (voted.has(interaction.user.id)) {
            return interaction.reply({
                content: "❌ Bạn đã bỏ phiếu.",
                ephemeral: true
            });
        }

        voted.add(interaction.user.id);

        const target = interaction.values[0];

        votes[target] = (votes[target] || 0) + 1;

        await interaction.reply({
            content: `✅ Bạn đã bỏ phiếu cho <@${target}>.`,
            ephemeral: true
        });

    });

    collector.on("end", async () => {

        let target = null;
        let maxVote = 0;

        for (const id in votes) {

            if (votes[id] > maxVote) {
                maxVote = votes[id];
                target = id;
            }

        }

        if (!target) {

            return room.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setTitle("⚖️ KHÔNG AI BỊ TREO")
                        .setDescription("Không có đủ phiếu.")
                ]
            });

        }

        room.players = room.players.filter(id => id !== target);

        await room.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("☠️ TREO CỔ")
                    .setDescription(
                        `<@${target}> đã bị treo với **${maxVote} phiếu**.`
                    )
            ]
        });

    });

}

module.exports = {
    votePhase
};
