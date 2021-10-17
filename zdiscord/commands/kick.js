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
    name: "kick",
    description: "Kick a player from the city",
    default_permission: false,
    role: "mod",

    options: [
        {
            name: "id",
            description: "Player's current id",
            required: true,
            type: "INTEGER",
        },
        {
            name: "message",
            description: "Kick message to show the user",
            required: false,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        const [ id, message ] = args;
        if (!GetPlayerName(id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        const reason = client.utils.replaceGlobals(message || client.locale.kickedWithoutReason);
        DropPlayer(id, reason);
        client.utils.log.info(`[${interaction.member.displayName}] Kicked ${GetPlayerName(id)} (${id}). Reason: ${reason}`);
        return interaction.reply({ content: `${GetPlayerName(id)} (${id}) has been kicked.`, ephemeral: false });
    },
};
