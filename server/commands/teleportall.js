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
    name: "teleport-all",
    description: "teleport everyone",
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "coords",
            description: "teleport to specific coordinates",
            options: [
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
            "airport": [ -1096.19, -3501.1, 17.18 ],
            "mazeroof": [ -75.57, -818.88, 327.96 ],
            "pier": [ -1712.06, -1136.48, 13.08 ],
            "militarybase": [ -2105.88, 2871.16, 32.81 ],
            "chiliad": [ 453.73, 5572.2, 781.18 ],
        };
        if (args.coords) {
            teleportEveryone(args.x, args.y, args.z);
            client.utils.log.info(`[${interaction.member.displayName}] Teleported EVERYONE to ${args.x}, ${args.y}, ${args.z}`);
            return interaction.reply({ content: "Teleported everyone.", ephemeral: false });
        } else if (args.preset) {
            teleportEveryone(locations[args.location][0], locations[args.location][1], locations[args.location][2]);
            client.utils.log.info(`[${interaction.member.displayName}] teleported EVERYONE to ${args.location}`);
            return interaction.reply({ content: `Everyone was teleported to ${args.location}`, ephemeral: false });
        }
    },
};

function teleportEveryone(x, y, z) {
    x = x.toFixed(2);
    y = y.toFixed(2);
    z = z.toFixed(2);
    emitNet(`${GetCurrentResourceName()}:teleport`, -1, x, y, z, false);
}
