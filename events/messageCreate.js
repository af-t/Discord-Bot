module.exports = async(I) => {
  if (I.author.bot) return;
  let prefix = (global.prefix == "")
  ? I.content.trim().match(/^[!,$]/g)?.[0]
  : global.prefix.test
  ? I.content.trim().match(global.prefix)?.[0]
  : I.content.trim().startsWith(global.prefix)
  ? global.prefix
  : null;
  if (!prefix) return;
  let rcmd = I.content.trim().slice(prefix.length).split(/ +/g)[0].toLowerCase().trim();
  let rarg = I.content.trim().slice(prefix.length).split(/ +/g).slice`1`.join` `;
  let command = client.commands.get(rcmd);
  if (command) {
    try {
      command.execute(I).then(() => log("handled command", rcmd, "\033[1;32m-\033[m", I.author.username));
    } catch(e) {
      log("Failed to handled command", rcmd + "!");
      console.error(e);
    }
  }
}
