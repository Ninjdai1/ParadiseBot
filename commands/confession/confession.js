const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { confessLogsId } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confession')
        .setDescription('Permet de se confesser anonymement')
        .addStringOption(
            option => option
                .setName('texte')
                .setDescription('La confession qui sera envoyée')
                .setMinLength(100)
                .setMaxLength(4000)
                .setRequired(true)
        ),
    async execute(interaction, client){
        const userData = await client.database.userdb.findOne({ where: { name: interaction.user.id } });
        console.log(userData)
        if(userData?.dataValues && userData.dataValues.confessBL) return interaction.reply({ content: "Votre confession n'a pas été envoyée, car vous êtes blacklisté des confessions !", ephemeral: true });
        const texte = interaction.options.getString('texte');
        const confessEmbed = new EmbedBuilder()
            .setTitle("Confession anonyme d'un membre de Paradis...")
            .setDescription(texte)
            .setTimestamp()
            .setColor("White")
        await client.confessWebhook.send({ embeds: [confessEmbed] });
        await interaction.reply({ content: "Votre confession a bien été envoyée anonymement !", embeds: [confessEmbed], ephemeral: true });
        const channel = await client.channels.cache.get(confessLogsId);
        const blBTN = new ButtonBuilder()
            .setCustomId(`confess_blacklist_${interaction.user.id}`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji("🛠️")
            .setLabel("Blacklister")
        await channel.send({ content: `Confession de ${interaction.user.tag} (${interaction.user.id})`, embeds: [confessEmbed], components: [new ActionRowBuilder().setComponents([blBTN])] });
    }
}
