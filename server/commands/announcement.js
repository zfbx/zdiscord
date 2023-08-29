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

translations["announcement"] = {
    "en": {
        cmdName: "announcement",
        cmdDesc: "Send in city announcement",
        optionMessageDescription: "announcement to send",
    },
    "es": {
        cmdName: "anuncio",
    },
};

module.exports = class cmd extends Command {
    constructor(file) {
        super(Lang.t("cmdName", {}, translations["announcement"]), file, {
            description: Lang.t("cmdDesc", {}, translations["announcement"]),
            role: "mod",

            options: [
                {
                    name: Lang.t("opt_message"),
                    description: Lang.t("optionMessageDescription", {}, translations["announcement"]),
                    required: true,
                    type: djs.ApplicationCommandOptionType.String,
                },
            ],
        });
    }

    async run(interaction, args) {
        const message = args[Lang.t("opt_message")];
        zutils.chatMessage(-1, Lang.t("announcement"), message, { color: [ 255, 0, 0 ] });
        zlog.info(`[${interaction.member.displayName} (${interaction.member.id})] ${Lang.t("announcement")}: ${message}`);
        interaction.sreply(Lang.t("message_sent"));
    }
};
