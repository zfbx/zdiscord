/* ar - ARABIC Translation by RADHWANEDZ
 Translation strings used by the bot
 Strings wrapped in {{ }} will be auto-replaced with updated values
 Globals: {{servername}}, {{invite}}, {{prefix}} (all from config) and {{playercount}} (current connected players)
*/
const locale = {
    checkingWhitelist: "يتم الان التحقق من حسابك اذا كان مفعل ام لا ،{{name}} مرحبا", // Globals + {{name}}
    discordNotOpen: "يجب ان تقوم بفتح تطبيق الديسكورد قبل فتح برنامج فايف ام ", // Globals
    fatalError: "نعتقد ان هناك خطأ ما في التحقق من تفعيل حسابك يرجى مراسلتنا عبر الديسكورد لحل المشكلة", // Globals
    notInDiscordServer: " {{invite}} يرجى الانضمام الي الديسكورد وتفعيل عضويتك، اليك الرابط {{servername}} انت لست عضوا في سيرفر الديسكورد الخاص بنا ", // Globals
    notWhitelisted: "ليتم تفعيل حسابك لتستطيع الدخول للمدينة {{servername}} يجب اجتياز المقابلة في الديسكورد اولا ", // Globals
    kickedWithoutReason: "لقد تم طردك من قبل المراقب.", // Globals
    announcement: "اعلان",
    directMessage: "الادارة",
}

module.exports = locale;
