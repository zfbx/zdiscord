/* pl - Polish Translation by insaneArian ♥
 Translation strings used by the bot
 Strings wrapped in { } will be auto-replaced with updated values
 Globals: {servername}, {invite}, (all from config) and {playercount} (current connected players)
*/
const locale = {
    checkingWhitelist: "Siema {name}, Sprawdzamy czy jesteś na whiteliście..",
    discordNotOpen: "Musisz mieć włączonego Discorda przed FiveM'em (zrestartuj oba jeśli problem dalej występuje)",
    fatalError: "Coś poszło nie tak przy sprawdzaniu twojej whitelisty, spróbuj jeszcze raz za chwilę, a jeżeli to nie pomoże skontaktuj się z administracją.",
    notInDiscordServer: "Nie jesteś na discordzie {servername}, dołącz tutaj: {invite}",
    notWhitelisted: "Nie masz odpowiedniej roli na discordzie {servername} aby dołączyć na serwer, jesteś pewny, że masz whiteliste?",
    kickedWithoutReason: "Zostałeś wyrzucony przez administrację.",
    announcement: "OGŁOSZENIE",
    directMessage: "ADMINISTRACJA",
    staffchat: "STAFFCHAT",
};

module.exports = locale;
