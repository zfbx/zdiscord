module.exports = {
    name: 'jail',
    description: 'Sends player to jail for certain amount of time',
    args: `[id] [time(seconds)]`,
    role: "mod",
    run(discord, msg, args) {

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, "You must provide an ID of a player.");
        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");
        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, "This ID seems invalid.");

        let time = args.shift();
        if (!time) return discord.createMessage(msg.channel.id, "No time specified");
        time = Number(time);
        if (isNaN(time) || time < 1) return discord.createMessage(msg.channel.id, "This time is invalid");

        player = QBCore.Functions.GetPlayer(id);

        const d = new Date();
        let currentDate = { // Stupid hack to replicate lua's os.date("*t") for the prison jail script is stupid..
            ["month"]: d.getDate(),
            ["sec"]: d.getSeconds(),
            ["year"]: d.getFullYear(),
            ["day"]: (d.getDate() > 30) ? 30 : d.getDate(),
            ["min"]: d.getMinutes(),
            ["wday"]: d.getDay() + 1,
            ["isdst"]: false, // fuck it
            ["yday"]: (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000,
            ["hour"]: d.getHours(),
        }

        player.Functions.SetMetaData("injail", time);
        player.Functions.SetMetaData("criminalrecord", { ["hasRecord"]: true, ["date"]: currentDate });
        TriggerClientEvent("police:client:SendToJail", player.PlayerData.source, time)
        TriggerClientEvent('QBCore:Notify', player.PlayerData.source, `You sent the person to prison for ${time} months`)

        console.log(`[${msg.nickname}] Jailed ${id} for ${time} months.`);
        
        msg.addReaction('✅');
    },
};