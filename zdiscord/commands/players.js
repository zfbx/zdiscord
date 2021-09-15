module.exports = {
    name: "players",
    alias: "p",
    description: "Get list of players in the city",
    role: "mod",
    run(discord, msg, args) {

        if (GetNumPlayerIndices() === 0) return discord.createMessage(msg.channel.id, "Nobody is online.");
        const playersembed = { embed: { color: config.embedColor, fields: [{ name: "Players ({{playercount}})".replaceGlobals(), value: "", inline: false }] } }
        getPlayers().forEach(async function (player, index, array) {
            playersembed.embed.fields[0].value = playersembed.embed.fields[0].value + `\`[${player}]\` ${GetPlayerName(player)}\n`;
        });
        return discord.createMessage(msg.channel.id, playersembed);
    },
};