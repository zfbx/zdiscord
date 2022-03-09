# Frequently Asked Questions

Here's a list of common problems people have run into and how to solve them. If you are having a problem that isn't listed here, check the [readme](https://github.com/zfbx/zdiscord/blob/djs/readme.md) and if there's still nothing submit an [issue](https://github.com/zfbx/zdiscord/issues) if it doesn't already exist there.

#### Table of Contents:

- [No Slash Commands?](#no-slash-commands)
- [How to get a Discord id?](#how-to-get-a-discord-id)
- ["ENABLE INTENTS" Error](#enable-intents-error)
- [Can't find yarn dependency](#cant-find-yarn-dependency)
- [QBCore commands not showing](#qbcore-commands-not-showing)
- [Bot status message updates slow](#bot-status-message-updates-slow)
- [Buffer Deprecation Warning](#buffer-deprecation-warning)
- [Could not find dependency /server:4890](#could-not-find-dependency-server4890)
- [QBCore commands aren't showing](#qbcore-commands-not-showing)
- [New chat messages / announcements aren't popping up when recieved](#new-chat-messages--announcements-arent-popping-up-when-recieved)
- [How to use custom chat](#how-to-use-custom-chat)


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

### QBCore commands aren't loading

If you're using an older version of QBCore that uses the old `QBCore:GetObject` event you will have to update the server.js replacing lines ~20-23 which look like:
```js
try {
    z.QBCore = global.exports["qb-core"].GetCoreObject();
    if (z.QBCore) z.utils.log.info("QBCore found! Supported QB commands will be loaded.");
} catch { z.QBCore = false; }
```
With this:
```js
z.QBCore = false;
TriggerEvent("QBCore:GetObject", (obj) => { z.QBCore = obj; });
if (z.QBCore) z.utils.log.info("QBCore found! Supported QB commands will be loaded.");
```

**Note:** Not all commands are backwards compatible with the previous version of QBCore as it would be very hard to support many versions of backwards compatibility so I recommend updating to a more recent version of qbcore :) *(Plus if you're using qbus it's probably a leak and you shouldn't be anyways)*


### Bot status message updates slow

By default the bot status updates every 30 seconds to prevent abusing the discord API, you can lower this to probably 10 seconds at the lowest without problems by changing the last line in `/events/ready.js` where it's `30000` to `10000` (it's in milliseconds)


### Buffer Deprecation Warning

**This was patched in version 7.0.0 of zdiscord and FiveM artifact 4980+. Update to these or later to make this go away.**

You may see a warning like:
```
[DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
```

This is fine.. it's just a warning that future versions may drop support for it. I don't see FiveM updating node again for quite some time so it's nothing to concern yourself with at the moment. This issue comes from a sub-dependency (node-fetch and whatwg) thinking FiveM is a browser so falling back to use `Buffer()`. I hope future updates of those resources will fix it, currently there's nothing I can do about it without forking entire collections of node modules and changing them. And I don't want the responsibility of keeping them updated especially when they're fairly active repositories.


### Could not find dependency /server:4890

When trying to start zdiscord you get an error that says `Could not find dependency /server:4890 for resource zdiscord`. This means you aren't running [FiveM artifacts](https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/) version 4890 or later. updating to a version number higher than 4890 will fix this error and allow the resource to start.


### New chat messages / announcements aren't popping up when recieved

cfx chat by default has modes you can toggle between with a keybind (default: L) and if you change it to "WHEN ACTIVE" it'll show when new messages arrive

### How to use custom chat

You really shouldn't use a custom chat but rather theme the default but IF you did.. you can change the functionality of the chat in zdiscord by modifying the function `chatMessage` in `utils.js` as all messages in game are forwarded through therre
