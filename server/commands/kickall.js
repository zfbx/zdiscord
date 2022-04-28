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
    name: "kickall",
    description: "Kick every player in the city",
    role: "admin",

    options: [
        {
            name: "message",
            description: "Kick message to show the user",
            required: true,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        const numberOnline = GetNumPlayerIndices();
        if (numberOnline === 0) return interaction.reply({ content: "Nobody was online to kick.", ephemeral: false });
        getPlayers().forEach(async (player) => {
            DropPlayer(player, args.message);
        });
        client.utils.log.info(`[${interaction.member.displayName}] Kicked all ${numberOnline} player(s). Reason: ${args.message}`);
        return interaction.reply({ content: `All ${numberOnline} player(s) have been kicked.`, ephemeral: false });
    },
};
