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
    name: "server",
    description: "Get FiveM and Discord Stats",

    run: async (client, interaction) => {
        if (client.isRolePresent(interaction.member, [client.config.DiscordModRoleId, client.config.DiscordAdminRoleId, client.config.DiscordGodRoleId])) {
            const embed = new client.Embed()
                .setThumbnail(interaction.guild.iconURL({ format: "png", size: 512 }))
                .addField("FiveM Server:", `**Version:** ${GetConvar("version", "Unknown")}
                    **Server Name:** ${client.config.FiveMServerName}
                    **Server IP:** ${client.config.FiveMServerIP}
                    **Resource Count:** ${GetNumResources()}
                    **Game Build:** ${GetConvar("sv_enforceGameBuild", "Unknown")}
                    **Max Clients:** ${GetConvar("sv_maxClients", "Unknown")}
                    **OneSync:** ${GetConvar("onesync_enabled", "Unknown")}
                    **Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
                    **Online Players:** ${GetNumPlayerIndices()}`, false)
                .addField("Discord Server:", `**ID:** ${interaction.guildId}
                    **Invite:** ${client.config.DiscordInviteLink}
                    **Roles:** ${interaction.guild.roles.cache.size}
                    **Channels:** ${interaction.guild.channels.cache.filter((chan) => chan.type === "GUILD_TEXT").size}
                    **Members:** ${interaction.guild.memberCount}${getWhitelisted(client, interaction)}
                    **Owner:** <@${interaction.guild.ownerId}> (${interaction.guild.ownerId})`, true)
                .setFooter({ text: "zdiscord by zfbx" });
            return interaction.reply({ embeds: [ embed ] });
        } else {
            const embed = new client.Embed()
                .setThumbnail(interaction.guild.iconURL({ format: "png", size: 512 }))
                .addField(client.config.FiveMServerName, `**Server IP:** ${client.config.FiveMServerIP}
                    **Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
                    **Players:** ${GetNumPlayerIndices()}/${GetConvar("sv_maxClients", "Unknown")}`, false)
                .setFooter({ text: "zdiscord by zfbx" });
            return interaction.reply({ embeds: [ embed ] });
        }
    },
};


function getWhitelisted(client, interaction) {
    if (!client.config.EnableWhitelistChecking) return "";
    const membersWithRole = interaction.guild.members.cache.filter(member => {
        let found = false;
        client.config.DiscordWhitelistRoleIds.forEach(role => {
            if (member.roles.cache.has(role)) found = true;
        });
        return found;
    });
    return `\n**Whitelisted:** ${membersWithRole.size}`;
}
