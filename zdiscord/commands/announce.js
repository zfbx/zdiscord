module.exports = {
    name: locale.cmdAnnounce,
    alias: locale.cmdAnnounceAlias,
    description: locale.helpAnnounce,
    args: `[${locale.helpTypeMessage}]`,
    staffOnly: true,
    run(discord, msg, args) {

        const content = args.join(" ") || "";
        if (!content) return discord.createMessage(msg.channel.id, locale.provideMessageError);

        TriggerClientEvent('chatMessage', -1, locale.announcement, "error", content)

        console.log(`[${msg.nickname}] Announcement: ${content}`);

        msg.addReaction('✔');
    },
};