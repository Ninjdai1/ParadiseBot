const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('top')
		.setDescription('Afficher le leaderboard.'),

	async execute(interaction, client) {
        const top = await client.database.leveldb.findAll({ 
            limit: 10 ,
            order: [['level','DESC'],
                    ['xp', 'DESC']]
        });
        let desc = ""
        top.forEach((element, index) => {
            desc+=`${String(index+1).replace('1','🥇').replace('2','🥈').replace('3','🥉')} - Niveau ${element.dataValues.level} : <@${element.dataValues.name}>\n`
        });
        const top200 = await client.database.leveldb.findAll({ 
            limit: 200 ,
            order: [['level','DESC'],
                    ['xp', 'DESC']]
        });
        const userData = await client.database.leveldb.findOne({ where: {name: interaction.user.id} });
        if(!userData in top200) desc+="\nVous n'êtes pas présent.e dans le leaderboard."
        else if(!userData in top){
            topPos = top200.indexOf(userData);
            desc+=`${String(topPos+1)} - Niveau ${userData.dataValues.level} : <@${userData.dataValues.name}>\n`
        }
        await interaction.reply({embeds:[
            new EmbedBuilder()
                .setTitle("Leaderboard")
                .setDescription(desc)
                .setThumbnail('https://media.discordapp.net/attachments/1074434392551854151/1074435152731709571/paradisebanner.png')
        ]})
    }
}