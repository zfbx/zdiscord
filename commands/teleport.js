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
                {
                    name: "vehicle",
                    description: "Teleport them with vehicle they're driving?",
                    required: false,
                    type: "BOOLEAN",
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
                {
                    name: "vehicle",
                    description: "Teleport them with vehicle they're driving?",
                    required: false,
                    type: "BOOLEAN",
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        const locations = {
            "airport": [ -1096.19, -3501.1, 17.18 ],
            "mazeroof": [ -75.57, -818.88, 327.96 ],
            "pier": [ -1712.06, -1136.48, 13.08 ],
            "militarybase": [ -2105.88, 2871.16, 32.81 ],
            "chiliad": [ 453.73, 5572.2, 781.18 ],
        };
        // if subcommand = preset: x = location & y = vehicle
        const [ subcommand, id, x, y, z, vehicle ] = args;
        if (!GetPlayerName(id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        if (subcommand === "coords") {
            teleport(id, x, y, z, vehicle || false);
            client.utils.log.info(`[${interaction.member.displayName}] Teleported ${GetPlayerName(id)} (${id}) to ${x}, ${y}, ${z}`);
            return interaction.reply({ content: `${GetPlayerName(id)} (${id}) was teleported to specified coords.`, ephemeral: false });
        } else if (subcommand === "preset") {
            teleport(id, locations[x][0], locations[x][1], locations[x][2], y || false);
            client.utils.log.info(`[${interaction.member.displayName}] teleported ${id} to ${x}`);
            return interaction.reply({ content: `${GetPlayerName(id)} (${id}) was teleported to ${x}`, ephemeral: false });
        }
    },
};

function teleport(id, x, y, z, withVehicle = false) {
    x = x.toFixed(2);
    y = y.toFixed(2);
    z = z.toFixed(2);
    if (NetworkGetEntityOwner(GetPlayerPed(id)) == id) {
        emitNet(`${GetCurrentResourceName()}:teleport`, id, x, y, z, withVehicle);
    } else {
        SetEntityCoords(GetPlayerPed(id), x, y, z);
    }
}