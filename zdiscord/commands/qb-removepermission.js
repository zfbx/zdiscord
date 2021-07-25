module.exports = {
    name: 'removepermission',
    description: 'Remove a player\'s QB permissions',
    args: `[${locale.helpTypeID}]`,
    staffOnly: true,
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, locale.noIdProvided);

        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        let player = QBCore.Functions.GetPlayer(id);
        if (!player) return discord.createMessage(msg.channel.id, "Player not found");

        QBCore.Functions.RemovePermission(player.PlayerData.source)

        console.log(`[${msg.nickname}] Removed ${id} permissions`);

        msg.addReaction('✅');
    },
};