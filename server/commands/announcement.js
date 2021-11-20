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
    name: "announcement",
    description: "Send in city announcement",
    default_permission: false,
    role: "mod",

    options: [
        {
            name: "message",
            description: "announcement to send",
            required: true,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        emitNet("chat:addMessage", -1, {
            template: `<div class=chat-message server'><strong>${client.locale.announcement}:</strong> ${args.message}</div>`,
        });
        client.utils.log.info(`[${interaction.member.displayName}] Announcement: ${args.message}`);
        interaction.reply({ content: "Announcement Sent", ephemeral: false });
    },
};
