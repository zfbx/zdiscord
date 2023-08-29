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

translations["weather"] = {
    "en": {
        cmdName: "weather",
        cmdDesc: "Manage in city weather",

        opt_weather: "weather",
        opt_weather_desc: "available weather presets",
        opt_weather_set: "set",
        opt_weather_set_desc: "set the weather to a preset",
        weather_set_success: "Weather was updated to {weather}.",
        weather_set_log: "{discordName} ({discordId}) set weather to {weather}",
        weather_select: "Select weather",
        weather_select_message: "Select the weather from the options below",

        // Weathers
        blizzard: "Snow Blizzard",
        christmas: "Christmas Theme",
        clear: "Clear Sky",
        clearing: "Clearing",
        cloudy: "Cloudy",
        drizzle: "Drizzle",
        foggy: "Foggy",
        groundblizzard: "Ground Blizzard",
        hail: "Hail",
        halloween: "Halloween Theme",
        highpressure: "High Pressure",
        hurricane: "Hurricane",
        misty: "Misty",
        neutral: "Neutral",
        overcast: "Overcast",
        overcastdark: "Overcast Dark",
        rain: "Rain",
        sandstorm: "Sandstorm",
        shower: "Shower",
        sleet: "Sleet",
        smog: "Smog",
        snow_light: "Light Snow",
        snow: "Snow",
        sunny: "Sunny",
        thunder: "Thunder",
        thunderstorm: "Thunderstorm",
        whiteout: "Whiteout",
    },
    "es": {
        //
    },
};

