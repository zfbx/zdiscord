const Eris = require('eris');
const config = GetConvar("discord", ""); //Currently not implemented, going to change to a config

if (!config.token) {
    console.error("This module requires a discord bot token to run. read the readme.md");
    StopResource('discord');
}

const discord = new Eris.Client(config.token, {
    intents: [ "guilds", "guildMessages", "guildMembers", "guildBans", "guildPresences", "guildMessageReactions", "directMessages" ],
    disabledEvents: { CHANNEL_CREATE: true, CHANNEL_CREATE: true },
    getAllUsers: true
});

const help = {embed: { color: 0x663A82, fields: [{ name: "Commands", value: "", inline: false }]}}
const staffhelp = {embed: { color: 0x663A82, fields: [{ name: "Commands", value: "", inline: false },{ name: "Staff", value: "", inline: false }]}};
const whitelistRoles = config.liveServer ? config.liveWhitelistRoles : config.devWhitelistRoles;

discord.on('ready', () => { console.log("Logged in on Discord as " + discord.user.username + "!"); });
discord.on("error", (err) => { console.error(err); });

discord.on("messageCreate", async (msg) => {
    if (!config.liveServer) return; // Don't accept input on dev server
    if (msg.guildID !== config.guildID || msg.author.bot) return;
    const isStaff = msg.member.roles.includes(config.staffRoleID);
    const nickname = msg.member.nick || msg.member.username;
    if (!msg.content.startsWith(config.prefix)) { 
        if (msg.channel.id !== config.staffChannelID) return; // Ignore content not from staff channel
        if (!msg.content) return; // Can't send images.
        getPlayers().forEach(async function(player, index, array) {
            if (QBCore.Functions.HasPermission(player, "admin")) { // TODO Replace QBCore shit
                if (QBCore.Functions.IsOptin(player)) TriggerClientEvent('chatMessage', player, `STAFF: ${nickname}`, "error", msg.content);
            }
        });
        return console.log(`[STAFF] ${nickname}: ${msg.content}`);
    }
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
    let content = args.join(" ") || "";

    switch(command) { // EVERYONE COMMANDS
        
        case "ping":
            discord.createMessage(msg.channel.id, "Pong!");
            return;

        case "online":
            const playerNumber = GetNumPlayerIndices();
            if (playerNumber === 0) discord.createMessage(msg.channel.id, `Nobody is online.`);
            else if (playerNumber === 1) discord.createMessage(msg.channel.id, `There is just 1 person in the city right now.`);
            else discord.createMessage(msg.channel.id, `There are ${playerNumber} players in the city.`);
            return;

        case "help":
            if (isStaff) discord.createMessage(msg.channel.id, staffhelp);
            else discord.createMessage(msg.channel.id, help);
            return;

        default:
            break;
    }

    if (!isStaff) return; // Only staff beyond this point.

    switch(command) { // ADMIN COMMANDS
        case "announcement":
        case "announce":
            if (!content) return discord.createMessage(msg.channel.id, "Can't send blank announcements");
            TriggerClientEvent('chatMessage', -1, "ANNOUNCEMENT", "error", content)
            return console.log(`[${nickname}] Announcement: ${content}`);

        case "reply":
            let rid = args.shift();
            if (!rid) return discord.createMessage(msg.channel.id, "Which ID is this message supposed to go to?");
            rid = Number(rid);
            if (isNaN(rid)) return discord.createMessage(msg.channel.id, "This ID seems invalid");

            content = args.join(" ") || "";
            if (!content) return discord.createMessage(msg.channel.id, "Can't reply with a blank message");
            TriggerClientEvent('chatMessage', rid, `ADMIN ${nickname}`, "warning", content);
            getPlayers().forEach(async function(player, index, array) {
                if (QBCore.Functions.HasPermission(player, "admin")) {
                    if (QBCore.Functions.IsOptin(player)) TriggerClientEvent('chatMessage', player, `${nickname} -> ${rid}`, "warning", content);
                }
            });
            return console.log(`[${nickname}] Message to ${rid}: ${content}`);

        case "kick":
            let kid = args.shift();
            if (!kid) return discord.createMessage(msg.channel.id, "Which ID to kick?");
            else {
                kid = Number(kid);
                if (isNaN(kid)) return discord.createMessage(msg.channel.id, "This ID seems invalid");
            }
            content = args.join(" ") || "";
            if (!content) content = "You've been kicked by staff.";
            console.log(`[${nickname}] Kicked ${kid}. Reason: ${content}`);
            return DropPlayer(kid, content);

        case "kickall":
            let numberOnline = GetNumPlayerIndices();
            if (numberOnline === 0) return discord.createMessage(msg.channel.id, "There is nobody online to kick.");
            content = args.join(" ") || "";
            if (!content || content.length < 7) return discord.createMessage(msg.channel.id, "Please provide a decent reason for why you're kicking everyone.");
            console.log(`[${nickname}] Kicked EVERYONE. Reason: ${content}`);
            getPlayers().forEach(async function(player, index, array) {
                DropPlayer(player, content);
            });
            return discord.createMessage(msg.channel.id, `All ${numberOnline} player(s) have kicked.`);

        case "players":
            if (GetNumPlayerIndices() === 0) return discord.createMessage(msg.channel.id, "There is nobody online to get.");
            const playersembed = {embed: { color: 0x663A82, fields: [{ name: "Players", value: "", inline: false }]}}
            getPlayers().forEach(async function(player, index, array) {
                playersembed.embed.fields[0].value = playersembed.embed.fields[0].value + `\`[${player}]\` ${GetPlayerName(player)}\n`;
            });
            return discord.createMessage(msg.channel.id, playersembed);

        case "info":
            let iid = args.shift();
            if (!iid) return discord.createMessage(msg.channel.id, "Which ID to lookup?");
            else {
                iid = Number(iid);
                if (isNaN(iid)) return discord.createMessage(msg.channel.id, "This ID seems invalid");
            }
            const playerembed = {embed: { color: 0x663A82, fields: []}}
            for (let i = 0; i < GetNumPlayerIdentifiers(iid); i++) {
                const identifier = GetPlayerIdentifier(iid, i);
                const id = identifier.split(":");
                if (id[0] === "discord") playerembed.embed.fields.push({ name: capitalize(id[0]), value: `<@${id[1]}> (${id[1]})`, inline: true });
                else playerembed.embed.fields.push({ name: capitalize(id[0]), value: id[1], inline: true });
            }
            return discord.createMessage(msg.channel.id, playerembed);

        default:
            break;
    }
});

