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
        super("jail", file, {
            description: "Manage a player's jail sentence",
            role: "mod",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "sentence",
                    description: "place player in jail",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: "time",
                            description: "How long in minutes to jail player for",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "free",
                    description: "free player from jail",
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
        if (args.sentence) {
            if (args.time < 5) return interaction.sreply("Jail time need to be more than 5 seconds");
            const player = QBCore.Functions.GetPlayer(args.id);
            const d = new Date();
            // Stupid hack to replicate lua's os.date("*t") for the prison jail script is stupid..
            const currentDate = {
                ["month"]: d.getDate(),
                ["sec"]: d.getSeconds(),
                ["year"]: d.getFullYear(),
                ["day"]: (d.getDate() > 30) ? 30 : d.getDate(),
                ["min"]: d.getMinutes(),
                ["wday"]: d.getDay() + 1,
                ["isdst"]: false,
                ["yday"]: (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000,
                ["hour"]: d.getHours(),
            };
            player.Functions.SetMetaData("injail", args.time);
            player.Functions.SetMetaData("criminalrecord", { ["hasRecord"]: true, ["date"]: currentDate });
            setImmediate(() => {
                emitNet("police:client:SendToJail", args.id, parseInt(args.time));
                emitNet("QBCore:Notify", args.id, `You were sent to prison for ${args.time} months`);
            });
            zlog.info(`[${interaction.member.displayName}] jailed ${GetPlayerName(args.id)} (${args.id}) for ${args.time} seconds`);
            return interaction.reply(`${GetPlayerName(args.id)} (${args.id}) was jailed for ${args.time} months.`);
        } else if (args.free) {
            setImmediate(() => {
                emitNet("prison:client:UnjailPerson", args.id);
            });
            zlog.info(`[${interaction.member.displayName}] freed ${GetPlayerName(args.id)} (${args.id}) from jail`);
            return interaction.reply(`${GetPlayerName(args.id)} (${args.id}) was set free`);
        }
    }
};
