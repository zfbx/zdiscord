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

const fs = require("fs").promises;
const Buffer = require("buffer").Buffer;

module.exports = {
    name: "screenshot",
    description: "Screenshot player's POV",
    version: 6,
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
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
        if (GetResourceState("screenshot-basic") !== "started") return interaction.reply({ content: "This command requires citizenfx's `screenshot-basic` to work", ephemeral: false });
        await interaction.reply("Taking screenshot..");
        const name = `${client.utils.log.timestamp(true)}_${args.id}.jpg`;
        const data = await takeScreenshot(args.id).catch(error => {
            client.utils.log.error(error);
            return interaction.editReply("**Error requesting screenshot**");
        });
        const buffer = new Buffer.from(data, "base64");
        const embed = new client.Embed()
            .setTitle(`${GetPlayerName(args.id)}'s Screen`)
            .setImage(`attachment://${name}`)
            .setFooter(`Taken At ${client.utils.log.timestamp()}`);
        await interaction.editReply({ content: null, embeds: [ embed ], files: [ { attachment: buffer, name: name } ] }).catch(console.error);
        if (client.config.SaveScreenshotsToServer) {
            await fs.mkdir(`${client.root}/screenshots`, { recursive: true }).catch();
            await fs.writeFile(`${client.root}/screenshots/${name}`, data, { encoding: "base64", flag:"w+" }).catch(client.utils.log.error);
        }
        return client.utils.log.info(`[${interaction.member.displayName}] Took a screenshot of ${GetPlayerName(args.id)}'s (${args.id}) screen`);
    },
};

const takeScreenshot = async (id) => {
    return new Promise((resolve, reject) => {
        global.exports["screenshot-basic"]["requestClientScreenshot"](id, {}, async (error, data) => {
            if (error) return reject(error);
            resolve(data.split(";base64,").pop());
        });
    });
};
