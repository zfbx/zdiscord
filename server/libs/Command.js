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

module.exports = class Command {
    constructor(name, file, data = {}) {
        const {
            type = djs.ApplicationCommandType.ChatInput,
            description = "",
            role = "",
            options = [],
            cooldown = null,
            default_member_permissions = null,
        } = data;

        if (!name) throw new Error(`${this.constructor.name} Missing name`);
        this.name = name;
        if (![djs.ApplicationCommandType.Message, djs.ApplicationCommandType.User].includes(type)) this.description = description;

        this.type = type;
        this.options = options;

        this.role = role;
        this.cooldown = cooldown;
        this.default_member_permissions = default_member_permissions;

        this.file = file;
    }

    shouldLoad() {
        return true;
    }

    get() {
        const cmdData = {
            name: this.name,
            default_member_permissions: this.default_member_permissions,
            role: this.role,
            type: this.type,
        };
        if (this.type === djs.ApplicationCommandType.ChatInput) cmdData.description = this.description;
        if (this.options) cmdData.options = this.options;
        return cmdData;
    }

    run(interaction, args) {
        throw new Error(`${this.constructor.name} NOT IMPLEMENTED`);
    }

    button(interaction, buttonId) {
        throw new Error(`${this.constructor.name} BUTTON NOT IMPLEMENTED`);
    }

    menu(interaction) {
        throw new Error(`${this.constructor.name} MENU TRIGGERED WHILE NOT IMPLEMENTED`);
    }

    autocomplete(interaction) {
        throw new Error(`${this.constructor.name} AUTOCOMPLETE TRIGGERED WHILE NOT IMPLEMENTED`);
    }
};
