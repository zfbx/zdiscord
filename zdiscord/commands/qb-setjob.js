module.exports = {
    name: 'setjob',
    description: 'Set players job in city',
    args: `[${locale.helpTypeID}] [job] [grade]`,
    staffOnly: true,
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, locale.noIdProvided);

        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        let job = args.shift();
        if (!job) return discord.createMessage(msg.channel.id, "No job specified");

        let grade = args.shift();
        if (!grade) return discord.createMessage(msg.channel.id, "No job grade specified");

        grade = Number(grade);
        if (isNaN(grade)) return discord.createMessage(msg.channel.id, "Job grade invalid");

        let player = QBCore.Functions.GetPlayer(id);

        player.Functions.SetJob(job, grade);

        console.log(`[${msg.nickname}] Set ${id}'s Job to ${job} with grade ${grade}`);

        msg.addReaction('✅');

    },
};