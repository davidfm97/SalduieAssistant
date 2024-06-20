const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    name: "list",
    description: "Muestra todos los usuarios agregados a la lista de semillas!",
    options: [
        {
            name: 'filter',
            type: 'STRING',
            description: 'Filtra los resultados por un criterio específico',
            required: false,
        }
    ],
    run: async (client, interaction) => {
        const filterCriteria = interaction.options.getString('filter') || '';
        const cultivadoresRoleId = '1246468778112323587'; // ID del rol de Cultivadores

        // Verificar si el usuario tiene el rol de Cultivadores o es administrador
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const isAdmin = member.permissions.has("ADMINISTRATOR");
        const isCultivador = member.roles.cache.has(cultivadoresRoleId);

        if (!isAdmin && !isCultivador) {
            return interaction.reply("No tienes permisos para usar este comando. Necesitas ser Administrador o tener el rol de Cultivador.");
        }

        try {
            const rows = await client.googleSheets.values.get({
                auth: client.auth,
                spreadsheetId: client.sheetId,
                range: "Sheet1!A:I", // Ajustar el rango para incluir el campo 'type'
            });

            if (!rows.data.values || rows.data.values.length <= 1) {
                return await interaction.reply("No hay usuarios agregados a la lista.");
            }

            // Eliminar la primera fila que contiene los títulos de las columnas
            const dataRows = rows.data.values.slice(1);

            // Filtrar por criterios si se proporciona uno
            let filteredRows = dataRows;
            if (filterCriteria) {
                filteredRows = dataRows.filter(row => {
                    // Verificar si alguno de los campos contiene el criterio de filtro
                    return row.some(value => value.toLowerCase().includes(filterCriteria.toLowerCase()));
                });
            }

            if (filteredRows.length === 0) {
                return await interaction.reply(`No se encontraron usuarios que coincidan con el criterio de búsqueda "${filterCriteria}".`);
            }

            // Crear un array para almacenar los campos del embed
            let embedFields = [];

            // Iterar sobre los datos filtrados y añadir campos al array
            for (let i = 0; i < filteredRows.length; i++) {
                const row = filteredRows[i];

                // Inicializar el campo de valor para el embed
                let fieldValue = '';

                if (row[0]) fieldValue += `**Usuario**: ${row[0]}\n`;
                if (row[1]) fieldValue += `**Tipo**: ${row[1]}\n`; // Mostrar el tipo de entrada (type)
                if (row[2]) fieldValue += `**Semilla**: ${row[2]}\n`;
                if (row[3]) fieldValue += `**Variedad**: ${row[3]}\n`;
                if (row[4]) fieldValue += `**Nombre científico**: ${row[4]}\n`;
                if (row[5]) fieldValue += `**Año de recolección**: ${row[5]}\n`;
                if (row[6]) fieldValue += `**Lugar de recolección**: ${row[6]}\n`;
                if (row[7]) fieldValue += `**Observaciones**: ${row[7]}\n`;

                const imageUrl = row[8]; // Asumiendo que la columna 8 contiene la URL de la imagen
                if (imageUrl) {
                    fieldValue += `**Imagen**: ${imageUrl}\n`;
                }

                // Añadir campo al array de campos del embed solo si fieldValue no está vacío
                if (fieldValue) {
                    embedFields.push({ name: `Semilla ${i + 1}`, value: fieldValue });
                }
            }

            // Si no hay campos para mostrar
            if (embedFields.length === 0) {
                return await interaction.reply("No hay usuarios agregados a la lista que coincidan con el criterio de búsqueda.");
            }

            // Dividir los campos en páginas de máximo 25 campos por embed
            const pageSize = 25;
            let pages = [];
            for (let i = 0; i < embedFields.length; i += pageSize) {
                const currentFields = embedFields.slice(i, i + pageSize);
                const embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Banco de Semillas")
                    .setDescription("Lista de semillas disponibles:");

                embed.addFields(currentFields);

                pages.push(embed);
            }

            // Función para enviar la página específica
            const sendPage = async (pageIndex) => {
                if (pageIndex < 0 || pageIndex >= pages.length) return;

                const page = pages[pageIndex];
                const buttonsRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('previous')
                            .setLabel('Anterior')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('next')
                            .setLabel('Siguiente')
                            .setStyle('PRIMARY'),
                    );

                // Enviar el mensaje con los botones de navegación
                await interaction.reply({ embeds: [page], components: [buttonsRow] });

                return buttonsRow; // Devolver los botonesRow para acceso posterior
            };

            let currentPageIndex = 0;
            await sendPage(currentPageIndex); // Enviar la primera página al inicio

            // Manejar interacciones de los botones de navegación
            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'previous') {
                    currentPageIndex = Math.max(0, currentPageIndex - 1);
                } else if (i.customId === 'next') {
                    currentPageIndex = Math.min(pages.length - 1, currentPageIndex + 1);
                }

                // Obtener los nuevos botonesRow para actualizar
                const newButtonsRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('previous')
                            .setLabel('Anterior')
                            .setStyle('PRIMARY')
                            .setDisabled(currentPageIndex === 0), // Deshabilitar el botón anterior en la primera página
                        new MessageButton()
                            .setCustomId('next')
                            .setLabel('Siguiente')
                            .setStyle('PRIMARY')
                            .setDisabled(currentPageIndex === pages.length - 1), // Deshabilitar el botón siguiente en la última página
                    );

                await i.update({ embeds: [pages[currentPageIndex]], components: [newButtonsRow] });
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp('La paginación ha expirado.');
                }
            });

        } catch (error) {
            console.error("Error al obtener datos de Google Sheets:", error);
            await interaction.reply("Hubo un error al obtener la lista de semillas.");
        }
    },
};
