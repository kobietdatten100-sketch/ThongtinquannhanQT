const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "help",

    async execute(client, message) {

        const embed = new EmbedBuilder()
            .setColor("#3498db")
            .setTitle("📖 DANH SÁCH LỆNH PSCOIN")
            .setDescription(
                "**💰 Kinh tế**\n" +
                "`.coin` - Xem số dư PSCOIN\n" +
                "`.daily` - Nhận thưởng hằng ngày\n" +
                "`.top` - BXH PSCOIN\n\n" +

                "**🎲 Casino**\n" +
                "`.tx` - Mini Game Tài Xỉu\n\n" +

                "**👑 Admin**\n" +
                "`.addcoin @user số_tiền`\n" +
                "`.removecoin @user số_tiền`\n\n" +

                "**📋 Khác**\n" +
                "`.help` - Xem danh sách lệnh"
            )
            .setFooter({
                text: `Yêu cầu bởi ${message.author.username}`
            });

        message.reply({
            embeds: [embed]
        });

    }
};
