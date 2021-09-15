module.exports = {
    name: "directmessage",
    alias: "dm",
    description: "Send a direct message to a player",
    args: "[id] [msg]",
    role: "mod",
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, "You must provide an ID of a player.");
        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");
        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        const content = args.join(" ") || "";
        if (!content) return discord.createMessage(msg.channel.id, "Please provide a message");

        TriggerClientEvent('chatMessage', id, locale.directMessage, "error", content)
        console.log(`[${msg.nickname}] DM'd ${id}. Message: ${content}`);

        msg.addReaction('✅');
    },
};