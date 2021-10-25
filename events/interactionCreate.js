/**
 * This file is part of zdiscord.
 * Copyright (C) 2021 Tony/zfbx
 * source: <https://github.com/zfbx/zdiscord>
 *
 * zdiscord is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * zdiscord is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with zdiscord. If not, see <https://www.gnu.org/licenses/>.
 */

module.exports = {
    name: "interactionCreate",
    // interaction = https://discord.js.org/#/docs/main/stable/class/Interaction
    run: async (client, interaction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({ content: "An error has occured ", ephemeral: true }).catch((error) => client.utils.log.handler("error", error));
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
