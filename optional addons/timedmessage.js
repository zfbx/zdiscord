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
 *
 * This addon sends a message with status updates every x number of minutes in a specified channel
 * copy this into your `server/addons` folder and edit the channelId to the channel id you want messages sent.
 */

const { MessageEmbed } = require("discord.js");


class TimedMessage {
    constructor(z) {
        // Minutes
        this.timerDelay = 5;
        // Channel id to send server status updates
        this.channelId = "00000000000000000";

        this.z = z;
        on("zdiscord:ready", async () => {
            this.post();
            this.start();
        });
    }

    async start() {
        setInterval(() => {
            this.post();
        }, 1000 * 60 * this.timerDelay);
    }

    async post() {
        try {
            const guild = this.z.bot.guilds.cache.get(this.z.config.DiscordGuildId);
            const channel = guild.channels.cache.get(this.channelId);
            const embed = new MessageEmbed();
            embed.setTitle("Server Status")
                .setColor("#f2449e")
                .setDescription(`**Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
                **Server IP:** ${this.z.config.FiveMServerIP}
                **Online Players:** ${GetNumPlayerIndices()}/${GetConvar("sv_maxClients", "64")}
                **Discord Invite:** ${this.z.config.DiscordInviteLink}`);
            channel.send({ embeds: [ embed ] }).catch();
        } catch {
            // Just incase something unforseen happens
        }
    }

}

module.exports = TimedMessage;
