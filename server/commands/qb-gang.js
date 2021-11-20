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
    name: "gang",
    description: "Manage player's in-city gang",
    version: 6,
    default_permission: false,
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "set a player's gang",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "gang",
                    description: "gang to set",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "grade",
                    description: "gang grade (or rank)",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Grade 0", value: "0" },
                        { name: "Grade 1", value: "1" },
                        { name: "Grade 2", value: "2" },
                        { name: "Grade 3", value: "3" },
                        { name: "Grade 4", value: "4" },
                        { name: "Grade 5", value: "5" },
                        { name: "Grade 6", value: "6" },
                        { name: "Grade 7", value: "7" },
                        { name: "Grade 8", value: "8" },
                        { name: "Grade 9", value: "9" },
                        { name: "Grade 10", value: "10" },
                    ],
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "kick",
            description: "kick a player from their current gang",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "Get a player's current gang",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        const player = client.QBCore.Functions.GetPlayer(args.id);
        const prevGang = `${player.PlayerData.gang.name} (${player.PlayerData.gang.grade.level})`;
        if (args.set) {
            if (player.Functions.SetGang(args.gang, args.grade)) {
                client.utils.log.info(`[${interaction.member.displayName}] changed ${GetPlayerName(args.id)} (${args.id})'s gang from ${prevGang} to ${args.gang} (${args.grade})`);
                return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) was moved from gang ${prevGang} to ${args.gang} (${args.grade})`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Invalid gang or grade", ephemeral: false });
            }
        } else if (args.kick) {
            player.Functions.SetGang("none", "0");
            client.utils.log.info(`[${interaction.member.displayName}] kicked ${GetPlayerName(args.id)} ${args.id} from their gang as ${prevGang}`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) has been kicked from a gang: ${prevGang}`, ephemeral: false });
        } else if (args.inspect) {
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) is in gang ${prevGang}`, ephemeral: false });
        }
    },
};
