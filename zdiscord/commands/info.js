module.exports = {
    name: locale.cmdInfo,
    alias: locale.cmdInfoAlias,
    description: locale.helpInfo,
    args: `[${locale.helpTypeID}]`,
    staffOnly: true,
    run(discord, msg, args) {
        let pid = args.shift();
        if (!pid) return discord.createMessage(msg.channel.id, locale.noIdProvided);

        pid = Number(pid);
        if (isNaN(pid)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        if (!GetPlayerName(pid)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        const playerembed = { embed: { color: config.embedColor, fields: [] } }

        for (let i = 0; i < GetNumPlayerIdentifiers(pid); i++) {
            const identifier = GetPlayerIdentifier(pid, i);
            const id = identifier.split(":");
            if (id[0] === "discord") {
                playerembed.embed.fields.push({ name: id[0], value: `<@${id[1]}> (${id[1]})`, inline: true });
            } else {
                playerembed.embed.fields.push({ name: id[0], value: id[1], inline: true });
            }
        }
        return discord.createMessage(msg.channel.id, playerembed);
    },
};