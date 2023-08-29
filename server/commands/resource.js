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
        super("resource", file, {
            description: "Manage server resources / scripts",
            role: "god",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "start",
                    description: "start a resource / script",
                    options: [
                        {
                            name: "script",
                            description: "resource / script to start",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "ensure",
                    description: "start/restart a resource / script",
                    options: [
                        {
                            name: "script",
                            description: "resource / script to start or restart",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "stop",
                    description: "stop a resource / script",
                    options: [
                        {
                            name: "script",
                            description: "resource / script to start or restart",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "inspect",
                    description: "Inspect the status of a resource / script",
                    options: [
                        {
                            name: "script",
                            description: "resource / script to start or restart",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "refresh",
                    description: "refreshes resources",
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "list",
                    description: "list resources",
                },
            ],
        });
    }

    async run(interaction, args) {
        if (!(args.refresh || args.inspect) && args.script == GetCurrentResourceName()) return interaction.sreply("You can't restart this script");
        if (!(args.refresh || args.inspect) && args.script == "qb-core") return interaction.sreply("You should never restart this script as it will break your server");
        await interaction.deferReply();
        if (args.refresh) {
            ExecuteCommand("refresh");
            return interaction.editReply("Resources have been refreshed");
        } else if (args.inspect) {
            const reply = GetResourceState(args.script);
            return interaction.editReply(`${args.script} is currently: ${reply}`);
        } else if (args.stop) {
            const reply = StopResource(args.script);
            if (reply) return interaction.editReply(`${args.script} has been stopped`);
            else return interaction.editReply(`${args.script} FAILED to be stopped or didn't exist`);
        } else if (args.start) {
            const reply = StartResource(args.script);
            if (reply) return interaction.editReply(`${args.script} was started if it wasn't already`);
            else return interaction.editReply(`${args.script} FAILED to be started and might not exist`);
        } else if (args.ensure) {
            StopResource(args.script);
            const reply = StartResource(args.script);
            if (reply) return interaction.editReply(`${args.script} has been started/restarted`);
            else return interaction.editReply(`${args.script} FAILED to be started/restarted and might not exist`);
        } else if (args.list) {
            const r = [];
            for (let i = 0; i < GetNumResources(); i++) {
                const res = GetResourceByFindIndex(i);
                if (res && res !== "_cfx_internal" && GetResourceState(res) == "started") {
                    r.push(res);
                }
            }
            const parts = [];
            r.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })).forEach((res, index) => {
                const i = Math.floor(index / 20);
                if (!parts[i]) parts[i] = "";
                parts[i] += `${res}\n`;
            });
            const pages = [];
            parts.forEach((part) => {
                const embed = new djs.EmbedBuilder().setColor(zconfig.ThemeColor)
                    .setTitle(`Resources (${GetNumResources()})`)
                    .setDescription(`${part}`);
                pages.push(embed);
            });
            await zpagination({
                embeds: pages,
                author: interaction.member.user,
                interaction: interaction,
                ephemeral: false,
                fastSkip: true,
                pageTravel: true,
            });
        }
    }
};
