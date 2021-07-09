/* en - English Translation by zfbx ♥
 Translation strings used by the bot
 Strings wrapped in {{ }} will be auto-replaced with updated values
 Globals: {{servername}}, {{invite}} (both from config) and {{playercount}} (current connected players)
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

    // Command replies
    invalidIdProvided: "This ID seems invalid.",
    noIdProvided: "You must provide an ID of a player.",
    nobodyOnline: "Nobody is online.",
    oneOnline: "There is 1 person online.",
    numberOnline: "There are {{playercount}} people online.", // Globals
    allPlayersKicked: "All {{previousOnlineCount}} player(s) have kicked.", // {{previousOnlineCount}}
    PlayersHeader: "Players ({{count}})", // Globals
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
    commands: "Commands",
    staff: "{{servername}} Staff", // Globals
    helpTypeMessage: "msg",
    helpTypeID: "id",
    helpTypeReason: "reason",

    // Console Errors
    consoleMissingToken: "This module requires a discord bot token to run. Check the config.lua",
    consoleLoggedIn: "Logged in on Discord as {{username}}!", // Globals, {{username}}
    consoleLogAnnouncement: "[{{sender}}] Announcement: {{msg}}", // {{sender}}, {{msg}}
    consoleLogKick: "[{{sender}}] Kicked {{id}}. Reason: {{msg}}", // {{sender}}, {{id}}, {{msg}}
    consoleLogKickAll: "[{{sender}}] Kicked EVERYONE. Reason: {{msg}}", // {{sender}}, {{msg}}
    consoleDiscordGuildErr: "Something went wrong fetching the Discord server for whitelist checking using guild id: {{guildid}}", // {{guildid}}
}

module.exports = locale;