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
    name: "ban",
    description: "ban a player",
    default_permission: false,
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
        const [ id, time, reason ] = args;
        const pname = GetPlayerName(id);
        if (!pname) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        if (time < 0) return interaction.reply({ content: "time must be a possitive number", ephemeral: true });
        const player = client.QBCore.Functions.GetPlayer(id);
        /* If this event is fixed the code following can be removed.
        emit("qb-admin:server:ban", player, time, reason);
        */
        const bantime = time < 2147483647 ? (time + Math.floor(Date.now() / 1000)) : 2147483647;
        global.exports.oxmysql.execute("INSERT INTO bans (name, license, discord, ip, reason, expire, bannedby) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            pname,
            client.QBCore.Functions.GetIdentifier(id, "license"),
            client.QBCore.Functions.GetIdentifier(id, "discord"),
            client.QBCore.Functions.GetIdentifier(id, "ip"),
            reason,
            bantime,
            interaction.member.id,
        ]);
        emitNet("chat:addMessage", -1, {
            template: "<div class=chat-message server'><strong>ANNOUNCEMENT | {0} has been banned:</strong> {1}</div>",
            args: [ GetPlayerName(id), reason ],
        });
        emit("qb-log:server:CreateLog", "bans", "Player Banned", "red", `${GetPlayerName(id)} was banned by ${interaction.member.displayName} for ${reason}`, true);
        if (bantime >= 2147483647) {
            DropPlayer(id, `You have been banned:\n${reason}\n\nYour ban is permanent.\n🔸 Check our Discord for more information: ${client.QBCore.Config.Server.discord}`);
        } else {
            DropPlayer(id, `You have been banned:\n${reason}\n\nBan expires in ${time / 60} minutes\n🔸 Check our Discord for more information: ${client.QBCore.Config.Server.discord}`);
        }

        // End of filler code

        client.utils.log.info(`[${interaction.member.displayName}] banned ${pname} (${id}) for ${time} seconds`);
        return interaction.reply({ content: `${pname} (${id}) was banned for ${time / 60} minutes.`, ephemeral: false });
    },
};
