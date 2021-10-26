# Config

Not sure what a config value means? You're in the right place, here we'll go over every config option available for zdiscord and what it means and expects. **If you haven't already, please read the setup guide in the [read me](https://github.com/zfbx/zdiscord/blob/djs/readme.md#setup) first.**

**NOTE:** All config values use strings (wrapped in `" "`) for their values. This is done for convar support.

#### Convars
If you don't want to set config options within `config.js` you can set them through the server.cfg as [convars](https://docs.fivem.net/docs/scripting-reference/convars/#standard-convars). If a convar is listed under a config you can use it instead of setting the config as long as it's placed above/before zdiscord is started/ensured or it wont be able to use them. **To use these convars, add a line to your server.cfg near the top with `set convar_name "value"`. replace `convar_name` with the convar name you want to use.

---



## Essentials

### DiscordBotToken
**[ Convar: `discord_token`]**<br>
This is where you put your discord bot token generated from [Discord Applications](https://discord.com/developers/applications). It will look somewhat like `ZDkx5NjQxjExNMzDM1D2U0O4.v9g7Wa.DK700Xi2LeVOC2NUuABgPt0ZyWR`.
<br>**DO NOT** Share this token with anyone, it's a key to your bot and discord server which could be dangerous in the wrong hands.

### DiscordGuildId
**[ Convar: `discord_guild_id` ]**<br>
This is for your Discord Server id (Also called a Guild Id). You can get that by enabling developer mode in your discord client then right clicking your discord server icon and "copy id". This is an important value, the bot will only listen to events done within this server.

### LanguageLocaleCode
**[ Default: "en" | Convar: `discord_lang` ]**<br>
This determines which locale (translation) file is loaded from `/locales` so if the file that fits the language you want used is in that folder then use the 2 character name of the file. As of writing this ar, de, en, pl, tr and vn are available options.



## Public

### YourFiveMServerName
**[ Replicated | Convar: `discord_server_name` ]**<br>
This is what you want your FiveM server to be called, this value is used in various places as an auto-fill like bot status and commands as well as translations when people are connecting to your server.

### DiscordInviteLink
**[ Replicated | Convar: `discord_invite` ]**<br>
A link to your discord server that will be given to users on connection problems to the FiveM server, used for discord presence links and some command replies.

### YourFiveMServerIP
**[ Replicated | Convar: `discord_server_ip` ]**<br>



## Whitelisting / Allowlisting

### EnableWhitelistChecking
**[ Convar: `discord_enable_whitelist` ]**<br>
This setting determines whether the bot should check if someone is in the discord and if they have a preset role defined under [DiscordWhitelistRoleIds](#DiscordWhitelistRoleIds). Setting this to `"true"` wont let anyone into the server unless they:

1. Have Discord open.
2. Are in the Discord defined in [DiscordGuildId](#DiscordGuildId).
3. Have the whitelisted role in the discord

### DiscordWhitelistRoleIds
**[ Convar: `discord_whitelist_roles` ]**<br>
This is a comma seperated list (`"role1id, role2id, role3id"`) of role IDs that will be able to connect to the server if [EnableWhitelistChecking](#EnableWhitelistChecking) is set to "true". To get a role Id you enable developer mode in your discord client then either right click a role name from someone's popup profile or right click the role name in the role settings and "copy id".



## Slash commands / Discord permissions

### EnableDiscordSlashCommands
**[ Convar: `discord_enable_commands` ]**<br>
If this is set to `"true"` the bot will register all it's slash commands to the discord server and allow users with the correct roles to access them. if this is set to `"false"` all the commands will ignored and never registered.

### DiscordModRoleId
**[ Convar: `discord_mod_role` ]**<br>
This is a single discord role ID that will be permitted to use commands set to role `"mod"`. this can only be a single role unlike [DiscordWhitelistRoleIds](#DiscordWhitelistRoleIds). You can add other roles but you'll have to follow the [guide](https://zfbx.github.io/zdiscord/commands#add-permission-levels). You can get the role ID in the same way described under [DiscordWhitelistRoleIds](#DiscordWhitelistRoleIds)

### DiscordAdminRoleId
**[ Convar: `discord_admin_role` ]**<br>
This is a single discord role ID that will be permitted to use commands set to role `"admin"` OR `"mod"`. Otherwise refer to [DiscordModRoleId](#DiscordModRoleId)'s notes.

### DiscordGodRoleId
**[ Convar: `discord_god_role` ]**<br>
This is a single discord role ID that will be permitted to use **all** commands. Including `"admin"` and `"mod"`. Otherwise refer to [DiscordModRoleId](#DiscordModRoleId)'s notes.



## Discord bot cosmetics

### EnableBotStatusMessages
**[ Convar: `discord_enable_status` ]**<br>
If this is set to `"true"` the bot will pick a random message from the [BotStatusMessages](#BotStatusMessages) config and display it as it's status. (Example: "Playing FiveM")

### BotStatusMessages
The bot will pick a random message from this array every 30 seconds to set as it's status if [EnableBotStatusMessages](#EnableBotStatusMessages) is set to `"true"`. you must have at least 1 of these if enabled. You can use `{{playercount}}`, `{{servername}}` or `{{invite}}` inside the status messages and when they're shown they will replace those values with either the current number of players online, the server name set under [YourFiveMServerName](#YourFiveMServerName) or invite set under [DiscordInviteLink](#DiscordInviteLink).



## Ace Permissions

### EnableAutoAcePermissions
**[ Convar: `discord_enable_ace_perms` ]**<br>
If this is set to `"true"` it'll enable a system of granting users Ace Permissions based on their role configured under [AutoAcePermissions](#AutoAcePermissions).

**NOTE: This will only work if `add_ace resource.zdiscord command allow` is set in the server.cfg**

### AutoAcePermissions
If [EnableAutoAcePermissions](#EnableAutoAcePermissions) is set to `"true"` the configured ace permissions will be automatically given to users which have at least one of the matching roles. For example if you put `"group.police": "DiscordPoliceRoleID",` as one of the rows, if a user joined the server and had the `DiscordPoliceRoleID` in discord the bot will automatically set the `group.police` ace permission to them. On disconnect all ace permissions granted are removed.

By default the discord mod, admin and god roles are given `group.mod`, `group.admin` or `group.god` respectively.

Set a single role id with `"example": "000000000000000000",`. You can also have multiple discord roles checked for an Ace permission by using an array instead of a single roleid string like: `"example2": [ "000000000000000000", "000000000000000000"],`

**NOTE: This will only work if `add_ace resource.zdiscord command allow` is set in the server.cfg**



## Other

### saveScreenshotsToServer
**[ Convar: `discord_save_screenshots` ]**<br>
If you want discord `/screenshot`s to be saved locally to the server set this to `"true"` however if you just want the screenshots to be sent to discord when the command is used leave this as `"false"`. Please note if you change this to true, it's up to you to monitor your screenshots folder as images can be quite large and use a lot of space if they don't get cleaned up regularly.


---
## Potenatial future feature configs

These may or may not be in any way functional or non-existent entirely, they're only here to make upgrading in the future easier if and when I add them.

### EnableConnectingQueue (not released)
**[ Convar: `discord_enable_connecting_queue` ]**<br>

### ConnectingQueuePriorities (not released)

### DiscordStaffChannelId (not released)
**[ Convar: `discord_staff_channel_id` ]**<br>

### EnableUserPresenceUpdates (not released)
**[ Replicated | Convar: `discord_enable_user_presence` ]**<br>

### LoggingWebhooks (not released)
