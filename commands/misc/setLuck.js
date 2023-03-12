const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setluck')
		.setDescription('Modifier le /luck.')
        .setDefaultMemberPermissions(0x8)
        .addStringOption(
            option =>  option
                .setName('reward')
                .setDescription('La récompense en cas de succès')
                .setRequired(true)
        )
        .addIntegerOption(
            option => option
                .setName('number')
                .setDescription('Le nombre sur lequel il faut tomber.')
                .setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();
        const reward = interaction.options.getString('reward');
        const number = interaction.options.getInteger('number');

        let serverData = await client.database.serverdb.findOne({ where: { name: interaction.guild.id } });
        if(serverData){
            await client.database.serverdb.update(
                { guessReward: reward, guessNum: number, },
                { where: { name: interaction.guild.id } }
            )
        }
        else{
            await client.database.serverdb.create({
                name: interaction.guild.id,
                guessReward: reward,
                guessNum: number,
            });
        };
        await interaction.editReply({ content: `Le /guess a bien été modifié !\nRécompense: ${reward}\nNombre: ${number}` });
    }
}