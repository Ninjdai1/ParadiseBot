const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { confessLogsId, confessChannelId } = require('../../../config.json');

module.exports = {
    async execute(interaction, client) {
        switch(interaction.customId.split('_')[1]){
            case 'create':
                const text = interaction.fields.getTextInputValue('content');
                const confessEmbed = new EmbedBuilder()
                    .setTitle("Confession anonyme d'un membre de Paradis...")
                    .setDescription(text)
                    .setTimestamp()
                    .setColor("White")
                const confessChannel = await interaction.guild.channels.cache.get(confessChannelId);
                await confessChannel.send({
                    embeds: [ confessEmbed ],
                    components: [
                        new ActionRowBuilder().setComponents([
                            new ButtonBuilder()
                                .setCustomId(`confess_answer_${interaction.user.id}`)
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("💬")
                                .setLabel("Répondre")
                        ])
                    ]
                });
                await interaction.reply({ content: "Votre confession a bien été envoyée anonymement !", embeds: [confessEmbed], ephemeral: true });
                const channel = await client.channels.cache.get(confessLogsId);
                const blBTN = new ButtonBuilder()
                    .setCustomId(`confess_blacklist_${interaction.user.id}`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🛠️")
                    .setLabel("Blacklister")
                await channel.send({ content: `Confession de ${interaction.user.tag} (${interaction.user.id})`, embeds: [confessEmbed], components: [new ActionRowBuilder().setComponents([blBTN])] });
                break;
            case 'answer':
                const opId = interaction.customId.split('_')[2];
                const textAnswer = interaction.fields.getTextInputValue('content');
                const confessAnswerEmbed = new EmbedBuilder()
                    .setTitle("Confession anonyme d'un membre de Paradis...")
                    .setDescription(textAnswer)
                    .setTimestamp()
                    .setColor("White")
                const ogAuthor = await interaction.guild.members.cache.get(opId);
                const ogMessage = interaction.message;
                const answerMessage = await ogMessage.reply({
                    embeds: [ confessAnswerEmbed ],
                    components: [
                        new ActionRowBuilder().setComponents([
                            new ButtonBuilder()
                                .setCustomId(`confess_answer_${interaction.user.id}`)
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("💬")
                                .setLabel("Répondre")
                        ])
                    ]
                });
                await interaction.reply({ content: "Votre confession a bien été envoyée anonymement !", embeds: [confessAnswerEmbed], ephemeral: true });
                await ogAuthor.send({ content: "Votre confession sur Paradis a reçu une réponse !\n"+answerMessage.url })
                const channelAnswer = await client.channels.cache.get(confessLogsId);
                const blAnswerBTN = new ButtonBuilder()
                    .setCustomId(`confess_blacklist_${interaction.user.id}`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🛠️")
                    .setLabel("Blacklister");
                await channelAnswer.send({ content: `Confession de ${interaction.user.tag} (${interaction.user.id})`, embeds: [confessAnswerEmbed], components: [new ActionRowBuilder().setComponents([blAnswerBTN])] });

                break;
        }
    }
}