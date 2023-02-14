const { SlashCommandBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder, ModalBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confession')
        .setDescription('Permet de se confesser anonymement'),
    async execute(interaction, client){
        const userData = await client.database.userdb.findOne({ where: { name: interaction.user.id } });
        if(userData?.dataValues && userData.dataValues.confessBL) return interaction.reply({ content: "Vous ne pouvez pas envoyer de confession, car vous avez été blacklisté.e !", ephemeral: true });

        const answerMODAL = new ModalBuilder()
        .setCustomId(`confess_create`)
        .setTitle('Envoyer une confession')
        .setComponents([
            new ActionRowBuilder()
                .setComponents([
                    new TextInputBuilder()
                        .setCustomId('content')
                        .setLabel('Confession')
                        .setMinLength(100)
                        .setMaxLength(4000)
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Inscrivez ici votre confession (qui sera postée anonymement)')
                ])
        ]);
        return await interaction.showModal(answerMODAL);
    }
}
