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
    name: "weather",
    description: "Manage city weather",
    default_permission: false,
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "set the weather to a preset",
            options: [
                {
                    name: "weather",
                    description: "available weather presets",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Extra Sunny", value: "EXTRASUNNY" },
                        { name: "Clear Sky", value: "CLEAR" },
                        { name: "Neutral", value: "NEUTRAL" },
                        { name: "Smog", value: "SMOG" },
                        { name: "Foggy", value: "FOGGY" },
                        { name: "Overcast", value: "OVERCAST" },
                        { name: "Cloudy", value: "CLOUDS" },
                        { name: "Clearing", value: "CLEARING" },
                        { name: "Rain", value: "RAIN" },
                        { name: "Thunder", value: "THUNDER" },
                        { name: "Snow", value: "SNOW" },
                        { name: "Snow (Light)", value: "SNOWLIGHT" },
                        { name: "Snow Blizzard", value: "BLIZZARD" },
                        { name: "Christmas Theme", value: "XMAS" },
                        { name: "Halloween Theme", value: "HALLOWEEN" },
                    ],
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "blackout",
            description: "toggle blackout",
        },
    ],

    run: async (client, interaction, args) => {
        const [ subcommand, weather ] = args;
        if (GetResourceState("qb-weathersync") !== "started") return interaction.reply({ content: "This command requires QBCore's `qb-weathersync` to work", ephemeral: false });
        if (subcommand === "blackout") {
            // doesn't give any option for true or false or feedback to which was done -.-
            emit("qb-weathersync:server:toggleBlackout");
            client.utils.log.info(`[${interaction.member.displayName}] toggled blackout`);
            return interaction.reply({ content: "Blackout has been toggled", ephemeral: false });
        } else if (subcommand === "set") {
            // also doesn't give any feedback on it's success or failure -.-
            emit("qb-weathersync:server:setWeather", weather);
            client.utils.log.info(`[${interaction.member.displayName}] toggled weather to ${weather}`);
            return interaction.reply({ content: "Weather was updated", ephemeral: false });
        }
    },
};
