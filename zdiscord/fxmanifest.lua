fx_version 'cerulean'
games { 'gta5' }

author 'zfbx'
description 'Simple Discord Bot Allowlist'
version '3.0.0'

files {
    'locales/*',
    'commands/*',
}

server_scripts {
    'config.js',
    'app.js',
}

dependencies {
    'yarn'
}


server_only 'yes'
