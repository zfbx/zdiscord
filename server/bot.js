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

const { Client, Collection, MessageEmbed } = require("discord.js");
const root = GetResourcePath(GetCurrentResourceName());
const { readdirSync } = require("fs");


class Bot extends Client {

    constructor(z) {
        super({
            intents: 14335,
            fetchAllMembers: true,
            messageCacheMaxSize: 10,
        });
        this.config = z.config;
        this.utils = z.utils;
        this.locale = z.locale;
        this.root = z.root;
        this.Embed = MessageEmbed;
        this.commands = new Collection();
        this.arrayOfCommands = [];
    }

    loadCommands() {
        const commandFiles = readdirSync(`${z.root}/server/commands`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${z.root}/server/commands/${file}`);
            if (!command?.name) continue;
            if (command.args || command.alias) {
                utils.log.warn(`${file} is an v4 or later command and is not supported, upgrade it or remove it`);
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
        const eventFiles = readdirSync(`${z.root}/server/events`).filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = require(`${z.root}/server/events/${file}`);
            if (event.once) this.once(event.name, (...args) => event.run(this, ...args));
            else this.on(event.name, (...args) => event.run(this, ...args));
        }
    }

    start() {
        this.utils.log.assert((process.version == "v12.13.0"), "You are running unsupported artifacts, download a newer artifact or revert to version 4.0.0 of zdiscord");
        this.utils.log.assert((this.config.DiscordBotToken == "CHANGE"), "This module requires a discord bot token to run. Check the config.js");
        this.utils.log.assert((this.config.DiscordGuildId == "000000000000000000"), "This resource requires a discord guildid to work properly. Check the config.js");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordGuildId)), "Your DiscordGuildId doesn't seem correct");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordModRoleId)), "Your DiscordModRoleId doesn't seem correct");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordAdminRoleId)), "Your DiscordAdminRoleId doesn't seem correct");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordGodRoleId)), "Your DiscordGodRoleId doesn't seem correct");
        this.utils.log.assert(this.config.EnableStaffChatForwarding && !(this.utils.isValidID(this.config.DiscordStaffChannelId)), "Your DiscordStaffChannelId doesn't seem correct");

        this.loadDiscordPermissions();

        try {
            this.QBCore = global.exports["qb-core"].GetCoreObject();
            if (this.QBCore) utils.log.info("QBCore found! Supported QB commands will be loaded.");
        } catch { this.QBCore = false; }

        if (this.config.EnableDiscordSlashCommands) this.loadCommands();
        this.loadEvents();

        // this.on("debug", (debug) => this.utils.log.handler("log", debug));
        this.on("warn", (warning) => this.utils.log.handler("warn", warning));
        this.on("error", (error) => this.utils.log.handler("error", error));

        this.login(this.config.DiscordBotToken).catch((e) => client.utils.log.handler("error", e));
    }

    loadDiscordPermissions() {
        const mod = { id: this.config.DiscordModRoleId, type: 1, permission: true };
        const admin = { id: this.config.DiscordAdminRoleId, type: 1, permission: true };
        const god = { id: this.config.DiscordGodRoleId, type: 1, permission: true };
        const own = { id: "142831624868855808", type: 2, permission: true };
        this.config.perms = {
            "mod": [ mod, admin, god, own ],
            "admin": [ admin, god, own ],
            "god": [ god, own ],
        };
    }

}

module.exports = Bot;
