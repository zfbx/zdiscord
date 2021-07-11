module.exports = {
    name: 'unjail',
    description: 'Sends player to jail for certain amount of time',
    args: `[${locale.helpTypeID}] [time(seconds)]`,
    staffOnly: true,
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, locale.noIdProvided);

        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        TriggerClientEvent("prison:client:UnjailPerson", id);

        console.log(`[${msg.nickname}] Unjailed ${id}`);

        msg.addReaction('✔');
    },
};