// Everyone
addHelpEntry('ping', "Check bot status", false);
addHelpEntry('help', "Get this message", false);
addHelpEntry('online', "Get number of people online", false);
// Staff Only
addHelpEntry('announcement [msg]', "Send in city announcement", true);
addHelpEntry('reply [id] [msg]', "Send message to user in city", true);
addHelpEntry('kick [id] (reason)', "Kicks user in city", true);
addHelpEntry('kickall [reason]', "Kicks everyone in city", true);
addHelpEntry('players', "Get list of players in the city", true);
addHelpEntry('info [id]', "Get information on a player", true);

discord.connect();

// FIVEM STUFF

on("playerConnecting", async (name, setKickReason, deferrals) => {
    const player = source;
    deferrals.defer();
    await sleep(0); // Required before running consecutive deferrals
    if (!config.enableWhitelist) return deferrals.done();
    deferrals.update(config.messages.checkingWhitelist.replace(/{{name}}/g, name));
    
    let discordID = null;
    for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
        const id = GetPlayerIdentifier(player, i);
        if (id.includes('discord:')) discordID = id.slice(8);
    }

    await sleep(0);
    if (discordID === null) return deferrals.done(config.messages.discordNotOpen);

    const guild = await discord.guilds.get(config.guildid);
    if (!guild) {
        console.error(`Something went wrong fetching the Discord server for whitelist checking using guild id: ${config.guildid}`);
        return deferrals.done(config.messages.fatalError);
    }

    const member = await guild.members.get(discordID);
    if (!member) return deferrals.done(config.messages.notInDiscordServer);
    
    let whitelisted = false;
    whitelistRoles.forEach(function(item, index, array) {
        if (member.roles.includes(item)) whitelisted = true;
    });
        
    if (whitelisted) deferrals.done();
    else deferrals.done(config.messages.notWhitelisted);
});

// UTILS
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addHelpEntry(cmd, desc, isStaff = false) {
    if (isStaff) staffhelp.embed.fields[1].value = staffhelp.embed.fields[1].value + `\`${config.prefix}${cmd}\` - ${desc}\n`;
    else {
        help.embed.fields[0].value = help.embed.fields[0].value + `\`${config.prefix}${cmd}\` - ${desc}\n`;
        staffhelp.embed.fields[0].value = staffhelp.embed.fields[0].value + `\`${config.prefix}${cmd}\` - ${desc}\n`;
    }
}

function capitalize(s) {
    if (typeof s !== 'string') return '';
    if (s === "id") return s.toUpperCase();
    else return s.charAt(0).toUpperCase() + s.slice(1);
}