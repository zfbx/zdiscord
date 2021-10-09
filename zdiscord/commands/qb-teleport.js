module.exports = {
    name: 'teleport',
    alias: 'tp',
    description: 'Teleports player to location',
    args: `[id] [location]`,
    role: "mod",
    run(discord, msg, args) {

        const teleportLocations = {
            "pillboxgarage": [ 22.41, -797.8, 30.83 ],
            "anotherlocation": [ 1004.37, -593.2, 40.24 ], // dunno where this goes lol
        }

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, "You must provide an ID of a player.");
        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");
        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        let location = args.shift();
        if (!location) return discord.createMessage(msg.channel.id, "No location specified");
        let location = teleportLocations[location.toLowerCase()] || false;
        if (!location) return discord.createMessage(msg.channel.id, "Invalid location");

        player = QBCore.Functions.GetPlayer(id);
        SetEntityCoords(GetPlayerPed(player.PlayerData.source), location[0], location[1], location[2])

        console.log(`[${msg.nickname}] teleported ${id} to ${location}.`);
        msg.addReaction('✅');
    },
};