module.exports = {
    name: 'voiceStateUpdate',
    on: true,
    async execute(oldVoiceState, newVoiceState, client) {
        const userData = await client.database.leveldb.findOne({ where: { name: newVoiceState.member.id } });
        if (newVoiceState.channel && !newVoiceState.selfMute && !newVoiceState.serverMute) {
            if (!client.database.voiceBuffer[newVoiceState.member.id]) client.database.voiceBuffer[newVoiceState.member.id] = newVoiceState.channelId;
        } else {
            if (client.database.voiceBuffer[newVoiceState.member.id]) return delete client.database.voiceBuffer[newVoiceState.member.id]
        };
    }
}