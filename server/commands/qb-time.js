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
    name: "time",
    description: "set city time",
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
        if (GetResourceState("qb-weathersync") !== "started") return interaction.reply({ content: "This command requires QBCore's `qb-weathersync` to work", ephemeral: false });
        // doesn't give any feedback to rely on :/
        emit("qb-weathersync:server:setTime", args.hour, "0");
        client.utils.log.info(`[${interaction.member.displayName}] set time to hour ${args.hour}`);
        return interaction.reply({ content: "Time has been set", ephemeral: false });
    },
};
