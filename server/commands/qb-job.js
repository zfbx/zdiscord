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

module.exports = class cmd extends Command {
    constructor(file) {
        super("job", file, {
            description: "Manage player's in-city job",
            role: "admin",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "set",
                    description: "set a player's job",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: "job",
                            description: "job to give",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                            /* choices: [ // If someone desired they could hard-code options to make it easier but there's a limit of 25 options allowed
                                { name: "Doctor / Ambulance", value: "ambulance" },
                                { name: "Police", value: "police" },
                            ],*/
                        },
                        {
                            name: "grade",
                            description: "job grade (some grades may not exist for some jobs)",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
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
                                { name: "Grade 11", value: "11" },
                                { name: "Grade 12", value: "12" },
                                { name: "Grade 13", value: "13" },
                                { name: "Grade 14", value: "14" },
                                { name: "Grade 15", value: "15" },
                                { name: "Grade 16", value: "16" },
                                { name: "Grade 17", value: "17" },
                                { name: "Grade 18", value: "18" },
                                { name: "Grade 19", value: "19" },
                                { name: "Grade 20", value: "20" },
                            ],
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "fire",
                    description: "fire player from their current job",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "inspect",
                    description: "Get a player's current job",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                    ],
                },
            ],
        });
    }

    async run(interaction, args) {
        // TODO: Pull jobs and grades dynamically
        if (!GetPlayerName(args.id)) return interaction.sreply("This ID seems invalid.");
        const player = QBCore.Functions.GetPlayer(args.id);
        const prevJob = `${player.PlayerData.job.name} (${player.PlayerData.job.grade.level})`;
        if (args.set) {
            if (player.Functions.SetJob(args.job, args.grade)) {
                zlog.info(`[${interaction.member.displayName}] changed ${GetPlayerName(args.id)} (${args.id})'s job from ${prevJob} to ${args.job} (${args.grade})`);
                return interaction.reply(`${GetPlayerName(args.id)} (${args.id}) was moved from ${prevJob} to ${args.job} (${args.grade})`);
            } else {
                return interaction.reply("Invalid job or grade");
            }
        } else if (args.fire) {
            player.Functions.SetJob("unemployed", "0");
            zlog.info(`[${interaction.member.displayName}] Fired ${GetPlayerName(args.id)} ${args.id} from their job as ${prevJob}`);
            return interaction.reply(`${GetPlayerName(args.id)} (${args.id}) has been fired from ${prevJob}`);
        } else if (args.inspect) {
            return interaction.reply(`${GetPlayerName(args.id)} (${args.id}) has is a ${prevJob}`);
        }
    }
};
