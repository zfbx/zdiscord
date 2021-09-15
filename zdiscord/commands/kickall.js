module.exports = {
    name: "kickall",
    description: "Kicks everyone in city",
    args: `[reason]`,
    role: "admin",
    run(discord, msg, args) {

        const numberOnline = GetNumPlayerIndices();
        if (numberOnline === 0) return discord.createMessage(msg.channel.id, "Nobody is online.");

        const content = args.join(" ") || "";
        if (!content) return discord.createMessage(msg.channel.id, "Please provide a message");

        getPlayers().forEach(async function (player, index, array) {
            DropPlayer(player, content);
        });

        discord.createMessage(msg.channel.id, `All ${numberOnline} player(s) have kicked.`);

        console.log(`[${msg.nickname}] Kicked EVERYONE. Reason: ${content}`);
    },
};