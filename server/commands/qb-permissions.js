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
        super("permissions", file, {
            description: "Manage player's in-city permissions",
            role: "god",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "add",
                    description: "add a permission to a player",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: "permission",
                            description: "permission to give",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                            choices: [
                                { name: "admin", value: "admin" },
                                { name: "god", value: "god" },
                            ],
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "remove",
                    description: "remove all permissions from a player",
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
        if (!GetPlayerName(args.id)) return interaction.sreply("This ID seems invalid.");
        if (args.add) {
            QBCore.Functions.AddPermission(args.id, args.permission);
            zlog.info(`[${interaction.member.displayName}] Gave ${args.id} the ${args.permission} permission`);
            return interaction.reply(`${GetPlayerName(args.id)} (${args.id}) was given ${args.permission} permission.`);
        } else if (args.remove) {
            QBCore.Functions.RemovePermission(args.id);
            zlog.info(`[${interaction.member.displayName}] Removed ${args.id} permissions`);
            return interaction.reply(`${GetPlayerName(args.id)} (${args.id}) had their permissions removed.`);
        }
    }
};
