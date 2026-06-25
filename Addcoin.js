const config = require("../config.json");
const {
loadData,
saveData,
createUser
} = require("../utils/database");

module.exports = {
name: "addcoin",

async execute(client, message, args) {

if (message.author.id !== config.ownerId)
return;

const member =
message.mentions.users.first();

const amount = Number(args[1]);

if (!member)
return message.reply("❌ Tag người cần cộng.");

if (isNaN(amount))
return message.reply("❌ Số tiền không hợp lệ.");

if (amount <= 0)
return message.reply("❌ Không được nhập số âm hoặc 0.");

const data = loadData();

createUser(member.id);

data[member.id].coins += amount;

saveData(data);

message.reply(
`✅ Đã cộng ${amount.toLocaleString()} PSCOIN cho ${member.tag}`
);

}
};
