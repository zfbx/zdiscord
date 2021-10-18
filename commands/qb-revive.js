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
    name: "revive",
    description: "Raise a downed player to full health and stats",
    default_permission: false,
    role: "admin",

    options: [
        {
            name: "id",
            description: "Player's current id",
            required: true,
            type: "INTEGER",
        },
    ],

    run: async (client, interaction, args) => {
        const [ id ] = args;
        if (!GetPlayerName(id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        emitNet("hospital:client:Revive", id);
        client.utils.log.info(`[${interaction.member.displayName}] revived ${GetPlayerName(id)} (${id})`);
        return interaction.reply({ content: `${GetPlayerName(id)} (${id}) has been fully healed.`, ephemeral: false });
    },
};
