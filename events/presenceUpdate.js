const { guildId, supportRoleId } = require('../config.json')

module.exports = {
    name: 'presenceUpdate',
    on: true,
    async execute(oldPresence, newPresence, client) {
        if(newPresence.guild.id==guildId && newPresence?.activities[0]?.state?.includes('.gg/paradis') && !oldPresence?.activities[0]?.state?.includes('.gg/paradis')){
            const role = await newPresence.guild.roles.fetch(supportRoleId);
            if(!newPresence.member.roles.cache.has(role.id)){
                await newPresence.member.roles.add(role);
            }
        } else if(newPresence.guild.id==guildId && !newPresence.status =='offline' && oldPresence?.activities[0]?.state?.includes('.gg/paradis') && !newPresence?.activities[0]?.state?.includes('.gg/paradis')){
            const role = await newPresence.guild.roles.fetch(supportRoleId);
            if(newPresence.member.roles.cache.has(role.id)){
                await newPresence.member.roles.remove(role);
            }
        }
    }
}