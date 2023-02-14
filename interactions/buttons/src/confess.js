const { ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    async execute(interaction, client) {
        switch(interaction.customId.split('_')[1]){
            case 'blacklist':
                await interaction.deferUpdate();
                const userId = interaction.customId.split('_')[2];
                const userData = await client.database.userdb.findOne({ where: { name: userId } });
                if(userData){
                    await client.database.userdb.update(
                        { confessBL: true },
                        { where: { name: userId } }
                    );

                } else {
                    await client.database.userdb.create({
                        name: userId,
                        confessBL: true
                    });
                }
                const unblBTN = new ButtonBuilder()
                    .setCustomId(`confess_unblacklist_${userId}`)
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Dé-Blacklister")
                    .setEmoji("🛠️");

                await interaction.editReply({ components: [new ActionRowBuilder().setComponents([unblBTN])] });
                await interaction.followUp({ content: `<@${userId}> a bien été blacklisté.e des confessions !`, ephemeral: true })
                break;
            case 'unblacklist':
                await interaction.deferUpdate();
                const UnuserId = interaction.customId.split('_')[2];
                const UnuserData = await client.database.userdb.findOne({ where: { name: UnuserId } });
                if(UnuserData){
                    await client.database.userdb.update(
                        { confessBL: false },
                        { where: { name: UnuserId } }
                    );

                } else {
                    await client.database.userdb.create({
                        name: UnuserId,
                        confessBL: false
                    });
                }
                const blBTN = new ButtonBuilder()
                    .setCustomId('confess_blacklist_'+UnuserId)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🛠️")
                    .setLabel("Blacklister")
                await interaction.editReply({ components: [new ActionRowBuilder().setComponents([blBTN])] });
                await interaction.followUp({ content: `<@${UnuserId}> a bien été dé-blacklisté.e des confessions !`, ephemeral: true })
                break;
            case 'answer':
                const answerUserData = await client.database.userdb.findOne({ where: { name: interaction.user.id } });
                if(answerUserData?.dataValues && answerUserData.dataValues.confessBL) return interaction.reply({ content: "Vous ne pouvez pas envoyer de confession, car vous avez été blacklisté.e !", ephemeral: true });
                const opId = interaction.customId.split('_')[2];
                const answerMODAL = new ModalBuilder()
                    .setCustomId(`confess_answer_${opId}`)
                    .setTitle('Répondre à la confession')
                    .setComponents([
                        new ActionRowBuilder()
                            .setComponents([
                                new TextInputBuilder()
                                    .setCustomId('content')
                                    .setLabel('Réponse')
                                    .setMinLength(100)
                                    .setMaxLength(4000)
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setPlaceholder('Inscrivez ici votre réponse (qui sera postée anonymement)')
                            ])
                    ])
                await interaction.showModal(answerMODAL);
        }
    }
}