const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "add",
    description: "Añade una entrada al banco de semillas con opción de imagen",
    userPerms: ["ADMINISTRATOR"],
    options: [
        {
            name: "user",
            description: "El usuario a añadir al banco de semillas",
            type: "USER",
            required: true,
        },
        {
            name: "seed",
            description: "La semilla a añadir",
            type: "STRING",
            required: true,
        },
        {
            name: "variety",
            description: "La variedad de la semilla",
            type: "STRING",
            required: true,
        },
        {
            name: "scientific_name",
            description: "El nombre científico de la planta",
            type: "STRING",
            required: true,
        },
        {
            name: "harvest_year",
            description: "El año de recolección",
            type: "INTEGER",
            required: true,
        },
        {
            name: "location",
            description: "El lugar de recolección",
            type: "STRING",
            required: false,
        },
        {
            name: "observations",
            description: "Observaciones adicionales",
            type: "STRING",
            required: false,
        },
        {
            name: "image_url",
            description: "URL de la imagen de la planta",
            type: "STRING",
            required: false,
        },
    ],
    run: async (client, interaction, args) => {
        try {
            const user = interaction.options.getUser("user");
            const seed = interaction.options.getString("seed");
            const variety = interaction.options.getString("variety");
            const scientificName = interaction.options.getString("scientific_name");
            const harvestYear = interaction.options.getInteger("harvest_year");
            const location = interaction.options.getString("location") || "";
            const observations = interaction.options.getString("observations") || "";
            const imageUrl = interaction.options.getString("image_url") || "";

            const username = user.username;

            const rows = await client.googleSheets.values.get({
                auth: client.auth,
                spreadsheetId: client.sheetId,
                range: "Sheet1!A:A"
            });

            const data = rows.data.values.find(row => row[0] === username);

            if (data) {
                return interaction.reply("¡El usuario ya ha sido añadido a la lista!");
            } else {
                let valuesToAppend = [username, seed, variety, scientificName, harvestYear.toString(), location, observations, imageUrl];

                await client.googleSheets.values.append({
                    auth: client.auth,
                    spreadsheetId: client.sheetId,
                    range: "Sheet1!A:H", // Ajustar el rango para incluir los nuevos campos
                    valueInputOption: "USER_ENTERED",
                    resource: {
                        values: [valuesToAppend]
                    }
                });

                return interaction.reply("¡La entrada ha sido añadida al banco de semillas correctamente!");
            }
        } catch (error) {
            console.error("Error al añadir entrada:", error);
            return interaction.reply("Hubo un error al añadir la entrada. Por favor, intenta de nuevo más tarde.");
        }
    }
};
