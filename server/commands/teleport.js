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
        super(Lang.t("cmd_teleport"), file, {
            description: Lang.t("desc_teleport"),
            role: "mod",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_coords"),
                    description: Lang.t("opt_coords_desc"),
                    options: [
                        {
                            name: Lang.t("opt_id"),
                            description: Lang.t("opt_id_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
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
                            description: Lang.t("opt_z_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Number,
                        },
                        {
                            name: Lang.t("opt_bring_vehicle"),
                            description: Lang.t("opt_bring_vehicle_desc"),
                            required: false,
                            type: djs.ApplicationCommandOptionType.Boolean,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_preset"),
                    description: Lang.t("opt_preset_desc"),
                    options: [
                        {
                            name: Lang.t("opt_id"),
                            description: Lang.t("opt_id_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: Lang.t("opt_location"),
                            description: Lang.t("opt_location_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                            autocomplete: true,
                        },
                        {
                            name: Lang.t("opt_bring_vehicle"),
                            description: Lang.t("opt_bring_vehicle_desc"),
                            required: false,
                            type: djs.ApplicationCommandOptionType.Boolean,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_to_player"),
                    description: Lang.t("opt_to_player_desc"),
                    options: [
                        {
                            name: Lang.t("opt_id"),
                            description: Lang.t("opt_id_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: Lang.t("opt_dest_player"),
                            description: Lang.t("opt_dest_player_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: Lang.t("opt_bring_vehicle"),
                            description: Lang.t("opt_bring_vehicle_desc"),
                            required: false,
                            type: djs.ApplicationCommandOptionType.Boolean,
                        },
                    ],
                },
            ],
        });
    }

    async run(interaction, args) {
        const id = args[Lang.t("opt_id")];
        const bringVehicle = args[Lang.t("opt_bring_vehicle")] ?? false;
        if (!GetPlayerName(id)) return interaction.sreply(Lang.t("invalid_id"));
        if (args[Lang.t("opt_coords")]) {
            this.teleport(id, args.x, args.y, args.z, bringVehicle);
            zlog.info(Lang.t("teleport_log", {
                discordName: interaction.member.displayName,
                discordId: interaction.member.id,
                playerName: GetPlayerName(id),
                playerId: id,
                where: `${args.x}, ${args.y}, ${args.z}`,
            }));
            return interaction.reply(Lang.t("teleport_success", {
                playerName: GetPlayerName(id),
                playerId: id,
                where: `${args.x}, ${args.y}, ${args.z}`,
            }));
        } else if (args[Lang.t("opt_preset")]) {
            const location = zconfig.teleportLocations[args[Lang.t("opt_location")]];
            if (!location) return interaction.sreply(Lang.t("invalid_item", { item: Lang.t("opt_location") }));
            this.teleport(id, location.coords[0], location.coords[1], location.coords[2], bringVehicle);
            zlog.info(Lang.t("teleport_log", {
                discordName: interaction.member.displayName,
                discordId: interaction.member.id,
                playerName: GetPlayerName(id),
                playerId: id,
                where: location.name,
            }));
            return interaction.sreply(Lang.t("teleport_success", {
                playerName: GetPlayerName(id),
                playerId: id,
                where: location.name,
            }));
        } else if (args[Lang.t("opt_to_player")]) {
            const dest = args[Lang.t("opt_dest_player")];
            if (!GetPlayerPed(dest)) return interaction.sreply(Lang.t("invalid_item", { item: Lang.t("opt_dest_player") }));
            const [x, y, z] = GetEntityCoords(GetPlayerPed(dest));
            this.teleport(id, x, y, z, bringVehicle);
            zlog.info(Lang.t("teleport_log", {
                discordName: interaction.member.displayName,
                discordId: interaction.member.id,
                playerName: GetPlayerName(id),
                playerId: id,
                where: `${GetPlayerName(dest)} (id: ${dest}, x: ${x}, y: ${y}, z: ${z})`,
            }));
            return interaction.sreply(Lang.t("teleport_success", {
                playerName: GetPlayerName(id),
                playerId: id,
                where: `${GetPlayerName(dest)} (${x}, ${y}, ${z})`,
            }));
        }
    }

    teleport(id, xc, yc, zc, withVehicle = false) {
        xc = xc.toFixed(2);
        yc = yc.toFixed(2);
        zc = zc.toFixed(2);
        if (NetworkGetEntityOwner(GetPlayerPed(id)) == id) {
            setImmediate(() => {
                emitNet("zdiscord:teleport", id, xc, yc, zc, withVehicle);
            });
        } else {
            setImmediate(() => {
                SetEntityCoords(GetPlayerPed(id), xc, yc, zc);
            });
        }
    }

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const filtered = Object.values(zconfig.teleportLocations).filter(choice => choice.search.includes(focusedValue)).slice(0, 20);
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.id })),
        );
    }
};

