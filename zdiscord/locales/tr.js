/* tr - Turkish Translation by alp1x ♥
 Translation strings used by the bot
 Strings wrapped in {{ }} will be auto-replaced with updated values
 Globals: {{servername}}, {{invite}}, {{prefix}} (all from config) and {{playercount}} (current connected players)
*/
const locale = {
    checkingWhitelist: "Merhaba {{name}}, Whitelist kontrol ediliyor..", // Globals + {{name}}
    discordNotOpen: "FiveM'i başlatmadan önce Discord açık olmalıdır. Sorun devam ederse ikisinide yeniden başlatın", // Globals
    fatalError: "Whitelist durumunuz alınırken bir şeyler ters gitti, lütfen biraz sonra tekrar deneyin veya sorun devam ederse destek ile iletişime geçin.", // Globals
    notInDiscordServer: "{{servername}} Discord adresinizde bulunmuyorsunuz, katılmak için: {{invite}}", // Globals
    notWhitelisted: "{{servername}} için whitelist rolünüz bulunmamakta.", // Globals
    kickedWithoutReason: "Yetkili tarafından sunucudan atıldın.", // Globals
    announcement: "Duyuru",
    directMessage: "Yetkili",
}

module.exports = locale;
