const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ================= DATA =================
let users = {};
let gangs = {};
let properties = {};

function getUser(id) {
  if (!users[id]) {
    users[id] = {
      wallet: 1000,
      bank: 0,
      xp: 0,
      level: 1
    };
  }
  return users[id];
}

// ================= LEVEL SYSTEM =================
function addXP(user) {
  user.xp += Math.floor(Math.random() * 20) + 5;

  let needed = user.level * 100;

  if (user.xp >= needed) {
    user.level++;
    user.xp = 0;
    return true;
  }
  return false;
}

// ================= BOT READY =================
client.on("ready", () => {
  console.log("❄️ ICE BANK V2 ONLINE");
});

// ================= COMMANDS =================
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const user = getUser(message.author.id);
  const args = message.content.split(" ");
  const cmd = args[0];

  addXP(user);

  // ================= SYSTEM =================
  if (cmd === "ice!ping") return message.reply("❄️ WORKING");

  if (cmd === "ice!help") {
    return message.reply(`
❄️ ICE BANK V2 ❄️

💰 Economy:
ice!balance
ice!daily
ice!work
ice!crime

🏦 Bank:
ice!deposit
ice!withdraw
ice!pay

📊 Level:
ice!rank
ice!profile

⚔️ Gangs:
ice!gang
ice!mygang

🏢 Properties:
ice!buyhouse
ice!buycar
ice!properties
    `);
  }

  // ================= ECONOMY =================
  if (cmd === "ice!balance") {
    return message.reply(`💰 Wallet: ${user.wallet}$\n🏦 Bank: ${user.bank}$`);
  }

  if (cmd === "ice!daily") {
    let amt = Math.floor(Math.random() * 1500) + 300;
    user.wallet += amt;
    return message.reply(`💸 Daily +${amt}$`);
  }

  if (cmd === "ice!work") {
    let amt = Math.floor(Math.random() * 2000) + 200;
    user.wallet += amt;
    return message.reply(`🛠 ربحت ${amt}$`);
  }

  if (cmd === "ice!crime") {
    let win = Math.random() > 0.5;

    if (win) {
      let amt = Math.floor(Math.random() * 3000) + 500;
      user.wallet += amt;
      return message.reply(`🚔 نجحت وربحت ${amt}$`);
    } else {
      let amt = Math.floor(Math.random() * 1200) + 200;
      user.wallet -= amt;
      return message.reply(`🚓 خسرت ${amt}$`);
    }
  }

  // ================= BANK =================
  if (cmd === "ice!deposit") {
    let amt = parseInt(args[1]);
    if (!amt || amt > user.wallet) return message.reply("❌ خطأ");

    user.wallet -= amt;
    user.bank += amt;

    return message.reply(`🏦 أودعت ${amt}$`);
  }

  if (cmd === "ice!withdraw") {
    let amt = parseInt(args[1]);
    if (!amt || amt > user.bank) return message.reply("❌ خطأ");

    user.bank -= amt;
    user.wallet += amt;

    return message.reply(`🏧 سحبت ${amt}$`);
  }

  if (cmd === "ice!pay") {
    let target = message.mentions.users.first();
    let amt = parseInt(args[2]);

    if (!target || !amt) return message.reply("❌ ice!pay @user amount");

    let t = getUser(target.id);

    if (user.wallet < amt) return message.reply("❌ ما معك فلوس");

    user.wallet -= amt;
    t.wallet += amt;

    return message.reply(`💸 حولت ${amt}$`);
  }

  // ================= LEVEL =================
  if (cmd === "ice!rank") {
    return message.reply(`📊 Level: ${user.level}\n⭐ XP: ${user.xp}/${user.level * 100}`);
  }

  if (cmd === "ice!profile") {
    return message.reply(`
👤 PROFILE

💰 Wallet: ${user.wallet}$
🏦 Bank: ${user.bank}$

📊 Level: ${user.level}
⭐ XP: ${user.xp}

⚔️ Gang: ${gangs[message.author.id]?.name || "No Gang"}
🏢 House: ${properties[message.author.id]?.house ? "Yes" : "No"}
🚗 Car: ${properties[message.author.id]?.car ? "Yes" : "No"}
    `);
  }

  // ================= GANGS =================
  if (cmd === "ice!gang") {
    let name = args.slice(1).join(" ");
    if (!name) return message.reply("❌ اكتب اسم العصابة");

    gangs[message.author.id] = {
      name,
      members: [message.author.id]
    };

    return message.reply(`⚔️ Gang Created: ${name}`);
  }

  if (cmd === "ice!mygang") {
    let g = gangs[message.author.id];
    if (!g) return message.reply("❌ ما عندك عصابة");

    return message.reply(`⚔️ ${g.name} | 👥 ${g.members.length}`);
  }

  // ================= PROPERTIES =================
  if (cmd === "ice!buyhouse") {
    let price = 3000;
    if (user.wallet < price) return message.reply("❌ ما معك فلوس");

    user.wallet -= price;
    if (!properties[message.author.id]) properties[message.author.id] = {};
    properties[message.author.id].house = true;

    return message.reply("🏠 اشتريت بيت");
  }

  if (cmd === "ice!buycar") {
    let price = 2500;
    if (user.wallet < price) return message.reply("❌ ما معك فلوس");

    user.wallet -= price;
    if (!properties[message.author.id]) properties[message.author.id] = {};
    properties[message.author.id].car = true;

    return message.reply("🚗 اشتريت سيارة");
  }

  if (cmd === "ice!properties") {
    let p = properties[message.author.id] || {};

    return message.reply(`
🏢 ممتلكاتك:
🏠 بيت: ${p.house ? "Yes" : "No"}
🚗 سيارة: ${p.car ? "Yes" : "No"}
    `);
  }
});

client.login(process.env.TOKEN);
