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

class TimedMessage {
    constructor(z) {
        this.timerDelay = 5; // Minutes
        this.channelId = "00000000000000000"; // Channel id to send server status updates
        this.reuseMessage = true; // Edit the same message rather than sending a new one each time
        this.messageId = null; // store message id so we can edit it later

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
        const channel = await zbot.channels.fetch(this.channelId).catch(console.error);
        const embed = new djs.EmbedBuilder()
            .setTitle(`${zconfig.FiveMServerName}`)
            .setDescription(`**Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
            **Direct Connect:** F8 > ${zconfig.FiveMServerIP}
            **Online Players:** ${GetNumPlayerIndices()}/${GetConvar("sv_maxClients", "48")}
            **Discord:** [Discord](${zconfig.DiscordInviteLink})`)
            .setColor(zconfig.ThemeColor)
            .setTimestamp()
            .setFooter({ name: "Powered by zdiscord" })
        if (this.reuseMessage && this.messageId) {
            const message = await channel.messages.fetch(this.messageId).catch(console.error);
            if (message) message.edit({ embeds: [embed] }).catch(console.error);
        } else {
            const message = await channel.send({ embeds: [embed] }).catch(console.error);
            if (message) this.messageId = message.id;
        }
    }

}

module.exports = TimedMessage;
