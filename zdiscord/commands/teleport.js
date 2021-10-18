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
    name: "teleport",
    description: "teleport a player",
    default_permission: false,
    role: "mod",

    options: [
        {
            type: "SUB_COMMAND",
            name: "coords",
            description: "teleport to specific coordinates",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "x",
                    description: "x coordinate",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "y",
                    description: "y coordinate",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "z",
                    description: "z coordinate",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "preset",
            description: "teleport to a pre-specified location",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "location",
                    description: "location to teleport to",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Airport", value: "airport" },
                        { name: "Maze Bank Roof", value: "mazeroof" },
                        { name: "Del Perro Pier", value: "pier" },
                        { name: "Fort Zancudo Base", value: "militarybase" },
                        { name: "Mount Chiliad", value: "chiliad" },
                    ],
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        const locations = {
            "airport": [ -948.35, -3367.04, 13.94 ],
            "mazeroof": [ -75.19, -819.2, 326.18 ],
            "pier": [ -1712.06, -1136.48, 13.08 ],
            "militarybase": [ -2105.88, 2871.16, 32.81 ],
            "chiliad": [ 453.73, 5572.2, 781.18 ],
        };
        // x = x coord or location if preset
        const [ subcommand, id, x, y, z ] = args;
        if (!GetPlayerName(id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        if (subcommand === "coords") {
            SetEntityCoords(GetPlayerPed(id), x.toFixed(1), y.toFixed(1), z.toFixed(1));
            client.utils.log.info(`[${interaction.member.displayName}] Teleported ${GetPlayerName(id)} (${id}) to ${x}, ${y}, ${z}`);
            return interaction.reply({ content: `${GetPlayerName(id)} (${id}) was teleported to specified coords.`, ephemeral: false });
        } else if (subcommand === "preset") {
            SetEntityCoords(GetPlayerPed(id), locations[x][0], locations[x][1], locations[x][2]);
            client.utils.log.info(`[${interaction.member.displayName}] teleported ${id} to ${x}`);
            return interaction.reply({ content: `${GetPlayerName(id)} (${id}) was teleported to ${x}`, ephemeral: false });
        }
    },
};
