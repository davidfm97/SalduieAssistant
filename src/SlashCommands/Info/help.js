const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "help",
    description: 'Muestra la página de ayuda del bot!',
    options: null,
    run: async(client, interaction, args) => {
        const seedBankCommands = [
            { 
                'add': {
                    description: "Añade una nueva semilla o esqueje al banco de semillas.",
                    example: "/add --user @Usuario --type 'Semilla' --location 'Jardín' --seed 'Tomate' --variety 'Cherry' --scientific_name 'Solanum lycopersicum' --harvest_year 2024 --observations 'Semilla orgánica' --image_url 'https://example.com/tomato.jpg'"
                }, 
                'list': {
                    description: "Lista todas las semillas y esquejes registrados en el banco.",
                    example: "/list\n/list --cultivo 'Tomate'"
                }
            },
            {
                'add-asociacion': {
                    description: "Registra un cultivo con su asociación beneficiosa o perjudicial.",
                    example: "/add-asociacion --cultivo 'Tomate' --tipo_asociacion 'Beneficiosa' --asociacion 'Pepino'"
                },
                'list-asociacion': {
                    description: "Muestra las asociaciones beneficiosas o perjudiciales de un cultivo específico.",
                    example: "/list-asociacion --cultivo 'Tomate'"
                }
            },
            {
                'add-intercambio': {
                    description: "Registra un intercambio correctamente o incorrectamente para un usuario.",
                    example: "/add-intercambio --user @Usuario --tipo 'Correcto'"
                },
                'list-intercambio': {
                    description: "Muestra todos los usuarios y sus intercambios registrados en la lista de semillas.",
                    example: "/list-intercambio --user @Usuario"
                }
            }
        ];

        const embed = new MessageEmbed()
            .setTitle("Menú de Ayuda - Banco de Semillas")
            .setDescription("Aquí están los comandos para gestionar el banco de semillas:")
            .setColor("GREEN")
            .setThumbnail('https://cdn.discordapp.com/attachments/1253100572509212683/1253737349234298901/default.jpeg?ex=6676f165&is=66759fe5&hm=fcb6bd4cb7caa622424c0affaf8d745cfb83025554e5a201d74680ec95acd7e9');

        seedBankCommands.forEach(commandPair => {
            for (const commandName in commandPair) {
                const commandInfo = commandPair[commandName];
                embed.addField(`Comando: ${commandName}`, `- Descripción: ${commandInfo.description}\n- Ejemplo: \`${commandInfo.example}\``);
            }
        });

        // Botón para el estado del bot
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Estado del Bot')
                    .setStyle('LINK')
                    .setURL('https://stats.uptimerobot.com/VG2Orc0Gxv')
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};
