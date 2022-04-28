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
    name: "weather",
    description: "Manage city weather",
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
        if (GetResourceState("qb-weathersync") !== "started") return interaction.reply({ content: "This command requires QBCore's `qb-weathersync` to work", ephemeral: false });
        if (args.blackout) {
            // doesn't give any option for true or false or feedback to which was done -.-
            emit("qb-weathersync:server:toggleBlackout");
            client.utils.log.info(`[${interaction.member.displayName}] toggled blackout`);
            return interaction.reply({ content: "Blackout has been toggled", ephemeral: false });
        } else if (args.set) {
            // also doesn't give any feedback on it's success or failure -.-
            emit("qb-weathersync:server:setWeather", args.weather);
            client.utils.log.info(`[${interaction.member.displayName}] toggled weather to ${args.weather}`);
            return interaction.reply({ content: "Weather was updated", ephemeral: false });
        }
    },
};