module.exports = class cmd extends Command {
    constructor(file) {
        super(Lang.t("cmdName", {}, translations["weather"]), file, {
            description: Lang.t("cmdDesc", {}, translations["weather"]),
            role: "admin",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: Lang.t("opt_weather_set", {}, translations["weather"]),
                    description: Lang.t("opt_weather_set_desc", {}, translations["weather"]),
                },
            ],

            scriptHook: "",
        });

        this.weatherOptions = this.getWeatherOptions();
    }

    shouldLoad() {
        if (GetResourceState("qb-weathersync") === "started") {
            this.scriptHook = "qb-weathersync";
            return true;
        }
        // TODO: Make zweather? and add other resources
        return false;
    }

    async run(interaction, args) {

        if (this.scriptHook === "qb-weathersync") {

            if (args[Lang.t("opt_weather_set", {}, translations["weather"])]) {
                const row = new djs.ActionRowBuilder()
                    .addComponents(
                        new djs.StringSelectMenuBuilder()
                            .setCustomId("weather_set")
                            .setPlaceholder(Lang.t("weather_select", {}, translations["weather"]))
                            .addOptions(this.weatherOptions),
                    );
                return interaction.sreply({
                    content: Lang.t("weather_select_message", {}, translations["weather"]),
                    components: [row],
                });
            }
            // TODO: Add weather freeze/resume?
        }

    }

    async menu(interaction, id) {
        const weather = interaction.values[0];
        // doesn't give any feedback on it's success or failure -.-
        emit("qb-weathersync:server:setWeather", weather);
        zlog.info(
            Lang.t("weather_set_log", {
                discordName: interaction.member.displayName,
                discordId: interaction.member.id,
                weather: weather,
            }, translations["weather"]));
        return interaction.sreply(Lang.t("weather_set_success", { weather: weather }, translations["weather"]));
    }

    getWeatherOptions() {
        const weathers = zutils.isGTA() ? [
            { name: Lang.t("clear", {}, translations["weather"]), value: "CLEAR", icon: "☀️" },
            { name: Lang.t("clearing", {}, translations["weather"]), value: "CLEARING", icon: "🌦️" },
            { name: Lang.t("cloudy", {}, translations["weather"]), value: "CLOUDS", icon: "⛅" },
            { name: Lang.t("foggy", {}, translations["weather"]), value: "FOGGY", icon: "🌫️" },
            { name: Lang.t("neutral", {}, translations["weather"]), value: "NEUTRAL", icon: "🌧️" },
            { name: Lang.t("overcast", {}, translations["weather"]), value: "OVERCAST", icon: "☁️" },
            { name: Lang.t("rain", {}, translations["weather"]), value: "RAIN", icon: "🌧️" },
            { name: Lang.t("smog", {}, translations["weather"]), value: "SMOG", icon: "🌫️" },
            { name: Lang.t("snow_light", {}, translations["weather"]), value: "SNOWLIGHT", icon: "🌨️" },
            { name: Lang.t("snow", {}, translations["weather"]), value: "SNOW", icon: "🌨️" },
            { name: Lang.t("blizzard", {}, translations["weather"]), value: "BLIZZARD", icon: "❄️" },
            { name: Lang.t("sunny", {}, translations["weather"]), value: "EXTRASUNNY", icon: "☀️" },
            { name: Lang.t("thunder", {}, translations["weather"]), value: "THUNDER", icon: "🌩️" },
            { name: Lang.t("halloween", {}, translations["weather"]), value: "HALLOWEEN", icon: "🎃" },
            { name: Lang.t("christmas", {}, translations["weather"]), value: "XMAS", icon: "🎄" },
        ] : [ // rdr3 I assume?
            { name: Lang.t("cloudy", {}, translations["weather"]), value: "CLOUDS", icon: "⛅" },
            { name: Lang.t("drizzle", {}, translations["weather"]), value: "DRIZZLE", icon: "☀️" },
            { name: Lang.t("foggy", {}, translations["weather"]), value: "FOGGY", icon: "🌫️" },
            { name: Lang.t("groundblizzard", {}, translations["weather"]), value: "GROUNDBLIZZARD", icon: "❄️" },
            { name: Lang.t("hail", {}, translations["weather"]), value: "HAIL", icon: "🧊" },
            { name: Lang.t("highpressure", {}, translations["weather"]), value: "HIGHPRESSURE", icon: "☀️" },
            { name: Lang.t("hurricane", {}, translations["weather"]), value: "HURRICANE", icon: "🌀" },
            { name: Lang.t("misty", {}, translations["weather"]), value: "MISTY", icon: "🌫️" },
            { name: Lang.t("overcast", {}, translations["weather"]), value: "OVERCAST", icon: "☁️" },
            { name: Lang.t("overcastdark", {}, translations["weather"]), value: "OVERCASTDARK", icon: "☁️" },
            { name: Lang.t("rain", {}, translations["weather"]), value: "RAIN", icon: "🌧️" },
            { name: Lang.t("sandstorm", {}, translations["weather"]), value: "SANDSTORM", icon: "🌪️" },
            { name: Lang.t("shower", {}, translations["weather"]), value: "SHOWER", icon: "🌧️" },
            { name: Lang.t("sleet", {}, translations["weather"]), value: "SLEET", icon: "🌨️" },
            { name: Lang.t("snow_light", {}, translations["weather"]), value: "SNOWLIGHT", icon: "🌨️" },
            { name: Lang.t("snow", {}, translations["weather"]), value: "SNOW", icon: "🌨️" },
            { name: Lang.t("blizzard", {}, translations["weather"]), value: "BLIZZARD", icon: "❄️" },
            { name: Lang.t("sunny", {}, translations["weather"]), value: "SUNNY", icon: "☀️" },
            { name: Lang.t("thunder", {}, translations["weather"]), value: "THUNDER", icon: "🌩️" },
            { name: Lang.t("thunderstorm", {}, translations["weather"]), value: "THUNDERSTORM", icon: "⛈️" },
            { name: Lang.t("whiteout", {}, translations["weather"]), value: "WHITEOUT", icon: "❄️" },
        ];
        const choices = [];
        for (const weather of weathers) {
            choices.push({
                label: weather.name,
                value: weather.value,
                emoji: { "name": weather.icon },
            });
        }
        return choices;
    }

};
