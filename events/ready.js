const { xpVCs } = require('../config.json')
const { giveLevelRoles } = require('../functions')

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        console.log("Prêt !");
        client.user.setStatus('online');
        setInterval(async ()=>{
            for (let [userId, data] of Object.entries(client.database.voiceBuffer)) {
                if(data.active==false) return;
                const userData = await client.database.leveldb.findOne({ where: { name: userId } });

                if(userData){
                    await client.database.leveldb.update(
                        { xp: userData.dataValues.xp + (xpVCs[data.parentId]||3) },
                        { where: { name: userId } }
                    );
                    client.database.voiceBuffer[userId].xpGain += xpVCs[data.parentId]||3

                    const userDataUp = await client.database.leveldb.findOne({ where: { name: userId } });
                    if(userDataUp.dataValues.xp >= userDataUp.dataValues.level*5 + 25){
                        await client.database.leveldb.update(
                            { level: userDataUp.dataValues.level + 1, xp: userDataUp.dataValues.xp - userDataUp.dataValues.level*5 - 25 },
                            { where: { name: userId } }
                        );
                        await giveLevelRoles(client, userId)
                    };

                } else {
                    client.database.leveldb.create({
                        name: userId,
                        xp: xpVCs[data.parentId]||3,
                        level: 0,
                        cardColor: "#ffffff"
                    });
                    client.database.voiceBuffer[userId].xpGain += xpVCs[data.parentId]||3
                }
            }
        }, 60000)
    }
}