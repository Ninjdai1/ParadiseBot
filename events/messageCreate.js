const { guildId } = require('../config.json');
const { giveLevelRoles } = require('../functions');

module.exports = {
    name: 'messageCreate',
    on: true,
    async execute(message, client) {
        if(message.author.bot) return;
        if(!client.isXPEnabled) return;
        if(message.content=="+luck") {
            const now = Date.now();
            let userData = await client.database.userdb.findOne({ where: { name: message.user.id } });
            if(userData){
                if(now - userData.dataValues.guessCD < 24 * 60 * 60 * 1000) return message.editReply({ content: "Vous avez déjà utilisé la commande dans les dernières 24H !", ephemeral: true });
                else await client.database.userdb.update(
                    { guessCD: now },
                    { where: { name: message.user.id } }
                );
            }
            else{
                await client.database.userdb.create({
                    name: message.user.id,
                    confessBL: false,
                    guessCD: now
                });
            };


            let serverData = await client.database.serverdb.findOne({ where: { name: message.guild.id } });
            if(!serverData){
                await client.database.serverdb.create({
                    name: message.guild.id,
                    guessReward: null,
                    guessNum: null,
                });
                serverData = await client.database.serverdb.findOne({ where: { name: message.guild.id } });
            };

            const guessedNum = Math.floor(Math.random() * 9999);
            const embed = new EmbedBuilder()
            if(serverData.dataValues.guessNum == guessedNum){
                embed
                    .setDescription(
                        `***Voyons voir si tu as de la chance !*** <:emoji_403:1079866988857409656> <@${message.user.id}> \n\n`
                        + `Tu as obtenu **${guessedNum}** !\n\n`
                        + `Tu as obtenu le bon nombre ! Contacte l'équipe pour recevoir ton ${serverData.dataValues.guessReward} !`
                    )
            } else {
                embed
                    .setDescription(
                        `***Voyons voir si tu as de la chance !*** <:emoji_403:1079866988857409656> <@${message.user.id}> \n\n`
                        + `Tu as eu **${guessedNum}** !\n\n`
                        + `*Si tu obtiens le nombre* ***__${serverData.dataValues.guessNum}__*** *tu gagnes un* ***${serverData.dataValues.guessReward}*** <a:P_boost:972371295771701308>`
                    )
            }
            await message.reply({ embeds: [embed] });
        }

        if(message.guildId == guildId) {
            const userData = await client.database.leveldb.findOne({ where: { name: message.author.id } });
            if(userData){
                if(Date.now()-userData.dataValues.updatedAt<60000) return;
                await client.database.leveldb.update(
                    { xp: userData.dataValues.xp + Math.floor(Math.random()*3)+3 },
                    { where: { name: message.author.id } }
                );

                const userDataUp = await client.database.leveldb.findOne({ where: { name: message.author.id } });
                if(userDataUp.dataValues.xp >= userDataUp.dataValues.level*5 + 25){
                    await client.database.leveldb.update(
                        { level: userDataUp.dataValues.level + 1, xp: userDataUp.dataValues.xp - userDataUp.dataValues.level*13 - 25 },
                        { where: { name: message.author.id } }
                    );
                    await message.reply({ content: `Bravo **${message.author.tag}**, tu es désormais niveau ${userDataUp.dataValues.level + 1}` });
                    await giveLevelRoles(client, message.author.id);
                };

            } else {
                await client.database.leveldb.create({
                    name: message.author.id,
                    xp: 5,
                    level: 0,
                    cardColor: "#ffffff"
                });
            }
        }
    }
}