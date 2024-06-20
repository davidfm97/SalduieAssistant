const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "add",
    description: "Añade una entrada al banco de semillas con opción de imagen",
    options: [
        {
            name: "user",
            description: "El usuario a añadir al banco de semillas",
            type: "USER",
            required: true,
        },
        {
            name: "type",
            description: "Tipo de entrada (semilla o esqueje)",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Semilla",
                    value: "Semilla"
                },
                {
                    name: "Esqueje",
                    value: "Esqueje"
                }
            ]
        },
        {
            name: "location",
            description: "El lugar de recolección",
            type: "STRING",
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
            required: false,
        },
        {
            name: "scientific_name",
            description: "El nombre científico de la planta",
            type: "STRING",
            required: false,
        },
        {
            name: "harvest_year",
            description: "El año de recolección",
            type: "INTEGER",
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
            const member = interaction.member;

            // Verificar si el usuario tiene el rol de "Cultivadores" o es administrador
            const isAdmin = member.permissions.has("ADMINISTRATOR");
            const isCultivador = member.roles.cache.has("1246468778112323587");

            if (!isAdmin && !isCultivador) {
                return interaction.reply("No tienes permiso para usar este comando. Necesitas ser Administrador o tener el rol de Cultivador.");
            }

            const user = interaction.options.getUser("user");
            const type = interaction.options.getString("type");
            const seed = interaction.options.getString("seed");
            const variety = interaction.options.getString("variety");
            const scientificName = interaction.options.getString("scientific_name");
            const harvestYear = interaction.options.getInteger("harvest_year");
            const location = interaction.options.getString("location") || "";
            const observations = interaction.options.getString("observations") || "";
            const imageUrl = interaction.options.getString("image_url") || "";

            const username = user.username;

            // Validar que el tipo sea válido (SEED o CUTTING)
            if (type !== "Semilla" && type !== "Esqueje") {
                return interaction.reply("El tipo debe ser 'Semilla' o 'Esqueje'.");
            }
            const harvestYearString = harvestYear ? harvestYear.toString() : "";
            let valuesToAppend = [username, type, seed, variety, scientificName, harvestYearString, location, observations, imageUrl];

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

        } catch (error) {
            console.error("Error al añadir entrada:", error);
            return interaction.reply("Hubo un error al añadir la entrada. Por favor, intenta de nuevo más tarde.");
        }
    }
};
