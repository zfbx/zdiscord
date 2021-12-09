/* BG - Bulgarian Translation by Wrecks ¦
Translation strings used by the bot
Strings wrapped in { } will be auto-replaced with updated values
Globals: {servername}, {invite}, (all from config) and {playercount} (current connected players)
*/
const locale = {
    // Includes {name} + Globals
    checkingWhitelist: "Здравейте {name}, Проверяваме Вашият Whitelist статус..",
    discordNotOpen: "Трябва да имате отворен Discord преди да отворите FiveM (Рестартирайте и двете ако имате проблем)",
    fatalError: "Има проблем с получаването на Вашия Whitelist статус, моля опитайте отново или се свържете със съпорта в дискорд канала ако проблема продължава.",
    notInDiscordServer: "Вие не сте в {servername} Discord, Ако желаете можете да влезе от тук: {invite}",
    notWhitelisted: "Нямате определена роля в {servername} discord за да можете да влезете в сървъра, сигурни ли сте че имате Whitelist за този сървър?",
    kickedWithoutReason: "Бяхте кикнати от стафа.",
    announcement: "ОПОВЕСТЯВАНЕ",
    directMessage: "STAFF",
    staffchat: "STAFFCHAT",
};

module.exports = locale;
