module.exports = {
    name: 'unjail',
    description: 'Sends player to jail for certain amount of time',
    args: `[id]`,
    role: "mod",
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, "You must provide an ID of a player.");

        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        TriggerClientEvent("prison:client:UnjailPerson", id);

        console.log(`[${msg.nickname}] Unjailed ${id}`);

        msg.addReaction('✅');
    },
};