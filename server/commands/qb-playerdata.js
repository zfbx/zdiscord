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
        super("playerdata", file, {
            description: "Manage player's playerdata / Character info.",
            role: "admin",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "add",
                    description: "add money to player",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: "moneytype",
                            description: "type of money to add to",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
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
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "remove",
                    description: "remove money from player",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: "moneytype",
                            description: "type of money to remove from",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
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
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "set",
                    description: "set a player's money (OVERWRITE)",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: "moneytype",
                            description: "type of money to set",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
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
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "inspect",
                    description: "get a player's current financial stats",
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

        // TODO: fix this shit
        /* player data model
        {
            "backstory":"placeholder backstory",
            "phone":"3752506883",
            "gender":0,
            "account":"US08QBCore6516143775",
            "cid":"1",
            "birthdate":"1992-02-25",
            "firstname":"Bob",
            "lastname":"Smith",
            "nationality":"White"
        }

        // Online
        TriggerEvent('QBCore:Player:SetPlayerData', self.PlayerData)
        TriggerClientEvent('QBCore:Player:SetPlayerData', self.PlayerData.source, self.PlayerData)

        // Offline
        MySQL.Async.execute('UPDATE players SET charinfo = @charinfo WHERE citizenid = @senderId', { ['charinfo'] =  charinfo, ['senderId'] = Player.PlayerData.citizenid })
        */
        /*
        {
            "callsign":"NO CALLSIGN",
            "hunterrep":0,
            "lumberjackxp":0,
            "commandbinds":[],
            "phonedata":{
                "InstalledApps":[],
                "SerialNumber":85561648
            },
            "inside":{
                "apartment":[]
            },
            "status":[],
            "tracker":false,
            "phone":[],
            "houserobberyrep":0,
            "fitbit":[],
            "legendary2":0,
            "attachmentcraftingrep":0,
            "boostingspecialmission1":0,
            "fingerprint":"ys071J65EzJ3031",
            "craftingrep":0,
            "boostingspecialmission2":0,
            "boostingrep":0,
            "boostingspecialmission4":0,
            "isdead":false,
            "dealerrep":0,
            "licences":{
                "driver":true,
                "weapon":false,
                "business":false
            },
            "lumberjackrep":0,
            "legendary3":0,
            "walletid":"QB-67855270",
            "boostingxp":0,
            "bloodtype":"O+",
            "jobrep":{
                "taxi":0,
                "tow":0,
                "trucker":0,
                "hotdog":0
            },
            "armor":0,
            "thirst":81.00000000000002,
            "skinningxp":0,
            "ishandcuffed":false,
            "stress":0,
            "inlaststand":false,
            "criminalrecord":{
                "hasRecord":false
            },
            "houserobberyxp":0,
            "hunterxp":0,
            "boostingspecialmission3":0,
            "injail":0,
            "hunger":78.99999999999999,
            "jailitems":[],
            "legendary1":0,
            "skinning":0,
            "boostingspecialmission5":0
        }
        */


        if (!GetPlayerName(args.id)) return interaction.sreply("This ID seems invalid.");
        const player = QBCore.Functions.GetPlayer(args.id);
        const characterName = `${player.PlayerData.charinfo.firstname} ${player.PlayerData.charinfo.lastname}`;
        const reason = "Staff intervention";
        if (args.inspect) {
            const embed = new djs.EmbedBuilder().setColor(zconfig.ThemeColor).setTitle(`${characterName}'s Money`);
            let desc = "";
            Object.entries(player.PlayerData.money).forEach(([type, value]) => {
                desc += `**${type}:** $${value.toLocaleString("en-US")}\n`;
            });
            embed.setDescription(desc);
            return interaction.reply({ embeds: [ embed ] });
        }
        if (args.amount < 0) return interaction.sreply("Please only use positive amounts");
        const prevMoney = player.Functions.GetMoney(args.moneytype);
        if (args.add) {
            if (player.Functions.AddMoney(args.moneytype, args.amount, reason)) {
                zlog.info(`[${interaction.member.displayName}] Added ${args.amount} to ${GetPlayerName(args.id)} (${args.id})'s ${args.moneytype} [Previously: ${prevMoney}]`);
                return interaction.reply(`${characterName} (${args.id})'s ${args.moneytype} has increased from ${prevMoney} to ${player.Functions.GetMoney(args.moneytype)}`);
            } else {
                return interaction.reply("Something went wrong trying to add money to this player");
            }
        } else if (args.remove) {
            if (player.Functions.RemoveMoney(args.moneytype, args.amount, reason)) {
                zlog.info(`[${interaction.member.displayName}] Removed ${args.amount} from ${GetPlayerName(args.id)} (${args.id})'s ${args.moneytype} [Previously: ${prevMoney}]`);
                return interaction.reply(`${characterName} (${args.id})'s ${args.moneytype} has decreased from ${prevMoney} to ${player.Functions.GetMoney(args.moneytype)}`);
            } else {
                return interaction.reply("Something went wrong trying to remove money from this player");
            }
        } else if (args.set) {
            if (player.Functions.SetMoney(args.moneytype, args.amount, reason)) {
                zlog.info(`[${interaction.member.displayName}] Set ${GetPlayerName(args.id)} (${args.id})'s ${args.moneytype} to ${args.amount} [Previously: ${prevMoney}]`);
                return interaction.reply(`${characterName} (${args.id})'s ${args.moneytype} has been set to ${player.Functions.GetMoney(args.moneytype)} (Previously: ${prevMoney})`);
            } else {
                return interaction.reply("Something went wrong trying to set this player's money");
            }
        }
    }
};
