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

const cooldowns = new Set();

module.exports = {
    name: "interactionCreate",
    // interaction = https://discord.js.org/#/docs/main/stable/class/Interaction
    run: async (interaction) => {
        let command = false;

        interaction.sreply = function(message) {
            let msg = message;
            if (typeof message === "string") msg = { content: message, ephemeral: true };
            else message.ephemeral = true;
            if (this.deferred) return this.editReply(msg).catch(console.error);
            if (this.replied) return this.followUp(msg).catch(console.error);
            return this.reply(msg).catch(console.error);
        };

        if (interaction.isButton()) {
            if (interaction.customId.startsWith("pgn_") || !isNaN(parseInt(interaction.customId))) return; // these are intended for pagination.js
            const fullId = interaction.customId.split("_");
            const commandId = fullId[0];
            const buttonId = fullId[1] ?? false;
            command = zbot.commands.get(commandId[0]);
            if (!command) return interaction.sreply(Lang.t("error"));
            if (!zbot.hasPermission(interaction.member, command.role)) {
                return interaction.sreply(Lang.t("no_permission")).catch(console.error);
            }
            return command.button(interaction, buttonId);
        }

        if (interaction.isAutocomplete()) {
            if (interaction.type !== djs.InteractionType.ApplicationCommandAutocomplete) return;
            command = zbot.commands.get(interaction.commandName);
            if (!command) return;
            return command.autocomplete(interaction);
        }

        if (interaction.isStringSelectMenu()) {
            const fullId = interaction.customId.split("_");
            const commandId = fullId.shift();
            const menuId = fullId.join("_") ?? false;
            command = zbot.commands.get(commandId);
            if (!command) return;
            if (!zbot.hasPermission(interaction.member, command.role)) {
                return interaction.sreply(Lang.t("no_permission")).catch(console.error);
            }
            return command.menu(interaction, menuId);
        }

        if (interaction.type === djs.InteractionType.ApplicationCommand || interaction.isMessageContextMenuCommand()) {
            command = zbot.commands.get(interaction.commandName);
            if (!command) return interaction.sreply(Lang.t("error")).catch(console.error);

            if (!zbot.hasPermission(interaction.member, command.role)) {
                return interaction.sreply(Lang.t("no_permission")).catch(console.error);
            }

            if (command.cooldown) {
                const cooldownId = `${interaction.commandName}_${interaction.user.id}`;
                if (cooldowns.has(cooldownId)) {
                    return interaction.sreply(Lang.t("on_cooldown", { cooldown: command.cooldown })).catch(console.error);
                } else {
                    cooldowns.add(cooldownId);
                    setTimeout(async () => {
                        cooldowns.delete(cooldownId);
                    }, command.cooldown * 1000);
                }
            }
        }

        const args = {};
        if (interaction.type === djs.InteractionType.ApplicationCommand) {
            for (let option of interaction.options.data) {
                if (option.type === djs.ApplicationCommandOptionType.SubcommandGroup) {
                    args[option.name] = true;
                    option = option.options[0];
                }
                if (option.type === djs.ApplicationCommandOptionType.Subcommand) {
                    if (option.name) args[option.name] = true;
                    option.options?.forEach((x) => {
                        args[x.name] = x.value;
                    });
                } else if (option.value !== null) { args[option.name] = option.value; }
            }
            zlog.info(Lang.t("command_log", {
                discordTag: interaction.user.tag,
                discordId: interaction.user.id,
                commandName: interaction.commandName,
                location: interaction.guild ? interaction.guild.id : "DMs",
                data: JSON.stringify(args),
            }), { tag: "CMD", color: "\x1b[1;30m" });
        }

        if (interaction.type === djs.InteractionType.ApplicationCommand || interaction.isMessageContextMenuCommand()) {
            try {
                command.run(interaction, args).catch(console.error);
            } catch (error) {
                zlog.error(error);
                interaction.sreply(Lang.t("error"));
            }
        }

    },
};
