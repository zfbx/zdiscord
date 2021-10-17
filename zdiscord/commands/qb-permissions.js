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
    name: "permissions",
    description: "Manage player's in-city permissions",
    default_permission: false,
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "add",
            description: "add a permission to a player",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "permission",
                    description: "permission to give",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "admin", value: "admin" },
                        { name: "god", value: "god" },
                    ],
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "remove",
            description: "remove all permissions from a player",
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
        const [ subcommand, id, permission ] = args;
        if (!GetPlayerName(id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        if (subcommand === "add") {
            client.QBCore.Functions.AddPermission(id, permission);
            client.utils.log.info(`[${interaction.member.displayName}] Gave ${id} the ${permission} permission`);
            return interaction.reply({ content: `${GetPlayerName(id)} (${id}) was given ${permission} permission.`, ephemeral: false });
        } else if (subcommand === "remove") {
            client.QBCore.Functions.RemovePermission(id);
            client.utils.log.info(`[${interaction.member.displayName}] Removed ${id} permissions`);
            return interaction.reply({ content: `${GetPlayerName(id)} (${id}) had their permissions removed.`, ephemeral: false });
        }
    },
};
