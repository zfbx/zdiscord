module.exports = {
    name: "kick",
    alias: "k",
    description: "Kicks user in city",
    args: `[id] (reason)`,
    role: "mod",
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, "You must provide an ID of a player.");

        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        let content = args.join(" ") || "";
        if (!content) content = locale.kickedWithoutReason.replaceGlobals();

        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        DropPlayer(id, content);

        console.log(`[${msg.nickname}] Kicked ${id}. Reason: ${content}`);

        msg.addReaction('✅');
    },
};