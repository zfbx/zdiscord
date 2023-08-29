/**
 * This file is part of zdiscord.
 * Copyright (C) 2021 Tony/zfbx
 * source: <https://github.com/zfbx/zdiscord>
 *
 * This work is licensed under the Creative Commons
 * Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 */

const languageLocales = require(`${zroot}/locales/${zconfig.Language}`);
const fallbackLocales = require(`${zroot}/locales/en`);

module.exports = {

    t: (key, values = {}, translations) => {
        let translation = translations?.[zconfig.Language][key] || languageLocales[key];
        if (typeof translation !== "string") {
            if (zconfig.LanguageWarnings) {
                zlog.warn(`[LANG] missing translation for key "${key}" for ${zconfig.Language}`);
            }
            translation = translations?.["en"][key] || fallbackLocales[key];
            if (translations) {
                if (!translations[zconfig.Language]) translations[zconfig.Language] = {};
                translations[zconfig.Language][key] = translation;
            } else {
                languageLocales[key] = translation;
            }
            if (typeof translation !== "string") {
                zlog.error(`[LANG] missing locale for key "${key}"`);
                return "UNDEFINED";
            }
        }
        for (const val in values) {
            translation = translation.replaceAll(`{${val}}`, values[val]);
        }
        return zutils.replaceGlobals(translation);
    },

};
