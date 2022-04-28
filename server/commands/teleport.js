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
    name: "teleport",
    description: "teleport a player",
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
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        if (args.coords) {
            teleport(args.id, args.x, args.y, args.z, args.vehicle || false);
            client.utils.log.info(`[${interaction.member.displayName}] Teleported ${GetPlayerName(args.id)} (${args.id}) to ${args.x}, ${args.y}, ${args.z}`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) was teleported to specified coords.`, ephemeral: false });
        } else if (args.preset) {
            teleport(args.id, locations[args.location][0], locations[args.location][1], locations[args.location][2], args.vehicle || false);
            client.utils.log.info(`[${interaction.member.displayName}] teleported ${args.id} to ${args.location}`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) was teleported to ${args.location}`, ephemeral: false });
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
