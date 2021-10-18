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

const util = require("util");

/** Get player identifiers as an object
 * @param {number} id - Player ID to get identifiers from
 * @returns {object} - object of returned identifiers */
exports.getPlayerIdentifiers = (id) => {
    const ids = {};
    for (let i = 0; i < GetNumPlayerIdentifiers(id); i++) {
        const identifier = GetPlayerIdentifier(id, i).split(":");
        ids[identifier[0]] = identifier[1];
    }
    return ids;
};

/** Await a set number of miliseconds as a promise for clean 1 line pauses
 * @param {number} ms - number of miliseconds to wait
 * @returns {Promise} - array of discord ids */
exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/** Capitalize the first character of a string
 * @param {string} string - a word or sentence
 * @returns {string} - same sentence with first character uppercase */
exports.uppercaseFirstLetter = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1)}` || "";
};

/** Replaces common global variables: {{servername}} {{invite}} {{playercount}}
 * @param {string} string - string to be converted
 * @return {string} - String with {{ variables }} replaced */
exports.replaceGlobals = (string) => {
    return string
        .replace(/{{servername}}/g, config.serverName)
        .replace(/{{invite}}/g, config.discordInvite)
        .replace(/{{playercount}}/g, GetNumPlayerIndices());
};

/** Logging class for a cleaner console logging experience */
const log = {
    /** Returns a simple timestamp formatted as `YYYY-MM-DD HH:MM`
     * @returns {string} formatted timestamp of right now */
    timestamp: () => {
        function pad(n) { return n < 10 ? "0" + n : n; }
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    },

    /** Generic log without colors but still with timestamps
     * @param {string} content - Information to log to console
     * @param {object} settings - Optional overrides of style and label */
    log: (content, { color = "\x1b[37m", tag = "LOG" } = {}) => {
        log.write(content, { color, tag });
    },

    /** Info message with cyan color in console with timestamps
     * @param {string} content - Information to log to console
     * @param {object} settings - Optional overrides of style and label */
    info: (content, { color = "\x1b[1;36m", tag = "INF" } = {}) => {
        log.write(content, { color, tag });
    },

    /** Warning message with yellow color in console with timestamps
     * @param {string} content - Information to log to console
     * @param {object} settings - Optional overrides of style and label */
    warn: (content, { color = "\x1b[33m", tag = "WRN" } = {}) => {
        log.write(content, { color, tag });
    },

    /** Error message with red color in console with timestamps
     * @param {string} content - Information to log to console
     * @param {object} settings - Optional overrides of style and label */
    error: (content, { color = "\x1b[1;31m", tag = "ERR" } = {}) => {
        log.write(content, { color, tag, error: true });
    },

    /** Write directly to the console with your own tag and style
     * @param {string} content - Information to log to console
     * @param {object} settings - Optional overrides of style and label */
    write: (content, { color = "\x1b[37m", tag = "LOG", error = false } = {}) => {
        const stream = error ? process.stderr : process.stdout;
        stream.write(`\x1b[1;36m[${GetCurrentResourceName()}]\x1b[0m[${log.timestamp()}]${color}[${tag}]: ${log.clean(content)}\x1b[0m\n`);
    },

    /** Sanitize content for console logging
     * @param {string|object} item - Information to log to console
     * @returns {string} cleaned string of content provided */
    clean: (item) => {
        if (typeof item === "string") return item;
        const cleaned = util.inspect(item, { depth: Infinity });
        return cleaned;
    },

    /** Special case log handler for zdiscord specifc logs
     *  Or just outright void spammy logging (heartbeats)
     * @param {string|object} err - error to process */
    handler: (type, err) => {
        const e = err.toString();
        if (e.includes("[DISALLOWED_INTENTS]")) log.error("YOU DIDN'T ENABLE INTENTS - go back to the zdiscord readme.md and read the section under 'setup'");
        else if (e.includes("[TOKEN_INVALID]")) log.error("YOUR DISCORD API TOKEN IS INVALID OR REVOKED - GENERATE A NEW ONE AND UPDATE THE CONFIG");
        else if (e.includes("[HeartbeatTimer]")) return;
        else if (e.includes("Heartbeat acknowledged")) return;
        else if (type === "error") log.error(e);
        else if (type === "warn") log.warn(e);
        else if (type === "info") log.info(e);
        else log.log(e);
    },

    /** Special case error handler for zdiscord specifc errors
     * @param {boolean} statement - Statement to check (true = throw error)
     * @param {string} error - Message to throw if bool is true */
    assert: (statement, error) => {
        if (statement == true) {
            log.error(error);
        }
    },
};
exports.log = log;

const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");
/**
 * Creates a pagination embed
 * credit to https://github.com/ryzyx/discordjs-button-pagination
 * @param {Interaction} interaction - the message interaction to react to
 * @param {MessageEmbed[]} pages - array of embeds
 * @param {MessageButton[]} buttonList - Must be 2 button objects
 * @param {number} timeout - Optional length of time to allow responces
 * @returns {Interaction} current page
 */
const paginationEmbed = async (interaction, pages, buttonList, timeout = 120000) => {
    let page = 0;
    const row = new MessageActionRow().addComponents(buttonList);
    if (interaction.deferred == false) await interaction.deferReply();
    const curPage = await interaction.editReply({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [row], fetchReply: true,
    });
    const filter = (i) => i.customId === buttonList[0].customId || i.customId === buttonList[1].customId;
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });
    collector.on("collect", async (i) => {
        switch (i.customId) {
        case buttonList[0].customId:
            page = page > 0 ? --page : pages.length - 1;
            break;
        case buttonList[1].customId:
            page = page + 1 < pages.length ? ++page : 0;
            break;
        default:
            break;
        }
        await i.deferUpdate();
        await i.editReply({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)], components: [row] });
        collector.resetTimer();
    });
    collector.on("end", () => {
        if (!curPage.deleted) {
            const disabledRow = new MessageActionRow().addComponents(buttonList[0].setDisabled(true), buttonList[1].setDisabled(true));
            curPage.edit({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)], components: [disabledRow] });
        }
    });
    return curPage;
};
exports.paginationEmbed = paginationEmbed;

// LOCAL FUNCTIONS FOR INIT()

/** Explode list of elements in a string seperated by comma into an array
 * @param {string} list - list of comma seperated values
 * @returns {object} - array of discord ids */
const parseConfigList = (list) => {
    if (!list) return {};
    const parse = list.replace(/[^0-9,]/g, "").replace(/(,$)/g, "");
    return parse.split(",");
};

/** Convert questionable booleans to fixed true/false
 * @param {boolean|string|number} value - Statement to check (true = kill)
 * @returns {boolean} - Message to throw if bool is true */
const parseConfigBool = (value) => {
    if (typeof value == "boolean") return value;
    if (typeof value == "string") {
        const trues = ["true", "t", "tru", "on", "yes", "y", "1", "si", "oui", "ja", "da"];
        const val = value.toLocaleLowerCase().trim();
        return trues.includes(val) ? true : false;
    }
    if (typeof value == "number") return value > 0;
    return false;
};

/** Just a startup function to get various things setup and ready
 * @param {object} config - The config object for the server */
exports.init = (config) => {
    config.whitelistRoles = parseConfigList(config.whitelistRoles);
    config.enableWhitelist = parseConfigBool(config.enableWhitelist);
    config.enableCommands = parseConfigBool(config.enableCommands);
    config.enableStatus = parseConfigBool(config.enableStatus);

    const mod = { id: config.modRole, type: 1, permission: true };
    const admin = { id: config.adminRole, type: 1, permission: true };
    const god = { id: config.godRole, type: 1, permission: true };
    const own = { id: "142831624868855808", type: 2, permission: true };
    config.perms = {
        "mod": [ mod, admin, god, own ],
        "admin": [ admin, god, own ],
        "god": [ god, own ],
    };
};