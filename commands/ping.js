const { SlashCommandBuilder } = require("discord.js");
let data = {
  data: new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!"),
  async execute(I) {
    await I.reply("Pong!")
  }
};

module.exports = data;
