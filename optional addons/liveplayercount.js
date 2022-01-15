/**
 * This file is part of zdiscord.
 * Copyright (C) 2021 Tony/zfbx
 * source: <https://github.com/zfbx/zdiscord>
 *
 * This work is licensed under the Creative Commons
 * Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * This addon enables you to have a voice channel that updates constantly with the current number of players online
 * copy this into your `server/addons` folder and edit the voiceChannelId to the channel id you want to use then start your server
 *
 * DO NOT TRY TO CHANGE THE UPDATE RATE ANY LOWER - doing so will cause your IP to get restricted from the discord api
 */

class LivePlayerCount {
    constructor(z) {
        // Id for the voice channel name to update
        this.voiceChannelId = "000000000000000000";

        this.z = z;
        on("zdiscord:ready", async () => {
            this.syncChannel();
            this.start();
        });
    }

    async start() {
        setInterval(() => {
            this.syncChannel();
        }, 1000 * 60 * 5);
    }

    async syncChannel() {
        try {
            const guild = this.z.bot.guilds.resolve(this.z.config.DiscordGuildId);
            const channel = guild.channels.cache.get(this.voiceChannelId);
            channel.setName(`Players Online: ${GetNumPlayerIndices()}`).catch();
        } catch {
            // Just incase something unforseen happens
        }
    }

}

module.exports = LivePlayerCount;
