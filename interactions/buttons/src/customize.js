const { PermissionFlagsBits } = require("discord.js");
const fetch = require('node-fetch')
const fs = require('fs')

module.exports = {
    async execute(interaction, client){
        switch(interaction.customId.replace('customize_','')){
            case 'color':
                break;
            case 'image':
                if(!interaction.member.premiumSince && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: "Désolé, cette fonctionnalité n'est disponible que pour les boosters", ephemeral: true });
                await interaction.reply({ content: "Envoyez l'image que vous désirez dans votre carte dans ce salon, format 3:1 !", ephemeral: true })
                const msg_filter = (m) => m.author.id === interaction.user.id;
                interaction.channel.awaitMessages({ msg_filter, max: 1, time: 120_000 })
                .then(async (collected) => {
                    const msg = collected?.first();
                    if(!msg) return interaction.editReply({ content: "Temps écoulé... Merci d'envoyer l'image sous deux minute." });
                    const image = msg.attachments?.first();
                    await msg.delete();
                    if(image){
                        if(!image.height) return interaction.editReply({ content: ":x: Merci d'envoyer une image !" })
                        fetch(image.url)
                        .then(res =>
                            res.body.pipe(fs.createWriteStream(`customization/${interaction.user.id}.png`))
                        );
                        await interaction.editReply({ content: "L'image de votre carte a bien été modifiée !" })
                    };
                });
                break;
        }
    }
}