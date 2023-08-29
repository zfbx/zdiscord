// inspired heavily from MIT open sourced https://github.com/devRael1/discordjs-pagination

module.exports = async (options) => {

    const TypesButtons = {
        first: 1,
        previous: 2,
        next: 3,
        last: 4,
        number: 5,
    };
    const StylesButton = {
        Primary: 1,
        Secondary: 2,
        Success: 3,
        Danger: 4,
        Link: 5,
    };
    const defaultEmojis = {
        first: "⬅️",
        previous: "◀️",
        next: "▶️",
        last: "➡️",
        number: "#️⃣",
    };
    const defaultStyles = {
        first: StylesButton.Primary,
        previous: StylesButton.Primary,
        next: StylesButton.Primary,
        last:  StylesButton.Primary,
        number:  StylesButton.Success,
    };

    const { interaction, message, ephemeral, author, embeds, buttons, time, max, customFilter, fastSkip, pageTravel } = options;
    let currentPage = 1;
    const ephemeralMessage = ephemeral !== null ? ephemeral : false;

    if (!interaction && !message) throw new Error("Pagination requires either an interaction or a message object");
    const type = interaction ? "interaction" : "message";

    const getButtonData = (value) => {
        return buttons?.find((btn) => btn.value === value);
    };

    const resolveButtonName = (value) => {
        return (Object.keys(TypesButtons)).find((key) => {
            return TypesButtons[key] === value;
        });
    };

    const generateButtons = (state) => {
        const checkState = (value) => {
            if (([1, 2]).includes(value) && currentPage === 1) return true;
            if (([5]).includes(value) && currentPage === 1 && embeds.length === 1) return true;
            return ([3, 4]).includes(value) && currentPage === embeds.length;
        };

        let names = [2, 3];
        if (fastSkip) names = [1, ...names, 4];
        if (pageTravel) names.push(5);

        return names.reduce(
            (accumulator, value) => {
                const embed = new djs.ButtonBuilder()
                    .setCustomId(value.toString())
                    .setDisabled(state || checkState(value))
                    .setStyle(getButtonData(value)?.style || defaultStyles[resolveButtonName(value)]);
                if (getButtonData(value)?.emoji !== null) embed.setEmoji(getButtonData(value)?.emoji || defaultEmojis[resolveButtonName(value)]);
                if (getButtonData(value)?.label) embed.setLabel(getButtonData(value)?.label);
                accumulator.push(embed);
                return accumulator;
            },
            [],
        );
    };

    const components = (state) => [
        new djs.ActionRowBuilder().addComponents(generateButtons(state)),
    ];

    const changeFooter = () => {
        const embed = embeds[currentPage - 1];
        const newEmbed = new djs.EmbedBuilder(embed.toJSON());
        if (embed?.footer?.text) {
            return newEmbed.setFooter({
                text: `${embed.footer.text} - Page ${currentPage} / ${embeds.length}`,
                iconURL: embed.footer.iconURL,
            });
        }
        return newEmbed.setFooter({
            text: `Page ${currentPage} / ${embeds.length}`,
        });
    };

    let initialMessage;
    const channel = message?.channel || interaction?.channel;

    if (type === "interaction" && channel) {
        if (interaction.type === djs.InteractionType.ApplicationCommand) {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.deferReply({ ephemeral: ephemeralMessage });
            }
            if (embeds.length === 1) {
                return interaction.editReply({
                    embeds: [ embeds[0] ],
                });
            }
            initialMessage = await interaction.editReply({
                embeds: [changeFooter()],
                components: components(),
            });
        }
    } else if (type === "message" && channel) {
        initialMessage = await channel.send({
            embeds: [changeFooter()],
            components: components(),
        });
    }

    const defaultFilter = (i) => {
        return i.user.id === author.id && parseInt(i.customId) <= 4;
    };

    const collectorOptions = (filter) => {
        const opt = {
            filter: filter || customFilter || defaultFilter,
            componentType: djs.ComponentType.Button,
        };
        if (max) opt["max"] = max;
        if (time) opt["time"] = time;
        return opt;
    };

    const collector = initialMessage.createMessageComponentCollector(collectorOptions());
    let collectorModal;

    if (pageTravel) {
        collectorModal = initialMessage.createMessageComponentCollector(collectorOptions((_i) => _i.user.id === author.id && parseInt(_i.customId) === 5));
        collectorModal.on("collect", async (ButtonInteraction) => {
            // Show modal
            const modal = new djs.ModalBuilder()
                .setCustomId("pgn_choose_page_modal")
                .setTitle(Lang.t("choose_page"));

            const inputPageNumber = new djs.TextInputBuilder()
                .setCustomId("pgn_page_number")
                .setLabel(Lant.t("enter_page_number"))
                .setStyle(djs.TextInputStyle.Short);

            const buildModal = new djs.ActionRowBuilder().addComponents(inputPageNumber);
            modal.addComponents(buildModal);
            await ButtonInteraction.showModal(modal);

            await ButtonInteraction.awaitModalSubmit({
                filter: (_i) => _i.user.id === author.id && _i.customId === "pgn_choose_page_modal",
                time: 30000,
            }).then(async (i) => {
                await i.deferUpdate();
                const page_number = i.fields.getTextInputValue("pgn_page_number");
                const int = parseInt(page_number);
                if (isNaN(int)) {return i.followUp({
                    content: Lang.t("enter_valid_page_number", {
                        user: i.member.user,
                        number: page_number,
                    }),
                    ephemeral: true,
                });}
                int > embeds.length ? currentPage = embeds.length : int < embeds.length ? currentPage = 1 : currentPage = int;
                await interaction.editReply({
                    embeds: [changeFooter()],
                    components: components(),
                    ephemeral: ephemeralMessage,
                });
            });
        });
    }

    collector.on("collect", async (i) => {
        const value = parseInt(i.customId);

        switch (value) {
        case 1: currentPage = 1; break;
        case 2: currentPage--; break;
        case 3: currentPage++; break;
        case 4: currentPage = embeds.length; break;
        }

        await i.update({
            embeds: [changeFooter()],
            components: components(),
            ephemeral: ephemeralMessage,
        });
    });

    collector.on("end", () => {
        if (type === "message") {
            initialMessage.edit({
                components: [],
            });
        } else {
            interaction.editReply({
                components: [],
            });
        }
    });
};
