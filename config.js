/*
    zdiscord - by Tony/zfbx - https://github.com/zfbx/zdiscord - License: GPLv3
    Setup and Help guide on the github page ^^^^^^^^^^^^^^^
    https://discord.com/api/oauth2/authorize?client_id=BOTUSERID&permissions=8&scope=bot%20applications.commands
*/

// Discord bot token to connect to the bot
const DiscordBotToken = "CHANGE";

// Locale translations (has to exist in locales folder) (Default "en" English)
const LanguageLocaleCode = "en";

// This name is used throughout the locale to autofill blanks to refer to your server
const YourFiveMServerName = "My FiveM Server";

// Permanent Invite link for your discord server - Used by locale to autofill where people need to go to join.
const DiscordInviteLink = "https://discord.gg/fivem";

// Whether to actually check whitelist status, turning this to false will let everyone in
const EnableWhitelistChecking = "true";

// Whether to run commands or ignore all
const EnableDiscordSlashCommands = "true";

// Your discord guild (server) ID [See above for help]
const DiscordGuildId = "000000000000000000";

// Discord role id for mod commands
const DiscordModRoleId = "000000000000000000";

// Discord role id for admin commands (inherits mod permissions)
const DiscordAdminRoleId = "000000000000000000";

// Discord role id for god commands (inherits mod and admin permissions)
const DiscordGodRoleId = "000000000000000000";

// List of role IDs (comma seperated) that will be able to join the server
const DiscordWhitelistRoleIds = "000000000000000000, 000000000000000000";

// Whether to update bot status
const EnableBotStatusMessages = "true";

// The bot status message will randomly select one of these statuses every 30 seconds
// {{playercount}} will automatically be replaced with the current number of users online
// {{servername}} will be replaced the serverName above
// {{invite}} will be replaced with the invite above
const BotStatusMessages = [
    "{{servername}}",
    "{{playercount}} online",
];

// Enable the AutoAcePermissions function config below
const EnableAutoAcePermissions = "false";

// Automatically assign Ace permissions to set roles on login
// "AcePermission(no spaces)": "DiscordRoleId",
const AutoAcePermissions = {
    "group.god": DiscordGodRoleId,
    "group.admin": DiscordAdminRoleId,
    "group.mod": DiscordModRoleId,
    // "example": "000000000000000000",
    // "example2": [ "000000000000000000", "000000000000000000"],
};

/* If true, using the /screenshot command will save the files taken to a folder in zdiscord.
   * If you use this, please keep in mind screenshots will take up more space over time
   so make sure to move or delete them on a regular basis if the command gets used regularly. */
const saveScreenshotsToServer = "false";


/** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !! DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

module.exports = {
    token: GetConvar("discord_token", DiscordBotToken),
    lang: GetConvar("discord_lang", LanguageLocaleCode),
    serverName: GetConvar("discord_server_name", YourFiveMServerName),
    discordInvite: GetConvar("discord_invite", DiscordInviteLink),
    enableWhitelist: getConBool("discord_enable_whitelist", EnableWhitelistChecking),
    enableCommands: getConBool("discord_enable_commands", EnableDiscordSlashCommands),
    enableStatus: getConBool("discord_enable_status", EnableBotStatusMessages),
    guildid: GetConvar("discord_guild_id", DiscordGuildId),
    modRole: GetConvar("discord_mod_role", DiscordModRoleId),
    adminRole: GetConvar("discord_admin_role", DiscordAdminRoleId),
    godRole: GetConvar("discord_god_role", DiscordGodRoleId),
    whitelistRoles: getConList("discord_whitelist_roles", DiscordWhitelistRoleIds),
    statusMessages: BotStatusMessages,
    enableaceperms: getConBool("discord_enable_ace_perms", EnableAutoAcePermissions),
    aceperms: AutoAcePermissions,
    saveScreenshots: getConBool("discord_save_screenshots", saveScreenshotsToServer),
};

/** Returns convar or default value fixed to a true/false boolean
 * @param {boolean|string|number} con - Convar name
 * @param {boolean|string|number} def - Default fallback value
 * @returns {boolean} - parsed bool */
function getConBool(con, def) {
    const ret = GetConvar(con, def);
    if (typeof ret == "boolean") return ret;
    if (typeof ret == "string") return ["true", "on", "yes", "y", "1"].includes(ret.toLocaleLowerCase().trim());
    if (typeof ret == "number") return ret > 0;
    return false;
}

/** returns array of items or default array provided
 * @param {string} con - string of comma seperated values
 * @param {string|Array} def - string of comma seperated values
 * @returns {object} - array of discord ids */
function getConList(con, def) {
    const ret = GetConvar(con, def);
    if (typeof ret == "string") return ret.replace(/[^0-9,]/g, "").replace(/(,$)/g, "").split(",");
    if (Array.isArray(ret)) return ret;
    if (!ret) return [];
}
