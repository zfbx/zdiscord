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
        super(Lang.t("cmd_clothingmenu"), file, {
            description: Lang.t("desc_clothingmenu"),
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
        if (!GetPlayerName(id)) return interaction.sreply(Lang.t("opt_id_desc"));
        setImmediate(() => {
            emitNet(zconfig.GiveClothingMenuEvent, id);
        });
        zlog.info(Lang.t("clothingmenu_log", {
            discordName: interaction.member.displayName,
            discordId: interaction.member.id,
            playerName: GetPlayerName(id),
            playerId: id,
        }));
        return interaction.sreply(Lang.t("clothingmenu_success", {
            playerName: GetPlayerName(id),
            playerId: id,
        }));
    }
};