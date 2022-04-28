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
    name: "interactionCreate",
    // interaction = https://discord.js.org/#/docs/main/stable/class/Interaction
    run: async (client, interaction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({ content: "An error has occurred ", ephemeral: true }).catch((error) => client.utils.log.handler("error", error));
            }
            if (!client.hasPermission(interaction.member, command.role)) {
                return interaction.reply({ content: "You don't have permission to use this command", ephemeral: true }).catch();
            }

            const args = {};
            for (const option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args[option.name] = true;
                    option.options?.forEach((x) => {
                        args[x.name] = x.value;
                    });
                } else if (option.value) { args[option.name] = option.value; }
            }
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);
            try {
                command.run(client, interaction, args);
            } catch (error) {
                client.utils.log.error(error);
                interaction.reply({ content: "There was an error while executing this command!", ephemeral: true }).catch((err) => client.utils.log.handler("error", err));
            }
        }
        if (interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }
    },
};
