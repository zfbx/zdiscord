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
        super("inventory", file, {
            description: "Manage player's in-city items",
            role: "admin",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "give",
                    description: "give a player an item",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: "item",
                            description: "item to give",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                        {
                            name: "count",
                            description: "how many to give [Default: 1]",
                            required: false,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "take",
                    description: "take an item away from a player",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: "item",
                            description: "item to take",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                        {
                            name: "count",
                            description: "how many to take [Default: 1]",
                            required: false,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "inspect",
                    description: "Peek inside player's inventory",
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

    // TODO: pull all items to memory for searching dynamically

    async run(interaction, args) {
        const amount = args.count || 1;
        if (!GetPlayerName(args.id)) return interaction.sreply("This ID seems invalid.");
        const player = QBCore.Functions.GetPlayer(args.id);
        if (args.give) {
            const badItems = [ "id_card", "harness", "markedbills", "labkey", "printerdocument"];
            const itemData = QBCore.Shared.Items[args.item.toLowerCase()];
            if (!itemData) return interaction.reply("Item could not be found");
            if (badItems.includes(itemData["name"])) return interaction.reply("This is a unique item and can't be interacted with like this");
            if (amount > 1 && itemData.unique) return interaction.reply("These items don't stack, give 1 at a time.");
            if (player.Functions.AddItem(itemData["name"], amount, false)) {
                zlog.info(`[${interaction.member.displayName}] gave ${GetPlayerName(args.id)} (${args.id}) ${amount} ${args.item}`);
                return interaction.reply(`${GetPlayerName(args.id)} (${args.id}) was given ${amount} ${itemData.label}`);
            } else {
                return interaction.reply("Something went wrong trying to give this item");
            }
        } else if (args.take) {
            const itemData = QBCore.Shared.Items[args.item.toLowerCase()];
            if (!itemData) return interaction.reply("Item could not be found");
            if (player.Functions.RemoveItem(args.item, amount)) {
                zlog.info(`[${interaction.member.displayName}] removed item from ${GetPlayerName(args.id)}'s (${args.id}) inventory (${amount} ${args.item})`);
                return interaction.reply(`${amount} ${itemData.label} has been taken from ${GetPlayerName(args.id)} (${args.id})`);
            } else {
                return interaction.reply(`Failed to remove item from ${GetPlayerName(args.id)}'s (${args.id}) inventory`);
            }
        } else if (args.inspect) {
            const embed = new djs.EmbedBuilder().setColor(zconfig.ThemeColor).setTitle(`${GetPlayerName(args.id)}'s (${args.id}) Inventory`);
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
            // TODO: break up into pages if over character length
            embed.setDescription(desc);
            return interaction.reply({ embeds: [ embed ] });
        }
    }
};
