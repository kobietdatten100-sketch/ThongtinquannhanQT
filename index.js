const {
Client,
GatewayIntentBits,
Collection
} = require("discord.js");

const fs = require("fs");
const config = require("./config.json");

const client = new Client({
intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commandFiles = fs
.readdirSync("./commands")
.filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
const command = require(`./commands/${file}`);
client.commands.set(command.name, command);
}

client.once("ready", () => {
console.log(`✅ ${client.user.tag} đã online`);
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
command.execute(client, message, args);
} catch (err) {
console.error(err);
}
});

client.login(config.token);
