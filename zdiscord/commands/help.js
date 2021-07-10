module.exports = {
	name: locale.cmdHelp,
	description: locale.helpHelp,
	args: `(${locale.helpTypeCommand})`,
	staffOnly: false,
	run(discord, msg, args) {

		let cmd = args.shift();
		if (cmd) {
			cmd = cmd.toLowerCase();
			if (!discord.commands.has(cmd) && !discord.commandAliases[cmd]) return discord.createMessage(msg.channel.id, locale.commandNotFound);

			const cmdval = discord.commands.has(cmd) ? discord.commands.get(cmd) : discord.commands.get(discord.commandAliases[cmd]);

			if (!msg.isStaff && cmdval.staffOnly) return;

			const cmdalias = cmdval.alias ? ` [Alias ${config.prefix}${cmdval.alias}]` : "";
			const cmdargs = cmdval.args ? `\n**Args:** ${cmdval.args}`: "";

			const cmdhelp = {embed: {
				color: config.embedColor,
				fields: [
					{
						name: `${cmdval.name}${cmdalias}`,
						value: `${cmdval.description}${cmdargs}`,
						inline: false 
					}
				]
			}}
			return discord.createMessage(msg.channel.id, cmdhelp);
		}

		const help = {embed: { color: config.embedColor, fields: [{ name: locale.commands, value: "", inline: false }]}}

		discord.commands.forEach((value, key) => {
			if(value.staffOnly && !msg.isStaff) return;

			const alias = value.alias ? ` (${value.alias})` : "";
			const cmdargs = value.args ? ` ${value.args}`: "";
			help.embed.fields[0].value = help.embed.fields[0].value + `\`${config.prefix}${value.name}${alias}${cmdargs}\` - ${value.description}\n`;
		});

		discord.createMessage(msg.channel.id, help);
	},
};