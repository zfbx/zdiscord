module.exports = {
    name: locale.cmdKick,
    alias: locale.cmdKickAlias,
    description: locale.helpKick,
    args: `[${locale.helpTypeID}] (${locale.helpTypeReason})`,
    staffOnly: true,
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, locale.noIdProvided);

        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        let content = args.join(" ") || "";
        if (!content) content = locale.kickedWithoutReason.replaceGlobals();

        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        DropPlayer(id, content);

        console.log(locale.consoleLogKick
            .replace(/{{sender}}/g, msg.nickname)
            .replace(/{{msg}}/g, content)
            .replace(/{{id}}/g, id));

        msg.addReaction('✔');
    },
};