const Eris = require('eris');
const fs = require('fs');
const locale = require('./locales/' + config.lang);
init();

if (!config.token) {
    console.error(locale.consoleMissingToken);
    StopResource(GetCurrentResourceName());
}
if (config.guildid == "000000000000000000") {
    console.error(locale.consoleMissingGuildid);
    StopResource(GetCurrentResourceName());
}
const discord = new Eris.Client(config.token, {
    intents: [ "guilds", "guildMessages", "guildMembers", "guildBans", "guildPresences" ],
    disabledEvents: { CHANNEL_CREATE: true, CHANNEL_CREATE: true },
    getAllUsers: true
});

discord.commands = new Map();
discord.commandAliases = {};

const commandFiles = fs.readdirSync(`${GetResourcePath(GetCurrentResourceName())}/commands`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	discord.commands.set(command.name, command);
    if (command.alias) discord.commandAliases[command.alias] = command.name;
}

discord.on('ready', () => {
    console.log(locale.consoleLoggedIn.replace(/{{username}}/g, discord.user.username).replaceGlobals());
    if (config.statusMessages) statusUpdater();
});

discord.on("error", (err) => { console.error(err); });

discord.on("messageCreate", async (msg) => {
    if (msg.guildID !== config.guildid || msg.author.bot) return;
    if (!msg.content.startsWith(config.prefix)) return;
    msg.nickname = msg.member.nick || msg.member.username;
    msg.isStaff = false;
    config.staffRoles.forEach(function(item, index, array) {
        if (msg.member.roles.includes(item)) msg.isStaff = true;
    });
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!discord.commands.has(command) && !discord.commandAliases[command]) return;
    const cmd = discord.commands.has(command) ? discord.commands.get(command) : discord.commands.get(discord.commandAliases[command]);
    if (!msg.isStaff && cmd.staffOnly) return;
	try {
		cmd.run(discord, msg, args);
	} catch (error) {
		console.error(error);
		discord.createMessage(msg.channel.id, locale.commandFailed);
	}
});

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
