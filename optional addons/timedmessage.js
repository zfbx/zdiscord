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
        this.channelId = "YOUR_CHANNEL_ID_HERE";
        // store message id so we can edit it later
        this.messageId = null;

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
            const channel = await this.z.bot.channels.fetch(this.channelId);
            const embed = new MessageEmbed()
                .setTitle(`${this.z.config.FiveMServerName}`)
                .setDescription(`**Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
                **Direct Connect:** F8 > ${this.z.config.FiveMServerIP}
                **Online Players:** ${GetNumPlayerIndices()}/${GetConvar("sv_maxClients", "48")}
                **Discord:** [Discord](${this.z.config.DiscordInviteLink})`)
                .setColor("#00ff00")
                .setTimestamp()
                // footer
                .setFooter({name: `Powered by zdiscord`, iconURL: "https://cdn.mythbot.org/img/dev_szn3uywo.png"})
                // print("posting message") // post message print debug (uncomment to debug)
            if (this.messageId) { // if we have a message id, edit the message
                // print("editing message") // edit message print debug (uncomment to debug)
                const message = await channel.messages.fetch(this.messageId);
                message.edit({ embeds: [embed] });
            } else { // if we don't have a message id, send a new message
                // print("sending message") // send message print debug (uncomment to debug)
                const message = await channel.send({ embeds: [embed] });
                this.messageId = message.id;
            }
        }
        catch (e) {
            console.error(e);
        }
    }

}

module.exports = TimedMessage;
