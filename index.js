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

const { rooms } = require("./commands/masoi");

console.log("Rooms:", rooms);

const fs = require("fs");

const config = require("./config.json");

const {
    loadData,
    saveData,
    createUser
} = require("./Database");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

// Load tất cả lệnh trong thư mục commands
const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Bot online
client.once("clientReady", () => {
    console.log(`✅ ${client.user.tag} đã online`);
});

// Xử lý lệnh prefix
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/);

    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(client, message, args);
    } catch (err) {
        console.error(err);
        message.reply("❌ Đã xảy ra lỗi khi thực hiện lệnh.");
    }
});
// Xử lý Button và Modal
client.on("interactionCreate", async (interaction) => {

    // ================= BUTTON =================
    if (interaction.isButton()) {

    // ================= MA SÓI =================
    if (interaction.customId.startsWith("ww_")) {

const room = rooms.get(interaction.guild.id);

console.log("Guild ID:", interaction.guild.id);
console.log("Room:", room);
console.log("Rooms keys:", [...rooms.keys()]);

if (!room) {
    return interaction.reply({
        content: "❌ Phòng không tồn tại.",
        ephemeral: true
    });
}
        if (!room) {
            return interaction.reply({
                content: "❌ Phòng không tồn tại.",
                ephemeral: true
            });
        }

        if (interaction.customId === "ww_join") {

            if (room.players.includes(interaction.user.id)) {
                return interaction.reply({
                    content: "❌ Bạn đã tham gia.",
                    ephemeral: true
                });
            }

            room.players.push(interaction.user.id);

        }

        else if (interaction.customId === "ww_leave") {

            room.players = room.players.filter(
                id => id !== interaction.user.id
            );

        }

        else if (interaction.customId === "ww_cancel") {

            if (interaction.user.id !== room.owner) {
                return interaction.reply({
                    content: "❌ Chỉ chủ phòng mới được hủy.",
                    ephemeral: true
                });
            }

            rooms.delete(interaction.guild.id);

            return interaction.update({
                content: "🗑️ Phòng đã bị hủy.",
                embeds: [],
                components: []
            });

        }

        else if (interaction.customId === "ww_start") {

            if (interaction.user.id !== room.owner) {
                return interaction.reply({
                    content: "❌ Chỉ chủ phòng mới được bắt đầu.",
                    ephemeral: true
                });
            }

            if (room.players.length < 5) {
                return interaction.reply({
                    content: "❌ Cần ít nhất 5 người.",
                    ephemeral: true
                });
            }

            return interaction.update({
                content: "🎉 Game đang bắt đầu...",
                embeds: [],
                components: []
            });

        }

        const list = room.players
            .map(id => `<@${id}>`)
            .join("\n");

        const embed = EmbedBuilder
            .from(interaction.message.embeds[0])
            .setDescription(
                `**Chủ phòng:** <@${room.owner}>\n\n` +
                `🌙 Hãy tập hợp người chơi.\n\n` +
                `**Người chơi (${room.players.length}/16)**\n` +
                `${list}\n\n` +
                `⚠️ Cần ít nhất **5 người** để bắt đầu.`
            );

        return interaction.update({
            embeds: [embed]
        });

    }

    // ================= TÀI XỈU =================

    const [choice, userId] = interaction.customId.split("_");

    if (choice !== "tai" && choice !== "xiu") return;

    if (interaction.user.id !== userId) {
        return interaction.reply({
            content: "❌ Đây không phải lượt cược của bạn.",
            ephemeral: true
        });
    }

    const modal = new ModalBuilder()
        .setCustomId(`bet_${choice}`)
        .setTitle("🎲 Đặt cược PSCOIN");

    const amountInput = new TextInputBuilder()
        .setCustomId("amount")
        .setLabel("Nhập số PSCOIN muốn cược")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const row = new ActionRowBuilder()
        .addComponents(amountInput);

    modal.addComponents(row);

    return interaction.showModal(modal);

    }

    // ================= MODAL =================
    if (!interaction.isModalSubmit()) return;

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
