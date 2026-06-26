const { EmbedBuilder } = require("discord.js");
const {
    loadData,
    saveData,
    createUser
} = require("../Database");

const config = require("../config.json");

module.exports = {
    name: "addcoin",

    async execute(client, message, args) {

        // Chỉ Owner được dùng
        if (message.author.id !== config.ownerId) {
            return message.reply("❌ Bạn không có quyền sử dụng lệnh này.");
        }

        const member = message.mentions.users.first();

        if (!member) {
            return message.reply("❌ Vui lòng mention người cần cộng coin.");
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

        data[member.id].coins += amount;

        saveData(data);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ CỘNG PSCOIN THÀNH CÔNG")
            .setDescription(
                `👤 Người nhận: ${member}\n\n` +
                `➕ Đã cộng: **${amount.toLocaleString()} PSCOIN**\n\n` +
                `💰 Số dư mới: **${data[member.id].coins.toLocaleString()} PSCOIN**`
            )
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });

    }
};
