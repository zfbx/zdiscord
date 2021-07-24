module.exports = {
    name: 'addpermission',
    description: 'Give a player QB permissions',
    args: `[${locale.helpTypeID}] [admin/god]`,
    staffOnly: true,
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, locale.noIdProvided);

        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        let player = QBCore.Functions.GetPlayer(id);
        if (!player) return discord.createMessage(msg.channel.id, "Player not found");

        let perm = args.shift();
        if (!perm) return discord.createMessage(msg.channel.id, "No permission level provided (admin / god)");

        perm = perm.toLowerCase();
        if (perm !== "admin" && perm !== "god") return discord.createMessage(msg.channel.id, "Not a valid permission level (only admin or god)");

        QBCore.Functions.AddPermission(player.PlayerData.source, perm)

        console.log(`[${msg.nickname}] Gave ${id} the ${perm} permission`);

        msg.addReaction('✔');
    },
};