/* pl - Polish Translation by insaneArian ♥
 Translation strings used by the bot
 Strings wrapped in {{ }} will be auto-replaced with updated values
 Globals: {{servername}}, {{invite}}, {{prefix}} (all from config) and {{playercount}} (current connected players)
*/
const locale = {
    checkingWhitelist: "Siema {{name}}, Sprawdzamy czy jesteś na whiteliście..", // Globals + {{name}}
    discordNotOpen: "Musisz mieć włączonego Discorda przed FiveM'em (zrestartuj oba jeśli problem dalej występuje)", // Globals
    fatalError: "Coś poszło nie tak przy sprawdzaniu twojej whitelisty, spróbuj jeszcze raz za chwilę, a jeżeli to nie pomoże skontaktuj się z administracją.", // Globals
    notInDiscordServer: "Nie jesteś na discordzie {{servername}}, dołącz tutaj: {{invite}}", // Globals
    notWhitelisted: "Nie masz odpowiedniej roli na discordzie {{servername}} aby dołączyć na serwer, jesteś pewny, że masz whiteliste?", // Globals
    kickedWithoutReason: "Zostałeś wyrzucony przez administrację.", // Globals
    announcement: "OGŁOSZENIE",
    directMessage: "ADMINISTRACJA",
}

module.exports = locale;
