# Frequently Asked Questions

Here's a list of common problems people have run into and how to solve them. If you are having a problem that isn't listed here, check the [readme](https://github.com/zfbx/zdiscord/blob/djs/readme.md) and if there's still nothing submit an [issue](https://github.com/zfbx/zdiscord/issues) if it doesn't already exist there.

#### Table of Contents:

- [No Slash Commands?](#no-slash-commands)
- [How to get a Discord id?](#how-to-get-a-discord-id)
- ["ENABLE INTENTS" Error](#enable-intents-error)
- [Can't find yarn dependency](#cant-find-yarn-dependency)
- [QBCore commands not showing](#qbcore-commands-not-showing)


### No Slash Commands?

Don't see slash commands when you type `/` in your server?

- In your discord user settings (bottom left gear icon) > Text & Images > Text Box do you have "Use slash commands.." enabled?
- Does the role trying to access the slash commands have the slash commands permission in discord roles?
- Is your server's guild id set to your discord server?
- Did you invite the bot to your server with the invite link provided (which includes `&scope=bot%20applications.commands` on the end)



### How to get a Discord id?

Discord has a [guide](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) on how to do this but the TL;DR is enable "Developer Mode" in your discord settings `Settings (gear in bottom left) > Advanced > Developer Mode` then right click any of the **[usernames, role names, channel names, server icon]** and `Copy ID`. You now should be able to paste the ~20 digit id.


### "ENABLE INTENTS" Error

zdiscord **needs** `Presence Intent` and `Server Members Intent` from the discord bot [settings](https://discord.com/developers/applications) to be enabled for basic functionality. Without these the bot is unable to check if a user is in your discord server or if they have the required roles to join the server if using the whitelist feature.

Under the "Bot" section of the discord settings towards the bottom you'll see 2 toggles under the "Privileged Gateway Intents" section, They both need to be enabled like show below:
![intents](/zdiscord/images/intents.png)


### Can't find yarn dependency

This resource requires FiveM's yarn module from [cfx-server-data](https://github.com/citizenfx/cfx-server-data) under `(resources/[system]/[builders]/yarn)` so either add those resources to your resource folder or just put the yarn one in your resources and zdiscord will enable it for itself so you don't need to include it in your cfg.

**Note:** If you want to use the /screenshot command which uses [screenshot-basic](https://github.com/citizenfx/screenshot-basic) you will also need the webpack resource also under `[builders]`. So consider having that one ready too if you end up just copying the single resource.


### QBCore commands not showing

For QBCore support you either have to `ensure qb-core` before this resource or have qb-core as a dependency in the fxmanifest.lua which will essentially start qb-core automatically before it but the former suggestion is more recommended since some dependency requirements can act up.
