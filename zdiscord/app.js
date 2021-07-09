const Eris = require('eris');
const locale = require('./locales/' + config.lang);
init();

if (!config.token) {
    console.error(locale.consoleMissingToken);
    StopResource(GetCurrentResourceName());
}

const discord = new Eris.Client(config.token, {
    intents: [ "guilds", "guildMessages", "guildMembers", "guildBans", "guildPresences" ],
    disabledEvents: { CHANNEL_CREATE: true, CHANNEL_CREATE: true },
    getAllUsers: true
});

const help = {embed: { color: config.embedColor, fields: [{ name: locale.commands, value: "", inline: false }]}}
const staffhelp = {embed: { color: config.embedColor, fields: [{ name: locale.commands, value: "", inline: false },{ name: locale.staff.replaceGlobals(), value: "", inline: false }]}};

discord.on('ready', () => {
    console.log(locale.consoleLoggedIn.replace(/{{username}}/g, discord.user.username).replaceGlobals());
    if (config.statusMessages) statusUpdater();
});
discord.on("error", (err) => { console.error(err); });

discord.on("messageCreate", async (msg) => {
    if (msg.guildID !== config.guildid || msg.author.bot) return;
    if (!msg.content.startsWith(config.prefix)) return;
    let isStaff = false;
    config.staffRoles.forEach(function(item, index, array) {
        if (msg.member.roles.includes(item)) isStaff = true;
    });
    const nickname = msg.member.nick || msg.member.username;
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
    let content = args.join(" ") || "";

    switch(command) { // EVERYONE COMMANDS
        case locale.cmdPing:
            discord.createMessage(msg.channel.id, locale.pong);
            return;
        case locale.cmdOnline:
            const playerNumber = GetNumPlayerIndices();
            if (playerNumber === 0) discord.createMessage(msg.channel.id, locale.nobodyOnline);
            else if (playerNumber === 1) discord.createMessage(msg.channel.id, locale.oneOnline);
            else discord.createMessage(msg.channel.id, locale.numberOnline.replaceGlobals());
            return;
        case locale.cmdHelp:
            if (isStaff) discord.createMessage(msg.channel.id, staffhelp);
            else discord.createMessage(msg.channel.id, help);
            return;
        default:
            break;
    }
    if (!isStaff) return; // Only staff beyond this point.
    switch(command) { // ADMIN COMMANDS
        case locale.cmdAnnounce:
        case locale.cmdAnnounceAlias:
            if (!content) return discord.createMessage(msg.channel.id, locale.provideMessageError);
            TriggerClientEvent('chatMessage', -1, locale.announcement, "error", content)
            return console.log(locale.consoleLogAnnouncement.replace(/{{sender}}/g, nickname).replace(/{{msg}}/g, content));
        case locale.cmdKick:
        case locale.cmdKickAlias:
            let kid = args.shift();
            if (!kid) return discord.createMessage(msg.channel.id, locale.noIdProvided);
            else {
                kid = Number(kid);
                if (isNaN(kid)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);
            }
            content = args.join(" ") || "";
            if (!content) content = locale.kickedWithoutReason.replaceGlobals();
            console.log(locale.consoleLogKick.replace(/{{sender}}/g, nickname).replace(/{{msg}}/g, content).replace(/{{id}}/g, kid));
            return DropPlayer(kid, content);
        case locale.cmdKickall:
            let numberOnline = GetNumPlayerIndices();
            if (numberOnline === 0) return discord.createMessage(msg.channel.id, locale.nobodyOnline);
            content = args.join(" ") || "";
            if (!content || content.length < 7) return discord.createMessage(msg.channel.id, locale.provideMessageError);
            console.log(locale.consoleLogKickAll.replace(/{{sender}}/g, nickname).replace(/{{msg}}/g, content));
            getPlayers().forEach(async function(player, index, array) {
                DropPlayer(player, content);
            });
            return discord.createMessage(msg.channel.id, locale.allPlayersKicked.replace(/{{previousOnlineCount}}/g, numberOnline));
        case locale.cmdPlayers:
        case locale.cmdPlayersAlias:
            if (GetNumPlayerIndices() === 0) return discord.createMessage(msg.channel.id, locale.nobodyOnline);
            const playersembed = {embed: { color: config.embedColor, fields: [{ name: locale.PlayersHeader.replaceGlobals(), value: "", inline: false }]}}
            getPlayers().forEach(async function(player, index, array) {
                playersembed.embed.fields[0].value = playersembed.embed.fields[0].value + `\`[${player}]\` ${GetPlayerName(player)}\n`;
            });
            return discord.createMessage(msg.channel.id, playersembed);
        case locale.cmdInfo:
        case locale.cmdInfoAlias:
            let iid = args.shift();
            if (!iid) return discord.createMessage(msg.channel.id, locale.noIdProvided);
            else {
                iid = Number(iid);
                if (isNaN(iid)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);
            }
            const playerembed = {embed: { color: config.embedColor, fields: []}}
            for (let i = 0; i < GetNumPlayerIdentifiers(iid); i++) {
                const identifier = GetPlayerIdentifier(iid, i);
                const id = identifier.split(":");
                if (id[0] === "discord") playerembed.embed.fields.push({ name: id[0], value: `<@${id[1]}> (${id[1]})`, inline: true });
                else playerembed.embed.fields.push({ name: id[0], value: id[1], inline: true });
            }
            return discord.createMessage(msg.channel.id, playerembed);
        default:
            break;
    }
});

