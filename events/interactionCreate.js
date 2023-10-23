module.exports = async(I) => {
  let command = client.commands.get(I.commandName);
  try {
    command.execute(I).then(() => log("handled command", I.commandName, "\033[1;32m-\033[m", I.user.username));
  } catch(e) {
    log("Failed to handled command", I.commandName + "!");
    console.error(e);
  }
}
