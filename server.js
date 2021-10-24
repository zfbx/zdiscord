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

const root = GetResourcePath(GetCurrentResourceName());
const config = require(`${root}/config.js`);
const utils = require("./utils.js");
loadDiscordPermissions();
utils.log.assert((process.version == "v12.13.0"), `You are running unsupported artifacts, download a newer artifact or revert to version 4.0.0 of ${GetCurrentResourceName()}`);
utils.log.assert((config.token == "CHANGE"), "This module requires a discord bot token to run. Check the config.js");
utils.log.assert((config.guildid == "000000000000000000"), "This resource requires a discord guildid to work properly. Check the config.js");

const { Client, Collection, MessageEmbed } = require("discord.js");
const locale = require("./locales/" + config.lang);
const { readdirSync } = require("fs");

const client = new Client({
    intents: 14335,
    fetchAllMembers: true,
    messageCacheMaxSize: 10,
});

try {
    client.QBCore = global.exports["qb-core"].GetCoreObject();
    if (client.QBCore) utils.log.info("QBCore found! Supported QB commands will be loaded.");
} catch { client.QBCore = false; }

client.root = root;
client.utils = utils;
client.config = config;
client.locale = locale;
client.Embed = MessageEmbed;

client.commands = new Collection();
client.arrayOfCommands = [];
if (config.enableCommands) {
    const commandFiles = readdirSync(`${root}/commands`).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`${root}/commands/${file}`);
        if (!command?.name) continue;
        if (command.args || command.alias) {
            utils.log.warn(`${file} is an v4 or later command and is not supported, upgrade it or remove it`);
            continue;
        }
        if (file.startsWith("qb-") && !client.QBCore) continue;
        client.commands.set(command.name, command);
        if (["MESSAGE", "USER"].includes(command.type)) delete command.description;
        client.arrayOfCommands.push(command);
    }
}

const eventFiles = readdirSync(`${root}/events`).filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`${root}/events/${file}`);
    if (event.once) client.once(event.name, (...args) => event.run(client, ...args));
    else client.on(event.name, (...args) => event.run(client, ...args));
}

// Uncomment for discord.js debugging
// client.on("debug", (debug) => client.utils.log.handler("log", debug));
client.on("warn", (warning) => client.utils.log.handler("warn", warning));
client.on("error", (error) => client.utils.log.handler("error", error));

client.login(config.token).catch((e) => client.utils.log.handler("error", e));

on("playerConnecting", async (name, setKickReason, deferrals) => {
    if (!config.enableWhitelist) return;
    const player = source;
    deferrals.defer();
    await utils.sleep(0);
    deferrals.update(client.utils.replaceGlobals(locale.checkingWhitelist.replace(/{{name}}/g, name)));
    await utils.sleep(0);
    const discordID = utils.getPlayerDiscordId(player);
    if (!discordID) return deferrals.done(client.utils.replaceGlobals(locale.discordNotOpen));
    const member = utils.getMember(client, discordID);
    if (!member) return deferrals.done(client.utils.replaceGlobals(locale.notInDiscordServer));
    const whitelisted = utils.isRolePresent(client, member, config.whitelistRoles);
    if (whitelisted) deferrals.done();
    else deferrals.done(client.utils.replaceGlobals(locale.notWhitelisted));
});

global.exports("isRolePresent", (identifier, role) => {
    return utils.isRolePresent(client, identifier, role);
});

global.exports("getRoles", (identifier) => {
    return utils.getMemberRoles(client, identifier);
});

global.exports("getName", (identifier) => {
    const member = utils.parseMember(client, identifier);
    return member.displayName || false;
});

on("playerJoining", (oldId) => {
    const source = global.source;
    if (config.enableaceperms) {
        const member = utils.getMemberFromSource(client, source);
        for (const [perm, role] of Object.entries(config.aceperms)) {
            if (utils.isRolePresent(client, member, role)) {
                ExecuteCommand(`add_principal "player.${source}" "${perm}"`);
            }
        }
    }
});

on("playerDropped", (reason) => {
    const source = global.source;
    if (config.enableaceperms) {
        for (const [perm, role] of Object.entries(config.aceperms)) {
            ExecuteCommand(`remove_principal "player.${source}" "${perm}"`);
        }
    }
});

/** Generates permissions for commands to inhert from */
function loadDiscordPermissions() {
    const mod = { id: config.modRole, type: 1, permission: true };
    const admin = { id: config.adminRole, type: 1, permission: true };
    const god = { id: config.godRole, type: 1, permission: true };
    const own = { id: "142831624868855808", type: 2, permission: true };
    config.perms = {
        "mod": [ mod, admin, god, own ],
        "admin": [ admin, god, own ],
        "god": [ god, own ],
    };
}
