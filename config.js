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

/** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !! DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

module.exports = {
    token: GetConvar("discord_token", DiscordBotToken),
    lang: GetConvar("discord_lang", LanguageLocaleCode),
    serverName: GetConvar("discord_server_name", YourFiveMServerName),
    discordInvite: GetConvar("discord_invite", DiscordInviteLink),
    enableWhitelist: GetConvar("discord_enable_whitelist", EnableWhitelistChecking),
    enableCommands: GetConvar("discord_enable_commands", EnableDiscordSlashCommands),
    enableStatus: GetConvar("discord_enable_status", EnableBotStatusMessages),
    guildid: GetConvar("discord_guild_id", DiscordGuildId),
    modRole: GetConvar("discord_mod_role", DiscordModRoleId),
    adminRole: GetConvar("discord_admin_role", DiscordAdminRoleId),
    godRole: GetConvar("discord_god_role", DiscordGodRoleId),
    whitelistRoles: GetConvar("discord_whitelist_roles", DiscordWhitelistRoleIds),
    statusMessages: BotStatusMessages,
    enableaceperms: GetConvar("discord_enable_ace_perms", EnableAutoAcePermissions),
    aceperms: AutoAcePermissions,
};
