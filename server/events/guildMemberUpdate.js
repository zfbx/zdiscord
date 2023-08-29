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

module.exports = {
    name: "guildMemberUpdate",
    run: async (oldMember, newMember) => {
        // https://discord.js.org/#/docs/discord.js/stable/class/Client?scrollTo=e-guildMemberUpdate

        if (!Object.keys(inCity).includes(newMember.id)) return;

        const added = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        const removed = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if (!(added.size > 0 || removed.size > 0)) return;
        const changes = added.concat(removed).map((_, k) => k);
        // Not functioning properly?
        // if (zconfig.WhitelistEnabled) {
        //     const whitelisted = zbot.isRolePresent(newMember, zconfig.WhitelistRoleIds);
        //     if (!whitelisted) {
        //         console.log("no longer whitelisted");
        //         DropPlayer(inCity[newMember.id], Lang.t("notWhitelisted"));
        //     }
        // }
        let found = false;
        changes.forEach(k => {
            if (zconfig.AllRoles.includes(k)) found = true;
        });
        if (!found) return;

        if (zconfig.AcePermsEnabled) {

            for (const [group, _] of Object.entries(zconfig.AutoAcePermissions)) {
                ExecuteCommand(`remove_principal identifier.discord:${newMember.id} ${group}`);
            }

            for (const [group, role] of Object.entries(zconfig.AutoAcePermissions)) {
                if (zbot.isRolePresent(newMember, role)) {
                    ExecuteCommand(`add_principal identifier.discord:${newMember.id} "${group}"`);
                }
            }
        }

        ExecuteCommand(`remove_principal identifier.discord:${newMember.id} group.zdiscordstaff`);
        if (zbot.isRolePresent(newMember, zconfig.StaffChatRoleIds)) {
            ExecuteCommand(`add_principal identifier.discord:${newMember.id} group.zdiscordstaff`);
        }
    },
};
