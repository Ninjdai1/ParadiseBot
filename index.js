const fs = require('fs');
const Sequelize = require('sequelize');
const { Client, GatewayIntentBits } = require("discord.js");
const { token, sequelizeCredentials, confessWebhook } = require('./config.json');
const { deploy_commands, autoUpdate } = require('./functions.js');

autoUpdate()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
    ]
});

const sequelize = new Sequelize('database', sequelizeCredentials.username, sequelizeCredentials.password, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const leveldb = sequelize.define('leveling', {
	name: {//id
		type: Sequelize.STRING,
		unique: true,
	},
    xp: Sequelize.INTEGER,
    level: Sequelize.INTEGER,
	cardColor: Sequelize.STRING
});

const userdb = sequelize.define('users', {
	name: {//id
		type: Sequelize.STRING,
		unique: true,
	},
    confessBL: Sequelize.BOOLEAN,
});

client.database = {
	sequelize: sequelize,
	leveldb: leveldb,
	userdb: userdb,
	voiceBuffer: {}
};

leveldb.sync();
userdb.sync();


process.on('uncaughtException', error =>{
	console.error(error);
});
client.on('error', error =>{
	console.error(error);
});


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

deploy_commands(client, true);//true: will refresh slash commands

client.login(token)