module.exports = {
	name: "add",
	description: "Adds a user to the spreadsheet!",
	userPerms: ["ADMINISTRATOR"],
	options: [
		{
			name: "Usuario",
			description: "El usuario poseedor de la semilla",
			type: "USER",
			required: true,
		},
		{
			name: "Semilla",
			description: "Especie de la semilla",
			type: "STRING",
			required: true,
		}
	],
	run: async(client, interaction, args) => {
		const user = await interaction.options.getUser("Usuario");
		const reason = await interaction.options.getString("Semilla");

		const username = await user.username;

		const rows = await client.googleSheets.values.get({
			auth: client.auth,
			spreadsheetId: client.sheetId,
			range: "Sheet1!A:A"
		});

		const data = rows.data.values.find(row => row[0] === username);

		if (data) {
			return interaction.reply("User has been added to the list already!")
		} else if (!data) {
			await client.googleSheets.values.append({
				auth: client.auth,
				spreadsheetId: client.sheetId,
				range: "Sheet1!A:B",
				valueInputOption: "USER_ENTERED",
				resource: {
					values: [
						[username, reason]
					]
				}
			});
	
			return interaction.reply("The user has been added to the list!")
		}
	}
}