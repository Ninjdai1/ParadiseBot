module.exports = {
    name: 'voiceStateUpdate',
    on: true,
    async execute(oldVoiceState, newVoiceState, client) {
        if (newVoiceState.channel && !newVoiceState.selfMute && !newVoiceState.serverMute) {
            const channel = await newVoiceState.guild.channels.fetch(newVoiceState.channelId);
            if (!client.database.voiceBuffer[newVoiceState.member.id]) client.database.voiceBuffer[newVoiceState.member.id] = {
                active: true,
                category: channel.parentId,
                startTimestamp: Date.now(),
                xpGain: 0
            };
            client.database.voiceBuffer[newVoiceState.member.id].active = true;
        } else {
            const data = client.database.voiceBuffer[newVoiceState.member.id]
            if (client.database.voiceBuffer[newVoiceState.member.id]) client.database.voiceBuffer[newVoiceState.member.id].active = false;
            if(!newVoiceState.channel){
                if(data.xpGain>0) await newVoiceState.member.send({
                    content: `Session vocale terminée ! Vous avez gagné ${data.xpGain} XP en ${Math.round((Date.now()-data.startTimestamp)/60000)} minutes de vocal.`
                });
                delete client.database.voiceBuffer[newVoiceState.member.id];
            }
        };
    }
}