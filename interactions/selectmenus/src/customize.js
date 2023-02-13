module.exports = {
    async execute(interaction, client) {
        const userData = await client.database.leveldb.findOne({ where: { name: interaction.user.id } });
        if(userData){
            await client.database.leveldb.update(
                { cardColor: interaction.values[0] },
                { where: { name: interaction.user.id } }
            );

        } else {
            await client.database.leveldb.create({
                name: interaction.user.id,
                xp: 0,
                level: 0,
                cardColor: interaction.values[0]
            });
        }
        await interaction.update({ content: "La couleur de votre carte a bien été changée !\nVous pouvez consulter le résultat via /rank !" });
    }
}