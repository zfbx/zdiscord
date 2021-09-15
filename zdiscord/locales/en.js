/* en - English Translation by zfbx ♥
 Translation strings used by the bot
 Strings wrapped in {{ }} will be auto-replaced with updated values
 Globals: {{servername}}, {{invite}}, {{prefix}} (all from config) and {{playercount}} (current connected players)
*/
const locale = {
    checkingWhitelist: "Hi {{name}}, We're Checking your whitelist status..", // Globals + {{name}}
    discordNotOpen: "You must have discord open before starting FiveM (Restart both if problem persists)", // Globals
    fatalError: "Something went wrong fetching your whitelist status, please try again in a bit or contact support in the discord if problem persists.", // Globals
    notInDiscordServer: "You are not in the {{servername}} Discord, please join here: {{invite}}", // Globals
    notWhitelisted: "You do not have the {{servername}} discord role required to join this server, are you whitelisted?", // Globals
    kickedWithoutReason: "You've been kicked by staff.", // Globals
    announcement: "ANNOUNCEMENT",
    directMessage: "STAFF",
}

module.exports = locale;