const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('customize')
		.setDescription('Customiser l\'apparence du bot.'),

	async execute(interaction, client) {
        return interaction.reply({ embeds: [customizeEmbed], components: [btnROW], ephemeral: true})

        const image = interaction.options.getAttachment('image');

        if(image){
            fetch(image.url)
            .then(res =>
                res.body.pipe(fs.createWriteStream(`customization/${interaction.user.id}.png`))
            )
        }
    }
}

const customizeEmbed = new EmbedBuilder()
    .setTitle('Customisation')
    .setDescription("Sur ce menu, vous pouvez configurer le bot à votre guise !")
    .setColor("#079b96")

const colorBTN = new ButtonBuilder()
    .setCustomId('customize_color')
    .setLabel('Couleur')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('🎨')

const imageBTN = new ButtonBuilder()
    .setCustomId('customize_image')
    .setLabel('Image')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('🖼️')

const btnROW = new ActionRowBuilder().setComponents([colorBTN, imageBTN])