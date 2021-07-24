/* de - German Translation by Anonymous
 Translation strings used by the bot
 Strings wrapped in {{ }} will be auto-replaced with updated values
Globals: {{servername}}, {{invite}}, {{prefix}} (all from config) and {{playercount}} (current connected players)
*/
const locale = {
    // FiveM replies
    checkingWhitelist: "Hi {{name}}, wir überprüfen deinen Whitelist status..", // Globals + {{name}}
    discordNotOpen: "Du musst Discord offen haben, bevor du FiveM startest..(Starte beide neu wenn ein Problem auftritt)", // Globals
    fatalError: "Beim Abrufen Ihres Whitelist-Status ist ein Fehler aufgetreten. Bitte versuchen Sie es in Kürze erneut oder kontaktieren Sie den Support im Discord, wenn das Problem weiterhin besteht.", // Globals
    notInDiscordServer: "Du bist nicht in dem {{servername}} Discord, tritt hier bei: {{invite}}", // Globals
    notWhitelisted: "Du hast nicht die {{servername}} Discord-Rolle, die benötigt wird um dem Server beizutreten, bist du auf der Whitelist?", // Globals
    kickedWithoutReason: "Du wurdest vom Team gekickt.", // Globals
    announcement: "ANNOUNCEMENT",
    directMessage: "STAFF",

    // Commands (lowercase only!) - These are the commands you'd type to call these functions
    // NONE OF THESE SHOULD MATCH OR THINGS WILL BREAK
    cmdPing: "ping",
    cmdHelp: "help",
    cmdOnline: "online",
    cmdAnnounce: "announce",
    cmdAnnounceAlias: "a",
    cmdKick: "kick",
    cmdKickAlias: "k",
    cmdKickall: "kickall",
    cmdPlayers: "players",
    cmdPlayersAlias: "p",
    cmdInfo: "info",
    cmdInfoAlias: "i",
    cmdDm: "directmessage",
    cmdDmAlias: "dm",

    // Command replies
    commandFailed: "Beim Ausführen dieses Befehls ist ein Fehler aufgetreten.",
    commandNotFound: "Dies ist kein gültiger Befehl.",
    invalidIdProvided: "Diese ID scheint ungültig zu sein.",
    noIdProvided: "Du musst die ID eines Spielers angeben.",
    nobodyOnline: "Niemand ist online.",
    oneOnline: "Es ist 1 Person online.",
    numberOnline: "Es sind {{playercount}} Personen online.", // Globals
    allPlayersKicked: "Alle {{previousOnlineCount}} Spieler wurden gekickt.", // {{previousOnlineCount}}
    playersHeader: "Spieler ({{playercount}})", // Globals
    provideMessageError: "Bitte geben Sie eine Nachricht ein",
    pong: "Pong!",

    // Help replies
    helpPing: "Checke den bot status",
    helpHelp: "Bekomme diese Nachricht",
    helpOnline: "Bekomme die Anzahl der Personen die Online sind",
    helpAnnounce: "Sende in city announcement",
    helpKick: "Kicke Benutzer in city",
    helpKickall: "Kicke alle in city",
    helpPlayers: "Bekomme eine Liste der Spieler in city",
    helpInfo: "Bekomme Informationen über einen Spieler",
    helpDm: "Send a direct message to a player",

    commands: "Commands",
    staff: "{{servername}} Team Mitglieder", // Globals
    helpTypeMessage: "msg",
    helpTypeID: "id",
    helpTypeReason: "Grund",
    helpTypeCommand: "command",

}

module.exports = locale;