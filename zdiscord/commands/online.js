module.exports = {
	name: locale.cmdOnline,
	description: locale.helpOnline,
	staffOnly: false,
	run(discord, msg, args) {
		const playerNumber = GetNumPlayerIndices();
		if (playerNumber === 0) discord.createMessage(msg.channel.id, locale.nobodyOnline.replaceGlobals());
        else if (playerNumber === 1) discord.createMessage(msg.channel.id, locale.oneOnline.replaceGlobals());
        else discord.createMessage(msg.channel.id, locale.numberOnline.replaceGlobals());
	},
};