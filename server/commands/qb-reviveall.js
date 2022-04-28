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
    name: "revive-all",
    description: "Raise all downed players to full health and stats",
    role: "god",

    run: async (client, interaction, args) => {
        emitNet("hospital:client:Revive", -1);
        client.utils.log.info(`[${interaction.member.displayName}] revived EVERYONE`);
        return interaction.reply({ content: "Everyone has been fully healed.", ephemeral: false });
    },
};
