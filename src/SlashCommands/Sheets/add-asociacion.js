const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "add-asociacion",
    description: "Registra un cultivo con su asociación beneficiosa o perjudicial y observaciones opcionales",
    options: [
        {
            name: "cultivo",
            description: "El cultivo que deseas registrar",
            type: "STRING",
            required: true,
        },
        {
            name: "tipo_asociacion",
            description: "Selecciona el tipo de asociación",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Beneficiosa",
                    value: "Beneficiosa"
                },
                {
                    name: "Perjudicial",
                    value: "Perjudicial"
                }
            ]
        },
        {
            name: "asociacion",
            description: "Especifica la asociación (una palabra)",
            type: "STRING",
            required: true,
        }
    ],
    run: async (client, interaction, args) => {
        try {
            const member = interaction.member;

            // Verificar si el usuario tiene el rol de "Cultivadores" o es administrador
            const isAdmin = member.permissions.has("ADMINISTRATOR");
            const isCultivador = member.roles.cache.has("1246468778112323587");

            if (!isAdmin && !isCultivador) {
                return interaction.reply({ content: "No tienes permiso para usar este comando. Necesitas ser Administrador o tener el rol de Cultivador.", ephemeral: true });
            }

            const cultivo = interaction.options.getString("cultivo");
            const tipoAsociacion = interaction.options.getString("tipo_asociacion");
            const asociacion = interaction.options.getString("asociacion").toLowerCase();

            // Obtener datos actuales de la hoja de cálculo
            const res = await client.googleSheets.values.get({
                auth: client.auth,
                spreadsheetId: client.sheetId,
                range: "Sheet3!A:C"
            });

            const rows = res.data.values || [];
            let cultivoFound = false;

            // Actualizar la fila correspondiente si el cultivo ya existe
            for (let i = 0; i < rows.length; i++) {
                if (rows[i][0].toLowerCase() === cultivo.toLowerCase()) {
                    cultivoFound = true;
                    let associationColumnIndex = tipoAsociacion === "Beneficiosa" ? 1 : 2;
                    let currentAssociations = rows[i][associationColumnIndex] ? rows[i][associationColumnIndex].toLowerCase().split(', ') : [];

                    // Comprobar si la asociación ya existe
                    if (!currentAssociations.includes(asociacion)) {
                        currentAssociations.push(asociacion);
                        rows[i][associationColumnIndex] = currentAssociations.join(', ');
                    }
                    break;
                }
            }

            // Añadir una nueva fila si el cultivo no existe
            if (!cultivoFound) {
                const newRow = [cultivo, "", "", observaciones];
                if (tipoAsociacion === "Beneficiosa") {
                    newRow[1] = asociacion; // Añadir a asociación beneficiosa
                } else if (tipoAsociacion === "Perjudicial") {
                    newRow[2] = asociacion; // Añadir a asociación perjudicial
                }
                rows.push(newRow);
            }

            // Actualizar los datos en la hoja de cálculo
            await client.googleSheets.values.update({
                auth: client.auth,
                spreadsheetId: client.sheetId,
                range: "Sheet3!A:C",
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: rows
                }
            });

            // Construir el embed de respuesta
            const embed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Cultivo Registrado")
                .setDescription(`Se ha registrado el cultivo "${cultivo}" con una asociación ${tipoAsociacion.toLowerCase()} correctamente.`)
                .addField("Cultivo", cultivo)
                .addField("Tipo de Asociación", tipoAsociacion)
                .addField("Asociación", asociacion);

            if (observaciones) {
                embed.addField("Observaciones", observaciones);
            }

            // Enviar el mensaje usando el embed
            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error("Error al procesar el comando 'add-cultivo':", error);
            return interaction.reply({ content: "Hubo un error al procesar el comando. Por favor, intenta de nuevo más tarde.", ephemeral: true });
        }
    }
};