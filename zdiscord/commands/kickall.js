/**
 * This file is part of zdiscord.
 * Copyright (C) 2021 Tony/zfbx
 * source: <https://github.com/zfbx/zdiscord>
 *
 * zdiscord is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * zdiscord is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with zdiscord. If not, see <https://www.gnu.org/licenses/>.
 */

module.exports = {
    name: "kickall",
    description: "Kick every player in the city",
    default_permission: false,
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
        const [ message ] = args;
        const numberOnline = GetNumPlayerIndices();
        if (numberOnline === 0) return interaction.reply({ content: "Nobody was online to kick.", ephemeral: false });
        getPlayers().forEach(async (player) => {
            DropPlayer(player, message);
        });
        client.utils.log.info(`[${interaction.member.displayName}] Kicked all ${numberOnline} player(s). Reason: ${reason}`);
        return interaction.reply({ content: `All ${numberOnline} player(s) have been kicked.`, ephemeral: false });
    },
};
