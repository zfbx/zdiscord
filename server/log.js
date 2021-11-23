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

const fetch = require("node-fetch");

class Log {
    constructor(z) {
        this.z = z;
        this.enabled = z.config.EnableLoggingWebhooks;
        this.hooks = z.config.LoggingWebhooks;

        if (this.enabled) {
            StopResource("qb-logs");
        }
    }

    /** Sends a log through to a webhook by name configured in config
     * @param {string} type - type of log/event to pick which webhook to send
     * @param {string} message - Message to log
     * @param {boolean} pingRole - Whether message should ping configured role
     * @param {string|number} color - [optional] color to have on the embed
     * @returns {boolean} - success or failure of logging event */
    async send(type, message, pingRole, color) {
        if (!this.enabled) return false;
        if (!message || !type) {
            this.z.utils.log.error("[WEBHOOK FAIL] Log without message or type not permitted");
            return false;
        }
        if (!this.z.config.LoggingWebhooks[type]) {
            this.z.utils.log.error(`[WEBHOOK FAIL] "${type}" is not defined. Message: ${message}`);
            return false;
        }
        const params = {
            username: this.z.config.LoggingWebhookName,
            embeds: [
                {
                    "description": message,
                    "color": (color || "#1e90ff"),
                },
            ],
        };
        if (pingRole) params.content = `<@&${this.z.config.LoggingAlertPingRoleId}>`;
        const reply = await fetch(z.config.LoggingWebhooks[type], {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(params),
        });
        if (!reply.ok) {
            this.z.utils.log.error(`[WEBHOOK FAIL] ${type.toLowerCase()} log failed. Message: ${message}. Error: ${reply.status}`);
            return false;
        }
        return true;
    }

}

module.exports = Log;
