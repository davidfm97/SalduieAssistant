const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "list-asociaciones",
    description: "Muestra las asociaciones beneficiosas y perjudiciales para un cultivo específico.",
    options: [
        {
            name: 'cultivo',
            type: 'STRING',
            description: 'El cultivo para el que deseas ver las asociaciones',
            required: true,
        }
    ],
    run: async (client, interaction) => {
        const cultivo = interaction.options.getString('cultivo').toLowerCase();
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
                range: "Sheet3!A:C", // Ajustar el rango para incluir los campos relevantes
            });

            if (!rows.data.values || rows.data.values.length <= 1) {
                return await interaction.reply({ content: "No hay datos registrados en la hoja de asociaciones.", ephemeral: true });
            }

            // Buscar el cultivo específico en los datos obtenidos
            const cultivoData = rows.data.values.find(row => row[0].toLowerCase() === cultivo);

            if (!cultivoData) {
                return await interaction.reply(`No se encontró información para el cultivo "${cultivo}".`);
            }

            const asociacionesBeneficiosas = cultivoData[1] ? cultivoData[1].split(', ').join(', ') : 'Ninguna';
            const asociacionesPerjudiciales = cultivoData[2] ? cultivoData[2].split(', ').join(', ') : 'Ninguna';

            // Construir el embed de respuesta
            const embed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`Asociaciones para el cultivo "${cultivo}"`)
                .addFields(
                    { name: "Asociaciones Beneficiosas", value: asociacionesBeneficiosas },
                    { name: "Asociaciones Perjudiciales", value: asociacionesPerjudiciales }
                );

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error("Error al obtener datos de Google Sheets:", error);
            await interaction.reply({ content: "Hubo un error al obtener la lista de asociaciones.", ephemeral: true });
        }
    },
};
