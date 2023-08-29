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
const zroot = GetResourcePath(GetCurrentResourceName());
const djs = require("discord.js");

// TODO: bring in add/remove role exports with config to enabled (disabled by default)
// TODO: fix custom vehicle spawning?
// TODO: enforce resource be named zdiscord for expo
// TODO: Check if up to date https://api.github.com/repos/zfbx/zdiscord/releases/latest with config to skip
// TODO: simple guide on https://forum.cfx.re/t/basic-aces-principals-overview-guide/90917

const zutils = require(`${zroot}/server/libs/utils`);
const zlog = require(`${zroot}/server/libs/log`);
const configValidated = require(`${zroot}/server/libs/configValidator`)();
const Lang = require(`${zroot}/server/libs/locales`);
const zpagination = require(`${zroot}/server/libs/pagination`);
const Command = require(`${zroot}/server/libs/Command`);
const z = {};
const inCity = {};
const translations = {};

let QBCore = false;
let ESX = false;

try {
    QBCore = global.exports["qb-core"].GetCoreObject();
    if (QBCore) zlog.verbose("QBCore found! Supported QB commands will be loaded.");
} catch { QBCore = false; }

try {
    ESX = global.exports["esx"].GetCoreObject();
    if (QBCore) zlog.verbose("ESX found! Supported ESX commands will be loaded.");
} catch { ESX = false; }

const Bot = require(`${zroot}/server/bot`);
const zbot = new Bot();

const addons = readdirSync(`${zroot}/server/addons`).filter(file => file.endsWith(".js"));
for (const file of addons) {
    try {
        const Addon = require(`${zroot}/server/addons/${file}`);
        z[file.slice(0, -3)] = new Addon(z);
        zlog.verbose(`[ADDON] ${file} addon found and loaded`);
    } catch (e) {
        zlog.error(`[ADDON] ${file} errored and could not be loaded`);
        zlog.error(e);
    }
}

SetConvarReplicated("zdiscord:FivemName", zconfig.FivemName);
SetConvarReplicated("zdiscord_discordinvite", zconfig.Invite);
SetConvarReplicated("zdiscord:FivemUrl", zconfig.FivemUrl);
SetConvarReplicated("zdiscord_userpresence", String(zconfig.enableUserPresence));

on("playerConnecting", async (name, setKickReason, deferrals) => {
    const player = source;
    if (!zconfig.WhitelistEnabled || !zconfig.Enabled) return;
    deferrals.defer();
    await zutils.sleep(0);
    deferrals.update(Lang.t("checkingWhitelist", { name: name }));
    await zutils.sleep(0);
    const discordID = zutils.getPlayerDiscordId(player);
    if (!discordID) return deferrals.done(Lang.t("discordNotOpen"));
    const member = zbot.getMember(discordID);
    if (!member) return deferrals.done(Lang.t("notInDiscordServer"));
    const whitelisted = zbot.isRolePresent(member, zconfig.WhitelistRoleIds);
    if (whitelisted) deferrals.done();
    else deferrals.done(Lang.t("notWhitelisted"));
});


on("playerJoining", (oldId) => {
    const source = global.source;
    if (!zconfig.Enabled) return;
    // TODO: Should this disable when not whitelisted? inCity might break :thinking:
    const member = zbot.getMemberFromSource(source);
    inCity[member.id] = source;
    if (zconfig.AcePermsEnabled) {
        for (const [group, role] of Object.entries(zconfig.AutoAcePermissions)) {
            if (zbot.isRolePresent(member, role)) {
                zlog.verbose(`Discord role for ${group} found, adding to [${source}] ${member.displayName} (${member.id})`);
                ExecuteCommand(`add_principal identifier.discord:${member.id} "${group}"`);
            }
        }
    }
    if (zbot.isRolePresent(member, zconfig.StaffChatRoleIds)) {
        ExecuteCommand(`add_principal identifier.discord:${member.id} group.zdiscordstaff`);
    }
});

on("playerDropped", (reason) => {
    const source = global.source;
    if (!zconfig.Enabled) return false;
    // TODO: same as on joining, Should this disable when not whitelisted?
    const id = zutils.getPlayerDiscordId(source);
    delete inCity[id];
    if (zconfig.AcePermsEnabled) {
        console.log(`dropping ${id}`);
        zlog.verbose(`Disconnecting ${source}`);
        for (const [group, role] of Object.entries(zconfig.AutoAcePermissions)) {
            ExecuteCommand(`remove_principal identifier.discord:${id} ${group}`);
        }
    }
    ExecuteCommand(`remove_principal identifier.discord:${id} group.zdiscordstaff`);
});

if (zconfig.StaffChatEnabled) {
    RegisterCommand("staff", (source, args, raw) => {
        if (!IsPlayerAceAllowed(source, "zdiscord.staffchat")) return;
        zutils.sendStaffChatMessage(GetPlayerName(source), raw.substring(6));
        if (!zconfig.Enabled) return;
        const staffChannel = zbot.channels.cache.get(zconfig.StaffChatChannelId);
        if (!staffChannel) return zlog.warn("StaffChatChannelId was not found, staff message not sent.");
        staffChannel.send({ content: `${GetPlayerName(source)}: ${raw.substring(6)}`, allowMentions: false }).catch((e) => {
            zlog.error("I don't seem to have the required permissions to forward the staffchat to the configured staffchannel");
        });
    }, false);

    RegisterCommand("stafftoggle", (source, args, raw) => {
        if (IsPlayerAceAllowed(source, "zdiscord.staffchat")) {
            ExecuteCommand(`remove_principal identifier.player:${source} group.zdiscordstaff`);
            zutils.chatMessage(source, Lang.t("staffchat"), Lang.t("staffchat_enabled"), { color: [ 255, 255, 0 ] });
        } else {
            const member = zbot.getMemberFromSource(source);
            if (zbot.isRolePresent(member, zconfig.StaffChatRoleIds)) {
                ExecuteCommand(`add_principal identifier.player:${source} group.zdiscordstaff`);
                zutils.chatMessage(source, Lang.t("staffchat"), Lang.t("staffchat_disabled"), { color: [ 255, 255, 0 ] });
            }
        }
    }, false);

    setImmediate(() => {
        emit("chat:addSuggestion", Lang.t("cmd_staffchat"), Lang.t("desc_staffchat"), [
            { name:Lang.t("staffchat_message_var"), help:Lang.t("staffchat_message_help") },
        ]);
        emit("chat:addSuggestion", Lang.t("cmd_staffchat_toggle"), Lang.t("desc_staffchat_toggle"), []);
    });
}

// EXPORTS

global.exports("isRolePresent", (identifier, role) => {
    return zbot.isRolePresent(identifier, role);
});


global.exports("getRoles", (identifier) => {
    return zbot.getMemberRoles(identifier);
});

global.exports("getName", (identifier) => {
    const member = zbot.parseMember(identifier);
    return member.displayName || false;
});

global.exports("getDiscordId", (identifier) => {
    return zutils.getPlayerDiscordId(identifier);
});

// TODO: make docs on this
global.exports("setRole", (identifier) => {
    const userid = (typeof identifier === "string") ? identifier : zutils.getPlayerDiscordId(identifier);
    // TODO: add this and wrap it in a check if enabled
    // return zbot.getMemberRoles(identifier);
});

if (GetNumPlayerIndices() > 0) { // in case of script restart
    getPlayers().forEach((id) => {
        const discordId = zutils.getPlayerDiscordId(id);
        if (discordId) inCity[discordId] = id;
    });
}
