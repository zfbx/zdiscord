# zdiscord (v7)

**Note: zdiscord v7 and high REQUIRE FiveM artifacts build 4890 or newer**<br>
zdiscord v5-6 REQUIRES artifacts 4800 or newer.<br>
Older artifacts will require use of the [v4 eris branch](https://github.com/zfbx/zdiscord/tree/eris) instead.

[Setup](#setup) | [Donate](#donate) | [FAQ](https://zfbx.github.io/zdiscord/faq) | [Support](#support) | [Docs](https://zfbx.github.io/zdiscord)

## About

A Discord bot that runs in FiveM for the purpose of whitelisting, moderation and utilities using [discord.js](https://discord.js.org/). The goal is for this this resource to be easy to setup and expand upon while giving your staff team an easy method of support and moderation of players in game without actually launching FiveM. This resource also heavily support [QBCore](https://github.com/qbcore-framework) in most of it's functionality but it's not required



## Features

- Standalone FiveM resource (no external hosting required)
- Uses [Slash commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) with help/suggestions
- Moderation tools (kick, ban, inspect, etc)
- [QBCore](https://github.com/qbcore-framework) [commands](https://zfbx.github.io/zdiscord/commands) included!
- Easy to expand and customize with modular [commands](https://zfbx.github.io/zdiscord/commands#add-commands)!
- Can be configured with [convars](https://zfbx.github.io/zdiscord/config)
- Automatic Ace Permission granting system
- [Helpful exports](https://zfbx.github.io/zdiscord/exports)
- bi-directional staff chat
- AND MORE!

## Setup

### Requirements
- FiveM artifacts build 4890 or higher
- [cfx-server-data](https://github.com/citizenfx/cfx-server-data) in your resources (yarn (`[system]/[builders]/yarn/`) at least)
- Optional: [screenshot-basic](https://github.com/citizenfx/screenshot-basic) if you want the /screenshot command to work

### Steps
1. Get a bot application if you haven't already [Guide Here](https://discordjs.guide/preparations/setting-up-a-bot-application.html)

2. **IMPORTANT: Enable BOTH intents** on the **bot** page of step 1 ([Picture example](https://zfbx.github.io/zdiscord/images/intents.png)) *If you don't do this.. your bot will NOT work.

3. Add the bot to your server - To do this copy the following link and replace `YOUR-BOT-ID` with your bots ID then follow the invite process to your discord from the link `https://discord.com/api/oauth2/authorize?client_id=YOUR-BOT-ID&permissions=8&scope=bot%20applications.commands`<br> **NOTE: If the bot is already in your server you might need to run the link above again anyways to make sure it can get the needed slash command scope (unrelated to permissions)**

4. Copy the resource into your fiveM resources directory and make sure it's named `zdiscord` (not zdiscord-djs, zdiscord-eris or anything)

5. Double check that you have the [cfx-server-data](https://github.com/citizenfx/cfx-server-data) resource in your resources (or yarn `[system]/[builders]/yarn/` at the very least)

6. In your `server.cfg` do the following:<br>
    6a. Add `ensure zdiscord` (after qb-core and/or [convars](https://zfbx.github.io/zdiscord/convars) you may have)<br>
    6b. Add the following anywhere in your .cfg:
    ```
    add_ace resource.zdiscord command allow
    add_ace group.zdiscordstaff zdiscord.staffchat allow
    ```

7. Adjust the `config.js` variables to how you'd like them. (Optionally use [Convars](https://zfbx.github.io/zdiscord/convars))

8. **If you missed step 2, go back and do it.. or else IT WONT WORK!**

9. If you run into any errors check out the [FAQ](https://zfbx.github.io/zdiscord/faq) where a lot of common problems are listed and answered


## Support

*Please note we only support the official, free and open source, [QBCore](https://github.com/qbcore-framework) framework and not old "qbus" or paid copies of QBCore*

If you have any errors or problems please first check:
- [Frequently Asked Questions](https://zfbx.github.io/zdiscord/faq)
- [Github Issues](https://github.com/zfbx/zdiscord/issues?q=)

If neither of those solve your problem [Open a ticket](https://github.com/zfbx/zdiscord/issues/new/choose) or message me on [Discord](https://discord.gg/M6neBU3cvP) (My name is Tony#1275 on discord)


## Donate

I've built and polished this resource from the ground up for free and open sourced it for everybody. If you use it, enjoy it, get support from me or just want to support the project please consider sending a tip or donation through any of the following platforms:

[![Donate on PayPal](https://img.shields.io/badge/Donate-PayPal-%2300457C?style=for-the-badge&logo=paypal)](https://paypal.me/zfbx)
[![Sub on Patreon](https://img.shields.io/badge/Support-Patreon-%23FF424D?style=for-the-badge&logo=patreon)](https://www.patreon.com/zfbx)
[![Buy Me a Pizza](https://img.shields.io/badge/Pizza-BuyMeACoffee-%23FFDD00?style=for-the-badge&logo=buymeacoffee)](https://www.buymeacoffee.com/zfbx)

Any contribution is greatly appreciated but you're amazing regardless ♥

## License


**Note: as of version 7.0.0 zdiscord, it is licensed under CC-BY-NC-SA-4.0**

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/zfbx/zdiscord">zdiscord</a> © 2021 by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/zfbx">zfbx</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution-NonCommercial-ShareAlike 4.0 International<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a></p>

**TL;DR**
- BY: Credit must be given to me, the creator. (Tony/zfbx)
- NC: Only noncommercial use of your work is permitted. (You can use in your own FiveM server which may make money itself BUT can't in any way sell zdiscord itself in any way for any commercial advantage or monetary compensation)
- SA: Adaptations must be shared under the same terms.
