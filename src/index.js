const chalk = require('chalk');
const fs = require("fs");
require('dotenv').config();
const { google } = require('googleapis');
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const { loadEvents } = require("../src/handlers/loadEvents");
const { loadSlashCommands } = require("../src/handlers/loadSlashCommands");

const botToken = process.env.CLIENT_TOKEN;
const spreadsheetId = process.env.SPREADSHEET_ID;
const credentials = {
	type: process.env.TYPE,
	project_id: process.env.PROJECT_ID,
	private_key_id: process.env.PRIVATE_KEY_ID,
	private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
	client_email: process.env.CLIENT_EMAIL,
	client_id: process.env.CLIENT_ID,
	auth_uri: process.env.AUTH_URI,
	token_uri: process.env.TOKEN_URI,
	auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
	client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
	universe_domain: process.env.UNIVERSE_DOMAIN
  };
// Declaring our Discord Client
const keep_alive = require('./keep_alive.js')
const client = new Client({
	allowedMentions: { parse: ["users", "roles"] },
	intents: [
	  Intents.FLAGS.GUILDS,
	  Intents.FLAGS.GUILD_MESSAGES,
	  Intents.FLAGS.GUILD_MEMBERS,
	  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	  Intents.FLAGS.GUILD_WEBHOOKS,
	  Intents.FLAGS.GUILD_VOICE_STATES,
	  Intents.FLAGS.GUILD_INVITES,
	  Intents.FLAGS.GUILD_BANS,
	  Intents.FLAGS.GUILD_PRESENCES,
	],
});
// Google Sheets Authorisation Stuff
const auth = new google.auth.GoogleAuth({
	credentials,
	scopes: "https://www.googleapis.com/auth/spreadsheets"
  });
const sheetClient = auth.getClient();
const googleSheets = google.sheets({ version: "v4", auth: sheetClient });

// Stuff that will be very useful in our project
client.sheetCommands = fs.readdirSync("./src/SlashCommands/Sheets/")
client.slash = new Collection();
client.auth = auth;
client.sheetId = spreadsheetId;
client.googleSheets = googleSheets.spreadsheets;

// Declaring Slash Command and Events
loadEvents(client);
loadSlashCommands(client);

// Error Handling
process.on("uncaughtException", (err) => {
	console.log("Uncaught Exception: " + err);
  
	const exceptionembed = new MessageEmbed()
	.setTitle("Uncaught Exception")
	.setDescription(`${err}`)
	.setColor("RED")
	//client.channels.cache.get(error_logs).send({ embeds: [exceptionembed] })
	console.log(err);
  });
  
process.on("unhandledRejection", (reason, promise) => {
	console.log(
	  "[FATAL] Possibly Unhandled Rejection at: Promise ",
	  promise,
	  " reason: ",
	  reason.message
	);
  
	 const rejectionembed = new MessageEmbed()
	.setTitle("Unhandled Promise Rejection")
	.addField("Promise", `${promise}`)
	.addField("Reason", `${reason.message}`)
	.setColor("RED")
	//client.channels.cache.get(error_logs).send({ embeds: [rejectionembed] })
});
  
client.login(botToken).then(() => {
	console.log(
	  chalk.bgBlueBright.black(
		` Successfully logged in as: ${client.user.username}#${client.user.discriminator} `
	  )
	);
});
// Manejo para apagar o detener el bot adecuadamente
process.on('SIGINT', () => {
    console.log('Shutting down...');
    client.destroy();
    process.exit(0);
});