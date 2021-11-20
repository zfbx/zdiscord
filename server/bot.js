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

console.log(config.languageLocaleCode);
const { Client, Collection, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");


utils.log.assert((process.version == "v12.13.0"), `You are running unsupported artifacts, download a newer artifact or revert to version 4.0.0 of ${GetCurrentResourceName()}`);
utils.log.assert((config.DiscordBotToken == "CHANGE"), "This module requires a discord bot token to run. Check the config.js");
utils.log.assert((config.DiscordGuildId == "000000000000000000"), "This resource requires a discord guildid to work properly. Check the config.js");
utils.log.assert(!(utils.isValidID(config.DiscordGuildId)), "Your DiscordGuildId doesn't seem correct");
utils.log.assert(!(utils.isValidID(config.DiscordModRoleId)), "Your DiscordModRoleId doesn't seem correct");
utils.log.assert(!(utils.isValidID(config.DiscordAdminRoleId)), "Your DiscordAdminRoleId doesn't seem correct");
utils.log.assert(!(utils.isValidID(config.DiscordGodRoleId)), "Your DiscordGodRoleId doesn't seem correct");
utils.log.assert(config.EnableStaffChatForwarding && !(utils.isValidID(config.DiscordStaffChannelId)), "Your DiscordStaffChannelId doesn't seem correct");

const client = new Client({
    intents: 14335,
    fetchAllMembers: true,
    messageCacheMaxSize: 10,
});

client.root = root;
client.utils = utils;
client.config = config;
client.locale = locale;
client.Embed = MessageEmbed;

try {
    client.QBCore = global.exports["qb-core"].GetCoreObject();
    if (client.QBCore) utils.log.info("QBCore found! Supported QB commands will be loaded.");
} catch { client.QBCore = false; }


client.commands = new Collection();
client.arrayOfCommands = [];
if (config.EnableDiscordSlashCommands) {
    const commandFiles = readdirSync(`${root}/server/commands`).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`${root}/server/commands/${file}`);
        if (!command?.name) continue;
        if (command.args || command.alias) {
            utils.log.warn(`${file} is an v4 or later command and is not supported, upgrade it or remove it`);
            continue;
        }
        if (!command.version || command.version < 6) {
            utils.log.warn(`${file} is an outdated command - check the github for updated commands`);
            continue;
        }
        if (client.commands.has(command.name)) {
            utils.log.warn(`${file} is using a name that's already been registered by another command [skipping]`);
            continue;
        }
        if (file.startsWith("qb-") && !client.QBCore) continue;
        client.commands.set(command.name, command);
        if (["MESSAGE", "USER"].includes(command.type)) delete command.description;
        client.arrayOfCommands.push(command);
    }
}

const eventFiles = readdirSync(`${root}/server/events`).filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`${root}/server/events/${file}`);
    if (event.once) client.once(event.name, (...args) => event.run(client, ...args));
    else client.on(event.name, (...args) => event.run(client, ...args));
}

// Uncomment for discord.js debugging
// client.on("debug", (debug) => client.utils.log.handler("log", debug));
client.on("warn", (warning) => client.utils.log.handler("warn", warning));
client.on("error", (error) => client.utils.log.handler("error", error));

client.login(config.DiscordBotToken).catch((e) => client.utils.log.handler("error", e));


module.exports = client;
