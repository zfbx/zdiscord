# zdiscord (v5)

**Note: This version of zdiscord REQUIRES FiveM artifacts 4800 or newer, if you're running an earlier version you might want to checkout the [v4 eris branch](https://github.com/zfbx/zdiscord/tree/eris) instead**

[Setup](#setup) | [Donate](#donate) | [License](#license) | [FAQ](https://github.com/zfbx/zdiscord/wiki/FAQ) | [Support](#support) | [Docs](#docs)

## About

A Discord bot that runs in FiveM for the purpose of whitelisting, moderation and utilties using [discord.js](https://discord.js.org/). The goal is for this this resource to be easy to setup and expand upon while giving your staff team an easy method of support and moderation of players in game without actually launching FiveM. This resource also heavily support [QBCore](https://github.com/qbcore-framework) in most of it's functionality but it's not required



## Features

- Standalone FiveM resource (no external hosting required)
- Uses [Slash commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) with help/suggestions
- Moderation tools (kick, ban, inspect, etc)
- [QBCore](https://github.com/qbcore-framework) [commands](./docs/commands.md) included!
- Easy to expand and customize with modular [commands](./docs/commands.md#add-commands)!
- Can be configured with [convars](./docs/convars.md)
- Automatic Ace Permission granting system
- [Helpful exports](./docs/exports.md)

## Setup

### Requirements
- FiveM artifacts build 4800 or higher
- [cfx-server-data](https://github.com/citizenfx/cfx-server-data) in your resources (yarn (`[system]/[builders]/yarn/`) at least)
- Optional: [screenshot-basic](https://github.com/citizenfx/screenshot-basic) if you want the /screenshot command to work

### Steps
1. Get a bot application if you haven't already [Guide Here](https://discordjs.guide/preparations/setting-up-a-bot-application.html)

2. **IMPORTANT: Enable BOTH intents** on the **bot** page of step 1 ([Picture example](https://github.com/zfbx/zdiscord/wiki/FAQ#intents)) *If you don't do this.. your bot will NOT work.

3. Add the bot to your server - To do this copy the following link and replace `YOUR-BOT-ID` with your bots ID then follow the invite process to your discord from the link
`https://discord.com/api/oauth2/authorize?client_id=YOUR-BOT-ID&permissions=8&scope=bot%20applications.commands`<br>
**NOTE: If the bot is already in your server you might need to run the link above again anyways to make sure it can get the needed slash command scope (unrelated to permissions)**

4. Copy the resource into your fiveM resources directory and make sure it's named `zdiscord` (no -main or anything)

5. Double check that you have the [cfx-server-data](https://github.com/citizenfx/cfx-server-data) resource in your resources (or yarn `[system]/[builders]/yarn/` at the very least)

6. In your `server.cfg` do the following:<br>
    6a. Add `ensure zdiscord` (after qb-core and/or [convars](./docs/convars.md) you may have)<br>
    6b. Add `add_ace resource.zdiscord command allow` anywhere in the .cfg file

7. Adjust the `config.js` variables to how you'd like them. (Optionally use [Convars](./docs/convars.md))

8. **If you missed step 2, go back and do it.. or else IT WONT WORK!**

## Docs

Documentation is fairly slim for zdiscord but a lot of concepts are covered in the [docs folder](./docs/)
- [Commands](./docs/commands.md)
- [Exports](./docs/exports.md)
- [Convars](./docs/convars.md)

## Languages

- en - English - By zfbx
- de - Deutsch / German - By Anonymous
- pl - Polish - By insaneArian
- vn - Vietnamese - By xenfovn
- ar - Arabic - By RadhwaneDZ

## Support

*Please note we only support the official, free and open source, [QBCore](https://github.com/qbcore-framework) framework and not old "qbus" or paid copies of QBCore*

If you have any errors or problems please first check:
- [Frequently Asked Questions](https://github.com/zfbx/zdiscord/wiki)
- [Github Issues](https://github.com/zfbx/zdiscord/issues?q=)

If neither of those solve your problem [Open a ticket](https://github.com/zfbx/zdiscord/issues/new/choose) or message me on [Discord](https://discord.gg/M6neBU3cvP) (My name is Tony#1275 on discord)


## Donate

I've built and polished this resource from the ground up for free and open sourced it for everybody. If you use it, enjoy it, get support from me or just want to support the project please consider sending a tip or donation through any of the following platforms:

[![Donate on PayPal](https://img.shields.io/badge/Donate-PayPal-%2300457C?style=for-the-badge&logo=paypal)](https://paypal.me/zfbx)
[![Sub on Patreon](https://img.shields.io/badge/Support-Patreon-%23FF424D?style=for-the-badge&logo=patreon)](https://www.patreon.com/zfbx)
[![Buy Me a Pizza](https://img.shields.io/badge/Pizza-BuyMeACoffee-%23FFDD00?style=for-the-badge&logo=buymeacoffee)](https://www.buymeacoffee.com/zfbx)

Any contribution is greatly appreciated but you're amazing regardless ♥

## License

**Note: as of version 5.0.0 zdiscord, it is licensed under GPL version 3**

    Copyright (C) 2021 Tony/zfbx <https://github.com/zfbx>

    This program (zdiscord) is free software: you can redistribute it
    and/or modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
