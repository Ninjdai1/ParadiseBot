const { buttonList } = require('../interactions/buttons/index');
const { selectMenuList } = require('../interactions/selectmenus/index');
const { modalList } = require('../interactions/modals/index');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                try {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                } catch (error){
                    console.error(error);
                }
            }
        } else if (interaction.isButton()) {
            buttonList[interaction.customId.split("_")[0]] ? buttonList[interaction.customId.split("_")[0]].execute(interaction, client) : interaction.reply({ content: "Si vous rencontrez cette erreur, merci de contacter CoolMan#4094 !", ephemeral: true });
        } else if (interaction.isStringSelectMenu()) {
            selectMenuList[interaction.customId.split("_")[0]] ? selectMenuList[interaction.customId.split("_")[0]].execute(interaction, client) : interaction.reply({ content: "Si vous rencontrez cette erreur, merci de contacter CoolMan#4094 !", ephemeral: true });
        } else if (interaction.isModalSubmit()) {
            modalList[interaction.customId.split("_")[0]] ? modalList[interaction.customId.split("_")[0]].execute(interaction, client) : interaction.reply({ content: "Si vous rencontrez cette erreur, merci de contacter CoolMan#4094 !", ephemeral: true });
        }
    }
}