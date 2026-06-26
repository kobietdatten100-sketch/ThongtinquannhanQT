const { EmbedBuilder } = require("discord.js");
const {
    loadData,
    saveData,
    createUser
} = require("../Database");

const COOLDOWN = 24 * 60 * 60 * 1000; // 24 giờ

module.exports = {
    name: "daily",

    async execute(client, message) {

        let data = loadData();

        if (!data[message.author.id]) {
            createUser(message.author.id);
            data = loadData();
        }

        const user = data[message.author.id];
        const now = Date.now();

        // Kiểm tra cooldown
        if (user.daily && now - user.daily < COOLDOWN) {

            const remaining = COOLDOWN - (now - user.daily);

            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("⏳ DAILY CHƯA SẴN SÀNG")
                .setDescription(
                    `Bạn cần chờ **${hours} giờ ${minutes} phút ${seconds} giây** để nhận tiếp.`
                );

            return message.reply({
                embeds: [embed]
            });
        }

        // Thưởng ngẫu nhiên
        const reward = Math.floor(Math.random() * 5001) + 5000; // 5.000 - 10.000

        user.coins += reward;
        user.daily = now;

        saveData(data);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🎁 NHẬN DAILY THÀNH CÔNG")
            .setDescription(
                `💰 Bạn nhận được **${reward.toLocaleString()} PSCOIN**!\n\n` +
                `💳 Số dư hiện tại: **${user.coins.toLocaleString()} PSCOIN**`
            )
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });

    }
};
