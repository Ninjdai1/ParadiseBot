const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')
const canvacord = require("canvacord");
const sequelize = require('sequelize')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Afficher votre level.'),

	async execute(interaction, client) {
        const userLevelData = await client.database.leveldb.findOne({ where: { name: interaction.user.id } });
        if(userLevelData){
            const rank = new canvacord.Rank()
                .setAvatar(interaction.user.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(userLevelData.dataValues.xp)
                .setRequiredXP(userLevelData.dataValues.level*5 + 25)
                .setStatus("online")
                .setRank(0, 'RANK', false)
                .setLevel(userLevelData.dataValues.level, "NIVEAU  ")
                .setProgressBar("#FFFFFF", "COLOR")
                .setUsername(interaction.user.username)
                .setDiscriminator(interaction.user.discriminator);
            
            rank.build()
                .then(data => {
                    interaction.reply({ files: [data]});
                });

        } else {
            await client.database.leveldb.create({
                name: interaction.user.id,
                xp: 0,
                level: 0
            });
            return interaction.reply({ content: "Commence à parler pour gagner de l'xp !" })
        }
	},
};