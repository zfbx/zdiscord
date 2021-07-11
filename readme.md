# zdiscord
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
- Supports QBCore!

## Support

Before we get into the setup I just want to say, I've built and polished this resource from the ground up for free and open sourced it for you. If you enjoy it and would like to send a thanks I have a [ko-fi](https://ko-fi.com/zfbx8), [Paypal](https://paypal.me/zfbx) and I even have a [Patreon](https://www.patreon.com/zfbx)! Any and all support is greatly appreciated but in no way manditory, all my resources will be free and open source :)


## How to use

All the config options for this module are to be set inside your server .cfg file

1. Copy the inner `zdiscord` directory into your fiveM resources directory
2. Add `ensure zdiscord` (or whatever you renamed it to) to your server's .cfg
3. Adjust the `config.js` variables to how you'd like them.


## Languages

- en - English - By zfbx
- de - Deutsch / German - By Anonymous


## FAQ

- How do I get a Discord bot / get it in my Discord server?

    1. While logged in to the Discord website go to [developers/applications](https://discord.com/developers/applications)

    2. Click **New Application** and give your bot a name.

    3. On the following page click **Bot** then **Add Bot** > *(Yes, do it)*

    4. Give it a picture if you like then toggle the `Presense Intent` and `Server Members Intent` to **on** and **Save Changes**

    5. Add the bot to your server by taking the application ID (The number in the url *or* from the **General Information** Tab) and replace "APPID" with it in the following URL: `https://discord.com/oauth2/authorize?client_id=APPID&scope=bot&permissions=8` Follow the instructions from the url to finish.


- How do I get a "token"?

    A "token" or Discord bot token is available on your **Bot** page of your application from [developers/applications](https://discord.com/developers/applications). Just under the bot's name press **Copy** and paste it into the config. *NOTE: Never share your bot's token, it's basically a password for your bot and with it people get full access to everything your bot has access to.*


- How do I get my discord server ID, channel ID or Role IDs?

    I could write out a long tutorial on this but discord beat me to it: [Discord IDs](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)


- Console is giving an errror of "Disallowed intent specified"

    Go back to step 4 in the first FAQ to solve that error as the bot needs `Presense Intent` and `Server Members Intent`
    
- Console is giving `Could not find dependency yarn for resource zdiscord.`

    This resource requires FiveM's yarn module from [cfx-server-data](https://github.com/citizenfx/cfx-server-data) (resources/[system]/[builders]/yarn) so either have those resource in your resource folder or just put the yarn one in your resources and zdiscord will enable it for itself so you don't need to include it in your cfg

- Bot is onlive but not responding too commands

    Did you set the guildid to your server's id in the config.js? it will only reply to commands from it's trusted server

- My QBCore/ESX commands aren't loading

    For support for QB or ESX you have to either have the resource load after the core OR uncomment the dependency line from fxmanifest.lua

## Change log

**1.0.0 - First unsupported build**
    A lot.
    
**2.0.0 - Github Release**
    - polished standalone
    - Added translation support
    
**3.0.0 - Modular commands!**
    - Commands are now loaded dynamically from the `/commands` folder
    - Help command now has sub commands `!help commandName`
    - New DM command
    - various Error checks and fixes

**3.1.0 - QBCore (potential ESX) support added**
    - Commands starting with `qb-` will load automatically if QBCore is detected.
    - Placeholders for `esx-` commands have been added.

## License

I'm releasing this under the **MIT License** asking only that you preserve my credit (zfbx) in whatever you do with it :)
