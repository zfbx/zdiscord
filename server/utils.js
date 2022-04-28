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

const util = require("util");


/** Get player identifiers as an object
 * @param {number} id - Player ID to get identifiers from
 * @returns {object} - object of returned identifiers */
const getPlayerIdentifiers = (id) => {
    const ids = {};
    for (let i = 0; i < GetNumPlayerIdentifiers(id); i++) {
        const identifier = GetPlayerIdentifier(id, i).split(":");
        ids[identifier[0]] = identifier[1];
    }
    return ids;
};
exports.getPlayerIdentifiers = getPlayerIdentifiers;


/** Get player's discord id from source
 * @param {number} id - Player ID to get identifiers from
 * @returns {string|boolean} - discord id or false */
const getPlayerDiscordId = (id) => {
    const ids = getPlayerIdentifiers(id);
    return ids["discord"] || false;
};
exports.getPlayerDiscordId = getPlayerDiscordId;


/** Get player source from discord id
 * @param {string} discordid - Discord ID
 * @returns {string|boolean} - source or false */
const getPlayerFromDiscordId = async (discordid) => {
    let player = false;
    getPlayers().some(async function(p, i, a) {
        const id = getPlayerDiscordId(p);
        if (id == discordid) {
            player = p;
            return true;
        }
        return false;
    });
    return player;
};
exports.getPlayerFromDiscordId = getPlayerFromDiscordId;


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


/** Replaces common global variables: {servername} {invite} {playercount}
 * @param {string} string - string to be converted
 * @return {string} - String with { variables } replaced */
exports.replaceGlobals = (z, string) => {
    return string
        .replace(/{servername}/g, z.config.FiveMServerName)
        .replace(/{invite}/g, z.config.DiscordInviteLink)
        .replace(/{playercount}/g, GetNumPlayerIndices());
};


/** Logging class for a cleaner console logging experience */
const log = {
    /** Returns a simple timestamp formatted as `YYYY-MM-DD HH:MM`
     * @returns {string} formatted timestamp of right now */
    timestamp: (noSpaces = false) => {
        function pad(n) { return n < 10 ? "0" + n : n; }
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}${noSpaces ? "_" : " "}${pad(date.getHours())}${noSpaces ? "-" : ":"}${pad(date.getMinutes())}${noSpaces ? "-" : ":"}${pad(date.getSeconds())}`;
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
        return false;
    },

    /** Write directly to the console with your own tag and style
     * @param {string} content - Information to log to console
     * @param {object} settings - Optional overrides of style and label */
    write: (content, { color = "\x1b[37m", tag = "LOG", error = false } = {}) => {
        const stream = error ? process.stderr : process.stdout;
        stream.write(`\x1b[1;36m[zdiscord]\x1b[0m[${log.timestamp()}]${color}[${tag}]: ${log.clean(content)}\x1b[0m\n`);
        return false;
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
        if (e.includes("[DISALLOWED_INTENTS]")) log.error("YOU DIDN'T ENABLE INTENTS - go back to the zdiscord readme.md and read the section under \"setup\"");
        else if (e.includes("[TOKEN_INVALID]")) log.error("YOUR DISCORD API TOKEN IS INVALID OR REVOKED - GENERATE A NEW ONE AND UPDATE THE CONFIG");
        else if (e.includes("Missing Access")) log.error("NO COMMAND CREATION PERMISSIONS - You must reinvite the bot to your server with the invite link provided in setup");
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


/** Check if role or server id looks at least somewhat correct
 * @param {string} id - role id
 * @returns {boolean} - whether ID looks correct */
const isValidID = (id) => {
    return /^\d{17,21}$/.test(id);
};
exports.isValidID = isValidID;


/** send staff message to all staff in game with it enabled
 * @param {object} z - z
 * @param {string} name - Name the message is from
 * @param {string} msg - message to send */
const sendStaffChatMessage = (z, name, msg) => {
    if (!msg) return;
    getPlayers().forEach(async function(player, index, array) {
        if (IsPlayerAceAllowed(player, "zdiscord.staffchat")) {
            chatMessage(player, `[${z.locale.staffchat}] ${name}`, msg, { multiline: false, color: [ 255, 100, 0 ] });
        }
    });
};
exports.sendStaffChatMessage = sendStaffChatMessage;


/** send chat message
 * @param {number} destination - source id or -1 for all
 * @param {string} label - Name the message is from
 * @param {string} msg - message to send
 * @param {object} options - options:  array color[r, g, b], bool multiline */
const chatMessage = (destination, label, msg, options) => {
    if (!options) { options = {}; }
    TriggerClientEvent("chat:addMessage", destination, {
        color: (options.color || [ 255, 255, 255 ]),
        multiline: options.multiline || false,
        args: [ label, msg ],
    });
};
exports.chatMessage = chatMessage;
