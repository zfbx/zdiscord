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
        super(Lang.t("cmd_reviveall"), file, {
            description: Lang.t("desc_reviveall"),
            role: "god",
        });
    }

    async run(interaction, args) {
        setImmediate(() => {
            emitNet(zconfig.RevivePlayerEvent, -1);
        });
        zlog.info(Lang.t("reviveall_log", {
            discordName: interaction.member.displayName,
            discordId: interaction.member.id,
        }));
        return interaction.sreply(Lang.t("reviveall_success"));
    }
};