// Everyone
addHelpEntry(locale.cmdPing, locale.helpPing, false);
addHelpEntry(locale.cmdHelp, locale.helpHelp, false);
addHelpEntry(locale.cmdOnline, locale.helpOnline, false);
// Staff Only
addHelpEntry(`${locale.cmdAnnounce} (${locale.cmdAnnounceAlias}) [${locale.helpTypeMessage}]`, locale.helpAnnounce, true);
addHelpEntry(`${locale.cmdKick} (${locale.cmdKickAlias}) [${locale.helpTypeID}] (${locale.helpTypeReason})`, locale.helpKick, true);
addHelpEntry(`${locale.cmdKickall} [${locale.helpTypeReason}]`, locale.helpKickall, true);
addHelpEntry(`${locale.cmdPlayers} (${locale.cmdPlayersAlias})`, locale.helpPlayers, true);
addHelpEntry(`${locale.cmdInfo} (${locale.cmdInfoAlias}) [${locale.helpTypeID}]`, locale.helpInfo, true);

discord.connect();

on("playerConnecting", async (name, setKickReason, deferrals) => {
    const player = source;
    deferrals.defer();
    await sleep(0); // Required before running consecutive deferrals
    if (!config.enableWhitelist) return deferrals.done();
    deferrals.update(locale.checkingWhitelist.replace(/{{name}}/g, name).replaceGlobals());
    
    let discordID = null;
    for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
        const id = GetPlayerIdentifier(player, i);
        if (id.includes('discord:')) discordID = id.slice(8);
    }
    await sleep(0);
    if (discordID === null) return deferrals.done(locale.discordNotOpen.replaceGlobals());
    const guild = await discord.guilds.get(config.guildid);
    if (!guild) {
        console.error(locale.consoleDiscordGuildErr.replace(/{{guildid}}/g, config.guildid));
        return deferrals.done(locale.fatalError.replaceGlobals());
    }
    const member = await guild.members.get(discordID);
    if (!member) return deferrals.done(locale.notInDiscordServer.replaceGlobals());
    let whitelisted = false;
    config.whitelistRoles.forEach(function(item, index, array) {
        if (member.roles.includes(item)) whitelisted = true;
    });
    if (whitelisted) deferrals.done();
    else deferrals.done(locale.notWhitelisted.replaceGlobals());
});

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

let liveloop = false;
async function statusUpdater() {
    if (liveloop) return;
    liveloop == true;
    while (true) {
        try {
            let msg = config.statusMessages[Math.floor(Math.random() * config.statusMessages.length)].replaceGlobals()
            discord.editStatus("online", {name: msg, type: 3});
        } catch(e) { console.error(e) }
        await sleep(30000);
    }
}

function init() { // Damn hoisting and wanting things clean
    Object.defineProperty(String.prototype, "replaceGlobals", {
        value: function() {
        return this
            .replace(/{{servername}}/g, config.serverName)
            .replace(/{{invite}}/g, config.discordInvite)
            .replace(/{{playercount}}/g, GetNumPlayerIndices())
        }
    });
}
