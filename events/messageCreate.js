const { guildId } = require('../config.json')

module.exports = {
    name: 'messageCreate',
    on: true,
    async execute(message, client) {
        if(message.author.bot) return;
        if(message.guildId == guildId) {
            const userData = await client.database.leveldb.findOne({ where: { name: message.author.id } });
            if(userData){
                if(Date.now()-userData.dataValues.updatedAt<60000) return console.log(Date.now()-userData.dataValues.updatedAt);
                console.log(userData)
                await client.database.leveldb.update(
                    { xp: userData.dataValues.xp + Math.floor(Math.random()*3)+3 },
                    { where: { name: message.author.id } }
                );

                const userDataUp = await client.database.leveldb.findOne({ where: { name: message.author.id } });
                if(userDataUp.dataValues.xp >= userDataUp.dataValues.level*5 + 25){
                    await client.database.leveldb.update(
                        { level: userDataUp.dataValues.level + 1, xp: userDataUp.dataValues.xp - userDataUp.dataValues.level*5 - 25 },
                        { where: { name: message.author.id } }
                    );
                    await message.reply({ content: `Bravo **${message.author.tag}**, tu es désormais niveau ${userDataUp.dataValues.level + 1}` });
                };

            } else {
                await client.database.leveldb.create({
                    name: message.author.id,
                    xp: 5,
                    level: 0
                });
            }
        }
    }
}