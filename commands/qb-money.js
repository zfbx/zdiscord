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
    name: "money",
    description: "Manage player's in-city money",
    version: 6,
    default_permission: false,
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "add",
            description: "add money to player",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "moneytype",
                    description: "type of money to add to",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Cash", value: "cash" },
                        { name: "Bank", value: "bank" },
                        { name: "Crypto", value: "Crypto" },
                    ],
                },
                {
                    name: "amount",
                    description: "amount to add",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "remove",
            description: "remove money from player",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "moneytype",
                    description: "type of money to remove from",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Cash", value: "cash" },
                        { name: "Bank", value: "bank" },
                        { name: "Crypto", value: "Crypto" },
                    ],
                },
                {
                    name: "amount",
                    description: "amount to remove",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "set a player's money (OVERWRITE)",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "moneytype",
                    description: "type of money to set",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Cash", value: "cash" },
                        { name: "Bank", value: "bank" },
                        { name: "Crypto", value: "Crypto" },
                    ],
                },
                {
                    name: "amount",
                    description: "amount to set to",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "get a player's current financial stats",
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
        const characterName = `${player.PlayerData.charinfo.firstname} ${player.PlayerData.charinfo.lastname}`;
        const reason = "Staff intervention";
        if (args.inspect) {
            const embed = new client.Embed().setTitle(`${characterName}'s Money`);
            let desc = "";
            Object.entries(player.PlayerData.money).forEach(([type, value]) => {
                desc += `**${type}:** $${value.toLocaleString("en-US")}\n`;
            });
            embed.setDescription(desc);
            return interaction.reply({ embeds: [ embed ], ephemeral: false });
        }
        if (args.amount < 0) return interaction.reply({ content: "Please only use positive amounts", ephemeral: true });
        const prevMoney = player.Functions.GetMoney(args.moneytype);
        if (args.add) {
            if (player.Functions.AddMoney(args.moneytype, args.amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] Added ${args.amount} to ${GetPlayerName(args.id)} (${args.id})'s ${args.moneytype} [Previously: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${args.id})'s ${args.moneytype} has increased from ${prevMoney} to ${player.Functions.GetMoney(args.moneytype)}`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Something went wrong trying to add money to this player", ephemeral: false });
            }
        } else if (args.remove) {
            if (player.Functions.RemoveMoney(args.moneytype, args.amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] Removed ${args.amount} from ${GetPlayerName(args.id)} (${args.id})'s ${args.moneytype} [Previously: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${args.id})'s ${args.moneytype} has decreased from ${prevMoney} to ${player.Functions.GetMoney(args.moneytype)}`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Something went wrong trying to remove money from this player", ephemeral: false });
            }
        } else if (args.set) {
            if (player.Functions.SetMoney(args.moneytype, args.amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] Set ${GetPlayerName(args.id)} (${args.id})'s ${args.moneytype} to ${args.amount} [Previously: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${args.id})'s ${args.moneytype} has been set to ${player.Functions.GetMoney(args.moneytype)} (Previously: ${prevMoney})`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Something went wrong trying to set this player's money", ephemeral: false });
            }
        }
    },
};
