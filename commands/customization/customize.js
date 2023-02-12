const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('customize')
		.setDescription('Customiser l\'apparence du bot.')
        .addAttachmentOption(
            option => option
                .setName('image')
                .setDescription('Image de fond de la carte')
                .setRequired(false)
        ),

	async execute(interaction, client) {
        const image = interaction.options.getAttachment('image');

        if(image){
            fetch(image.url)
            .then(res =>
                res.body.pipe(fs.createWriteStream(`customization/${interaction.user.id}.png`))
            )
        }
    }
}