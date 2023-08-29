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
    name: "ready",
    once: true,
    run: async () => {
        if (zconfig.SlashCommandsEnabled) {
            zbot.updateAllGuildCommands();
        }
        const guild = zbot.guilds.cache.get(zconfig.ServerId);
        if (!guild) return zlog.error("DISCORD SERVER NOT FOUND - Is your config for 'ServerId' set correctly?");
        else await guild.members.fetch();
        if (zconfig.StatusMessages.length > 0) statusUpdater();
        zlog.info(`Logged in as ${zbot.user.tag}`);
        zlog.info("Enjoying zdiscord? Consider supporting it at patreon.com/zfbx or paypal.me/zfbx <3");
        emit("zdiscord:ready");
    },
};

async function statusUpdater() {
    setInterval(function() {
        try {
            const msg = zutils.replaceGlobals(zconfig.StatusMessages[Math.floor(Math.random() * zconfig.StatusMessages.length)]);
            zbot.user.setActivity({ name: msg, type: "PLAYING" });
        } catch (e) {
            // Just gonna void these errors..
        }
    }, 20000);
}
