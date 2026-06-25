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

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
]
});

client.commands = new Collection();

const commandFiles = fs
.readdirSync("./commands")
.filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
const command = require("./commands/${file}");
client.commands.set(command.name, command);
}

client.once("ready", () => {
console.log("✅ ${client.user.tag} đã online");
});

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
}
});

client.on("interactionCreate", async interaction => {

if (interaction.isButton()) {

const [choice, userId] = interaction.customId.split("_");

if (choice !== "tai" && choice !== "xiu") return;

if (interaction.user.id !== userId) {
return interaction.reply({
content: "❌ Đây không phải lượt cược của bạn.",
ephemeral: true
});
}

const modal = new ModalBuilder()
.setCustomId("bet_${choice}")
.setTitle("Đặt cược PSCOIN");

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

if (interaction.isModalSubmit()) {

if (!interaction.customId.startsWith("bet_")) return;

const choice = interaction.customId.split("_")[1];

const amount = Number(
interaction.fields.getTextInputValue("amount")
);

if (isNaN(amount)) {
return interaction.reply({
content: "❌ Số tiền không hợp lệ.",
ephemeral: true
});
}

if (amount <= 0) {
return interaction.reply({
content: "❌ Không được nhập số âm hoặc 0.",
ephemeral: true
});
}

const {
loadData,
saveData,
createUser
} = require("./utils/database");

const data = loadData();

createUser(interaction.user.id);

const user = data[interaction.user.id];

if (user.coins < amount) {
return interaction.reply({
content: "❌ Bạn không đủ PSCOIN.",
ephemeral: true
});
}

const dice1 = Math.floor(Math.random() * 6) + 1;
const dice2 = Math.floor(Math.random() * 6) + 1;
const dice3 = Math.floor(Math.random() * 6) + 1;

const total = dice1 + dice2 + dice3;

const result = total >= 11 ? "tai" : "xiu";

let win = false;

if (choice === result) {
user.coins += amount;
win = true;
} else {
user.coins -= amount;
}

saveData(data);

const embed = new EmbedBuilder()
.setColor(win ? "Green" : "Red")
.setTitle(
win ? "🎉 BẠN ĐÃ THẮNG" : "💥 BẠN ĐÃ THUA"
)
.setDescription(
"🎲 Xúc xắc: ${dice1} • ${dice2} • ${dice3}\n" +
"📊 Tổng: ${total}\n\n" +
"🎯 Bạn chọn: ${choice.toUpperCase()}\n" +
"🏆 Kết quả: ${result.toUpperCase()}\n\n" +
`${win ? "➕" : "➖"} ${amount.toLocaleString()} PSCOIN\n\n` +
"💰 Số dư: ${user.coins.toLocaleString()} PSCOIN"
);

return interaction.reply({
embeds: [embed]
});
}

});

client.login(config.token);
