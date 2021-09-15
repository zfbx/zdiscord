module.exports = {
    name: "ping",
    description: "Check bot status",
    role: "none",
    run(discord, msg, args) {
        discord.createMessage(msg.channel.id, "Pong");
    },
};