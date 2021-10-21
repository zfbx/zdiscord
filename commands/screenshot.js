/**
 * Created by ItzDabbzz with <3
 * 
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

const fs = require("fs");
const utils = require("../utils.js");

module.exports = {
    name: "screenshot",
    description: "Screenshot player's POV",
    default_permission: false,
    role: "god",

    options: [
        {
            name: "id",
            description: "Player's current id",
            required: true,
            type: "INTEGER",
        },
    ],

    run: async (client, interaction, args) => {
        const [ id ] = args;
        if (!GetPlayerName(id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        if(!fs.existsSync(GetResourcePath(GetCurrentResourceName()) + `/screenshots`)) fs.mkdir(GetResourcePath(GetCurrentResourceName()) + `/screenshots`);
        if (GetResourceState("screenshot-basic") === "started") {
            let date = new Date()
            let filena = `${id}__${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}__${date.getHours()}-${date.getMinutes()}.png`
            await global.exports['screenshot-basic']["requestClientScreenshot"](id, {
                filename: filena
            }, async (error, data) => {
                if(error) { utils.log.log(error); return interaction.reply('Error requesting screenshot'); }
                const base64Data = data.split(';base64,').pop();
                fs.writeFile(GetResourcePath(GetCurrentResourceName()) + `/screenshots/${filena}`, base64Data, {encoding: 'base64', flag:'w+'}, function(err) {
                    if(err) utils.log.log(err);
                    const embed = new client.Embed()
                    .setTitle(`${id}'s | Screenshot`)
                    .setImage(`attachment://${filena}`)
                    .setFooter(`Taken At ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`);
                    interaction.reply({ embeds: [embed], files: [ GetResourcePath(GetCurrentResourceName()) +`/screenshots/${filena}` ]})
                });
            })
        } else {
            return interaction.reply({ content: "This command requires citizenfx's `screenshot-basic` to work", ephemeral: false });
        }
    },
};
