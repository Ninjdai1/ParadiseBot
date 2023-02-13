const { ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");

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
                await interaction.followUp({ content: `<@${userId}> a bien été blacklisté des confessions !`, ephemeral: true })
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
                await interaction.followUp({ content: `<@${UnuserId}> a bien été dé-blacklisté des confessions !`, ephemeral: true })
                break;
        }
    }
}