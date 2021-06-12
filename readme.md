# CURRENTLY WIP - Please disregard till this message is removed! :)

# zDiscord - A Discord Allowlist + so much more!

I've not seen many decent whitelist systems out there that connect with discord and the good ones seem to use oauth but I wanted more.. specifically I wanted to be able to have a full blown bot built in and be able to have bi-directional communication between the server and discord

## Features
- Completely standalone, no dependencies

## Support

Before we get into the setup I just want to say, I've built and polished this resource from the ground up for free and open sourced it for you. If you enjoy it and would like to send a thanks I have a [ko-fi](https://ko-fi.com/zfbx8), [Paypal](https://paypal.me/zfbx) and I even have a [Patreon](https://www.patreon.com/zfbx)! Any and all support is greatly appreciated but in no way manditory, all my resources will be free and open source :)


## How to use

All the config options for this module are to be set inside your server .cfg file

```cfg
set discord {
    "token": "NTg2MjUxNTY4MzMyOTMxMDcz.XPlTUQ.QPIGShCDGivogX50Qh7V3d2-9l4"
}
```
1. Copy the `zdiscord` directory into your fiveM resources (rename it if you'd like)
2. Add `ensure zdiscord` (or whatever you renamed it to) to your server's .cfg
4. Adjust the `config.lua` variables to how you'd like them.


## License

I'm releasing this under the **MIT License** asking only that you preserve my credit (zfbx) in whatever you do with it :)

## Note

This concept is new as far as I'm aware and might have some weirdness, I'm totally not sure as I haven't been able to test it with other people, if you notice anything feel free to submit an [issue](https://github.com/zfbx/zSeatbelt/issues).

Also I might add an optional visual indicator in the future that would be configurable


## Special Thanks

This resource wouldn't be a thing if it wasn't for [eris](https://abal.moe/Eris/). Other *popular* frameworks out there decided to update everything to the newest of the new and don't care about backwards compatibility and because fivem runs a custom version of nodejs build to fill it's specific needs it's slightly outdated compared to the main stream. So again thank you Eris for being a flexible, speedy and lightweight framework to build discord bots on ♥