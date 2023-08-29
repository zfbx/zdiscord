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
        super(Lang.t("cmd_whitelist"), file, {
            description: Lang.t("desc_whitelist"),
            role: "god",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_toggle_whitelist"),
                    description: Lang.t("opt_toggle_whitelist_desc"),
                    options: [
                        {
                            name: Lang.t("opt_enabled"),
                            description: Lang.t("opt_enabled_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Boolean,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_add_role"),
                    description: Lang.t("opt_add_role_desc"),
                    options: [
                        {
                            name: Lang.t("opt_role"),
                            description: Lang.t("opt_role_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Role,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_remove_role"),
                    description: Lang.t("opt_remove_role_desc"),
                    options: [
                        {
                            name: Lang.t("opt_role"),
                            description: Lang.t("opt_role_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Role,
                        },
                    ],
                },
            ],
        });
    }

    async run(interaction, args) {
        if (args[Lang.t("opt_toggle_whitelist")]) {
            const prev = zconfig.WhitelistEnabled;
            zconfig.WhitelistEnabled = args[Lang.t("opt_enabled")];
            return interaction.sreply(Lang.t("whitelist_toggle", {
                prevState: prev ? Lang.t("enabled") : Lang.t("disabled"),
                newState: args[Lang.t("opt_enabled")] ? Lang.t("enabled") : Lang.t("disabled"),
            }));
        } else if (args[Lang.t("opt_add_role")]) {
            if (zconfig.WhitelistRoleIds.includes(args[Lang.t("opt_role")])) {
                return interaction.sreply(Lang.t("whitelist_already_whitelisted", { role: `<@&${args[Lang.t("opt_role")]}>` }));
            }
            zconfig.WhitelistRoleIds.push(args[Lang.t("opt_role")]);
            return interaction.sreply(Lang.t("whitelist_added", { role: `<@&${args[Lang.t("opt_role")]}>` }));
        } else if (args[Lang.t("opt_remove_role")]) {
            if (!zconfig.WhitelistRoleIds.includes(args[Lang.t("opt_role")])) {
                return interaction.sreply(Lang.t("whitelist_not_whitelisted", { role: `<@&${args[Lang.t("opt_role")]}>` }));
            }
            zconfig.WhitelistRoleIds = zconfig.WhitelistRoleIds.filter(item => item !== args.role);
            return interaction.sreply(Lang.t("whitelist_removed", { role: `<@&${args[Lang.t("opt_role")]}>` }));
        }
    }
};
