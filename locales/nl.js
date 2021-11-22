/*
 Translation strings used by the bot
 Strings wrapped in { } will be auto-replaced with updated values
 Globals: {servername}, {invite}, (all from config) and {playercount} (current connected players)
*/
const locale = {
    checkingWhitelist: "Hoi {name}, wij kijken na of je wel gewhitelist bent",
    discordNotOpen: "Je moet Discord open hebben staan voordat je FiveM opstart (Restart beiden als het probleem zich voordoet)",
    fatalError: "Iets ging verkeerd terwijl wij jouw whitelist status nakeken, gelieven even opnieuw te verbinden of contact met ons op te zoeken in discord",
    notInDiscordServer: "Je zit niet in de {servername} Discord, gelieve deze te joinen hier: {invite}",
    notWhitelisted: "Je hebt de benodigde {servername} Discord role niet om te joinen, ben je wel whitelisted?",
    kickedWithoutReason: "Je werd gekickt door staff.",
    announcement: "AANKONDIGING",
    directMessage: "STAFF",
    staffchat: "STAFFCHAT",
};

module.exports = locale;
