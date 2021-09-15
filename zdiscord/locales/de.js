/* de - German Translation by Anonymous
 Translation strings used by the bot
 Strings wrapped in {{ }} will be auto-replaced with updated values
Globals: {{servername}}, {{invite}}, {{prefix}} (all from config) and {{playercount}} (current connected players)
*/
const locale = {
    checkingWhitelist: "Hi {{name}}, wir überprüfen deinen Whitelist status..", // Globals + {{name}}
    discordNotOpen: "Du musst Discord offen haben, bevor du FiveM startest..(Starte beide neu wenn ein Problem auftritt)", // Globals
    fatalError: "Beim Abrufen Ihres Whitelist-Status ist ein Fehler aufgetreten. Bitte versuchen Sie es in Kürze erneut oder kontaktieren Sie den Support im Discord, wenn das Problem weiterhin besteht.", // Globals
    notInDiscordServer: "Du bist nicht in dem {{servername}} Discord, tritt hier bei: {{invite}}", // Globals
    notWhitelisted: "Du hast nicht die {{servername}} Discord-Rolle, die benötigt wird um dem Server beizutreten, bist du auf der Whitelist?", // Globals
    kickedWithoutReason: "Du wurdest vom Team gekickt.", // Globals
    announcement: "ANNOUNCEMENT",
    directMessage: "STAFF",
}

module.exports = locale;