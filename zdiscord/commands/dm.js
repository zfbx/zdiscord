module.exports = {
    name: locale.cmdDm,
    alias: locale.cmdDmAlias,
    description: locale.helpDm,
    args: `[${locale.helpTypeID}] [${locale.helpTypeMessage}]`,
    staffOnly: true,
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, locale.noIdProvided);

        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        const content = args.join(" ") || "";
        if (!content) return discord.createMessage(msg.channel.id, locale.provideMessageError);

        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        TriggerClientEvent('chatMessage', id, locale.directMessage, "error", content)

        console.log(locale.consoleLogDm
            .replace(/{{sender}}/g, msg.nickname)
            .replace(/{{msg}}/g, content)
            .replace(/{{id}}/g, id));

        msg.addReaction('✔');
    },
};