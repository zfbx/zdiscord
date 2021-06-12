fx_version 'cerulean'
games { 'gta5' }

author 'Tony (zfbx)'
description 'Two way Discord bot / Whitelist checker'
version '1.0.0'

server_script 'app.js'

dependencies {
    'yarn'
}

server_only 'yes'

--[[
Notes:
Setting "set liveserver true" in your server.cfg tells the discord bot that it's the live server and to allow everyone and respond to commands
Setting "set liveserver false" in your server.cfg tells the bot it's a dev server and to not respond to commands and only allow venture staff in.

]]