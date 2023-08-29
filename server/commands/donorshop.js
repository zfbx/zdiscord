/**
 * This file is part of zdiscord.
 * Credit to codesign including support originally ♥ Check out the supported script here: https://codesign.pro/package/4754302
 * Copyright (C) 2021 Tony/zfbx
 * source: <https://github.com/zfbx/zdiscord>
 *
 * This work is licensed under the Creative Commons
 * Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 */

translations["donorshop"] = {
    "en": {
        cmdName: "donorpoints",
        cmdDesc: "Manage donator shop points",
    },
    "es": {
        cmdName: "tienda-de-donantes",
    },
};

module.exports = class cmd extends Command {
    constructor(file) {
        super(Lang.t("cmdName", {}, translations["donorshop"]), file, {
            description: Lang.t("cmdDesc", {}, translations["donorshop"]),
            role: "admin",
            scriptHook: "",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "list",
                    description: "List Donation Points",
                    options: [
                        {
                            name: "citizenid",
                            description: "Citizen ID",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "modify",
                    description: "modify a user's donor points",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: "action",
                            description: "What to do to the points?",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                            choices: [
                                { name: "Add", value: "add" },
                                { name: "Remove", value: "remove" },
                                { name: "Set", value: "set" },
                            ],
                        },
                        {
                            name: "amount",
                            description: "amount of points to add/remove/set",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                    ],
                },
            ],
        });
    }

    shouldLoad() {
        if (GetResourceState("cd_donatorshop") === "started") {
            this.scriptHook = "cd_donatorshop";
            return true;
        }
        return false;
    }

    async run(interaction, args) {
        if (this.scriptHook === "cd_donatorshop") {
            const citizen = await this.getLicense(args.citizenid);
            const donor = await this.getDonationPoints(citizen["license"]);

            if (args.list) {
                return interaction.reply(`Donation Points for ${citizen["license"]}: ${donor["balance"]}`).catch(console.error);
            }
            else if (args.modify) {
                if (!zbot.hasPermission(interaction.member, "god")) {
                    return interaction.sreply(Lang.t("no_permission")).catch(console.error);
                }
                if (args.amount < 0) {
                    return interaction.sreply(Lang.t("no_permission")).catch(console.error);
                }
                let newBalance;
                if (args.action === "add") newBalance = donor["balance"] + args.amount;
                else if (args.action === "remove") newBalance = donor["balance"] - args.amount;
                else if (args.action === "set") newBalance = args.amount;

                await this.setDonationPoints(citizen["license"], newBalance);
                return interaction.reply(`Donation Points updated from ${donor["balance"]} to ${newbalance} for ${citizen["license"]}`).catch(console.error);
            }
        }
    }

    async setDonationPoints(citizenid, points) {
        return await global.exports.oxmysql.update_async("UPDATE cd_donatorshop SET balance = ? WHERE identifier = ?", [ points, citizenid ]);
    }

    async getLicense(citizenid) {
        return await global.exports.oxmysql.single_async("SELECT license FROM players WHERE citizenid = ?", [ citizenid ]);
    }

    async getDonationPoints(license) {
        return await global.exports.oxmysql.single_async("SELECT balance FROM cd_donatorshop WHERE identifier = ?", [ license ]);
    }
};
