const { EmbedBuilder } = require('discord.js');
const { guildId, supportRoleId } = require('../config.json')

module.exports = {
    name: 'presenceUpdate',
    on: true,
    async execute(oldPresence, newPresence, client) {
        if(newPresence.guild.id==guildId && newPresence?.activities[0]?.state?.includes('.gg/paradis') && !oldPresence?.activities[0]?.state?.includes('.gg/paradis')){
            const role = await newPresence.guild.roles.fetch(supportRoleId);
            if(!newPresence.member.roles.cache.has(role.id)){
                await newPresence.member.roles.add(role);
                await newPresence.member.send({ embeds: [thanksEmbed] });
            }
        } else if(newPresence.guild.id==guildId && oldPresence?.activities[0]?.state?.includes('.gg/paradis') && !newPresence?.activities[0]?.state?.includes('.gg/paradis')){
            const role = await newPresence.guild.roles.fetch(supportRoleId);
            if(newPresence.member.roles.cache.has(role.id)){
                await newPresence.member.roles.remove(role);
                await newPresence.member.send({ embeds: [thanksEndEmbed] });
            }
        }
    }
}

const thanksEmbed = new EmbedBuilder()
    .setDescription("Merci de soutenir Paradis ! En guise de remerciement, vous avez reçu le rôle soutien !")
    .setColor("Random")
const thanksEndEmbed = new EmbedBuilder()
    .setDescription("Merci d'avoir soutenu Paradis ! Le rôle soutien vous a été retiré car votre statut a changé.")
    .setColor("Random")