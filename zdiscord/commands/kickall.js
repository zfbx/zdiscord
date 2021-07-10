module.exports = {
    name: locale.cmdKickall,
    description: locale.helpKickall,
    args: `[${locale.helpTypeReason}]`,
    staffOnly: true,
    run(discord, msg, args) {

        const numberOnline = GetNumPlayerIndices();
        if (numberOnline === 0) return discord.createMessage(msg.channel.id, locale.nobodyOnline);

        const content = args.join(" ") || "";
        if (!content) return discord.createMessage(msg.channel.id, locale.provideMessageError);

        console.log(locale.consoleLogKickAll
            .replace(/{{sender}}/g, msg.nickname)
            .replace(/{{msg}}/g, content));

        getPlayers().forEach(async function (player, index, array) {
            DropPlayer(player, content);
        });

        return discord.createMessage(msg.channel.id, locale.allPlayersKicked
            .replace(/{{previousOnlineCount}}/g, numberOnline));
    },
};