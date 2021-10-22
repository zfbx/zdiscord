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
    name: "time",
    description: "set city time",
    default_permission: false,
    role: "admin",

    options: [
        {
            name: "hour",
            description: "what time to set to",
            required: true,
            type: "STRING",
            choices: [
                { name: "1:00 AM", value: "1" },
                { name: "2:00 AM", value: "2" },
                { name: "3:00 AM", value: "3" },
                { name: "4:00 AM", value: "4" },
                { name: "5:00 AM", value: "5" },
                { name: "6:00 AM", value: "6" },
                { name: "7:00 AM", value: "7" },
                { name: "8:00 AM", value: "8" },
                { name: "9:00 AM", value: "9" },
                { name: "10:00 AM", value: "10" },
                { name: "11:00 AM", value: "11" },
                { name: "12:00 PM", value: "12" },
                { name: "1:00 PM", value: "13" },
                { name: "2:00 PM", value: "14" },
                { name: "3:00 PM", value: "15" },
                { name: "4:00 PM", value: "16" },
                { name: "5:00 PM", value: "17" },
                { name: "6:00 PM", value: "18" },
                { name: "7:00 PM", value: "19" },
                { name: "8:00 PM", value: "20" },
                { name: "9:00 PM", value: "21" },
                { name: "10:00 PM", value: "22" },
                { name: "11:00 PM", value: "23" },
                { name: "12:00 AM", value: "24" },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        const [ hour ] = args;
        if (GetResourceState("qb-weathersync") !== "started") return interaction.reply({ content: "This command requires QBCore's `qb-weathersync` to work", ephemeral: false });
        // doesn't give any feedback to rely on :/
        emit("qb-weathersync:server:setTime", hour, "0");
        client.utils.log.info(`[${interaction.member.displayName}] set time to hour ${hour}`);
        return interaction.reply({ content: "Time has been set", ephemeral: false });
    },
};
