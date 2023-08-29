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
        super(Lang.t("cmd_kickall"), file, {
            description: Lang.t("desc_kickall"),
            role: "admin",

            options: [
                {
                    name: Lang.t("opt_message"),
                    description: Lang.t("kick_message_desc"),
                    required: true,
                    type: djs.ApplicationCommandOptionType.String,
                },
            ],
        });
    }

    async run(interaction, args) {
        const numberOnline = GetNumPlayerIndices();
        if (numberOnline === 0) return interaction.sreply(Lang.t("nobody_online"));
        getPlayers().forEach(async (player) => {
            DropPlayer(player, args[Lang.t("opt_message")]);
        });
        zlog.info(Lang.t("kickall_log", {
            discordName: interaction.member.displayName,
            discordId: interaction.member.id,
            playerCount: numberOnline,
            reason: reason,
        }));
        return interaction.sreply(Lang.t("kickall_success", { playerCount: numberOnline }));
    }
};
