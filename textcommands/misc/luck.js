const { EmbedBuilder } = require("discord.js");

module.exports = {
	data: {
    name: "luck"
  }

	async execute(message, client) {
        const now = Date.now();
        let userData = await client.database.userdb.findOne({ where: { name: message.author.id } });
        if(userData){
            if(now - userData.dataValues.guessCD < 24 * 60 * 60 * 1000) return message.reply({ content: "Vous avez déjà utilisé la commande dans les dernières 24H !"});
            else await client.database.userdb.update(
                { guessCD: now },
                { where: { name: message.author.id } }
            );
        }
        else{
            await client.database.userdb.create({
                name: message.author.id,
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
                    `***Voyons voir si tu as de la chance !*** <:emoji_403:1079866988857409656> <@${message.author.id}> \n\n`
                    + `Tu as obtenu **${guessedNum}** !\n\n`
                    + `Tu as obtenu le bon nombre ! Contacte l'équipe pour recevoir ton ${serverData.dataValues.guessReward} !`
                )
        } else {
            embed
                .setDescription(
                    `***Voyons voir si tu as de la chance !*** <:emoji_403:1079866988857409656> <@${message.author.id}> \n\n`
                    + `Tu as eu **${guessedNum}** !\n\n`
                    + `*Si tu obtiens le nombre* ***__${serverData.dataValues.guessNum}__*** *tu gagnes un* ***${serverData.dataValues.guessReward}*** <a:P_boost:972371295771701308>`
                )
        }
        await message.reply({ embeds: [embed] });
    }
};
