module.exports = {
    name: 'revive',
    alias: 'r',
    description: 'Revive player in city',
    args: `[id]`,
    role: "admin",
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, "You must provide an ID of a player.");

        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        let player = QBCore.Functions.GetPlayer(id);

        TriggerClientEvent('hospital:client:Revive', player.PlayerData.source);

        console.log(`[${msg.nickname}] Revived ${id}`);

        msg.addReaction('✅');

    },
};