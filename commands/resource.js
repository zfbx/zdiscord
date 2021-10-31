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

const { MessageButton } = require("discord.js");

module.exports = {
    name: "resource",
    description: "Manage server resources / scripts",
    version: 6,
    default_permission: false,
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "start",
            description: "start a resource / script",
            options: [
                {
                    name: "script",
                    description: "resource / script to start",
                    required: true,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "ensure",
            description: "start/restart a resource / script",
            options: [
                {
                    name: "script",
                    description: "resource / script to start or restart",
                    required: true,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "stop",
            description: "stop a resource / script",
            options: [
                {
                    name: "script",
                    description: "resource / script to start or restart",
                    required: true,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "Inspect the status of a resource / script",
            options: [
                {
                    name: "script",
                    description: "resource / script to start or restart",
                    required: true,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "refresh",
            description: "refreshes resources",
        },
        {
            type: "SUB_COMMAND",
            name: "list",
            description: "list resources",
        },
    ],

    run: async (client, interaction, args) => {
        if (!(args.refresh || args.inspect) && args.script == GetCurrentResourceName()) return interaction.reply({ content: "You can't restart this script", ephemeral: true });
        if (!(args.refresh || args.inspect) && args.script == "qb-core") return interaction.reply({ content: "You should never restart this script as it will break your server", ephemeral: true });
        await interaction.deferReply();
        if (args.refresh) {
            ExecuteCommand("refresh");
            return interaction.editReply({ content: "Resources have been refreshed", ephemeral: false });
        } else if (args.inspect) {
            const reply = GetResourceState(args.script);
            return interaction.editReply({ content: `${args.script} is currently: ${reply}`, ephemeral: false });
        } else if (args.stop) {
            const reply = StopResource(args.script);
            if (reply) return interaction.editReply({ content: `${args.script} has been stopped`, ephemeral: false });
            else return interaction.editReply({ content: `${args.script} FAILED to be stopped or didn't exist`, ephemeral: false });
        } else if (args.start) {
            const reply = StartResource(args.script);
            if (reply) return interaction.editReply({ content: `${args.script} was started if it wasn't already`, ephemeral: false });
            else return interaction.editReply({ content: `${args.script} FAILED to be started and might not exist`, ephemeral: false });
        } else if (args.ensure) {
            StopResource(args.script);
            const reply = StartResource(args.script);
            if (reply) return interaction.editReply({ content: `${args.script} has been started/restarted`, ephemeral: false });
            else return interaction.editReply({ content: `${args.script} FAILED to be started/restarted and might not exist`, ephemeral: false });
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
                const embed = new client.Embed()
                    .setTitle(`Resources (${GetNumResources()})`)
                    .setDescription(`${part}`);
                pages.push(embed);
            });
            const backBtn = new MessageButton().setCustomId("previousbtn").setEmoji("🔺").setStyle("SECONDARY");
            const forwardBtn = new MessageButton().setCustomId("nextbtn").setEmoji("🔻").setStyle("SECONDARY");
            client.utils.paginationEmbed(interaction, pages, [backBtn, forwardBtn]);
        }
    },
};
