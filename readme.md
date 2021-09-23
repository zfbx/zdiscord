# zdiscord

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=opensourceinitiative)](https://opensource.org/licenses/MIT)
[![Donate on PayPal](https://img.shields.io/badge/Donate-PayPal-%2300457C?style=for-the-badge&logo=paypal)](https://paypal.me/zfbx)
[![Sub on Patreon](https://img.shields.io/badge/Support-Patreon-%23FF424D?style=for-the-badge&logo=patreon)](https://www.patreon.com/zfbx)
[![Buy Me a Pizza](https://img.shields.io/badge/Pizza-BuyMeACoffee-%23FFDD00?style=for-the-badge&logo=buymeacoffee)](https://www.buymeacoffee.com/zfbx)

A Discord whitelist (allowlist) and moderation tool

I've not seen many decent whitelist systems out there that connect with discord and the good ones seem to use oauth but I wanted more.. specifically I wanted to be able to have a full blown bot built in and be able to have bi-directional communication between the server and discord, so here it is!

## Features

- Completely standalone, no dependencies or need for running external applications
- Commands to see online users, info, etc
- Moderation commands to kick someone or everyone
- Send server wide announcements from a command in discord
- Easy to translate and customize with locales!
- Built in `!help` command for discord (prefix may be different if you changed it in your config)
- Easy to expand and customize with modular commands!
- Supports QBCore! Included: `!revive, !jail, !giveitem, !kill, !setjob` and more!

## Support

Before we get into the setup I just want to say, I've built and polished this resource from the ground up for free and open sourced it for you. If you enjoy it and would like to send a thanks I have a [ko-fi](https://ko-fi.com/zfbx8), [Paypal](https://paypal.me/zfbx) and I even have a [Patreon](https://www.patreon.com/zfbx)! Any and all support is greatly appreciated but in no way manditory, all my resources will be free and open source :)


## How to use

All the config options for this module are to be set inside your server .cfg file

1. Copy the inner `zdiscord` directory into your fiveM resources directory
2. Add `ensure zdiscord` (or whatever you renamed it to) to your server's .cfg
3. Adjust the `config.js` variables to how you'd like them.

[More detailed Setup Guide](https://github.com/zfbx/zdiscord/wiki/Setup)

## Languages

- en - English - By zfbx
- de - Deutsch / German - By Anonymous
- pl - Polish - By insaneArian
- vn - Vietnamese - By xenfovn
- ar - Arabic - By RadhwaneDZ


## FAQ

Moved to [FAQ Wiki Page](https://github.com/zfbx/zdiscord/wiki/FAQ)

## Change log

**4.0.0 - permissions! bye yarn!.. and esx.**

- Dependencies are now embeded libs making the project slimer on install and not requiring yarn.
- ESX support was dropped, it wasn't getting used and I don't have an esx server for testing.
- translations were slimmed down to fivem messages only.
- `add/removepermissions` merged into `perms` command
-  Convars changed to be more readable using standard FiveM format with `_` spacing

**3.2.0 - Convars everywhere!**

- Convar hooks added for nearly every config option [Read More](https://github.com/zfbx/zdiscord/wiki/Convars)
- Slimmed up locales by removing console log messages
- Added {{prefix}} to the global variables
- New Add/Remove permissions command for QBCore


**3.1.0 - QBCore (potential ESX) support added**

- Commands starting with `qb-` will load automatically if QBCore is detected.
- Placeholders for `esx-` commands have been added.
    

**3.0.0 - Modular commands!**

- Commands are now loaded dynamically from the `/commands` folder
- Help command now has sub commands `!help commandName`
- New DM command
- various Error checks and fixes
    

**2.0.0 - Github Release**

- polished standalone
- Added translation support


**1.0.0 - First unsupported build**

- A lot.



## License

I'm releasing this under the **MIT License** asking only that you preserve my credit (zfbx) in whatever you do with it :)
