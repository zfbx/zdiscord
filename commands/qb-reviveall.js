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
    name: "revive-all",
    description: "Raise all downed players to full health and stats",
    version: 6,
    default_permission: false,
    role: "god",

    run: async (client, interaction, args) => {
        emitNet("hospital:client:Revive", -1);
        client.utils.log.info(`[${interaction.member.displayName}] revived EVERYONE`);
        return interaction.reply({ content: "Everyone has been fully healed.", ephemeral: false });
    },
};
