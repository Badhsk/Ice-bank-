const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
  console.log("ICE BANK BOT ONLINE ❄️");
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "ice!ping") {
    message.reply("WORKING ❄️");
  }
});

client.login(process.env.TOKEN);
