module.exports = {
    name: "teleport",
    alias: "tp",
    description: "teleport a player",
    args: `[id] [location/x] (y) (z)`,
    role: "mod",
    run: (discord, msg, args) => {
        const locations = {
            "airport": [ -948.35, -3367.04, 13.94 ],
            "mazeroof": [ -75.19, -819.2, 326.18 ],
            "pier": [ -1712.06, -1136.48, 13.08 ],
            "base": [ -2105.88, 2871.16, 32.81 ],
            "chiliad": [ 453.73, 5572.2, 781.18 ],
        };

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, "You must provide an ID of a player.");
        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");
        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");
        
        let xOrLoc = args.shift();
        if (!xOrLoc) return discord.createMessage(msg.channel.id, "You must provide either a preset location or x y z coordinates");
        if (!isNaN(Number(xOrLoc))) {
            let y = args.shift();
            let z = args.shift();
            if (!y || !z) return discord.createMessage(msg.channel.id, "You must provide x y and z coordinates");
            if (isNaN(Number(y)) || isNaN(Number(z))) return discord.createMessage(msg.channel.id, "invalid x y or z coordinate");
            teleport(id, Number(xOrLoc), Number(y), Number(z));
        } else {
            xOrLoc = xOrLoc.toLowerCase()
            if (locations[xOrLoc]) {
                teleport(id, locations[xOrLoc][0], locations[xOrLoc][1], locations[xOrLoc][2]);
            } else {
                return discord.createMessage(msg.channel.id, `This location id is invalid. Valid locations: ${Object.keys(locations).join(", ")}`);
            }
        }
        console.log(`[${msg.nickname}] teleported ${id}`);
        msg.addReaction('✅');
    },
};

function teleport(id, x, y, z, withVehicle = false) {
    x = x.toFixed(2);
    y = y.toFixed(2);
    z = z.toFixed(2);
    if (NetworkGetEntityOwner(GetPlayerPed(id)) == id) {
        emitNet(`${GetCurrentResourceName()}:teleport`, id, x, y, z, withVehicle);
    } else {
        SetEntityCoords(GetPlayerPed(id), x, y, z);
    }
}