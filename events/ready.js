/**
 * This file is part of zdiscord.
 * Copyright (C) 2021 Tony/zfbx
 * source: <https://github.com/zfbx/zdiscord>
 *
 * zdiscord is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * zdiscord is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with zdiscord. If not, see <https://www.gnu.org/licenses/>.
 */

module.exports = {
    name: "ready",
    once: true,
    run: async (client) => {
        if (config.enableCommands) {
            const guild = client.guilds.cache.get(client.config.guildid);
            if (!guild) return client.utils.log.error("DISCORD SERVER NOT FOUND - Is your config for 'DiscordGuildId' set correctly?");
            await guild.commands.set(client.arrayOfCommands).catch((error) => client.utils.log.handler("error", error)).then((cmd) => {
                const fullPermissions = cmd.reduce((accumulator, x) => {
                    const command = client.arrayOfCommands.find((y) => y.name === x.name).role;
                    if (!command) return accumulator;
                    const permissions = client.config.perms[command];
                    return [
                        ...accumulator,
                        { id: x.id, permissions },
                    ];
                }, []);
                guild.commands.permissions.set({ fullPermissions }).catch((error) => client.utils.log.handler("error", error));
            });
        }
        if (config.enableStatus && config.statusMessages) statusUpdater(client);
        client.utils.log.info(`Logged in as ${client.user.tag}`);
    },
};

async function statusUpdater(client) {
    setInterval(function() {
        try {
            const msg = client.utils.replaceGlobals(config.statusMessages[Math.floor(Math.random() * config.statusMessages.length)]);
            client.user.setActivity({ name: msg, type: "PLAYING" });
        } catch (e) {
            // Just gonna void these errors..
        }
    }, 30000);
}
