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

    /** Get player identifiers as an object
    * @param {number} id - Player ID to get identifiers from
    * @returns {object} - object of returned identifiers */
    getPlayerIdentifiers: (id) => {
        const ids = {};
        for (let i = 0; i < GetNumPlayerIdentifiers(id); i++) {
            const identifier = GetPlayerIdentifier(id, i).split(":");
            ids[identifier[0]] = identifier[1];
        }
        return ids;
    },

    /** Get player's discord id from source
     * @param {number} id - Player ID to get identifiers from
     * @returns {string|boolean} - discord id or false */
    getPlayerDiscordId: (id) => {
        const ids = zutils.getPlayerIdentifiers(id);
        return ids["discord"] || false;
    },

    /** Get player source from discord id
     * @param {string} discordid - Discord ID
     * @returns {string|boolean} - source or false */
    getPlayerFromDiscordId: async (discordid) => {
        let player = false;
        getPlayers().some(async function(p, i, a) {
            const id = zutils.getPlayerDiscordId(p);
            if (id == discordid) {
                player = p;
                return true;
            }
            return false;
        });
        return player;
    },

    /** Await a set number of miliseconds as a promise for clean 1 line pauses
     * @param {number} ms - number of miliseconds to wait
     * @returns {Promise} - array of discord ids */
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /** Capitalize the first character of a string
     * @param {string} string - a word or sentence
     * @returns {string} - same sentence with first character uppercase */
    uppercaseFirstLetter: (string) => {
        return `${string[0].toUpperCase()}${string.slice(1)}` || "";
    },

    /** Replaces common global variables: {servername} {invite} {playercount}
     * @param {string} string - string to be converted
     * @return {string} - String with { variables } replaced */
    replaceGlobals: (string) => {
        return string
            .replace(/{servername}/g, zconfig.FivemName)
            .replace(/{invite}/g, zconfig.Invite)
            .replace(/{playercount}/g, GetNumPlayerIndices());
    },

    /** Check if role or server id looks at least somewhat correct
     * @param {string} id - role id
     * @returns {boolean} - whether ID looks correct */
    isValidID: (id) => {
        if (id.includes("00000000")) return false;
        return /^\d{16,23}$/.test(id);
    },

    /** Returns convar or default value fixed to a true/false boolean
     * @param {string} con - Convar name
     * @param {boolean|string|number} def - Default fallback value
     * @returns {boolean} - parsed bool */
    getConBool: (con, def) => {
        if (typeof def == "boolean") def = def.toString();
        const ret = GetConvar(con, def);
        if (typeof ret == "boolean") return ret;
        if (typeof ret == "string") return ["true", "on", "yes", "y", "1"].includes(ret.toLowerCase().trim());
        if (typeof ret == "number") return ret > 0;
        return false;
    },

    /** Returns convar or default value fixed to a true/false boolean
     * @param {string} con - Convar name
     * @param {array} def - Default fallback value
     * @returns {array} - parsed bool */
    getConArray: (con, def) => {
        const ret = GetConvar(con, "DefaultValue");
        if (ret === "DefaultValue") return def;
        if (ret.includes("[")) {
            try {
                return JSON.parse(ret);
            } catch (e) {
                zlog.error(`convar ${con} is not formatted correctly as an array. should be like: [ "item1", "item2" ]`);
                return def;
            }
        }
        return ret.replaceAll(" ", "").split(",").filter(v => v !== "");
    },

    isGTA: () => {
        return GetConvar("gamename", "gta5") === "gta5";
    },

    isRDR: () => {
        return GetConvar("gamename", "gta5") === "rdr3";
    },

    /** send staff message to all staff in game with it enabled
     * @param {object} z - z
     * @param {string} name - Name the message is from
     * @param {string} msg - message to send */
    sendStaffChatMessage: (name, msg) => {
        if (!msg) return;
        getPlayers().forEach(async function(player, index, array) {
            if (IsPlayerAceAllowed(player, "zdiscord.staffchat")) {
                zutils.chatMessage(player, `[${Lang.t("staffchat")}] ${name}`, msg, { multiline: false, color: [ 255, 100, 0 ] });
            }
        });
    },

    /** send chat message
     * @param {number} destination - source id or -1 for all
     * @param {string} label - Name the message is from
     * @param {string} msg - message to send
     * @param {object} options - options:  array color[r, g, b], bool multiline */
    chatMessage: (destination, label, msg, options) => {
        if (!options) { options = {}; }
        TriggerClientEvent("chat:addMessage", destination, {
            color: (options.color || [ 255, 255, 255 ]),
            multiline: options.multiline || false,
            args: [ label, msg ],
        });
    },

};
