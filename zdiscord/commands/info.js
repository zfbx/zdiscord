module.exports = {
    name: "info",
    alias: "i",
    description: "Get information on a player",
    args: `[id]`,
    role: "mod",
    run(discord, msg, args) {
        let pid = args.shift();
        if (!pid) return discord.createMessage(msg.channel.id, "You must provide an ID of a player.");

        pid = Number(pid);
        if (isNaN(pid)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        if (!GetPlayerName(pid)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        const playerembed = { embed: { color: config.embedColor, fields: [] } }

        for (let i = 0; i < GetNumPlayerIdentifiers(pid); i++) {
            const identifier = GetPlayerIdentifier(pid, i);
            const id = identifier.split(":");
            if (id[0] === "discord") {
                playerembed.embed.fields.push({ name: id[0], value: `<@${id[1]}> (${id[1]})`, inline: true });
            } else if (id[0] === "ip") {
                playerembed.embed.fields.push({ name: id[0], value: `||${id[1]}||`, inline: true });
            } else {
                playerembed.embed.fields.push({ name: id[0], value: id[1], inline: true });
            }
        }
        return discord.createMessage(msg.channel.id, playerembed);
    },
};