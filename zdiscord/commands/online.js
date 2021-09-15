module.exports = {
    name: "online",
    description: "Get number of people online",
    role: "none",
    run(discord, msg, args) {
        const playerNumber = GetNumPlayerIndices();
        if (playerNumber === 0) discord.createMessage(msg.channel.id, "Nobody is online.");
        else if (playerNumber === 1) discord.createMessage(msg.channel.id, "There is 1 person online.");
        else discord.createMessage(msg.channel.id, `There are ${playerNumber} people online.`);
    },
};