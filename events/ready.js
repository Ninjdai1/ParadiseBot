const { xpVCs, guildId } = require('../config.json')
const { giveLevelRoles } = require('../functions')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log("Prêt !");
        client.user.setStatus('online');
        let serverData = await client.database.serverdb.findOne({ where: { name: guildId } });
        client.isXPEnabled = serverData?.dataValues?.xp || true;
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
                            { level: userDataUp.dataValues.level + 1, xp: userDataUp.dataValues.xp - userDataUp.dataValues.level*13 - 25 },
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
        setInterval(async ()=>{
            client.database.top = [];
            const top1000 = await client.database.leveldb.findAll({ 
                limit: 1000 ,
                order: [['level','DESC'],
                        ['xp', 'DESC']]
            });
            top1000.forEach(element => {
                client.database.top.append(element.dataValues.name);
            });
        }, 600000)
    }
}