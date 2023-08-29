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
        super(Lang.t("cmd_players"), file, {
            description: Lang.t("desc_players"),
            role: "mod",
            // TODO: make share option
        });
    }

    async run(interaction) {
        if (GetNumPlayerIndices() === 0) return interaction.sreply(Lang.t("nobody_online"));
        const parts = [];
        let index = 0;
        getPlayers().sort().forEach((id) => {
            const i = Math.floor(index / 10);
            if (!parts[i]) parts[i] = "";
            parts[i] += `\`[${id}]\` **${GetPlayerName(id)}**`;
            if (QBCore) {
                try {
                    const player = QBCore.Functions.GetPlayer(parseInt(id));
                    parts[i] += ` | (${player.PlayerData.citizenid}) **${player.PlayerData.charinfo.firstname} ${player.PlayerData.charinfo.lastname}**\n`;
                } catch { parts[i] += ` (${Lang.t("player_not_loaded")})\n`; }
            } else { parts[i] += "\n"; }
            index++;
        });
        const pages = [];
        parts.forEach((part) => {
            const embed = new djs.EmbedBuilder()
                .setColor(zconfig.ThemeColor)
                .setTitle(Lang.t("players_count", { count: GetNumPlayerIndices() }))
                .setDescription(`${part}`);
            pages.push(embed);
        });
        await zpagination({
            embeds: pages,
            author: interaction.member.user,
            interaction: interaction,
            ephemeral: true,
            fastSkip: true,
            pageTravel: true,
        });
    }
};
