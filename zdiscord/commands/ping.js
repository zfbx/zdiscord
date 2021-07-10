module.exports = {
	name: locale.cmdPing,
	description: locale.helpPing,
	staffOnly: false,
	run(discord, msg, args) {
		discord.createMessage(msg.channel.id, locale.pong);
	},
};