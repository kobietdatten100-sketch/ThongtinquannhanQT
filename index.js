const {
    Client,
    GatewayIntentBits,
    Collection,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const config = require("./config.json");

const { rooms } = require("./commands/masoi");
const { assignRoles } = require("./utils/assignRoles");
const { renderRoom } = require("./utils/roomUI");
const { loadingAnimation } = require("./utils/animation");

const {
    loadData,
    saveData,
    createUser
} = require("./Database");

// ================= BOT =================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: ["CHANNEL"]
});

client.commands = new Collection();

// ================= LOAD COMMANDS =================
const commandFiles = fs.readdirSync("./commands")
    .filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const cmd = require(`./commands/${file}`);
    client.commands.set(cmd.name, cmd);
}

// ================= READY =================
client.once("clientReady", () => {
    console.log(`✅ ${client.user.tag} đã online`);
});

// ================= PREFIX =================
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const cmd = client.commands.get(cmdName);
    if (!cmd) return;

    try {
        await cmd.execute(client, message, args);
    } catch (err) {
        console.error(err);
        message.reply("❌ Lỗi command");
    }
});

// ================= INTERACTIONS =================
client.on("interactionCreate", async (interaction) => {

    // ================= BUTTON =================
    if (interaction.isButton()) {

        const id = interaction.customId;

        // ================= TÀI XỈU =================
        if (id.startsWith("tai_") || id.startsWith("xiu_")) {

            const [choice, userId] = id.split("_");

            if (interaction.user.id !== userId) {
                return interaction.reply({
                    content: "❌ Không phải lượt cược của bạn.",
                    ephemeral: true
                });
            }

            const modal = new ModalBuilder()
                .setCustomId(`bet_${choice}`)
                .setTitle("🎲 TÀI XỈU");

            const input = new TextInputBuilder()
                .setCustomId("amount")
                .setLabel("Nhập PSCOIN")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(input));

            return interaction.showModal(modal);
        }

        // ================= MA SÓI START =================
        if (id === "start_game") {

            const room = rooms.find(r => r.ownerId === interaction.user.id);

            if (!room) {
                return interaction.reply({
                    content: "❌ Không phải chủ phòng.",
                    ephemeral: true
                });
            }

            if (room.players.length < 4) {
                return interaction.reply({
                    content: "❌ Cần ít nhất 4 người.",
                    ephemeral: true
                });
            }

            const roles = assignRoles(room.players);
            room.roles = roles;
            room.started = true;

            // animation start
            let msg = await interaction.reply({
                content: "🐺 Đang khởi động Ma Sói...",
                fetchReply: true
            });

            const steps = [
                "📦 Chia vai trò...",
                "🎭 Gán vai...",
                "🔒 Ẩn thông tin...",
                "🌙 Chuẩn bị đêm...",
                "🐺 Bắt đầu game..."
            ];

            await loadingAnimation(msg, steps);

            // DM roles
            for (const p of room.players) {
                const role = roles.find(r => r.userId === p.id);

                try {
                    await p.send(`🎭 Vai trò của bạn: ||${role.role}||`);
                } catch {}
            }

            return;
        }
    }

    // ================= MODAL (TÀI XỈU) =================
    if (interaction.isModalSubmit()) {

        if (!interaction.customId.startsWith("bet_")) return;

        const choice = interaction.customId.split("_")[1];
        const amount = Number(interaction.fields.getTextInputValue("amount"));

        if (!amount || amount <= 0) {
            return interaction.reply({
                content: "❌ Số không hợp lệ",
                ephemeral: true
            });
        }

        let data = loadData();
        createUser(interaction.user.id);
        data = loadData();

        const user = data[interaction.user.id];

        if (!user || user.coins < amount) {
            return interaction.reply({
                content: "❌ Không đủ PSCOIN",
                ephemeral: true
            });
        }

        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const d3 = Math.floor(Math.random() * 6) + 1;

        const total = d1 + d2 + d3;
        const result = total >= 11 ? "tai" : "xiu";

        const win = choice === result;

        if (win) {
            user.coins += amount;
            user.win = (user.win || 0) + 1;
        } else {
            user.coins -= amount;
            user.lose = (user.lose || 0) + 1;
        }

        saveData(data);

        const embed = new EmbedBuilder()
            .setColor(win ? 0x00ff88 : 0xff4444)
            .setTitle(win ? "🎉 THẮNG!" : "💥 THUA!")
            .addFields(
                { name: "🎲 Xúc xắc", value: `${d1} • ${d2} • ${d3}`, inline: true },
                { name: "📊 Tổng", value: `${total}`, inline: true },
                { name: "🏆 Kết quả", value: result.toUpperCase(), inline: true },
                { name: "💰 Số dư", value: `${user.coins.toLocaleString()}`, inline: true }
            )
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
});

// ================= LOGIN =================
client.login(process.env.TOKEN);    if (!interaction.isModalSubmit()) return;

    if (!interaction.customId.startsWith("bet_")) return;

    const choice = interaction.customId.split("_")[1];

    const amount = Number(
        interaction.fields.getTextInputValue("amount")
    );

    if (isNaN(amount) || amount <= 0) {
        return interaction.reply({
            content: "❌ Vui lòng nhập số PSCOIN hợp lệ.",
            ephemeral: true
        });
    }

    let data = loadData();

    createUser(interaction.user.id);

    data = loadData();

    const user = data[interaction.user.id];

    if (user.coins < amount) {
        return interaction.reply({
            content: "❌ Bạn không đủ PSCOIN.",
            ephemeral: true
        });
}
  // Tung xúc xắc
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;

    const total = dice1 + dice2 + dice3;

    // 3 - 10 = Xỉu | 11 - 18 = Tài
    const result = total >= 11 ? "tai" : "xiu";

    let win = false;

    if (choice === result) {
        user.coins += amount;
        user.win = (user.win || 0) + 1;
        win = true;
    } else {
        user.coins -= amount;
        user.lose = (user.lose || 0) + 1;
    }

    saveData(data);

    const embed = new EmbedBuilder()
        .setColor(win ? 0x2ecc71 : 0xe74c3c)
        .setTitle(win ? "🎉 BẠN ĐÃ THẮNG!" : "💥 BẠN ĐÃ THUA!")
        .setDescription(
            `# 🎲 KẾT QUẢ TÀI XỈU

🎲 Xúc xắc: **${dice1} • ${dice2} • ${dice3}**

📊 Tổng: **${total}**

👤 Người chơi: <@${interaction.user.id}>

🎯 Bạn chọn: **${choice.toUpperCase()}**

🏆 Kết quả: **${result.toUpperCase()}**

${win ? "➕ Thắng" : "➖ Thua"}: **${amount.toLocaleString()} PSCOIN**

💰 Số dư hiện tại: **${user.coins.toLocaleString()} PSCOIN**`
        )
        .setTimestamp();

    return interaction.reply({
        embeds: [embed]
    });
});
// ================= ĐĂNG NHẬP BOT =================

// Nếu dùng Railway Variables
if (process.env.TOKEN) {
    client.login(process.env.TOKEN);
}
