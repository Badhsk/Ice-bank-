const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ================= DATA =================
let users = {};
let gangs = {};
let jail = {};
let subs = {};

// ================= COMMANDS HELP =================
const commands = {
  "فلوس":"عرض رصيدك",
  "يومي":"مكافأة يومية",
  "عمل":"تشتغل وتربح",
  "كازينو":"لعبة حظ",
  "نرد":"لعبة زهر",
  "تخمين":"تخمين رقم",
  "خطر":"مخاطرة",
  "اسهم":"سوق الأسهم",
  "شراء":"شراء سهم",
  "سيارة":"عرض سيارة",
  "بيت":"عرض بيت",
  "جزيرة":"ربح جزيرة",
  "سفينة":"عرض سفينة",
  "جوال":"عرض جوال",
  "عصابة":"إنشاء عصابة",
  "حرب":"حرب عصابات",
  "سطو":"سرقة RP",
  "سجن":"سجن لاعب",
  "خروج":"الخروج من السجن",
  "ترتيب":"Top 20",
  "اشتراك":"VIP / PRO",
  "بروفايل":"حسابك",
  "اوامر":"عرض كل الأوامر",
  "شرح":"شرح أمر"
};

// ================= UTIL =================
function getUser(id){
  if(!users[id]){
    users[id]={wallet:5000,bank:0,xp:0,level:1};
  }
  return users[id];
}
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;

// ================= STOCKS =================
const stocks = {
Tesla:120, Apple:200, Google:180, Amazon:150,
Meta:170, Nvidia:220, Samsung:160, Sony:140,
Intel:110, Microsoft:250, Oracle:130, Uber:100,
Netflix:175, SpaceX:300, BMW:160, Toyota:140,
Honda:130, OpenAI:280, Discord:210, CryptoX:190
};

// ================= ASSETS =================
const cars=["Supra","GTR","BMW M5","AMG","Lambo","Ferrari","R8","Chiron","McLaren","Rolls Royce","Bentley","Aston Martin","Dodge","Corvette","Mustang","Tesla S","Lexus","Pagani","Koenigsegg","Bugatti"];
const houses=["كوخ","شقة","شقة فاخرة","فيلا","قصر","قصر ملكي","قصر ذهبي","جزيرة","قصر فضائي","بيت حديث","بيت خشبي","قصر أسطوري","قصر تحت الأرض","قصر بحر","قصر ثلجي","قصر VIP","قصر خيالي","فيلا ضخمة","قصر ملكي فاخر","قصر زجاجي"];
const islands=["Island X","Skull Island","Crypto Island","Ice Island","Luxury Island"];
const ships=["Speed Boat","Yacht","War Ship","Submarine","Titanic Class"];
const phones=["iPhone 15","Samsung S24","Pixel 9","Xiaomi Ultra"];

// ================= READY =================
client.on("ready",()=>console.log("❄️ ICE BANK V50 FINAL ONLINE"));

// ================= MAIN =================
client.on("messageCreate",(m)=>{
if(m.author.bot) return;

const u=getUser(m.author.id);
const args=m.content.split(" ");
const cmd=args[0];

// ================= LEVEL =================
u.xp+=rand(5,30);
if(u.xp>=u.level*150){
u.level++; u.wallet+=2000; u.xp=0;
}

// ================= BASIC =================
if(cmd==="ice!فلوس") return m.reply(`💰 ${u.wallet}$`);

if(cmd==="ice!بروفايل")
return m.reply(`👤 LVL ${u.level}\n💰 ${u.wallet}$`);

// ================= ECONOMY =================
if(cmd==="ice!يومي"){
let x=rand(500,8000);
u.wallet+=x;
return m.reply(`💸 +${x}$`);
}

if(cmd==="ice!عمل"){
let x=rand(2000,15000);
u.wallet+=x;
return m.reply(`💼 +${x}$`);
}

// ================= CASINO =================
if(cmd==="ice!كازينو"){
let bet=rand(1000,20000);
if(Math.random()>0.5){
u.wallet+=bet*2;
return m.reply("🎰 WIN");
}
u.wallet-=bet;
return m.reply("💀 LOSE");
}

// ================= 20 GAMES =================
if(cmd==="ice!نرد"){
let a=rand(1,6),b=rand(1,6);
return a>b? (u.wallet+=8000,m.reply("WIN")):(u.wallet-=4000,m.reply("LOSE"));
}

if(cmd==="ice!تخمين"){
let n=rand(1,5);
return parseInt(args[1])===n?(u.wallet+=10000,m.reply("WIN")):(u.wallet-=5000,m.reply("LOSE"));
}

if(cmd==="ice!خطر"){
return Math.random()>0.4?(u.wallet+=25000,m.reply("WIN")):(u.wallet-=12000,m.reply("LOSE"));
}

if(cmd==="ice!روليت"){
return Math.random()>0.5?(u.wallet+=15000,m.reply("WIN")):(u.wallet-=8000,m.reply("LOSE"));
}

// ================= STOCK =================
if(cmd==="ice!اسهم"){
let t="📈 MARKET:\n";
for(let c in stocks){
stocks[c]+=rand(-25,25);
if(stocks[c]<50) stocks[c]=50;
t+=`${c}: ${stocks[c]}$\n`;
}
return m.reply(t);
}

// ================= ASSETS =================
if(cmd==="ice!سيارة") return m.reply("🚗 "+cars[rand(0,19)]);
if(cmd==="ice!بيت") return m.reply("🏠 "+houses[rand(0,19)]);
if(cmd==="ice!جزيرة") return m.reply("🏝️ "+islands[rand(0,4)]);
if(cmd==="ice!سفينة") return m.reply("🚢 "+ships[rand(0,4)]);
if(cmd==="ice!جوال") return m.reply("📱 "+phones[rand(0,3)]);

// ================= GANGS =================
if(cmd==="ice!عصابة"){
gangs[m.author.id]=args.slice(1).join(" ");
return m.reply("⚔️ "+gangs[m.author.id]);
}

if(cmd==="ice!حرب"){
return Math.random()>0.5?(u.wallet+=25000,m.reply("WIN WAR")):(u.wallet-=15000,m.reply("LOSE WAR"));
}

if(cmd==="ice!سطو"){
return Math.random()>0.6?(u.wallet+=40000,m.reply("HEIST WIN")):(u.wallet-=20000,m.reply("HEIST LOSE"));
}

// ================= JAIL =================
if(cmd==="ice!سجن"){
let t=m.mentions.users.first();
if(!t) return;
jail[t.id]=Date.now()+60000;
return m.reply("🚔 jailed");
}

if(cmd==="ice!خروج"){
if(jail[m.author.id]&&Date.now()<jail[m.author.id])
return m.reply("🚫 jailed");
delete jail[m.author.id];
return m.reply("free");
}

// ================= SUBS =================
if(cmd==="ice!اشتراك"){
let t=args[1];
if(t==="vip"){u.wallet+=15000;return m.reply("VIP");}
if(t==="pro"){u.wallet+=30000;return m.reply("PRO");}
}

// ================= HELP =================
if(cmd==="ice!اوامر"){
let text="📜 COMMANDS:\n\n";
for(let c in commands){
text+=`🔹 ice!${c} — ${commands[c]}\n`;
}
return m.reply(text);
}

if(cmd==="ice!شرح"){
let q=args[1];
return commands[q]
? m.reply(`📌 ${commands[q]}`)
: m.reply("❌ غير موجود");
}

});

client.login(process.env.TOKEN);
