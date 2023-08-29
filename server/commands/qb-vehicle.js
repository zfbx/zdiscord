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

module.exports = class cmd extends Command {
    constructor(file) {
        super("vehicle", file, {
            description: "Give user a vehicle with a fixed plate",
            role: "god",

            options: [
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "give",
                    description: "grant a car to a player",
                    options: [
                        {
                            name: "id",
                            description: "Player's current id",
                            required: true,
                            type: djs.ApplicationCommandOptionType.Integer,
                        },
                        {
                            name: "model",
                            description: "Vehicle's spawn hash (ex: t20)",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                        {
                            name: "plate",
                            description: "Plate to give vehicle to player (max 8 characters)",
                            required: false,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                    ],
                },
                {
                    type: djs.ApplicationCommandOptionType.Subcommand,
                    name: "lookup",
                    description: "lookup vehicle by plate",
                    options: [
                        {
                            name: "plate",
                            description: "Plate to look for",
                            required: true,
                            type: djs.ApplicationCommandOptionType.String,
                        },
                    ],
                },
                // TODO: repair
            ],
        });
    }

    async run(interaction, args) {

        if (args.give) {
            if (!GetPlayerName(args.id)) return interaction.sreply("This ID seems invalid.");
            const player = QBCore.Functions.GetPlayer(args.id);
            const vehicles = QBCore.Shared.Vehicles;
            const vehicle = vehicles[Object.keys(vehicles).find(key => key.toLowerCase() === args.model.toLowerCase())];
            if (!vehicle) return interaction.sreply(`Vehicle model \`${args.model}\` does not exist.`);

            const plate = args.plate ? args.plate.toUpperCase() : await this.createPlate();
            if (plate.length > 8) return interaction.sreply("Plate names can only be a max of 8 characters.");
            const exists = await this.getVehicleByPlate(plate);
            if (exists.length > 0) return interaction.sreply("The plate provided is already in use by another vehicle");

            const save = await global.exports.oxmysql.insert_async("INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state, garage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
                player.PlayerData.license, player.PlayerData.citizenid, vehicle.model, vehicle.hash, "{}", plate, 1, "pillboxgarage",
            ]);
            if (!save) return interaction.sreply("Something went wrong saving the vehicle");

            zlog.info(`[${interaction.member.displayName}] Gave ${GetPlayerName(args.id)} (${args.id}) a ${args.model} with the plate ${plate}`);
            const playerMessage = `${vehicle.name} has been added to your garage at legion (Plate: ${plate})`;

            if (zconfig.useNotifyInsteadOfChat) {
                setImmediate(() => {
                    emitNet("QBCore:Notify", args.id, playerMessage);
                });
            } else {
                zutils.chatMessage(args.id, "Government", playerMessage, { color: [65, 105, 225] });
            }

            return interaction.reply(`${GetPlayerName(args.id)} (${args.id}) was given a ${vehicle.name}. Plate: ${plate}`);
        }
        else if (args.lookup) {
            let vehicle = await this.getVehicleByPlate(args.plate);
            if (vehicle.length < 1) return interaction.sreply("Vehicle with this plate doesn't exist");
            vehicle = vehicle[0];
            const embed = new djs.EmbedBuilder().setColor(zconfig.ThemeColor);
            embed.setDescription(`**Plate:** ${vehicle.plate}
                **Owner ID:** ${vehicle.citizenid}
                **Vehicle:** ${vehicle.vehicle}
                **Garage:** ${vehicle.garage}
                **State:** ${zconfig.vehicleStates[vehicle.state] ?? "Recently Purchased?"}
                **Fuel:** ${vehicle.fuel}/100
                **Body:** ${vehicle.body}/1000
                **Status:** ${vehicle.status ?? "Null"}
                **Odometer:** ${vehicle.drivingdistance ?? 0}

                **Finacing Details:**
                **Balance:** $${vehicle.balance}
                **Payment Amount:** $${vehicle.paymentamount}
                **Payments Left:** ${vehicle.paymentsleft}
                **Finance Time:** ${vehicle.financetime}`);
            return interaction.reply({ embeds: [ embed ] });
        }
    }

    async getVehicleByPlate(plate) {
        // TODO: add support for other garages?
        return await global.exports.oxmysql.query_async("SELECT * FROM player_vehicles WHERE plate = ?", [plate]);
    }

    async createPlate() {
        let plate = this.generatePlate();
        let taken = true;
        while (taken) {
            const exists = await this.getVehicleByPlate(plate);
            if (exists.length > 0) plate = this.generatePlate();
            else taken = false;
        }
        return plate;
    }

    generatePlate() {
        return `${this.random(1, false)}${this.random(2)}${this.random(3, false)}${this.random(2)}`;
    }

    random(length = 8, alphabetical = true) {
        const chars = alphabetical ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "0123456789";
        let str = "";
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    }

};
