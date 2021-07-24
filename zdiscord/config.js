/*
    zdiscord - by zfbx ♥ - https://github.com/zfbx/zdiscord - License: MIT Open Source
    Setup and Help guide on the github page ^^^^^^^^^^^^^^^
*/

const config = {
    // Discord bot token to connect to the bot
    // Get token from https://discord.com/developers/applications (create app > bot > create bot > copy token) [don't forget to invite the bot to your server]
    token: GetConvar("zdiscordtoken", "CHANGE"),

    // The prefix needed for a message to be recognized as a command ( ie: !help )
    prefix: GetConvar("zdiscordprefix", "!"),

    // Locale to use for translations from locales folder (Default "en" English)
    lang: GetConvar("zdiscordlang", "en"),

    // This name is used throughout the locale to autofill blanks to refer to your server
    serverName: GetConvar("zdiscordservername", "My FiveM Server"),

    // Permanent Invite link for your discord server - Used by locale to autofill where people need to go to join.
    discordInvite: GetConvar("zdiscordinvite", "https://discord.gg/fivem"),

    // Whether to actually check whitelist status, turning this to false will let everyone in
    enableWhitelist: GetConvar("zdiscordenablewhitelist", true),

    // Whether to run commands or ignore all
    enableCommands: GetConvar("zdiscordenablecommands", true),

    // Whether to update bot status
    enableStatus: GetConvar("zdiscordenablestatus", true),

    // Color of the embed replies on discord for help and such (defaults purple #663A82)
    // This needs to be entered in hex form (#ff00ff -> 0xff00ff) without quotes around it
    embedColor: 0x663A82,

    // Your discord server ID [See above for help]
    guildid: GetConvar("zdiscordguildid", "000000000000000000"), // My Cool Server ID

    // List of staff / admin role IDs (comma seperated) that you want to be able to use mod commands [See above for help]
    staffRoles: GetConvar("zdiscordstaffroles", `000000000000000000, 000000000000000000`),

    // List of role IDs (comma seperated) that will be able to join the server
    whitelistRoles: GetConvar("zdiscordwhitelistroles", `000000000000000000, 000000000000000000`),

    // The bot status message will randomly select one of these statuses every 30 seconds
    // {{playercount}} will automatically be replaced with the current number of users online
    // {{servername}} will be replaced the serverName above
    // {{invite}} will be replaced with the invite above
    // {{prefix}} will be replaced with the prefix currenting being used from above
    statusMessages: [
        "{{prefix}}help",
        "{{playercount}} online",
    ],
}