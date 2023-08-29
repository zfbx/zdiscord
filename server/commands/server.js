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

module.exports = class cmd extends Command {
    constructor(file) {
        super("server", file, {
            description: "Get FiveM and Discord Stats",
        });
    }

    async run(interaction) {
        // TODO: is this right?
        if (zbot.isRolePresent(interaction.member, [zconfig.ModRoleIds, zconfig.AdminRoleIds, zconfig.GodRoleIds])) {
            const embed = new djs.EmbedBuilder().setColor(zconfig.ThemeColor)
                .setThumbnail(interaction.guild.iconURL({ format: "png", size: 512 }))
                .addFields([
                    {
                        name: "FiveM Server:",
                        value: `**Version:** ${GetConvar("version", "Unknown")}
                            **Server Name:** ${zconfig.FivemName}
                            **Server IP:** ${zconfig.FivemUrl}
                            **Resource Count:** ${GetNumResources()}
                            **Game Build:** ${GetConvar("sv_enforceGameBuild", "Unknown")}
                            **Max Clients:** ${GetConvar("sv_maxClients", "Unknown")}
                            **OneSync:** ${GetConvar("onesync_enabled", "Unknown")}
                            **Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
                            **Online Players:** ${GetNumPlayerIndices()}`,
                    }, {
                        name: "Discord Server:",
                        value: `**ID:** ${interaction.guildId}
                            **Invite:** ${zconfig.Invite}
                            **Roles:** ${interaction.guild.roles.cache.size}
                            **Channels:** ${interaction.guild.channels.cache.filter((chan) => chan.type === "GUILD_TEXT").size}
                            **Members:** ${interaction.guild.memberCount}${this.getWhitelisted(interaction)}
                            **Owner:** <@${interaction.guild.ownerId}> (${interaction.guild.ownerId})`,
                        inline: true,
                    },
                ])
                .setFooter({ text: "zdiscord by zfbx" });
            return interaction.reply({ embeds: [ embed ] });
        } else {
            const embed = new djs.EmbedBuilder().setColor(zconfig.ThemeColor)
                .setThumbnail(interaction.guild.iconURL({ format: "png", size: 512 }))
                .addFields([{
                    name: zconfig.FivemName,
                    value: `**Server IP:** ${zconfig.FivemUrl}
                        **Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
                        **Players:** ${GetNumPlayerIndices()}/${GetConvar("sv_maxClients", "Unknown")}`,
                }])
                .setFooter({ text: "zdiscord by zfbx" });
            return interaction.reply({ embeds: [ embed ] });
        }
    }

    getWhitelisted(interaction) {
        if (!zconfig.WhitelistEnabled) return "";
        const membersWithRole = interaction.guild.members.cache.filter(member => {
            return member.roles.cache.hasAny(...zconfig.WhitelistRoleIds);
        });
        return `\n**Whitelisted:** ${membersWithRole.size}`;
    }
};
