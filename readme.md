# zdiscord
A Discord whitelist (allowlist) and moderation tool

I've not seen many decent whitelist systems out there that connect with discord and the good ones seem to use oauth but I wanted more.. specifically I wanted to be able to have a full blown bot built in and be able to have bi-directional communication between the server and discord, so here it is!

## Features

- Completely standalone, no dependencies or need for running external applications
- Commands to see online users, info, etc
- Moderation commands to kick someone or everyone
- Send server wide announcements from a command in discord
- Easy to translate and customize with locales!

## Support

Before we get into the setup I just want to say, I've built and polished this resource from the ground up for free and open sourced it for you. If you enjoy it and would like to send a thanks I have a [ko-fi](https://ko-fi.com/zfbx8), [Paypal](https://paypal.me/zfbx) and I even have a [Patreon](https://www.patreon.com/zfbx)! Any and all support is greatly appreciated but in no way manditory, all my resources will be free and open source :)


## How to use

All the config options for this module are to be set inside your server .cfg file

1. Copy the inner `zdiscord` directory into your fiveM resources directory
2. Add `ensure zdiscord` (or whatever you renamed it to) to your server's .cfg
3. Adjust the `config.js` variables to how you'd like them.


## Languages

- English (en) - By zfbx
- Deutsch/German (de) - By Anonymous


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


## License

I'm releasing this under the **MIT License** asking only that you preserve my credit (zfbx) in whatever you do with it :)