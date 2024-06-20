const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    name: "list-intercambio",
    description: "Muestra todos los usuarios y sus intercambios registrados en la lista de semillas.",
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'Filtra los resultados por un usuario específico (obligatorio)',
            required: true,
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const username = user.username;
        const cultivadoresRoleId = '1246468778112323587'; // ID del rol de Cultivadores

        // Verificar si el usuario tiene el rol de Cultivadores o es administrador
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const isAdmin = member.permissions.has("ADMINISTRATOR");
        const isCultivador = member.roles.cache.has(cultivadoresRoleId);

        if (!isAdmin && !isCultivador) {
            return interaction.reply({ content: "No tienes permisos para usar este comando. Necesitas ser Administrador o tener el rol de Cultivador.", ephemeral: true });
        }

        try {
            const rows = await client.googleSheets.values.get({
                auth: client.auth,
                spreadsheetId: client.sheetId,
                range: "Sheet2!A:C", // Ajustar el rango para incluir los campos relevantes
            });

            if (!rows.data.values || rows.data.values.length <= 1) {
                return await interaction.reply({ content: "No hay usuarios registrados en la lista de semillas.", ephemeral: true });
            }

            // Buscar el usuario específico en los datos obtenidos
            const userData = rows.data.values.find(row => row[0] === username);

            if (!userData) {
                return await interaction.reply(`No se encontró información para el usuario "${username}".`);
            }

            const intercambiosCorrectos = parseInt(userData[1]) || 0;
            const intercambiosIncorrectos = parseInt(userData[2]) || 0;

            // Determinar el color del embed y la thumbnail según los intercambios
            let embedColor = "RED";
            let thumbnailUrl = '';
            if (intercambiosCorrectos > intercambiosIncorrectos) {
                embedColor = "GREEN";
                // URL de la imagen para intercambios correctos
                thumbnailUrl = 'https://cdn.discordapp.com/attachments/1253100572509212683/1253400631423795271/cac6cf8f-db0c-4dcd-a95b-68a1ae371b40.jpg?ex=6675b7cd&is=6674664d&hm=aa0661a76059b239128dcfc233809536add0142a0c85b0216ff66a1b260408cb&'; // Reemplaza con tu enlace
            } else {
                // URL de la imagen para intercambios incorrectos
                thumbnailUrl = 'https://cdn.discordapp.com/attachments/1253100572509212683/1253401672428818583/c3a7e351-2fb7-437c-b7e9-cb87193be6c9.jpg?ex=6675b8c5&is=66746745&hm=9486548f50b4a8dd4af417a9bf35821e47b644b9833fdcd07128f89f04990f03&'; // Reemplaza con tu enlace
            }

            // Construir el contenido del campo del embed
            const fieldValue = `**Intercambios Correctos**: ${intercambiosCorrectos}\n**Intercambios Incorrectos**: ${intercambiosIncorrectos}`;

            // Construir el embed final
            const embed = new MessageEmbed()
                .setColor(embedColor)
                .setTitle(`Intercambios de Semillas para ${username}`)
                .setDescription(fieldValue)
                .setThumbnail(thumbnailUrl); // Añadir la thumbnail

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error("Error al obtener datos de Google Sheets:", error);
            await interaction.reply({ content: "Hubo un error al obtener la lista de semillas.", ephemeral: true });
        }
    },
};
