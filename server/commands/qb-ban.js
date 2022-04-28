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
    name: "ban",
    description: "ban a player",
    role: "admin",

    options: [
        {
            name: "id",
            description: "Player's current id",
            required: true,
            type: "INTEGER",
        },
        {
            name: "time",
            description: "How long in seconds to ban player for",
            required: true,
            type: "INTEGER",
        },
        {
            name: "reason",
            description: "reason for ban",
            required: true,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        if (args.time < 0) return interaction.reply({ content: "time must be a positive number", ephemeral: true });
        // const player = client.QBCore.Functions.GetPlayer(args.id);
        /* If this event is fixed the code following can be removed.
        emit("qb-admin:server:ban", player, time, reason);
        */
        const bantime = args.time < 2147483647 ? (args.time + Math.floor(Date.now() / 1000)) : 2147483647;
        global.exports.oxmysql.insert_async("INSERT INTO bans (name, license, discord, ip, reason, expire, bannedby) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            GetPlayerName(args.id),
            client.QBCore.Functions.GetIdentifier(args.id, "license"),
            client.QBCore.Functions.GetIdentifier(args.id, "discord"),
            client.QBCore.Functions.GetIdentifier(args.id, "ip"),
            args.reason,
            bantime,
            interaction.member.id,
        ]);
        client.utils.chatMessage(-1, client.z.locale.announcement, `${GetPlayerName(args.id)} has been banned for breaking the rules.`, { color: [ 155, 0, 0 ] });
        emit("qb-log:server:CreateLog", "bans", "Player Banned", "red", `${GetPlayerName(args.id)} was banned by ${interaction.member.displayName} for ${args.reason}`, true);
        if (bantime >= 2147483647) {
            DropPlayer(args.id, `You have been banned:\n${args.reason}\n\nYour ban is permanent.\n🔸 Check our Discord for more information: ${client.QBCore.Config.Server.discord}`);
        } else {
            DropPlayer(args.id, `You have been banned:\n${args.reason}\n\nBan expires in ${args.time / 60} minutes\n🔸 Check our Discord for more information: ${client.QBCore.Config.Server.discord}`);
        }

        // End of filler code

        client.utils.log.info(`[${interaction.member.displayName}] banned ${GetPlayerName(args.id)} (${args.id}) for ${args.time} seconds`);
        return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) was banned for ${args.time / 60} minutes.`, ephemeral: false });
    },
};
