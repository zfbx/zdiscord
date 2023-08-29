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
        super(Lang.t("cmd_revive"), file, {
            description: Lang.t("desc_revive"),
            role: "admin",

            options: [
                {
                    name: Lang.t("opt_id"),
                    description: Lang.t("opt_id_desc"),
                    required: true,
                    type: djs.ApplicationCommandOptionType.Integer,
                },
            ],
        });
    }

    async run(interaction, args) {
        const id = args[Lang.t("opt_id")];
        if (!GetPlayerName(id)) return interaction.sreply(Lang.t("invalid_id"));
        setImmediate(() => {
            emitNet(zconfig.RevivePlayerEvent, id);
        });
        zlog.info(Lang.t("revive_log", {
            discordName: interaction.member.displayName,
            discordId: interaction.member.id,
            playerName: GetPlayerName(id),
            playerId: id,
        }));
        return interaction.sreply(Lang.t("revive_success", {
            playerName: GetPlayerName(id),
            playerId: id,
        }));
    }
};
