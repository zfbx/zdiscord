module.exports = {
    name: 'permissions',
    alias: 'perms',
    description: 'Give/take a player QB permissions',
    args: `[(set/add/a)/(remove/r)] [id] (if set/add: [admin/god])`,
    role: "god",
    run(discord, msg, args) {
        const actions = {
            "set": true,
            "add": true,
            "a": true,
            "remove": false,
            "r": false,
            "rem": false,
        }

        // Get whether to add or remove
        let addperms = args.shift();
        if (!addperms) return discord.createMessage(msg.channel.id, "Not valid. Add or remove permissions?");
        addperms = addperms.toLowerCase();
        if (actions[addperms] == undefined) return discord.createMessage(msg.channel.id, "Not a valid action [(set/add/a)/(remove/r)]");
        addperms = actions[addperms];

        // Get and process ID
        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, "You must provide an ID of a player.");
        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");
        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");
        let player = QBCore.Functions.GetPlayer(id);
        if (!player) return discord.createMessage(msg.channel.id, "Player not found");

        if (addperms) {
            // Get and process permission level
            let perm = args.shift();
            if (!perm) return discord.createMessage(msg.channel.id, "No permission level provided (admin / god)");
            perm = perm.toLowerCase();
            if (perm !== "admin" && perm !== "god") return discord.createMessage(msg.channel.id, "Not a valid permission level (only admin or god)");

            QBCore.Functions.AddPermission(player.PlayerData.source, perm);
            console.log(`[${msg.nickname}] Gave ${id} the ${perm} permission`);
        } else {
            QBCore.Functions.RemovePermission(player.PlayerData.source);
            console.log(`[${msg.nickname}] Removed ${id} permissions`);
        }

        msg.addReaction('✅');
    },
};