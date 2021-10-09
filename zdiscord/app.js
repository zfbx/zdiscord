const Eris = require('./libs/eris');
const fs = require('fs');
const locale = require('./locales/' + config.lang);
init();

if (config.token == "CHANGE") {
    console.error("This module requires a discord bot token to run. Check the config.js");
    StopResource(GetCurrentResourceName());
}
if (config.guildid == "000000000000000000") {
    console.error("You need to setup a guildid for me to use in the config.js");
    StopResource(GetCurrentResourceName());
}
config.staffRoles = parseConfigList(config.staffRoles);
config.whitelistRoles = parseConfigList(config.whitelistRoles);
config.enableWhitelist = parseConfigBool(config.enableWhitelist);
config.enableCommands = parseConfigBool(config.enableCommands);
config.enableStatus = parseConfigBool(config.enableStatus);

let QBCore;
QBCore = global.exports['qb-core'].GetCoreObject()
if (QBCore) console.log("QBCore found! Supported QB commands will be loaded.");

const discord = new Eris.Client(config.token, {
    intents: ["guilds", "guildMessages", "guildMembers", "guildBans", "guildPresences"],
    disabledEvents: { CHANNEL_CREATE: true, CHANNEL_CREATE: true },
    getAllUsers: true
});

discord.commands = new Map();
discord.commandAliases = {};

const commandFiles = fs.readdirSync(`${GetResourcePath(GetCurrentResourceName())}/commands`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (file.startsWith("qb-") && !QBCore) continue;
    discord.commands.set(command.name, command);
    if (command.alias) discord.commandAliases[command.alias] = command.name;
}

discord.on('ready', () => {
    console.log(`Logged in on Discord as ${discord.user.username}!`);
    if (config.enableStatus && config.statusMessages) statusUpdater();
});

discord.on("error", (err) => { console.error(err); });

discord.on("messageCreate", async (msg) => {
    if (msg.guildID !== config.guildid || msg.author.bot) return;
    if (!config.enableCommands) return;
    if (!msg.content.startsWith(config.prefix)) return;
    msg.nickname = msg.member.nick || msg.member.username;
    msg.staffRole = "none";
    if (msg.member.roles.includes(config.modRole)) msg.staffRole = "mod";
    if (msg.member.roles.includes(config.adminRole)) msg.staffRole = "admin";
    if (msg.member.roles.includes(config.godRole)) msg.staffRole = "god";
 
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!discord.commands.has(command) && !discord.commandAliases[command]) return;
    const cmd = discord.commands.has(command) ? discord.commands.get(command) : discord.commands.get(discord.commandAliases[command]);
    if (cmd.role && !hasPermission(cmd.role, msg.staffRole)) return;
    try {
        cmd.run(discord, msg, args);
    } catch (error) {
        console.error(error);
        discord.createMessage(msg.channel.id, "Something went wrong trying to run this command.");
    }
});

discord.connect();

on("playerConnecting", async (name, setKickReason, deferrals) => {
    if (!config.enableWhitelist) return;
    const player = source;
    deferrals.defer();
    await sleep(0);
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
        console.error(`Something went wrong fetching the Discord server for whitelist checking using guild id: ${config.guildid}`);
        return deferrals.done(locale.fatalError.replaceGlobals());
    }
    const member = await guild.members.get(discordID);
    if (!member) return deferrals.done(locale.notInDiscordServer.replaceGlobals());
    let whitelisted = false;
    config.whitelistRoles.forEach(function (item, index, array) {
        if (member.roles.includes(item)) whitelisted = true;
    });
    if (whitelisted) deferrals.done();
    else deferrals.done(locale.notWhitelisted.replaceGlobals());
});


exports('isRolePresent', (discordID, role) => {
    if (discordID.includes('discord:')) discordID = id.slice(8);
    const guild = await discord.guilds.get(config.guildid);
    if (!guild) {
        console.error(`Something went wrong fetching the Discord server for whitelist checking using guild id: ${config.guildid}`);
        return { found: false, roles: []};
    }
    const member = await guild.members.get(discordID);
    if (!member) return { found: false, roles: []};
    if (typeof role === "object") {
        let found = false;
        role.forEach(function (item, index, array) {
            if (member.roles.includes(item)) found = true;
        });
        return { found: (found ? true : false), roles: member.roles };
    } else {
        return { found: (member.roles.includes(role) ? true : false), roles: member.roles };
    }
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
            discord.editStatus("online", { name: msg, type: 3 });
        } catch (e) { console.error(e) }
        await sleep(30000);
    }
}

function init() { // Damn hoisting and wanting things clean
    Object.defineProperty(String.prototype, "replaceGlobals", {
        value: function () {
            return this
                .replace(/{{servername}}/g, config.serverName)
                .replace(/{{invite}}/g, config.discordInvite)
                .replace(/{{playercount}}/g, GetNumPlayerIndices())
                .replace(/{{prefix}}/g, config.prefix)
        }
    });
}

function parseConfigList(list) {
    if (!list) return {};
    let parse = list.replace(/[^0-9,]/g, '').replace(/(,$)/g, '');
    return parse.split(",");
}

function parseConfigBool(bool) {
    if (typeof bool == "boolean") return bool;
    if (typeof bool == "string") {
        const trues = ["true", "t", "tru", "on", "yes", "y", "1"];
        let val = bool.toLocaleLowerCase().trim();
        return trues.includes(val) ? true : false;
    }
    if (typeof bool == "number") return bool > 0;
    return false;
}

function hasPermission(required, has) {
    const ranks = {
        "none": 0,
        "mod": 1,
        "admin": 2,
        "god": 3,
    }
    if (ranks[has] >= ranks[required]) return true;
    return false;
}
