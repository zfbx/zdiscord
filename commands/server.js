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
    name: "server",
    description: "Get FiveM and Discord Stats",
    version: 6,
    // default_permission: false,
    // role: "mod",

    run: async (client, interaction) => {
        if (client.utils.isRolePresent(client, interaction.member, [client.config.modRole, client.config.adminRole, client.config.godRole])) {
            const embed = new client.Embed()
                .setThumbnail(interaction.guild.iconURL({ format: "png", size: 512 }))
                .addField("FiveM Server:", `**Version:** ${GetConvar("version", "Unknown")}
                    **Server Name:** ${client.config.serverName}
                    **Server IP:** ${client.config.serverIp}
                    **Resource Count:** ${GetNumResources()}
                    **Game Build:** ${GetConvar("sv_enforceGameBuild", "Unknown")}
                    **Max Clients:** ${GetConvar("sv_maxClients", "Unknown")}
                    **OneSync:** ${GetConvar("onesync_enabled", "Unknown")}
                    **Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
                    **Online Players:** ${GetNumPlayerIndices()}`, false)
                .addField("Discord Server:", `**ID:** ${interaction.guildId}
                    **Invite:** ${client.config.discordInvite}
                    **Roles:** ${interaction.guild.roles.cache.size}
                    **Channels:** ${interaction.guild.channels.cache.filter((chan) => chan.type === "GUILD_TEXT").size}
                    **Members:** ${interaction.guild.memberCount}${getWhitelisted(client, interaction)}
                    **Owner:** <@${interaction.guild.ownerId}> (${interaction.guild.ownerId})`, true)
                .setFooter(`${GetCurrentResourceName()} by zfbx`);
            return interaction.reply({ embeds: [ embed ] });
        } else {
            const embed = new client.Embed()
                .setThumbnail(interaction.guild.iconURL({ format: "png", size: 512 }))
                .addField(client.config.serverName, `**Server IP:** ${client.config.serverIp}
                    **Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
                    **Players:** ${GetNumPlayerIndices()}/${GetConvar("sv_maxClients", "Unknown")}`, false)
                .setFooter(`${GetCurrentResourceName()} by zfbx`);
            return interaction.reply({ embeds: [ embed ] });
        }
    },
};


function getWhitelisted(client, interaction) {
    if (!client.config.enableWhitelist) return "";
    const membersWithRole = interaction.guild.members.cache.filter(member => {
        let found = false;
        client.config.whitelistRoles.forEach(role => {
            if (member.roles.cache.has(role)) found = true;
        });
        return found;
    });
    return `\n**Whitelisted:** ${membersWithRole.size}`;
}
