const { xpVCs } = require('../config.json')

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        console.log("Prêt !");
        client.user.setStatus('online');
        setInterval(async ()=>{
            for (let [userId, channelId] of Object.entries(client.database.voiceBuffer)) {
                const userData = await client.database.leveldb.findOne({ where: { name: userId } });

                if(userData){
                    await client.database.leveldb.update(
                        { xp: userData.dataValues.xp + xpVCs[channelId]||5 },
                        { where: { name: userId } }
                    );

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
                        xp: xpVCs[channelId]||5,
                        level: 0,
                        cardColor: "#ffffff"
                    });
                }
            }
        }, 60000)
    }
}