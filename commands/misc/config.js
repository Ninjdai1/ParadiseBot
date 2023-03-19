const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Modifier le bot.')
        .setDefaultMemberPermissions(0x8)
        .addBooleanOption(
            option =>  option
                .setName('xp')
                .setDescription('Xp activé ou non')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();
        const xp = interaction.options.getBoolean('xp');

        let serverData = await client.database.serverdb.findOne({ where: { name: interaction.guild.id } });
        if(serverData){
            await client.database.serverdb.update(
                { xp: xp },
                { where: { name: interaction.guild.id } }
            );
        }
        else{
            await client.database.serverdb.create({
                name: interaction.guild.id,
                guessReward: null,
                guessNum: null,
                xp: xp
            });
        };
        client.isXPEnabled = xp;
        await interaction.editReply({ content: `Le système d'xp a bien été ${xp ? "activé" : "désactivé"}` });
    }
}