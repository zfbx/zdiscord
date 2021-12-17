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

const { MessageEmbed, WebhookClient } = require("discord.js");

class Log {
    constructor(z) {
        this.z = z;
        this.enabled = z.config.EnableLoggingWebhooks;
        this.hooks = {};

        if (this.enabled) {
            StopResource("qb-logs");
            let count = 0;
            Object.entries(z.config.LoggingWebhooks).forEach(entry => {
                const [key, value] = entry;
                const k = key.toLocaleLowerCase();
                if (this.hooks[k]) return client.z.utils.log.write(`Webhook for ${k} has already been registered. Remove the duplicate key`, { tag: "WEBHOOK", error: true });
                const id = value.split("/").at(-2);
                const token = value.split("/").at(-1);
                if (id.length < 16 || id.length > 28 || token.length < 50 || token.length > 80) {
                    return this.z.utils.log.write(`Webhook for ${k} seems to be incorrect, check it's value.`, { tag: "WEBHOOK", error: true });
                }
                this.hooks[k] = new WebhookClient({ id: id, token: token, url: value });
                count++;
            });
            this.z.utils.log.info(`${count} webhooks loaded.`, { tag: "WEBHOOK" });
        }
        global.exports("log", async (type, message, pingRole, color) => {
            return z.log.send(type, message, { pingRole: pingRole, color: color });
        });
    }

    /** Sends a log through to a webhook by name configured in config
     * @param {string} type - type of log/event to pick which webhook to send
     * @param {string} message - Message to log
     * @param {boolean} pingRole - Whether message should ping configured role
     * @param {object} options - pingRole, color, username, pingId
     * @returns {boolean} - success or failure of logging event */
    async send(type, message, options) {
        if (!this.enabled) return false;
        if (!message || !type) return this.z.utils.log.write("Log without message or type not permitted", { tag: "WEBHOOK", error: true });

        const hook = this.hooks[type.toLocaleLowerCase()];
        if (!hook) return this.z.utils.log.write(`Webhook "${type}" is not defined. Message: ${message}`, { tag: "WEBHOOK", error: true });

        const embed = new MessageEmbed().setDescription(message).setColor(options.color || "#1e90ff");
        const data = {
            username: options.username || this.z.config.LoggingWebhookName,
            embeds: [ embed ],
        };
        if (options.pingRole) data.content = `<@${options.pingId || this.z.config.LoggingAlertPingId}>`;

        await hook.send(data).catch((e) => {
            return this.z.utils.log.write(`${type.toLowerCase()} log failed. Message: ${message}. Error: ${reply.status}`, { tag: "WEBHOOK", error: true });
        });
        return true;
    }

}

module.exports = Log;
