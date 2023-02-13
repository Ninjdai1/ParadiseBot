const { SlashCommandBuilder } = require('discord.js');
const sequelize = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setlevel')
		.setDescription('Modifier le niveau d\'un utilisateur.')
        .setDefaultMemberPermissions(0x8)
        .addUserOption(
            option =>  option
                .setName('user')
                .setDescription('Utilisateur')
                .setRequired(true)
        )
        .addIntegerOption(
            option => option
                .setName('level')
                .setDescription('Niveau')
                .setRequired(true)),

	async execute(interaction, client) {
        const member = interaction.options.getMember('user');
        const level = interaction.options.getInteger('level');
        const userLevelData = await client.database.leveldb.findOne({ where: { name: member.id } });
        if(userLevelData) {
            await client.database.leveldb.update(
                { level: level, xp: 0 },
                { where: { name: member.id } }
            );
        } else {
            await client.database.leveldb.create({
                name: member.id,
                xp: 0,
                level: level,
                cardColor: "#ffffff"
            });
        }
        await interaction.reply({ content: `<@${member.id}> est désormais niveau ${level}` })
    }
}