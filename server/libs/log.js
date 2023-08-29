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

module.exports = {
    timestamp: (noSpaces = false) => {
        function pad(n) { return n < 10 ? "0" + n : n; }
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}${noSpaces ? "_" : " "}${pad(date.getHours())}${noSpaces ? "-" : ":"}${pad(date.getMinutes())}${noSpaces ? "-" : ":"}${pad(date.getSeconds())}`;
    },

    log: (content, { color = "\x1b[37m", tag = "LOG" } = {}) => {
        zlog.write(content, { color, tag });
        return false;
    },

    verbose: (content, { color = "\x1b[37m", tag = "LOG" } = {}) => {
        if (zconfig.VerboseLogging) zlog.write(content, { color, tag });
        return false;
    },

    info: (content, { color = "\x1b[1;36m", tag = "INF" } = {}) => {
        zlog.write(content, { color, tag });
        return false;
    },

    warn: (content, { color = "\x1b[33m", tag = "WRN" } = {}) => {
        zlog.write(content, { color, tag });
        return false;
    },

    error: (content, { color = "\x1b[1;31m", tag = "ERR" } = {}) => {
        zlog.write(content, { color, tag, error: true });
        return false;
    },

    write: (content, { color = "\x1b[37m", tag = "LOG", error = false } = {}) => {
        const stream = error ? process.stderr : process.stdout;
        stream.write(`\x1b[0m[${zlog.timestamp()}]${color}[zdiscord][${tag}]: ${zlog.clean(content)}\x1b[0m\n`);
        return false;
    },

    clean: (item) => {
        if (typeof item === "string") return item;
        const cleaned = util.inspect(item, { depth: Infinity });
        return cleaned;
    },

    assert: (statement, error) => {
        if (statement === false) {
            zlog.error(error);
            return false;
        }
        return true;
    },

    /** Special case log handler for zdiscord specifc logs
     *  Or just outright void spammy logging (heartbeats)
     * @param {string|object} err - error to process */
    handler: (type, err) => {
        const e = err.toString();
        if (e.includes("[DISALLOWEDINTENTS]")) zlog.error("YOU DID NOT ENABLE INTENTS - Go to discord.com/developers/applications click your bot, go to the bot tab and enable all 3 Privileged Gateway Intents then restart the bot");
        else if (e.includes("[TOKEN_INVALID]")) zlog.error("YOUR DISCORD API TOKEN IS INVALID OR REVOKED - GENERATE A NEW ONE AND UPDATE THE CONFIG");
        else if (e.includes("Missing Access")) zlog.error("NO COMMAND CREATION PERMISSIONS - You must reinvite the bot to your server with the invite link provided in setup");
        else if (e.includes("[HeartbeatTimer]")) return;
        else if (e.includes("Heartbeat acknowledged")) return;
        else if (type === "error") zlog.error(e);
        else if (type === "warn") zlog.warn(e);
        else if (type === "info") zlog.info(e);
        else zlog.log(e);
    },
};
