# Convars
If you don't want to set config options within `config.js` you can actually set them through the server.cfg as **convars!** You can place any or all of the following values in your server.cfg as long as they're placed above/before zdiscord is ensured or it wont be able to call them. For full description of what each of these values are read the comments in `config.js`

## Available convars (+default values):**

`set discord_token "CHANGE"` (Required if not set config)

`set discord_lang "en"` (en, ar, de, pl, tr, vn | if it's in /locales you can use it as a value here)

`set discord_server_name "My FiveM Server"`

`set discord_invite "https://discord.gg/fivem"`

`set discord_enable_whitelist true` (accepts strings or numbers)

`set discord_enable_commands true` (accepts strings or numbers)

`set discord_enable_status true` (accepts strings or numbers)

`set discord_guild_id "000000000000000000"`

`set discord_mod_role "000000000000000000"`

`set discord_admin_role "000000000000000000"`

`set discord_god_role "000000000000000000"`

`set discord_whitelist_roles "000000000000000000, 000000000000000000"` (accepts comma separated string of ids)

