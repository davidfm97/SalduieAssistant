const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "add-intercambio",
    description: "Registra un intercambio correctamente o incorrectamente para un usuario",
    options: [
        {
            name: "user",
            description: "El usuario al que se refiere el intercambio",
            type: "USER",
            required: true,
        },
        {
            name: "tipo",
            description: "Selecciona el tipo de intercambio",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Correcto",
                    value: "Correcto"
                },
                {
                    name: "Incorrecto",
                    value: "Incorrecto"
                }
            ]
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

            const user = interaction.options.getUser("user");
            const username = user.username;
            const tipo = interaction.options.getString("tipo");

            // Validar el tipo de intercambio
            if (tipo !== "Correcto" && tipo !== "Incorrecto") {
                return interaction.reply({ content: "El tipo de intercambio debe ser 'Correcto' o 'Incorrecto'.", ephemeral: true });
            }

            // Obtener datos actuales de Sheet2
            const res = await client.googleSheets.values.get({
                auth: client.auth,
                spreadsheetId: client.sheetId,
                range: "Sheet2!A:C"
            });

            const rows = res.data.values || [];
            let userFound = false;

            // Actualizar la fila correspondiente si el usuario ya existe
            for (let i = 0; i < rows.length; i++) {
                if (rows[i][0] === username) {
                    if (tipo === "Correcto") {
                        rows[i][1] = (parseInt(rows[i][1]) + 1).toString(); // Columna de intercambios correctos
                    } else if (tipo === "Incorrecto") {
                        rows[i][2] = (parseInt(rows[i][2]) + 1).toString(); // Columna de intercambios incorrectos
                    }
                    userFound = true;
                    break;
                }
            }

            // Añadir una nueva fila si el usuario no existe
            if (!userFound) {
                const newRow = [username, "0", "0"]; // Nuevo usuario con 0 intercambios correctos e incorrectos
                if (tipo === "Correcto") {
                    newRow[1] = "1"; // Sumar 1 a intercambios correctos
                } else if (tipo === "Incorrecto") {
                    newRow[2] = "1"; // Sumar 1 a intercambios incorrectos
                }
                rows.push(newRow);
            }

            // Actualizar los datos en la hoja de cálculo
            await client.googleSheets.values.update({
                auth: client.auth,
                spreadsheetId: client.sheetId,
                range: "Sheet2!A:C",
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: rows
                }
            });

            // Construir el embed de respuesta
            const embed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Intercambio Registrado")
                .setDescription(`Intercambio ${tipo === "Correcto" ? "correcto" : "incorrecto"} añadido para ${username}`)
                .addField("Tipo de Intercambio", tipo === "Correcto" ? "Correcto" : "Incorrecto");

            // Enviar el mensaje usando el embed
            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error("Error al procesar el comando 'add':", error);
            return interaction.reply({ content: "Hubo un error al procesar el comando. Por favor, intenta de nuevo más tarde.", ephemeral: true });
        }
    }
};
