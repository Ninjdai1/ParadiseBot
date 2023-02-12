const { SlashCommandBuilder } = require('discord.js');
const canvacord = require("canvacord");
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Afficher votre level.')
        .addUserOption(
            option =>  option
                .setName('member')
                .setDescription('Utilisateur')
                .setRequired(false)
        ),

	async execute(interaction, client) {
        const member = interaction.options.getMember('member') || interaction.member;
        const userLevelData = await client.database.leveldb.findOne({ where: { name: member.id } });

        const rank = new canvacord.Rank()
            .setCurrentXP(0)
            .setRequiredXP(25)
            .setStatus(member.presence?.status || "offline")
            .setRank(0, 'RANK', false)
            .setLevel(0, "NIVEAU  ")
            .setProgressBar("#FFFFFF", "COLOR")

        if(userLevelData){
            rank.setAvatar(member.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(userLevelData.dataValues.xp)
                .setRequiredXP(userLevelData.dataValues.level*5 + 25)
                .setLevel(userLevelData.dataValues.level, "NIVEAU  ")
                .setUsername(member.user.username)
                .setDiscriminator(member.user.discriminator);

            if (fs.existsSync(`customization/${member.id}.png`)) {
                rank.setBackground("IMAGE", `customization/${member.id}.png`)
            }
            
            rank.build()
                .then(data => {
                    interaction.reply({ files: [data]});
                });

        } else {
            await client.database.leveldb.create({
                name: member.id,
                xp: 0,
                level: 0
            });

            rank.setAvatar(user.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setUsername(member.user.username)
                .setDiscriminator(member.user.discriminator);
            rank.build()
                .then(data => {
                    interaction.reply({ files: [data]});
                });
        }
	},
};