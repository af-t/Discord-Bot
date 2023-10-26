const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const util = require("util");

global.client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent
  ]
});

require("./config.js");

if (global.prefix === "" || !global.prefix) global.prefix = new RegExp('^[!.,•°§∆]', "gi");
if (global.token === "" || !global.prefix) throw new Error("Please set Discord token");
global.dirname = path.resolve(__dirname);
global.lib = path.resolve(__dirname, "lib");
global.dtb = path.resolve(__dirname, "database");
global.cmds = path.resolve(__dirname, "commands");
global.event = path.resolve(__dirname, "events");
global.log = util.log;

client.commands = new Discord.Collection;

async function updateCommands() {
  let v = fs.readdirSync(cmds).filter(f => f.endsWith(".js"));
  for (let f of v) {
    try {
      let _cmd = require(path.join(cmds, f));
      if (typeof _cmd?.data?.name === "string" && typeof _cmd.execute === "function") {
        if (!client.commands.get(_cmd.data.name)) {
          client.commands.set(_cmd.data.name, _cmd);
          if (Array.isArray(_cmd.data.alias)) for (let a of _cmd.data.alias) if (typeof a === "string") client.commands.set(a, _cmd);
          let res = await fetch(`https://discord.com/api/v10/applications/${appid}/commands`, {
            method: "POST",
            headers: {
              authorization: `Bot ${token}`,
              "content-type": "application/json"
            },
            body: JSON.stringify(_cmd.data)
          });
//          console.log(JSON.parse(Buffer.from(await res.arrayBuffer())));
          log("Loaded", f);
        };
      };
    } catch {
      log("\033[1;33mW\033[m", `- Unable to load ${f}`);
    };
  };
};
setInterval(updateCommands, 10 * 60 * 1000); // 10 minute
updateCommands();

fs.readdir(event, (err, file) => {
  file = file.filter(f => {
    if (f.endsWith`.js` && !f.startsWith`.`) return true
    return false
  });
  for (let f of file) {
    let ev = require(path.join(event, f));
    client.on(f.split`.js`[0], ev);
  }
});
client.login(global.token);
