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
    name: "inventory",
    description: "Manage player's in-city items",
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "give",
            description: "give a player an item",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "item",
                    description: "item to give",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "count",
                    description: "how many to give [Default: 1]",
                    required: false,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "take",
            description: "take an item away from a player",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "item",
                    description: "item to take",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "count",
                    description: "how many to take [Default: 1]",
                    required: false,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "Peek inside player's inventory",
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
        const amount = args.count || 1;
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        const player = client.QBCore.Functions.GetPlayer(args.id);
        if (args.give) {
            const badItems = [ "id_card", "harness", "markedbills", "labkey", "printerdocument"];
            const itemData = client.QBCore.Shared.Items[args.item.toLowerCase()];
            if (!itemData) return interaction.reply({ content: "Item could not be found", ephemeral: false });
            if (badItems.includes(itemData["name"])) return interaction.reply({ content: "This is a unique item and can't be interacted with like this", ephemeral: false });
            if (amount > 1 && itemData.unique) return interaction.reply({ content: "These items don't stack, give 1 at a time.", ephemeral: false });
            if (player.Functions.AddItem(itemData["name"], amount, false)) {
                client.utils.log.info(`[${interaction.member.displayName}] gave ${GetPlayerName(args.id)} (${args.id}) ${amount} ${args.item}`);
                return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) was given ${amount} ${itemData.label}`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Something went wrong trying to give this item", ephemeral: false });
            }
        } else if (args.take) {
            const itemData = client.QBCore.Shared.Items[args.item.toLowerCase()];
            if (!itemData) return interaction.reply({ content: "Item could not be found", ephemeral: false });
            if (player.Functions.RemoveItem(args.item, amount)) {
                client.utils.log.info(`[${interaction.member.displayName}] removed item from ${GetPlayerName(args.id)}'s (${args.id}) inventory (${amount} ${args.item})`);
                return interaction.reply({ content: `${amount} ${itemData.label} has been taken from ${GetPlayerName(args.id)} (${args.id})`, ephemeral: false });
            } else {
                return interaction.reply({ content: `Failed to remove item from ${GetPlayerName(args.id)}'s (${args.id}) inventory`, ephemeral: false });
            }
        } else if (args.inspect) {
            const embed = new client.Embed().setTitle(`${GetPlayerName(args.id)}'s (${args.id}) Inventory`);
            const items = player.PlayerData.items;
            let desc = "";
            if (typeof items === "object") {
                Object.entries(items).forEach(([key, i]) => {
                    desc += `[${i.slot}] ${i.amount}x - **${i.label}** (${i.name})\n`;
                });
            } else {
                items.forEach((i) => {
                    desc += `[${i.slot}] ${i.amount}x - **${i.label}** (${i.name})\n`;
                });
            }
            embed.setDescription(desc);
            return interaction.reply({ embeds: [ embed ], ephemeral: false });
        }

    },
};
