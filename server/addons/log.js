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

class Log {
    constructor() {
        this.enabled = zconfig.WebhooksEnabled;
        this.hooks = {};

        if (this.enabled) {
            let count = 0;
            Object.entries(zconfig.LoggingWebhooks).forEach(entry => {
                const [key, value] = entry;
                const k = key.toLocaleLowerCase();
                if (this.hooks[k]) return zlog.write(`Webhook for ${k} has already been registered. Remove the duplicate key`, { tag: "WEBHOOK", error: true });
                this.hooks[k] = new djs.WebhookClient({ url: value.replace(/discordapp/g, "discord") });
                count++;
            });
            zlog.info(`${count} webhooks loaded.`, { tag: "WEBHOOK" });
            zbot.rest.on("rateLimited", (error) => zlog.error(error, { tag: "WEBHOOK" }));
        }
        global.exports("log", async (type, message, pingRole, color) => {
            return zlog.send(type, message, { pingRole: pingRole, color: color });
        });
    }

    /** Sends a log through to a webhook by name configured in config
     * @param {string} type - type of log/event to pick which webhook to send
     * @param {string} message - Message to log
     * @param {object} options - pingRole, color, username, pingId
     * @returns {boolean} - success or failure of logging event */
    async send(type, message, options) {
        if (!this.enabled) return false;
        if (!message || !type) return zlog.write("Log without message or type not permitted", { tag: "WEBHOOK", error: true });

        const hook = this.hooks[type.toLocaleLowerCase()];
        if (!hook) return zlog.write(`Webhook "${type}" is not defined. Message: ${message}`, { tag: "WEBHOOK", error: true });

        const embed = new djs.EmbedBuilder().setDescription(message).setColor(options.color || zconfig.ThemeColor);
        const data = {
            username: options.username ?? zconfig.WebhooksName,
            embeds: [ embed ],
        };
        if (options.pingRole) data.content = `<@${ options.pingId ?? zconfig.WebhooksPing }>`;

        await hook.send(data).catch((e) => {
            return zlog.write(`${type.toLowerCase()} log failed. Message: ${message}. Error: ${reply.status}`, { tag: "WEBHOOK", error: true });
        });
        return true;
    }

}

module.exports = Log;
