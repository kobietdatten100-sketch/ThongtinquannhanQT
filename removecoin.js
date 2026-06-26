const { EmbedBuilder } = require("discord.js");
const {
    loadData,
    saveData,
    createUser
} = require("../Database");

const config = require("../config.json");

module.exports = {
    name: "removecoin",

    async execute(client, message, args) {

        // Chỉ Owner được dùng
        if (message.author.id !== config.ownerId) {
            return message.reply("❌ Bạn không có quyền sử dụng lệnh này.");
        }

        const member = message.mentions.users.first();

        if (!member) {
            return message.reply("❌ Vui lòng mention người cần trừ coin.");
        }

        const amount = Number(args[1]);

        if (isNaN(amount) || amount <= 0) {
            return message.reply("❌ Số PSCOIN phải là số dương.");
        }

        let data = loadData();

        if (!data[member.id]) {
            createUser(member.id);
            data = loadData();
        }

        // Không cho coin âm
        if (data[member.id].coins < amount) {
            data[member.id].coins = 0;
        } else {
            data[member.id].coins -= amount;
        }

        saveData(data);

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("➖ TRỪ PSCOIN THÀNH CÔNG")
            .setDescription(
                `👤 Người bị trừ: ${member}\n\n` +
                `➖ Đã trừ: **${amount.toLocaleString()} PSCOIN**\n\n` +
                `💰 Số dư còn lại: **${data[member.id].coins.toLocaleString()} PSCOIN**`
            )
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });

    }
};
