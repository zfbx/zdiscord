fx_version 'cerulean'
games { 'gta5' }

author 'zfbx'
description 'Simple Discord Bot Allowlist'
repository 'https://github.com/zfbx/zdiscord'
version '3.1.0'

files {
    'locales/*',
    'commands/*',
}

server_scripts {
    'config.js',
    'app.js',
}

dependencies {
    'yarn',
    --'qb-core', -- Uncomment for QBCore support if zdiscord loaded before qb-core
    --'esx', -- Uncomment for ESX support
}

server_only 'yes'
