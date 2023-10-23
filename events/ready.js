module.exports = (I) => {
  I.user.setPresence({
    status: global.status || "online",
  });
  global.log("Logged in! Curently serving", I.guilds.cache.size, "server(s)");
}
