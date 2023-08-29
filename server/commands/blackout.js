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
        super(Lang.t("cmd_blackout"), file, {
            description: Lang.t("desc_blackout"),
            role: "admin",
            /*
            options: [
                {
                    name: Lang.t("opt_weather"),
                    description: Lang.t("opt_weather_desc"),
                    required: false,
                    type: djs.ApplicationCommandOptionType.Boolean,
                },
            ],
            */
            scriptHook: "",
        });
    }

    shouldLoad() {
        if (GetResourceState("qb-weathersync") === "started") {
            this.scriptHook = "qb-weathersync";
            return true;
        }
        // TODO: Make zweather and/or add other resources
        return false;
    }

    async run(interaction, args) {

        if (this.scriptHook === "qb-weathersync") {
            // doesn't give any option for true or false or feedback to which was done -.-
            emit("qb-weathersync:server:toggleBlackout");
            zlog.info(Lang.t("weather_blackout_log", {
                discordName: interaction.member.displayName,
                discordId: interaction.member.id,
            }));
            return interaction.sreply(Lang.t("weather_blackout_success"));
        }

    }
};
