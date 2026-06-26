const { EmbedBuilder } = require("discord.js");
const { loadData } = require("../Database");

module.exports = {
    name: "top",

    async execute(client, message) {

        const data = loadData();

        const users = Object.entries(data)
            .sort((a, b) => b[1].coins - a[1].coins)
            .slice(0, 10);

        if (users.length === 0) {
            return message.reply("❌ Chưa có người chơi nào.");
        }

        let description = "";

        for (let i = 0; i < users.length; i++) {

            const [id, user] = users[i];

            let member;

            try {
                member = await client.users.fetch(id);
            } catch {
                member = { username: "Không xác định" };
            }

            let medal = "🏅";

            if (i === 0) medal = "🥇";
            else if (i === 1) medal = "🥈";
            else if (i === 2) medal = "🥉";

            description +=
`${medal} **#${i + 1}** • ${member.username}
💰 ${user.coins.toLocaleString()} PSCOIN

`;
        }

        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("🏆 BXH PSCOIN")
            .setDescription(description)
            .setFooter({
                text: `Yêu cầu bởi ${message.author.username}`
            })
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });

    }
};
