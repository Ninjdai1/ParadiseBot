const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guess')
		.setDescription('Essayer de tomber sur le numéro gagnant'),

	async execute(interaction, client) {
        await interaction.deferReply();
        const now = Date.now();
        let userData = await client.database.userdb.findOne({ where: { name: interaction.user.id } });
        if(userData){
            if(now - userData.dataValues.guessCD < 24 * 60 * 60 * 1000) return interaction.editReply({ content: "Vous avez déjà utilisé la commande dans les dernières 24H !", ephemeral: true });
            else await client.database.userdb.update(
                { guessCD: now },
                { where: { name: interaction.user.id } }
            );
        }
        else{
            await client.database.userdb.create({
                name: interaction.user.id,
                confessBL: false,
                guessCD: now
            });
        };


        let serverData = await client.database.serverdb.findOne({ where: { name: interaction.guild.id } });
        if(!serverData){
            await client.database.serverdb.create({
                name: interaction.guild.id,
                guessReward: null,
                guessNum: null,
            });
            serverData = await client.database.serverdb.findOne({ where: { name: interaction.guild.id } });
        };

        const guessedNum = Math.floor(Math.random() * 9999);
        const embed = new EmbedBuilder()
        if(serverData.dataValues.guessNum == guessedNum){
            embed
                .setDescription(
                    `Voyons si tu as eu de la chance <@${interaction.user.id}> 🍀 !\n\n`
                    + `Tu as eu **${guessedNum}** !\n\n`
                    + `Tu as obtenu le bon nombre ! Contacte l'équipe pour recevoir ${serverData.dataValues.guessReward} !`
                )
        } else {
            embed
                .setDescription(
                    `Voyons si tu as eu de la chance <@${interaction.user.id}> 🍀 !\n\n`
                    + `Tu as eu **${guessedNum}** !\n\n`
                    + `Si tu obtiens le nombre __${serverData.dataValues.guessNum}__, tu gagnes ${serverData.dataValues.guessReward}`
                )
        }
        await interaction.editReply({ embeds: [embed] });
    }
};