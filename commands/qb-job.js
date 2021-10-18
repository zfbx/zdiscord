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
    name: "job",
    description: "Manage player's in-city job",
    default_permission: false,
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "set a player's job",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "job",
                    description: "job to give",
                    required: true,
                    type: "STRING",
                    /* choices: [ // If someone desired they could hardcode options to make it easier but there's a limit of 25 options allowed
                        { name: "Doctor / Amulance", value: "ambulance" },
                        { name: "Police", value: "police" },
                        { name: "Real Estate", value: "realestate" },
                    ],*/
                },
                {
                    name: "grade",
                    description: "job grade (some grades may not exist for some jobs)",
                    required: true,
                    type: "STRING",
                    choices: [
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
            name: "fire",
            description: "fire player from their current job",
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
            description: "Get a player's current job",
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
        const [ subcommand, id, job, grade ] = args;
        if (!GetPlayerName(id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        const player = client.QBCore.Functions.GetPlayer(id);
        const prevJob = `${player.PlayerData.job.name} (${player.PlayerData.job.grade.level})`;
        if (subcommand === "set") {
            if (player.Functions.SetJob(job, grade)) {
                client.utils.log.info(`[${interaction.member.displayName}] changed ${GetPlayerName(id)} (${id})'s job from ${prevJob} to ${job} (${grade})`);
                return interaction.reply({ content: `${GetPlayerName(id)} (${id}) was moved from ${prevJob} to ${job} (${grade})`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Invalid job or grade", ephemeral: false });
            }
        } else if (subcommand === "fire") {
            player.Functions.SetJob("unemployed", "0");
            client.utils.log.info(`[${interaction.member.displayName}] Fired ${GetPlayerName(id)} ${id} from their job as ${prevJob}`);
            return interaction.reply({ content: `${GetPlayerName(id)} (${id}) has been fired from ${prevJob}`, ephemeral: false });
        } else if (subcommand === "inspect") {
            return interaction.reply({ content: `${GetPlayerName(id)} (${id}) has is a ${prevJob}`, ephemeral: false });
        }
    },
};
