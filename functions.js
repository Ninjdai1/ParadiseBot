const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId, guildId, levelRoles } = require('./config.json');
const { Collection } = require('discord.js');
const fs = require('fs');
const rest = new REST({ version: '10' }).setToken(token);


function deploy_commands(client, loadcommands) {
    if (typeof loadcommands != 'boolean') throw "type of loadcommands argument needs to be boolean";

    const commands = [];
    client.commands = new Collection();
    const commandCategories = fs.readdirSync('./commands').filter(file => !file.includes('.'));
    for (const category of commandCategories) {
        const commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${category}/${file}`);
            commands.push(command.data);
            client.commands.set(command.data.name, command);

            console.log(`${category}/${command.data.name} chargé !`);
        }
    }
    if (loadcommands){
        slashCommandLoad(client, commands);
    }
    else{//Deletes slash commands
        slashCommandLoad(client, [])
    }
}

async function slashCommandLoad(client, commands) {
    try {
        console.log('Je commence à actualiser les commandes slash.');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );    
        console.log('Je viens de terminer de charger les commandes slash.');
    } catch (error) {
        console.error(error);
    }
    return client.commands;
};


async function giveLevelRoles(client, userId){
    const userData = await client.database.leveldb.findOne({ where: { name: userId } });
    if(userData && levelRoles[String(userData.dataValues.level)]){
        const guild = await client.guilds.fetch(guildId);
        const role = await guild.roles.roles.find(role => role.id == levelRoles[String(userData.dataValues.level)]);
        const member = await guild.members.fetch(userId);
        if(!member.roles.cache.has(role.id)) await member.roles.add(role);
    }
}

module.exports = { deploy_commands, giveLevelRoles }