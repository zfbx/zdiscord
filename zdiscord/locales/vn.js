/* vn - Vietnamese Translation by xenfovn ♥
 Translation strings used by the bot
 Strings wrapped in {{ }} will be auto-replaced with updated values
 Globals: {{servername}}, {{invite}}, {{prefix}} (all from config) and {{playercount}} (current connected players)
*/
const locale = {
    checkingWhitelist: "Xin Chào {{name}}, Chúng Tôi Đang Kiểm Tra Whitelist Của Bạn..", // Globals + {{name}}
    discordNotOpen: "Bạn Cần Mở Discord Trước Khi Mở FiveM ( Khởi Động Lại Cả 2 Nếu Vẫn Bị )", // Globals
    fatalError: "Đã Xảy Ra Lỗi Khi Kiểm Tra Whitelist , Vui Lòng Liên Hệ Đội Ngũ Hỗ Trợ !.", // Globals
    notInDiscordServer: "Bạn Chưa Tham Gia Discord {{servername}} , Tham Gia ở Đây: {{invite}}", // Globals
    notWhitelisted: "Bạn Chưa Được Cấp Phép Trong Discord {{servername}} , Hãy Kiểm Tra Lại !", // Globals
    kickedWithoutReason: "Bạn Đã Bị Đuổi Bởi Quản Trị Viên.", // Globals
    announcement: "Thông Báo",
    directMessage: "Quản Trị Viên",
}

module.exports = locale;
