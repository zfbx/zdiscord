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

const useNotifyInsteadOfChat = false;
const vehicleStates = {
    0: "On the Streets",
    1: "In Garage",
    2: "In Police Impound",
    3: "3",
};

module.exports = {
    name: "vehicle",
    description: "Give user a vehicle with a fixed plate",
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "give",
            description: "grant a car to a player",
            options: [
                {
                    name: "id",
                    description: "Player's current id",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "model",
                    description: "Vehicle's spawn hash (ex: t20)",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "plate",
                    description: "Plate to give vehicle to player (max 8 characters)",
                    required: false,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "lookup",
            description: "lookup vehicle by plate",
            options: [
                {
                    name: "plate",
                    description: "Plate to look for",
                    required: true,
                    type: "STRING",
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {

        if (args.give) {
            if (!GetPlayerName(args.id)) return interaction.reply({ content: "This ID seems invalid.", ephemeral: true });
            const player = client.QBCore.Functions.GetPlayer(args.id);
            const vehicles = client.QBCore.Shared.Vehicles;
            const vehicle = vehicles[Object.keys(vehicles).find(key => key.toLowerCase() === args.model.toLowerCase())];
            if (!vehicle) return interaction.reply({ content: `Vehicle model \`${args.model}\` does not exist.`, ephemeral: true });

            const plate = args.plate ? args.plate.toUpperCase() : await createPlate();
            if (plate.length > 8) return interaction.reply({ content: "Plate names can only be a max of 8 characters.", ephemeral: true });
            const exists = await getVehicleByPlate(plate);
            if (exists.length > 0) return interaction.reply({ content: "The plate provided is already in use by another vehicle", ephemeral: true });

            const save = await global.exports.oxmysql.insert_async("INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state, garage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
                player.PlayerData.license, player.PlayerData.citizenid, vehicle.model, vehicle.hash, "{}", plate, 1, "pillboxgarage",
            ]);
            if (!save) return interaction.reply({ content: "Something went wrong saving the vehicle", ephemeral: true });

            client.utils.log.info(`[${interaction.member.displayName}] Gave ${GetPlayerName(args.id)} (${args.id}) a ${args.model} with the plate ${plate}`);
            const playerMessage = `${vehicle.name} has been added to your garage at legion (Plate: ${plate})`;

            if (useNotifyInsteadOfChat) emitNet("QBCore:Notify", args.id, playerMessage);
            else client.utils.chatMessage(args.id, "Government", playerMessage, { color: [65, 105, 225] });

            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) was given a ${vehicle.name}. Plate: ${plate}`, ephemeral: false });
        }
        else if (args.lookup) {
            let vehicle = await getVehicleByPlate(args.plate);
            if (vehicle.length < 1) return interaction.reply({ content: "Vehicle with this plate doesn't exist", ephemeral: true });
            vehicle = vehicle[0];
            const embed = new client.Embed();
            embed.setDescription(`**Plate:** ${vehicle.plate}
                **Owner ID:** ${vehicle.citizenid}
                **Vehicle:** ${vehicle.vehicle}
                **Garage:** ${vehicle.garage}
                **State:** ${vehicleStates[vehicle.state] ?? "Recently Purchased?"}
                **Fuel:** ${vehicle.fuel}/100
                **Body:** ${vehicle.body}/1000
                **Status:** ${vehicle.status ?? "Null"}
                **Odometer:** ${vehicle.drivingdistance ?? 0}

                **Finacing Details:**
                **Balance:** $${vehicle.balance}
                **Payment Amount:** $${vehicle.paymentamount}
                **Payments Left:** ${vehicle.paymentsleft}
                **Finance Time:** ${vehicle.financetime}`);
            return interaction.reply({ embeds: [ embed ], ephemeral: false });
        }
    },
};

async function getVehicleByPlate(plate) {
    return await global.exports.oxmysql.query_async("SELECT * FROM player_vehicles WHERE plate = ?", [plate]);
}

async function createPlate() {
    let plate = generatePlate();
    let taken = true;
    while (taken) {
        const exists = await getVehicleByPlate(plate);
        if (exists.length > 0) plate = generatePlate();
        else taken = false;
    }
    return plate;
}

function generatePlate() {
    return `${random(1, false)}${random(2)}${random(3, false)}${random(2)}`;
}

const random = (length = 8, alphabetical = true) => {
    const chars = alphabetical ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "0123456789";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
};
