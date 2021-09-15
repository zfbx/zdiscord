module.exports = {
    name: "announce",
    alias: "a",
    description: "Send in city announcement",
    args: "[msg]",
    role: "admin",
    run(discord, msg, args) {

        const content = args.join(" ") || "";
        if (!content) return discord.createMessage(msg.channel.id, "Please provide a message");

        TriggerClientEvent('chatMessage', -1, locale.announcement, "error", content)

        console.log(`[${msg.nickname}] Announcement: ${content}`);

        msg.addReaction('✅');
    },
};