/* en - English Translation by zfbx ♥
 Translation strings used by the bot
 Strings wrapped in {{ }} will be auto-replaced with updated values
 Globals: {{servername}}, {{invite}}, {{prefix}} (all from config) and {{playercount}} (current connected players)
*/
const locale = {
    // FiveM replies
    checkingWhitelist: "Hi {{name}}, We're Checking your whitelist status..", // Globals + {{name}}
    discordNotOpen: "You must have discord open before starting FiveM (Restart both if problem persists)", // Globals
    fatalError: "Something went wrong fetching your whitelist status, please try again in a bit or contact support in the discord if problem persists.", // Globals
    notInDiscordServer: "You are not in the {{servername}} Discord, please join here: {{invite}}", // Globals
    notWhitelisted: "You do not have the {{servername}} discord role required to join this server, are you whitelisted?", // Globals
    kickedWithoutReason: "You've been kicked by staff.", // Globals
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
    commandFailed: "Something went wrong trying to run this command.",
    commandNotFound: "This is not a valid command.",
    invalidIdProvided: "This ID seems invalid.",
    noIdProvided: "You must provide an ID of a player.",
    nobodyOnline: "Nobody is online.",
    oneOnline: "There is 1 person online.",
    numberOnline: "There are {{playercount}} people online.", // Globals
    allPlayersKicked: "All {{previousOnlineCount}} player(s) have kicked.", // {{previousOnlineCount}}
    playersHeader: "Players ({{playercount}})", // Globals
    provideMessageError: "Please provide a message",
    pong: "Pong!",

    // Help replies
    helpPing: "Check bot status",
    helpHelp: "Get this message",
    helpOnline: "Get number of people online",
    helpAnnounce: "Send in city announcement",
    helpKick: "Kicks user in city",
    helpKickall: "Kicks everyone in city",
    helpPlayers: "Get list of players in the city",
    helpInfo: "Get information on a player",
    helpDm: "Send a direct message to a player",

    commands: "Commands",
    staff: "{{servername}} Staff", // Globals
    helpTypeMessage: "msg",
    helpTypeID: "id",
    helpTypeReason: "reason",
    helpTypeCommand: "command",
}

module.exports = locale;