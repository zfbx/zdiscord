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

const z = {};
const fetch = require("node-fetch");

z.root = GetResourcePath(GetCurrentResourceName());
z.config = require(`${z.root}/config`);
z.locale = require(`${z.root}/locales/${z.config.LanguageLocaleCode}`);
z.utils = require(`${z.root}/server/utils`);

const Bot = require(`${z.root}/server/bot`);
z.bot = new Bot(z);
if (z.config.EnableDiscordBot) z.bot.start();

const Queue = require(`${z.root}/server/queue`);
z.queue = new Queue(z);

SetConvarReplicated("zdiscord_servername", z.config.FiveMServerName);
SetConvarReplicated("zdiscord_discordinvite", z.config.DiscordInviteLink);
SetConvarReplicated("zdiscord_serverip", z.config.FiveMServerIP);
SetConvarReplicated("zdiscord_userpresence", String(z.config.enableUserPresence));

on("playerConnecting", async (name, setKickReason, deferrals) => {
    const player = source;
    if (!z.config.EnableWhitelistChecking || !z.config.EnableDiscordBot) return;
    deferrals.defer();
    await z.utils.sleep(0);
    deferrals.update(z.utils.replaceGlobals(z, z.locale.checkingWhitelist.replace(/{name}/g, name)));
    await z.utils.sleep(0);
    const discordID = z.utils.getPlayerDiscordId(player);
    if (!discordID) return deferrals.done(z.utils.replaceGlobals(z, z.locale.discordNotOpen));
    const member = z.utils.getMember(z.bot, discordID);
    if (!member) return deferrals.done(z.utils.replaceGlobals(z, z.locale.notInDiscordServer));
    const whitelisted = z.utils.isRolePresent(z.bot, member, z.config.DiscordWhitelistRoleIds);
    if (whitelisted) deferrals.done();
    else deferrals.done(z.utils.replaceGlobals(z, z.locale.notWhitelisted));
});

global.exports("isRolePresent", (identifier, role) => {
    if (!z.config.EnableDiscordBot) return false;
    return z.utils.isRolePresent(z.bot, identifier, role);
});

global.exports("getRoles", (identifier) => {
    if (!z.config.EnableDiscordBot) return false;
    return z.utils.getMemberRoles(z.bot, identifier);
});

global.exports("getName", (identifier) => {
    if (!z.config.EnableDiscordBot) return false;
    const member = z.utils.parseMember(z.bot, identifier);
    return member.displayName || false;
});

on("playerJoining", (oldId) => {
    const source = global.source;
    if (!z.config.EnableDiscordBot) return;
    const member = z.utils.getMemberFromSource(z.bot, source);
    if (z.config.EnableAutoAcePermissions) {
        for (const [perm, role] of Object.entries(z.config.AutoAcePermissions)) {
            if (z.utils.isRolePresent(z.bot, member, role)) {
                ExecuteCommand(`add_principal "player.${source}" "${perm}"`);
            }
        }
    }
    if (z.utils.isRolePresent(z.bot, member, [ z.config.DiscordModRoleId, z.config.DiscordAdminRoleId, z.config.DiscordGodRoleId ])) {
        ExecuteCommand(`add_principal "player.${source}" group.zdiscordstaff`);
    }
});

on("playerDropped", (reason) => {
    const source = global.source;
    if (!z.config.EnableDiscordBot) return false;
    if (z.config.EnableAutoAcePermissions) {
        for (const [perm, role] of Object.entries(z.config.AutoAcePermissions)) {
            ExecuteCommand(`remove_principal "player.${source}" "${perm}"`);
        }
    }
});



if (z.config.EnableStaffChatForwarding) {
    RegisterCommand("staff", (source, args, raw) => {
        if (!IsPlayerAceAllowed(source, "zdiscord.staffchat")) return;
        z.utils.sendStaffChatMessage(z, GetPlayerName(source), raw.substring(6));
        if (!z.config.EnableDiscordBot) return;
        const staffChannel = z.bot.channels.cache.get(z.config.DiscordStaffChannelId);
        if (!staffChannel) return z.utils.log.warn("DiscordStaffChannelId was not found, staff message not sent.");
        staffChannel.send({ content: `${GetPlayerName(source)}: ${raw.substring(6)}`, allowMentions: false });
    }, "zdiscord.staffchat");

    RegisterCommand("stafftoggle", (source, args, raw) => {
        if (IsPlayerAceAllowed(source, "zdiscord.staffchat")) {
            ExecuteCommand(`remove_principal "player.${source}" group.zdiscordstaff`);
            emitNet("chat:addMessage", source, {
                template: "<div class=chat-message server'><strong>[server]:</strong> Staff Chat Disabled</div>",
            });
        } else {
            const member = z.utils.getMemberFromSource(z.bot, source);
            if (z.utils.isRolePresent(z.bot, member, [ z.config.DiscordModRoleId, z.config.DiscordAdminRoleId, z.config.DiscordGodRoleId ])) {
                ExecuteCommand(`add_principal "player.${source}" group.zdiscordstaff`);
                emitNet("chat:addMessage", source, {
                    template: "<div class=chat-message server'><strong>[server]:</strong> Staff Chat Enabled</div>",
                });
            }
        }
    }, "zdiscord.staffchat");

    setImmediate(() => {
        emit("chat:addSuggestion", "/staff", "Send message to other staff (Staff only)", [
            { name:"Message", help:"Message to send to other staff" },
        ]);
        emit("chat:addSuggestion", "/stafftoggle", "Toggle staff chat messages", []);
    });
}

/** Sends a log through to a webhook by name configured in config
 * @param {string} type - type of log/event to pick which webhook to send
 * @param {string} message - Message to log
 * @param {boolean} pingRole - Whether message should ping configured role
 * @param {string|number} color - [optional] color to have on the embed
 * @returns {boolean} - success or failure of logging event */
global.exports("log", async (type, message, pingRole, color) => {
    if (z.config.EnableLoggingWebhooks) {
        if (!message || !type) {
            z.utils.log.error("[WEBHOOK FAIL] Log without message or type not permitted");
            return false;
        }
        if (!z.config.LoggingWebhooks[type]) {
            z.utils.log.error(`[WEBHOOK FAIL] "${type}" is not defined. Message: ${message}`);
            return false;
        }
        const params = {
            username: z.config.LoggingWebhookName,
            embeds: [
                {
                    "description": message,
                    "color": "#1e90ff",
                },
            ],
        };
        if (pingRole) params.content = `<@&${z.config.LoggingAlertPingRoleId}>`;
        const reply = await fetch(z.config.LoggingWebhooks[type], {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(params),
        });
        if (!reply.ok) {
            z.utils.log.error(`[WEBHOOK FAIL] ${type.toLowerCase()} log failed. Message: ${message}. Error: ${reply.status}`);
            return false;
        }
        return true;
    }
    return false;
});

// add_principal "player.1" "zdiscord.staffchat" allow
