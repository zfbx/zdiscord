/**
 * This file is part of zdiscord.
 * Copyright (C) 2021 Tony/zfbx
 * source: <https://github.com/zfbx/zdiscord>
 *
 * This work is licensed under the Creative Commons
 * Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 */

module.exports = {
    name: "messageCreate",
    // msg = https://discord.js.org/#/docs/main/stable/class/Message
    run: async (client, msg) => {
        if (!msg.content || msg.author.bot) return;
        if (client.config.EnableStaffChatForwarding && msg.channel.id == client.config.DiscordStaffChannelId) {
            client.utils.sendStaffChatMessage(client.z, msg.member.displayName, msg.content);
            return client.z.utils.log.write(`${msg.member.displayName}: ${msg.content}`, { tag: "STAFFCHAT" });
        }
    },
};
