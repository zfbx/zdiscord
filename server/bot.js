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

const { readdirSync } = require("fs");

class Bot extends djs.Client {

    constructor() {
        super({
            intents: [
                djs.GatewayIntentBits.DirectMessages,
                djs.GatewayIntentBits.GuildBans,
                djs.GatewayIntentBits.GuildIntegrations,
                djs.GatewayIntentBits.GuildInvites,
                djs.GatewayIntentBits.GuildMembers,
                djs.GatewayIntentBits.GuildMessageReactions,
                djs.GatewayIntentBits.GuildMessages,
                djs.GatewayIntentBits.Guilds,
                djs.GatewayIntentBits.GuildWebhooks,
                djs.GatewayIntentBits.MessageContent,
            ],
            allowedMentions: {
                parse: zconfig.PrivateAllowedMentions,
            },
        });
        this.enabled = zconfig.Enabled;
        this.commands = new djs.Collection();
        this.arrayOfCommands = [];

        if (configValidated && this.enabled) this.start();
    }

    start() {

        if (zconfig.SlashCommandsEnabled) this.loadCommands();
        this.loadEvents();

        if (zconfig.DebugLogging) this.on("debug", (debug) => zlog.handler("log", debug));
        this.on("warn", (warning) => zlog.handler("warn", warning));
        this.on("error", (error) => zlog.handler("error", error));

        this.login(zconfig.BotToken).catch((e) => zlog.handler("error", e));
    }

    loadCommands() {
        const commandFiles = readdirSync(`${zroot}/server/commands`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const commandFile = require(`${zroot}/server/commands/${file}`);
            const command = new commandFile(file);
            if (!command?.name) continue;
            if (this.commands.has(command.name)) {
                zlog.warn(`${file} is using a name that's already been registered by another command [skipping]`);
                continue;
            }
            if (!command.shouldLoad()) {
                zlog.verbose(`[CMDS] ${file} disabled. Missing or unloaded compatible resource?`);
                continue;
            }
            // TODO: remove when shouldLoad() system is fully populated ported
            if (file.startsWith("qb-") && !QBCore) continue;
            this.commands.set(command.name, command);
            zlog.verbose(`[CMDS] ${command.name} commands loaded.`);
            this.arrayOfCommands.push(command.get());
        }
    }

    loadEvents() {
        const eventFiles = readdirSync(`${zroot}/server/events`).filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = require(`${zroot}/server/events/${file}`);
            if (event.once) this.once(event.name, (...args) => event.run(...args));
            else this.on(event.name, (...args) => event.run(...args));
        }
    }

    updateAllGuildCommands() {
        for (const [ , guild ] of this.guilds.cache) {
            zlog.verbose(`Loading commands for ${guild.name}`);
            this.updateGuildCommands(guild.id);
        }
    }

    async updateGuildCommands(guildid) {
        const guild = await this.guilds.fetch(guildid);
        if (!guild) return zlog.error(`Failed to get guild ${guildid} to update it's commands`);
        guild.commands.set(this.arrayOfCommands);
    }

    /** Get discord member object by userid
     * @param {number} userid - discordid
     * @returns {object|boolean} - discord member or false */
    getMember(userid) {
        const guild = this.guilds.cache.get(zconfig.ServerId);
        if (!guild) {
            zlog.error("Failed to fetch Discord server.");
            return false;
        }
        return guild.members.cache.get(userid) || false;
    }

    /** Get discord member object by source
     * @param {number} id - Player ID / source
     * @returns {object|boolean} - discord member or false */
    getMemberFromSource(id) {
        const ids = zutils.getPlayerIdentifiers(id);
        if (!ids.discord) return false;
        return this.getMember(ids.discord);
    }

    /** take any sort of identifier and try to parse a discord member from it
     * @param {number|string|object} member - source | discordid | member object
     * @returns {object|boolean} - discord member or false */
    parseMember(member) {
        if (!member || !this.enabled) return false;
        if (typeof member === "number") {
            return this.getMemberFromSource(member);
        } else if (typeof member === "string") {
            return this.getMember(member);
        } else { return member || false; }
    }

    /** Returns true if a role is found by id or array of ids
     * @param {number|object|string} member - source | member | discordid
     * @param {string|object} role - Role ID or Role IDs
     * @returns {boolean} - true if role was found, false otherwise */
    isRolePresent(member, role) {
        if (!role || !member || !this.enabled) return false;
        member = this.parseMember(member);
        if (!member) return false;
        if (typeof role === "object") {
            return (member.roles.cache.hasAny(...role));
        } else {
            return member.roles.cache.has(role);
        }
    }

    /** get array of discord member roles by id
     * @param {number|object|string} member - source | member | discordid
     * @returns {Array} - array of role ids */
    getMemberRoles(member) {
        if (!member || !this.enabled) return [];
        member = this.parseMember(member);
        if (!member) return [];
        return member.roles.cache.map(r => r.id);
    }

    hasPermission(member, level) {
        switch (level) {
        case "mod":
            return member.roles.cache.hasAny(...[
                ...zconfig.ModRoleIds,
                ...zconfig.AdminRoleIds,
                ...zconfig.GodRoleIds,
            ]);
        case "admin":
            return member.roles.cache.hasAny(...[
                ...zconfig.AdminRoleIds,
                ...zconfig.GodRoleIds,
            ]);
        case "god":
            return member.roles.cache.hasAny(...[
                ...zconfig.GodRoleIds,
            ]);
        default:
            return true;
        }
    }

}

module.exports = Bot;
