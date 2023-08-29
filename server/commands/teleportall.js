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
        super(Lang.t("cmd_teleportall"), file, {
            description: Lang.t("desc_teleportall"),
            role: "god",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_coords"),
                    description: Lang.t("opt_coords_desc"),
                    options: [
                        {
                            name: "x",
                            description: Lang.t("opt_x_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Number,
                        },
                        {
                            name: "y",
                            description: Lang.t("opt_y_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Number,
                        },
                        {
                            name: "z",
                            description:  Lang.t("opt_z_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Number,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_preset"),
                    description: Lang.t("opt_preset_desc"),
                    options: [
                        {
                            name: Lang.t("opt_location"),
                            description: Lang.t("opt_location_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                            autocomplete: true,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_to_player"),
                    description: Lang.t("opt_to_player_desc"),
                    options: [
                        {
                            name: Lang.t("opt_dest_player"),
                            description: Lang.t("opt_dest_player_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                    ],
                },
            ],
        });
    }

    async run(interaction, args) {
        if (args[Lang.t("opt_coords")]) {
            this.teleportEveryone(args.x, args.y, args.z);
            zlog.info(Lang.t("teleporall_log", {
                discordName: interaction.member.displayName,
                discordId: interaction.member.id,
                where: `${args.x}, ${args.y}, ${args.z}`,
            }));
            return interaction.sreply(Lang.t("teleportall_success", { where: `${args.x}, ${args.y}, ${args.z}` }));
        } else if (args[Lang.t("opt_preset")]) {
            const loc = args[Lang.t("opt_location")];
            const location = zconfig.teleportLocations[loc];
            if (!location) return interaction.sreply(Lang.t("invalid_item", { item: Lang.t("opt_location") }));
            this.teleportEveryone(location.coords[0], location.coords[1], location.coords[2]);
            zlog.info(Lang.t("teleporall_log", {
                discordName: interaction.member.displayName,
                discordId: interaction.member.id,
                where: loc,
            }));
            return interaction.sreply(Lang.t("teleportall_success", { where: loc }));
        } else if (args[Lang.t("opt_to_player")]) {
            const dest = args[Lang.t("opt_dest_player")];
            if (!GetPlayerPed(dest)) return interaction.sreply(Lang.t("invalid_item", { item: Lang.t("opt_dest_player") }));
            const [x, y, z] = GetEntityCoords(GetPlayerPed(dest));
            this.teleportEveryone(x, y, z);
            zlog.info(Lang.t("teleporall_log", {
                discordName: interaction.member.displayName,
                discordId: interaction.member.id,
                where: `${GetPlayerName(dest)} (id: ${dest}, x: ${x}, y: ${y}, z: ${z})`,
            }));
            return interaction.sreply(Lang.t("teleportall_success", {
                where: `${GetPlayerName(dest)} (${x}, ${y}, ${z})`,
            }));
        }
    }

    teleportEveryone(xc, yc, zc) {
        xc = xc.toFixed(2);
        yc = yc.toFixed(2);
        zc = zc.toFixed(2);
        setImmediate(() => {
            emitNet("zdiscord:teleport", -1, xc, yc, zc, false);
        });
    }

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const filtered = Object.values(zconfig.teleportLocations).filter(choice => choice.search.includes(focusedValue)).slice(0, 20);
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.id })),
        );
    }
};
