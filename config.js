/*
    zdiscord - by Tony/zfbx - https://github.com/zfbx/zdiscord - License: GPLv3
    Docs for this file available at https://zfbx.github.io/zdiscord/config or in docs/config.md
*/


// ESSENTIALS
const DiscordBotToken = "CHANGE";
const DiscordGuildId = "000000000000000000";
const LanguageLocaleCode = "en";

// PUBLIC VALUES
const YourFiveMServerName = "My FiveM Server";
const DiscordInviteLink = "https://discord.gg/fivem";
const YourFiveMServerIP = "127.0.0.1";

// WHITELISTING / ALLOWLISTING
const EnableWhitelistChecking = "true";
const DiscordWhitelistRoleIds = "000000000000000000, 000000000000000000";

// SLASH COMMANDS / DISCORD PERMISSIONS
const EnableDiscordSlashCommands = "true";
const DiscordModRoleId = "000000000000000000";
const DiscordAdminRoleId = "000000000000000000";
const DiscordGodRoleId = "000000000000000000";

// DISCORD BOT STATUS
const EnableBotStatusMessages = "true";
const BotStatusMessages = [
    "{servername}",
    "{playercount} online",
];

// ACE PERMISSIONS
const EnableAutoAcePermissions = "false";
const AutoAcePermissions = {
    "group.god": DiscordGodRoleId,
    "group.admin": DiscordAdminRoleId,
    "group.mod": DiscordModRoleId,
    // "example": "000000000000000000",
    // "example2": [ "000000000000000000", "000000000000000000"],
};

// OTHER
const SaveScreenshotsToServer = "false";

// FUTURE (features potentially not yet released)
const EnableConnectingQueue = "false";
const ConnectingQueuePriorities = {
    1: DiscordGodRoleId,
    2: DiscordAdminRoleId,
    3: DiscordModRoleId,
    // 10: "000000000000000000",
    // 20: [ "000000000000000000", "000000000000000000"],
};
const DiscordStaffChannelId = "000000000000000000";
const EnableUserPresenceUpdates = "false";
const LoggingWebhooks = {
    "example": "",
};


/** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !! DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

module.exports = {
    token: GetConvar("discord_token", DiscordBotToken),
    guildid: GetConvar("discord_guild_id", DiscordGuildId),
    lang: GetConvar("discord_lang", LanguageLocaleCode),
    serverName: GetConvar("discord_server_name", YourFiveMServerName),
    discordInvite: GetConvar("discord_invite", DiscordInviteLink),
    serverIp: GetConvar("discord_server_ip", YourFiveMServerIP),
    enableWhitelist: getConBool("discord_enable_whitelist", EnableWhitelistChecking),
    whitelistRoles: getConList("discord_whitelist_roles", DiscordWhitelistRoleIds),
    enableCommands: getConBool("discord_enable_commands", EnableDiscordSlashCommands),
    modRole: GetConvar("discord_mod_role", DiscordModRoleId),
    adminRole: GetConvar("discord_admin_role", DiscordAdminRoleId),
    godRole: GetConvar("discord_god_role", DiscordGodRoleId),
    enableStatus: getConBool("discord_enable_status", EnableBotStatusMessages),
    statusMessages: BotStatusMessages,
    enableaceperms: getConBool("discord_enable_ace_perms", EnableAutoAcePermissions),
    aceperms: AutoAcePermissions,
    saveScreenshots: getConBool("discord_save_screenshots", SaveScreenshotsToServer),
    enableQueue: getConBool("discord_enable_connecting_queue", EnableConnectingQueue),
    queuePrios: ConnectingQueuePriorities,
    staffChannel: GetConvar("discord_staff_channel_id", DiscordStaffChannelId),
    enableUserPresence: getConBool("discord_enable_user_presence", EnableUserPresenceUpdates),
    logWebhooks: LoggingWebhooks,
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
 * @param {string} con - string of comma separated values
 * @param {string|Array} def - string of comma separated values
 * @returns {object} - array of discord ids */
function getConList(con, def) {
    const ret = GetConvar(con, def);
    if (typeof ret == "string") return ret.replace(/[^0-9,]/g, "").replace(/(,$)/g, "").split(",");
    if (Array.isArray(ret)) return ret;
    if (!ret) return [];
}
