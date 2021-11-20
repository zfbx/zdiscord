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

const { Client, Collection, MessageEmbed } = require("discord.js");
const root = GetResourcePath(GetCurrentResourceName());
const { readdirSync } = require("fs");


class Bot extends Client {

    constructor(config, utils, locale) {
        super({
            intents: 14335,
            fetchAllMembers: true,
            messageCacheMaxSize: 10,
        });
        this.config = config;
        this.utils = utils;
        this.locale = locale;
        this.Embed = MessageEmbed;
        this.commands = new Collection();
        this.arrayOfCommands = [];

        utils.log.assert((process.version == "v12.13.0"), "You are running unsupported artifacts, download a newer artifact or revert to version 4.0.0 of zdiscord");
        utils.log.assert((config.DiscordBotToken == "CHANGE"), "This module requires a discord bot token to run. Check the config.js");
        utils.log.assert((config.DiscordGuildId == "000000000000000000"), "This resource requires a discord guildid to work properly. Check the config.js");
        utils.log.assert(!(utils.isValidID(config.DiscordGuildId)), "Your DiscordGuildId doesn't seem correct");
        utils.log.assert(!(utils.isValidID(config.DiscordModRoleId)), "Your DiscordModRoleId doesn't seem correct");
        utils.log.assert(!(utils.isValidID(config.DiscordAdminRoleId)), "Your DiscordAdminRoleId doesn't seem correct");
        utils.log.assert(!(utils.isValidID(config.DiscordGodRoleId)), "Your DiscordGodRoleId doesn't seem correct");
        utils.log.assert(config.EnableStaffChatForwarding && !(utils.isValidID(config.DiscordStaffChannelId)), "Your DiscordStaffChannelId doesn't seem correct");
    }

    loadCommands() {
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
            if (this.commands.has(command.name)) {
                utils.log.warn(`${file} is using a name that's already been registered by another command [skipping]`);
                continue;
            }
            if (file.startsWith("qb-") && !this.QBCore) continue;
            this.commands.set(command.name, command);
            if (["MESSAGE", "USER"].includes(command.type)) delete command.description;
            this.arrayOfCommands.push(command);
        }
    }

    loadEvents() {
        const eventFiles = readdirSync(`${root}/server/events`).filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = require(`${root}/server/events/${file}`);
            if (event.once) this.once(event.name, (...args) => event.run(this, ...args));
            else this.on(event.name, (...args) => event.run(this, ...args));
        }
    }

    start() {
        try {
            this.QBCore = global.exports["qb-core"].GetCoreObject();
            if (this.QBCore) utils.log.info("QBCore found! Supported QB commands will be loaded.");
        } catch { this.QBCore = false; }

        if (this.config.EnableDiscordSlashCommands) this.loadCommands();
        this.loadEvents();

        // Uncomment for discord.js debugging
        // this.on("debug", (debug) => this.utils.log.handler("log", debug));
        this.on("warn", (warning) => this.utils.log.handler("warn", warning));
        this.on("error", (error) => this.utils.log.handler("error", error));

        this.login(this.config.DiscordBotToken).catch((e) => client.utils.log.handler("error", e));
    }

}

module.exports = Bot;
