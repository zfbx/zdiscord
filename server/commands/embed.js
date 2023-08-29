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
        super(Lang.t("cmd_embed"), file, {
            description: Lang.t("desc_embed"),
            role: "god",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_simple"),
                    description: Lang.t("opt_simple_desc"),
                    options: [
                        {
                            name: Lang.t("opt_channel"),
                            description: Lang.t("opt_channel_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Channel,
                        },
                        {
                            name: Lang.t("opt_message"),
                            description: Lang.t("opt_message_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                        {
                            name: "title",
                            description: "embed title (short)",
                            required: false,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                        {
                            name: Lang.t("opt_image"),
                            description: Lang.t("opt_image_desc"),
                            required: false,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                        {
                            name: Lang.t("opt_thumbnail"),
                            description: Lang.t("opt_thumbnail_desc"),
                            required: false,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                        {
                            name: Lang.t("opt_footer"),
                            description: Lang.t("opt_footer_desc"),
                            required: false,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                        {
                            name: Lang.t("opt_color"),
                            description: Lang.t("opt_color_desc"),
                            required: false,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_complex"),
                    description: Lang.t("opt_complex_desc"),
                    options: [
                        {
                            name: Lang.t("opt_channel"),
                            description: Lang.t("opt_channel_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.Channel,
                        },
                        {
                            name: Lang.t("opt_json"),
                            description: Lang.t("opt_json_desc"),
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                    ],
                },
            ],
        });
    }

    async run(interaction, args) {
        const channel = interaction.guild.channels.cache.get(args[Lang.t("opt_channel")]);
        if (!channel || (channel.type !== djs.ChannelType.GuildText && channel.type !== djs.ChannelType.GuildAnnouncement)) {
            return interaction.sreply(Lang.t("invalid_item", { item: Lang.t("opt_channel") }));
        }
        if (args[Lang.t("opt_simple")]) {
            const embed = new djs.EmbedBuilder();
            if (args.title) embed.setTitle(args.title);
            if (args[Lang.t("opt_footer")]) embed.setFooter({ text: args[Lang.t("opt_footer")] });
            if (args[Lang.t("opt_image")]) {
                if (/^(http[s]?:\/\/.*\.(?:png|jpg|gif|jpeg))/i.test(args[Lang.t("opt_image")])) embed.setImage(args[Lang.t("opt_image")]);
                else return interaction.sreply(Lang.t("invalid_item", { item: Lang.t("opt_image") }));
            }
            if (args[Lang.t("opt_color")]) {
                if (/^#[0-9A-F]{6}$/i.test(args[Lang.t("opt_color")])) embed.setColor(args[Lang.t("opt_color")]);
                else return interaction.sreply(Lang.t("invalid_item", { item: Lang.t("opt_color") }));
            }
            if (args[Lang.t("opt_thumbnail")]) {
                if (/^(http[s]?:\/\/.*\.(?:png|jpg|gif|jpeg))/i.test(args[Lang.t("opt_thumbnail")])) embed.setThumbnail(args[Lang.t("opt_thumbnail")]);
                else return interaction.sreply(Lang.t("invalid_item", { item: Lang.t("opt_thumbnail") }));
            }
            embed.setDescription(args[Lang.t("opt_message")].replace(/<br>/ig, "\n"));
            channel.send({ embeds: [ embed ] });
        } else if (args[Lang.t("opt_complex")]) {
            let embed = args[Lang.t("opt_json")];
            try {
                embed = JSON.parse(args[Lang.t("opt_json")]);
            } catch (e) {
                return interaction.sreply(Lang.t("invalid_item", { item: Lang.t("opt_json") }));
            }
            channel.send({ embeds: [ embed ] });
        }
        return interaction.reply(Lang.t("message_sent"));
    }
};
