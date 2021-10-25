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
        const [ subcommand, id, moneytype, amount ] = args;
        if (!GetPlayerName(id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        const player = client.QBCore.Functions.GetPlayer(id);
        const characterName = `${player.PlayerData.charinfo.firstname} ${player.PlayerData.charinfo.lastname}`;
        const reason = "Staff intervention";
        if (subcommand === "inspect") {
            const embed = new client.Embed().setTitle(`${characterName}'s Money`);
            let desc = "";
            Object.entries(player.PlayerData.money).forEach(([type, value]) => {
                desc += `**${type}:** $${value.toLocaleString("en-US")}\n`;
            });
            embed.setDescription(desc);
            return interaction.reply({ embeds: [ embed ], ephemeral: false });
        }
        if (amount < 0) return interaction.reply({ content: "Please only use positive amounts", ephemeral: true });
        const prevMoney = player.Functions.GetMoney(moneytype);
        if (subcommand === "add") {
            if (player.Functions.AddMoney(moneytype, amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] Added ${amount} to ${GetPlayerName(id)} (${id})'s ${moneytype} [Previously: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${id})'s ${moneytype} has increased from ${prevMoney} to ${player.Functions.GetMoney(moneytype)}`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Something went wrong trying to add money to this player", ephemeral: false });
            }
        } else if (subcommand === "remove") {
            if (player.Functions.RemoveMoney(moneytype, amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] Removed ${amount} from ${GetPlayerName(id)} (${id})'s ${moneytype} [Previously: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${id})'s ${moneytype} has decreased from ${prevMoney} to ${player.Functions.GetMoney(moneytype)}`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Something went wrong trying to remove money from this player", ephemeral: false });
            }
        } else if (subcommand === "set") {
            if (player.Functions.SetMoney(moneytype, amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] Set ${GetPlayerName(id)} (${id})'s ${moneytype} to ${amount} [Previously: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${id})'s ${moneytype} has been set to ${player.Functions.GetMoney(moneytype)} (Previously: ${prevMoney})`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Something went wrong trying to set this player's money", ephemeral: false });
            }
        }
    },
};
