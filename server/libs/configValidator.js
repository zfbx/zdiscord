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

module.exports = () => {
    let errors = 0;
    let warnings = 0;
    zconfig.AllRoles = [];

    function checkRoles(array, config) {
        const newArray = [];
        array.forEach(e => {
            if (zlog.assert(zutils.isValidID(e), `[config.js] ${config} value ${e} does not seem to be a valid id, skipping.`)) {
                newArray.push(e);
                zconfig.AllRoles.push(e);
            }
        });
        return newArray;
    }

    if (!zlog.assert(Number(process.versions.node.split(".")[0]) >= 16, "Your FiveM artifacts are too old. Update them to use zdiscord.")) errors++;
    if (!zlog.assert(GetCurrentResourceName() === "zdiscord", `Please rename this resource from "${GetCurrentResourceName()}" to "zdiscord" for consistent stability and support.`)) warnings++;

    // Bot Settings
    zconfig.Enabled = zutils.getConBool("zdiscord:Enabled", zconfig.Enabled);
    zconfig.BotToken = GetConvar("zdiscord:BotToken", zconfig.BotToken);
    if (!zlog.assert(!zconfig.Enable || (zconfig.Enabled && zconfig.BotToken.length > 42), "[config.js] Your BotToken does not appear to be valid, did you put the right one? The bot wont function till this is fixed.")) {
        zconfig.Enabled = false;
        errors++;
    }
    zconfig.ServerId = GetConvar("zdiscord:ServerId", zconfig.ServerId);
    if (zconfig.Enabled) {
        if (!zlog.assert(zutils.isValidID(zconfig.ServerId), "[config.js] The ServerId seems to be invalid. Fix and restart zdiscord for bot to function again.")) {
            zconfig.Enabled = false;
            errors++;
        }
    }
    zconfig.VerboseLogging = zutils.getConBool("zdiscord:VerboseLogging", zconfig.VerboseLogging);
    zconfig.DebugLogging = zutils.getConBool("zdiscord:DebugLogging", zconfig.DebugLogging);
    zconfig.SlashCommandsEnabled = zutils.getConBool("zdiscord:SlashCommandsEnabled", zconfig.SlashCommandsEnabled);
    zconfig.StatusMessages = zutils.getConArray("zdiscord:StatusMessages", zconfig.StatusMessages);
    zconfig.PrivateAllowedMentions = [
        "users",
        "roles",
        // "everyone",
    ];

    if (zconfig.Enabled) {
        if (!zlog.assert(zconfig.BotToken !== "CHANGE", "[config.js] To enable the bot the BotToken must be set.")) errors++;
        if (!zlog.assert(zutils.isValidID(zconfig.ServerId), "[config.js] The ServerId seems to be invalid, check that it's correct and restart zdiscord.")) errors++;
    }

    // Locales
    zconfig.Language = GetConvar("zdiscord:Language", zconfig.Language.replace(".js", ""));
    zconfig.LanguageWarnings = zutils.getConBool("zdiscord:LanguageWarnings", zconfig.LanguageWarnings);

    // Webhook Logging
    zconfig.WebhooksEnabled = zutils.getConBool("zdiscord:WebhooksEnabled", zconfig.WebhooksEnabled);
    zconfig.WebhooksPing = GetConvar("zdiscord:WebhooksPing", zconfig.WebhooksPing);
    zconfig.WebhooksName = GetConvar("zdiscord:WebhooksName", zconfig.WebhooksName);

    if (zconfig.WebhooksEnabled && zconfig.WebhooksPing !== "") {
        if (zconfig.WebhooksPing.toLowerCase() === "everyone") {
            zconfig.WebhooksPing = `&${zconfig.ServerId}`;
            zconfig.PrivateAllowedMentions.push("everyone");
        } else {
            const isRole = zconfig.WebhooksPing.includes("&");
            const filteredId = zconfig.WebhooksPing.replace(/[^0-9]/g, "");
            if (!zlog.assert(zutils.isValidID(filteredId), `[config.js] The WebhooksPing ${isRole ? "role" : "user"} id seems to be invalid. webhook ping wont function till fixed`)) {
                zconfig.WebhooksPing = "";
                warnings++;
            } else {
                zconfig.WebhooksPing = `${isRole ? "&" : ""}${filteredId}`;
            }
        }
    }

    // General Info
    zconfig.FivemName = GetConvar("zdiscord:FivemName", zconfig.FivemName);
    zconfig.Invite = GetConvar("zdiscord:Invite", zconfig.Invite);
    zconfig.FivemUrl = GetConvar("zdiscord:FivemUrl", zconfig.FivemUrl);
    zconfig.ThemeColor = GetConvar("zdiscord:ThemeColor", zconfig.ThemeColor);

    // Whitelist
    zconfig.WhitelistEnabled = zutils.getConBool("zdiscord:WhitelistEnabled", zconfig.WhitelistEnabled);
    zconfig.WhitelistRoleIds = checkRoles(zutils.getConArray("zdiscord:WhitelistRoleIds", zconfig.WhitelistRoleIds), "WhitelistRoleIds");
    zconfig.AllRoles = [ ...zconfig.AllRoles, ...zconfig.WhitelistRoleIds ];

    // Permission Syncing
    zconfig.AcePermsEnabled = zutils.getConBool("zdiscord:AcePermsEnabled", zconfig.AcePermsEnabled);

    // Screenshot storage
    zconfig.SaveScreenshotsToServer = zutils.getConBool("zdiscord:SaveScreenshotsToServer", zconfig.SaveScreenshotsToServer);

    // Staff Roles
    zconfig.ModRoleIds = checkRoles(zutils.getConArray("zdiscord:ModRoleIds", zconfig.ModRoleIds), "ModRoleIds");
    zconfig.AdminRoleIds = checkRoles(zutils.getConArray("zdiscord:AdminRoleIds", zconfig.AdminRoleIds), "AdminRoleIds");
    zconfig.GodRoleIds = checkRoles(zutils.getConArray("zdiscord:GodRoleIds", zconfig.GodRoleIds), "GodRoleIds");

    // Staff Chat
    zconfig.StaffChatEnabled = zutils.getConBool("zdiscord:StaffChatEnabled", zconfig.StaffChatEnabled);
    zconfig.StaffChatChannelId = GetConvar("zdiscord:StaffChatChannelId", zconfig.StaffChatChannelId);
    zconfig.StaffChatRoleIds = [
        ...zconfig.ModRoleIds,
        ...zconfig.AdminRoleIds,
        ...zconfig.GodRoleIds,
        ...zconfig.AdditionalStaffChatRoleIds,
    ];
    zconfig.StaffChatRoleIds = [...new Set(zconfig.StaffChatRoleIds)];

    if (zconfig.StaffChatEnabled) {
        if (!zlog.assert(zutils.isValidID(zconfig.StaffChatChannelId), "[config.js] Your StaffChatChannelId seems to be invalid, check that it's correct and restart zdiscord to enabled staffchat. Staff chat has been disabled for now.")) {
            zconfig.StaffChatEnabled = false;
            warnings++;
        }
    }

    function AddAutoAce(key, roles) {
        if (typeof roles === "string") zconfig.AllRoles.push(roles);
        else zconfig.AllRoles = [...zconfig.AllRoles, ...roles];

        if (!zconfig.AutoAcePermissions[key]) {
            return zconfig.AutoAcePermissions[key] = roles;
        }
        if (typeof zconfig.AutoAcePermissions[key] === "string") {
            zconfig.AutoAcePermissions[key] = [
                zconfig.AutoAcePermissions[key],
            ];
        }
        if (typeof roles === "string") {
            if (zconfig.AutoAcePermissions[key].indexOf(roles) === -1) {
                zconfig.AutoAcePermissions[key].push(roles);
            }
        }
        roles.forEach((e) => {
            if (zconfig.AutoAcePermissions[key].indexOf(e) === -1) {
                zconfig.AutoAcePermissions[key].push(e);
            }
        });
    }

    // AutoAcePermissions
    zconfig.AutoAceDefaultStaffRoles = zutils.getConBool("zdiscord:AutoAceDefaultStaffRoles", zconfig.AutoAceDefaultStaffRoles);
    if (zconfig.AutoAceDefaultStaffRoles) {
        // QBCore auto-permissions
        AddAutoAce("qbcore.mod", zconfig.ModRoleIds);
        AddAutoAce("qbcore.admin", zconfig.AdminRoleIds);
        AddAutoAce("qbcore.god", zconfig.GodRoleIds);
        // Other
        AddAutoAce("group.admin", zconfig.GodRoleIds);
        AddAutoAce("group.mod", zconfig.AdminRoleIds);
    }

    // teleportLocations
    let locationCount = 0;
    for (const [key, value] of Object.entries(zconfig.teleportLocations)) {
        locationCount++;
        if (!key) {
            zlog.error(`[config.js] the key ${locationCount} entries down for teleportLocations is not set. Fix this and restart zdiscord.`);
            errors++;
            continue;
        }
        if (!key.length > 100) {
            zlog.warning(`[config.js] teleportLocations > ${key} is too long (over 100 characters) and will be skipped.`);
            delete zconfig.teleportLocations[key];
            warnings++;
            continue;
        }
        if (!value.name.length > 100) {
            zlog.warning(`[config.js] teleportLocations > ${key} > name is too long (over 100 characters) and will trimmed.`);
            zconfig.teleportLocations[key].name = zconfig.teleportLocations.name.substring(0, 99);
            warnings++;
        }
        zconfig.teleportLocations[key].id = key;
        zconfig.teleportLocations[key].search = `${key} ${value.name.toLowerCase()}`;
    }

    // end, remove duplicates.
    zconfig.AllRoles = [...new Set(zconfig.AllRoles)];
    if (errors > 0) {
        zlog.error(`${errors} errors & ${warnings} warnings in config.js, booting aborted. please fix the errors then restart the zdiscord script`);
        return false;
    }
    zlog.info(`Config validated with ${warnings} warnings.`);
    return true;
};
