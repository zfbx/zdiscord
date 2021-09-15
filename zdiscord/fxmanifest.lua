-- The github has help and FAQ, please read them for help first, submit issue if they don't answer questions. -Tony / zfbx
fx_version 'cerulean'
games { 'gta5' }

author 'zfbx'
description 'Simple Discord Bot Allowlist'
repository 'https://github.com/zfbx/zdiscord'
version '4.0.0'
license 'MIT'

files {
    'libs/**',
    'locales/*',
    'commands/*',
}

server_scripts {
    'config.js',
    'app.js',
}

--dependency 'qb-core' -- Uncomment for QBCore support if zdiscord is loaded before qb-core

server_only 'yes'
