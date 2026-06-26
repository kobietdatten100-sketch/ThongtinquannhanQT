const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    loadData,
    createUser
} = require("../Database");

// Chống spam mở nhiều phiên cược
const playing = new Set();

module.exports = {
    name: "tx",

    async execute(client, message) {

        // Không cho mở nhiều bàn cược cùng lúc
        if (playing.has(message.author.id)) {
            return message.reply({
                content: "⏳ Bạn đang có một phiên cược chưa hoàn thành."
            });
        }

        playing.add(message.author.id);

        let data = loadData();

        if (!data[message.author.id]) {
            createUser(message.author.id);
            data = loadData();
        }

        const user = data[message.author.id];

        const embed = new EmbedBuilder()
            .setColor("#f1c40f")
            .setTitle("🎲 MINI GAME TÀI XỈU")
            .setDescription(
`## Chọn cửa cược

🔴 **TÀI** (11 - 18)

🔵 **XỈU** (3 - 10)

💰 Số dư:
**${user.coins.toLocaleString()} PSCOIN**

> Sau khi bấm nút sẽ hiện cửa sổ nhập số tiền cược.`
            )
            .setFooter({
                text: `Người chơi: ${message.author.username}`
            })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tai_${message.author.id}`)
                    .setLabel("🔴 TÀI")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId(`xiu_${message.author.id}`)
                    .setLabel("🔵 XỈU")
                    .setStyle(ButtonStyle.Primary)
            );

        const msg = await message.reply({
            embeds: [embed],
            components: [row]
        });

        // Sau 60 giây tự hủy phiên cược
        setTimeout(async () => {
            playing.delete(message.author.id);

            try {
                await msg.edit({
                    components: []
                });
            } catch {}
        }, 60000);
    }
};// ===========================
// Các nút sẽ được xử lý trong index.js
// tx.js chỉ tạo giao diện và nút.
// Nếu muốn chống spam mạnh hơn, thêm cooldown:

const cooldown = new Map();

module.exports.cooldown = cooldown;

// Hàm kiểm tra cooldown (5 giây)
module.exports.checkCooldown = (userId) => {

    const now = Date.now();

    if (cooldown.has(userId)) {

        const expire = cooldown.get(userId);

        if (expire > now) {
            return Math.ceil((expire - now) / 1000);
        }
    }

    cooldown.set(userId, now + 5000);

    setTimeout(() => {
        cooldown.delete(userId);
    }, 5000);

    return 0;
};
