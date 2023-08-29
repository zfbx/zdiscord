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
        super(Lang.t("cmd_checkonline"), file, {
            type: djs.ApplicationCommandType.User,
            role: "mod",
        });
    }

    async run(interaction, args) {
        const player = await zutils.getPlayerFromDiscordId(interaction.targetId);
        const user = `<@${interaction.targetId}>`;
        if (!player) return interaction.sreply(Lang.t("checkonline_offline", { user: user }));
        if (QBCore) {
            const qbplayer = QBCore.Functions.GetPlayer(parseInt(player));
            if (!qbplayer) return interaction.sreply(Lang.t("checkonline_connected", { user: user }));
            return interaction.sreply(Lang.t("checkonline_loaded", {
                user: user,
                firstName: qbplayer.PlayerData.charinfo?.firstname ?? "",
                lastName: qbplayer.PlayerData.charinfo?.lastname ?? "",
                citizenId: qbplayer.PlayerData.citizenid,
            }));
        } else if (ESX) {
            // TODO: Add esx hook
        } else {
            return interaction.sreply(Lang.t("checkonline_online", { user: user }));
        }
    }
};
