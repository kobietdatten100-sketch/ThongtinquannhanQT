const { EmbedBuilder } = require("discord.js");
const {
    loadData,
    saveData,
    createUser
} = require("../Database");

module.exports = {
    name: "coin",

    async execute(client, message) {

        let data = loadData();

        if (!data[message.author.id]) {
            createUser(message.author.id);
            data = loadData();
        }

        const user = data[message.author.id];

        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("💰 TÀI KHOẢN PSCOIN")
            .setThumbnail(message.author.displayAvatarURL())
            .addFields(
                {
                    name: "👤 Người chơi",
                    value: `${message.author}`,
                    inline: true
                },
                {
                    name: "💵 Số dư",
                    value: `${user.coins.toLocaleString()} PSCOIN`,
                    inline: true
                },
                {
                    name: "🏆 Thắng",
                    value: `${user.win || 0}`,
                    inline: true
                },
                {
                    name: "💥 Thua",
                    value: `${user.lose || 0}`,
                    inline: true
                }
            )
            .setFooter({
                text: "PSCOIN Casino"
            })
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });

    }
};
