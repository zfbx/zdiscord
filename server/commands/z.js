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
        super("z", file, {
            description: "Extra special commands",

            options: [
                {
                    name: "cmd",
                    description: "Command to run",
                    required: true,
                    type: djs.ApplicationCommandOptionType.String,
                },
                {
                    name: "var1",
                    description: "variable 1",
                    required: false,
                    type: djs.ApplicationCommandOptionType.String,
                },
                {
                    name: "var2",
                    description: "variable 2",
                    required: false,
                    type: djs.ApplicationCommandOptionType.String,
                },
                {
                    name: "var3",
                    description: "variable 3",
                    required: false,
                    type: djs.ApplicationCommandOptionType.String,
                },
            ],
        });

        this.cmds = {

            "debug": {
                desc: "",
                args: "",
                role: "mod",
                run: async (interaction, args) => {
                    interaction.sreply(`**Node Version:** ${process.version}
**discord.js version:** ${djs.version}
**System Platform:** ${process.platform} (${process.arch})
**Resource name:** ${GetCurrentResourceName()}
**Resource Path:** ${GetResourcePath(GetCurrentResourceName())}
**Memory Used:** ${Math.round(((process.memoryUsage().heapUsed / 1000000) + 0.00001) * 100) / 100}Mb
**Total Memory:** ${Math.round(((process.memoryUsage().heapTotal / 1000000) + 0.00001) * 100) / 100}Mb
**Lib Memory:** ${Math.round(((process.memoryUsage().rss / 1000000) + 0.00001) * 100) / 100}Mb

**mod roles:** ${zconfig.ModRoleIds}
**admin roles:** ${zconfig.AdminRoleIds}
**god roles:** ${zconfig.GodRoleIds}
`);
                },
            },

            "reloadconfig": {
                desc: "Reload the config and convars",
                args: "",
                role: "god",
                run: async (interaction, args) => {
                    require(`${zroot}/server/libs/configValidator`)();
                    return interaction.sreply("Okie");
                },
            },

            "say": {
                desc: "Say in current channel",
                args: "[message]",
                role: "mod",
                run: async (interaction, args) => {
                    if (!args.var1) return interaction.sreply("Idk what to say yet");
                    if (!interaction.channel.viewable) return interaction.sreply("I can't see this channel.");
                    await interaction.channel.send(args.var1).catch(console.error);
                    return interaction.sreply("Okie");
                },
            },

            "dm": {
                desc: "dm a user",
                args: "[user] [message]",
                role: "admin",
                run: async (interaction, args) => {
                    const user = await zbot.users.fetch(args.var1).catch(console.error);
                    if (!user) return interaction.sreply("Couldn't find this user");
                    const msg = await user.send(args.var2).catch(console.error);
                    if (!msg) return interaction.sreply("Something went wrong trying to send this message.");
                    return interaction.sreply(`Message sent to **${user.tag}**\n${args.var2}`);
                },
            },

            "sql": {
                desc: "run sql queries",
                args: "[all/run/get] [query]",
                role: "god",
                run: async (interaction, args) => {
                    if (!args.var1 || !["all", "run", "get"].includes(args.var1)) return interaction.sreply("all, run or get?");
                    if (!args.var2) return interaction.sreply("SQL Query can't be blank");
                    try {
                        const q = client.db.db.prepare(args.var2);
                        let reply = "";
                        if (args.var1 === "all") reply = q.all();
                        else if (args.var1 === "run") reply = q.run();
                        else if (args.var1 === "get") reply = q.get();
                        console.log(args.var2);
                        console.log(reply);
                        const cleaned = await this.clean(reply);
                        interaction.sreply(`\`\`\`sql\n${cleaned.slice(0, 1900)}\n\`\`\``);
                    } catch (e) {
                        interaction.sreply(e.toString());
                    }
                },
            },

            "eval": {
                desc: "run eval code",
                args: "[all/run/get] [query]",
                role: "god",
                run: async (interaction, args) => {
                    if (!args.var1) return interaction.sreply("need something to eval");
                    try {
                        const evaled = eval(args.var1);
                        console.log(evaled);
                        const cleaned = await this.clean(evaled);
                        interaction.sreply(`\`\`\`js\n${cleaned.slice(0, 1900)}\n\`\`\``);
                    } catch (err) {
                        console.error(err);
                        interaction.sreply(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
                    }
                },
            },

        };
    }

    async run(interaction, args) {
        if (this.cmds[args.cmd]) {
            if (!zbot.hasPermission(interaction.member, this.cmds[args.cmd].role)) {
                return interaction.sreply(Lang.t("no_permission")).catch(console.error);
            }
            return this.cmds[args.cmd].run(interaction, args);
        }
        return interaction.sreply("Command not found.");
    }

    async clean(text) {
        if (text && text.constructor.name == "Promise") text = await text;
        if (typeof text !== "string") text = require("util").inspect(text, { depth: 1 });
        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        return text;
    }
};
