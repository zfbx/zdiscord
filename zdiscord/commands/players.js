module.exports = {
	name: locale.cmdPlayers,
	alias: locale.cmdPlayersAlias,
	description: locale.helpPlayers,
	staffOnly: true,
	run(discord, msg, args) {

		if (GetNumPlayerIndices() === 0) return discord.createMessage(msg.channel.id, locale.nobodyOnline);
		const playersembed = {embed: { color: config.embedColor, fields: [{ name: locale.playersHeader.replaceGlobals(), value: "", inline: false }]}}
		getPlayers().forEach(async function(player, index, array) {
			playersembed.embed.fields[0].value = playersembed.embed.fields[0].value + `\`[${player}]\` ${GetPlayerName(player)}\n`;
		});
		return discord.createMessage(msg.channel.id, playersembed);
	},
};