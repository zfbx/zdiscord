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

const fs = require("fs").promises;
const Buffer = require("buffer").Buffer;

module.exports = class cmd extends Command {
    constructor(file) {
        super("screenshot", file, {
            description: "Screenshot player's POV",
            role: "god",

            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: djs.ApplicationCommandOptionType.Integer,
                },
            ],
        });
    }

    async run(interaction, args) {
        if (!GetPlayerName(args.id)) return interaction.sreply("This ID seems invalid.");
        if (GetResourceState("screenshot-basic") !== "started") return interaction.reply("This command requires citizenfx's `screenshot-basic` to work");
        await interaction.reply("Taking screenshot..");
        const name = `${zlog.timestamp(true)}_${args.id}.jpg`;
        const data = await takeScreenshot(args.id).catch(error => {
            zlog.error(error);
            return interaction.editReply("**Error requesting screenshot**");
        });
        const buffer = new Buffer.from(data, "base64");
        const embed = new djs.EmbedBuilder().setColor(zconfig.ThemeColor)
            .setTitle(`${GetPlayerName(args.id)}'s Screen`)
            .setImage(`attachment://${name}`)
            .setFooter({ text: `Taken At ${zlog.timestamp()}` });
        await interaction.editReply({ content: null, embeds: [ embed ], files: [ { attachment: buffer, name: name } ] }).catch(console.error);
        if (zconfig.SaveScreenshotsToServer) {
            await fs.mkdir(`${zroot}/screenshots`, { recursive: true }).catch();
            await fs.writeFile(`${zroot}/screenshots/${name}`, data, { encoding: "base64", flag:"w+" }).catch(zlog.error);
        }
        return zlog.info(`[${interaction.member.displayName}] Took a screenshot of ${GetPlayerName(args.id)}'s (${args.id}) screen`);
    }
};

const takeScreenshot = async (id) => {
    return new Promise((resolve, reject) => {
        global.exports["screenshot-basic"]["requestClientScreenshot"](id, {}, async (error, data) => {
            if (error) return reject(error);
            resolve(data.split(";base64,").pop());
        });
    });
};
