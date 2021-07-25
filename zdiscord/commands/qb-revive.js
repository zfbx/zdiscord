module.exports = {
    name: 'revive',
    alias: 'r',
    description: 'Revive player in city',
    args: `[${locale.helpTypeID}]`,
    staffOnly: true,
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, locale.noIdProvided);

        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        let player = QBCore.Functions.GetPlayer(id);

        TriggerClientEvent('hospital:client:Revive', player.PlayerData.source);

        console.log(`[${msg.nickname}] Revived ${id}`);

        msg.addReaction('✅');

    },
};