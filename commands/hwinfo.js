const { SlashCommandBuilder } = require("discord.js");
const { spawn } = require("child_process");
const { readFileSync: read } = require("fs");
let data = {
  data: new SlashCommandBuilder()
  .setName("hwinfo")
  .setDescription("Get bot device specification"),
  execute(I) {
    let text = "## CPU INFORMATION\n";
    let data = Buffer.alloc(0);
    return new Promise((res,rej) => {
      spawn("lscpu")
      .stdout.on("data", chunk => { data = Buffer.concat([data,chunk]);})
      .on("error", rej)
      .on("end", code => {
        if (code < 0 || code > 0) rej();
        let dtext = data.toString().split("\n");
        for (let l of dtext) {
          let o = l.split(/: +/)[0];
          let v = l.split(/: +/)[1];
          if (
            o.match(/architecture/i) ||
            o.match(/cpu/i) ||
            o.match(/core/i) ||
            o.match(/socket/i) ||
            o.match(/cluster/i)) text += "> **" + o.trim() + ":** " + v.trim() + "\n";
        };
        text += "## MEM + SWAP\n";
        data = read("/proc/meminfo");
        dtext = data.toString().split("\n");
        let total = 0;
        let free = 0;
        for (let l of dtext) {
          let o = l.split(/: +/)[0];
          let v = l.split(/: +/)[1];
          if (o.match(/memtotal/i) || o.match(/swaptotal/i)) total = total + parseInt(v.trim().split(/ +/)[0]);
          if (o.match(/memavailable/i) || o.match(/swapfree/i)) free = free + parseInt(v.trim().split(/ +/)[0]);
        };
        let mused = total - free;
        text += "> **Total:** " + byteGib(total * 1024) + "\n";
        text += "> **Free:** " + byteGib(free * 1024) + "\n";
        text += "> **Used:** " + byteGib(mused * 1024) + "\n";
        text += "## BOT Mem Usage\n";
        mused = process.memoryUsage();
        text += "> **RSS:** " + byteGib(mused.rss) + "\n";
        text += "> **Heap Total:** " + byteGib(mused.heapTotal) + "\n";
        text += "> **Heap Used:** " + byteGib(mused.heapUsed) + "\n";
        text += "> **External:** " + byteGib(mused.external) + "\n";
        text += "> **ArrayBuffers:** " + byteGib(mused.arrayBuffers) + "\n";
        I.reply(text).then(res);
      });
    });
  },
  noslash: true
};
function byteGib(bytes = 0) {
  let end = " Bytes";
  if (bytes >= 1000) {
    bytes = bytes / 1024;
    end = " KiB";
  }
  if (bytes >= 1000) {
    bytes = bytes / 1024;
    end = " MiB";
  }
  if (bytes >= 1000) {
    bytes = bytes / 1024;
    end = " GiB";
  }
  if (1000 >= bytes)
  return String(bytes).slice(0, 4) + end
  else return String(bytes);
};

data.data.alias = [ "info", "botinfo" ];
module.exports = data;
