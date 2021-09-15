module.exports = {
    name: "help",
    description: "Get this message",
    args: "(command)",
    role: "none",
    run(discord, msg, args) {

        let cmd = args.shift();
        if (cmd) {
            cmd = cmd.toLowerCase();
            if (!discord.commands.has(cmd) && !discord.commandAliases[cmd]) return discord.createMessage(msg.channel.id, "This is not a valid command.");

            const cmdval = discord.commands.has(cmd) ? discord.commands.get(cmd) : discord.commands.get(discord.commandAliases[cmd]);

            if (cmd.role && !hasPermission(cmd.role, msg.staffRole)) return;

            const cmdalias = cmdval.alias ? ` [Alias ${config.prefix}${cmdval.alias}]` : "";
            const cmdargs = cmdval.args ? `\n**Args:** ${cmdval.args}` : "";

            const cmdhelp = {
                embed: {
                    color: config.embedColor,
                    fields: [
                        {
                            name: `${cmdval.name}${cmdalias}`,
                            value: `${cmdval.description}${cmdargs}`,
                            inline: false
                        }
                    ]
                }
            }
            return discord.createMessage(msg.channel.id, cmdhelp);
        }

        const help = { embed: { color: config.embedColor, fields: [{ name: "Commands", value: "", inline: false }] } }

        discord.commands.forEach((value, key) => {
            if (value.role && !hasPermission(value.role, msg.staffRole)) return;

            const alias = value.alias ? ` (${value.alias})` : "";
            const cmdargs = value.args ? ` ${value.args}` : "";
            help.embed.fields[0].value = help.embed.fields[0].value + `\`${config.prefix}${value.name}${alias}${cmdargs}\` - ${value.description}\n`;
        });

        discord.createMessage(msg.channel.id, help);
    },
};