module.exports = {
    name: 'giveitem',
    description: 'Give a player a specific item',
    args: `[${locale.helpTypeID}] [item] [amount]`,
    staffOnly: true,
    run(discord, msg, args) {

        const badItems = [ "id_card", "harness", "markedbills", "labkey", "printerdocument"];
        let info = {};

        let id = args.shift();
        if (!id) return discord.createMessage(msg.channel.id, locale.noIdProvided);
        id = Number(id);
        if (isNaN(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);
        if (!GetPlayerName(id)) return discord.createMessage(msg.channel.id, locale.invalidIdProvided);

        let item = args.shift();
        if (!item) return discord.createMessage(msg.channel.id, "No item specified");
        let itemData = QBCore.Shared.Items[item.toLowerCase()]
        if (!itemData) return discord.createMessage(msg.channel.id, "Item not found.");
        if (badItems.includes(itemData["name"])) return discord.createMessage(msg.channel.id, "This items has special traits and can only be given in game.");

        let amount = args.shift();
        if (!amount) return discord.createMessage(msg.channel.id, "No amount specified");
        amount = Number(amount);
        if (isNaN(amount) || amount < 1) return discord.createMessage(msg.channel.id, "This amount is invalid");

        if (itemData["type"] == "weapon") {
            amount = 1;
            let ran1 = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
            let ran2 = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
            info.serie = String(`${ran1}${ran2}`);
        }

        let player = QBCore.Functions.GetPlayer(id);

        if (player.Functions.AddItem(itemData["name"], amount, false, info)) {
            console.log(`[${msg.nickname}] Gave ${id} ${count} ${item}`);
            msg.addReaction('✔');
        } else {
            console.log(`[${msg.nickname}] Tried to Give ${id} ${count} ${item}`);
            msg.addReaction('❌');
        }
    },
};