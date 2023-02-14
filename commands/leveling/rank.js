const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const canvacord = require("canvacord");
const fs = require('fs');
const { devId } = require('../../config.json');

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
            .setProgressBar("#FFFFFF", "COLOR");

        if(userLevelData){
            const cardColor = userLevelData.dataValues.cardColor
            rank.setAvatar(member.user.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(userLevelData.dataValues.xp, cardColor)
                .setRequiredXP(userLevelData.dataValues.level*13 + 25, cardColor)
                .setLevel(userLevelData.dataValues.level, "NIVEAU  ")
                .setUsername(member.user.username, cardColor)
                .setDiscriminator(member.user.discriminator)
                .setProgressBar(cardColor, "COLOR")
                .setLevelColor(cardColor, cardColor);

            if (fs.existsSync(`customization/${member.id}.png`) && (member.premiumSince || member.permissions.has(PermissionFlagsBits.Administrator) || member.id==devId)) {
                rank.setBackground("IMAGE", `customization/${member.id}.png`);
            };
            
            rank.build()
                .then(data => {
                    interaction.reply({ files: [data]});
                });

        } else {
            await client.database.leveldb.create({
                name: member.id,
                xp: 0,
                level: 0,
                cardColor: "#ffffff"
            });

            rank.setAvatar(member.user.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setUsername(member.user.username)
                .setDiscriminator(member.user.discriminator);
            rank.build()
                .then(data => {
                    interaction.reply({ files: [data]});
                });
        }
	},
};