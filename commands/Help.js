const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "help",

    async execute(client, message) {

        const embed = new EmbedBuilder()
            .setColor("#00BFFF")
            .setTitle("📖 DANH SÁCH LỆNH PSCOIN CASINO")
            .setDescription("Các lệnh hiện có của bot:")
            .addFields(
                {
                    name: "🎲 Mini Game",
                    value:
                        "`.tx` - Mở giao diện Tài/Xỉu",
                    inline: false
                },
                {
                    name: "💰 Tài khoản",
                    value:
                        "`.coin` - Xem số dư PSCOIN\n" +
                        "`.daily` - Nhận thưởng hằng ngày\n" +
                        "`.top` - BXH người giàu",
                    inline: false
                },
                {
                    name: "🛠 Admin",
                    value:
                        "`.addcoin @user <số>`\n" +
                        "`.removecoin @user <số>`",
                    inline: false
                }
            )
            .setFooter({
                text: `Yêu cầu bởi ${message.author.username}`
            })
            .setTimestamp();

        await message.reply({
            embeds: [embed]
        });

    }
};
