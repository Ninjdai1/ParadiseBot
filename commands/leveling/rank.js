const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Illustrator, IllustratorImage, ImageLoader } = require("illustrator.js");
const fs = require('fs');
const { devId } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Afficher votre level.')
        .addUserOption(
            option =>  option
                .setName('member')
                .setDescription('Utilisateur')
                .setRequired(false)
        ),

	async execute(interaction, client) {
        await interaction.deferReply();
        const member = interaction.options.getMember('member') || interaction.member;
        let userLevelData = await client.database.leveldb.findOne({ where: { name: member.id } });
        if(!userLevelData){
            await client.database.leveldb.create({
                name: member.id,
                xp: 0,
                level: 0,
                cardColor: "#f8ddbf"
            });
            userLevelData = await client.database.leveldb.findOne({ where: { name: member.id } });
        };
        const top200 = await client.database.leveldb.findAll({ 
            limit: 200 ,
            order: [['level','DESC'],
                    ['xp', 'DESC']]
        });
        console.log(top200)

        let rank = -1
        if(top200.includes(userLevelData)){
            rank = top200.indexOf(userData)+1;
        };
        generateRankCard(member, userLevelData, rank)
            .then(data => {
                interaction.editReply({ files: [data]});
            });
	},
};

async function generateRankCard(member, userLevelData, rank){
    const config = {
        width: 2048,
        height: 512,
        cardColor: userLevelData.dataValues.cardColor,
        backgroundImage: "default.png",
        avatar: member.user.displayAvatarURL({ dynamic: false, format: 'png' }),
        username: member.user.username,
        font: {
            path: "./MANROPE_BOLD.ttf",
            name: "MANROPE_BOLD"
        },
        rank: rank,
        level: userLevelData.dataValues.level,
        currentXp: userLevelData.dataValues.xp,
        requiredXp: userLevelData.dataValues.level*13 + 25
    };
    if (fs.existsSync(`customization/${member.id}.png`) && (member.premiumSince || member.permissions.has(PermissionFlagsBits.Administrator) || member.id==devId)) {
        config.backgroundImage = `customization/${member.id}.png`;
    };

    const formatNumber = (n) => new Intl.NumberFormat("en", { notation: "compact" }).format(n);

    const illustrator = new Illustrator(config.width, config.height);

    // background
    const img = await ImageLoader.loadImage(config.backgroundImage, true);
    const image = new IllustratorImage(img);

    const bg = await image.resize(config.width).crop(0, 200, config.width, 712).png();
    const background = await ImageLoader.loadImage(bg);

    const layer = illustrator.backgroundLayer.unlock();
    const itool = layer.tools.get("ImageTool");

    itool.drawRounded(background, 0, 0, config.width, config.height, 30);
    itool.render();

    const textL = illustrator.layers.createLayer({
        name: "text"
    });

    const xp = config.currentXp > config.requiredXp ? config.requiredXp : config.currentXp;
    const barWidth = (xp / config.requiredXp) * 1413;
    const perc = (xp / config.requiredXp) * 100;

    let textTool = textL.tools.get("TextTool");
    textTool.registerFontPath("./MANROPE_BOLD.ttf", "MANROPE_BOLD");

    textTool
        .setColor(config.cardColor)
        .setFont("MANROPE_BOLD", "85px")
        .writeText(config.username, 485, illustrator.height / 2 - 25)
    if(config.rank!=-1) textTool
        .setColor("#A7A7A7")
        .setFont("MANROPE_BOLD", "40px")
        .writeText(`RANK:`, 500, illustrator.height / 2 + 120)
        .setColor(config.cardColor)
        .writeText(`#${config.rank}`, 500 + 130, illustrator.height / 2 + 120)
    
    textTool.setColor("#A7A7A7")
        .setFont("MANROPE_BOLD", "40px")
        .writeText(`LEVEL:`, 500 + 265, illustrator.height / 2 + 120)
        .setColor(config.cardColor)
        .writeText(`${config.level}`, 500 + 430, illustrator.height / 2 + 120)
        .render();

    const xpText = illustrator.layers.createLayer({
        name: "XP"
    });

    let textToolXP = xpText.tools.get("TextTool");

    textToolXP.registerFontPath("MANROPE_BOLD", "MANROPE_BOLD");
    textToolXP
        .setColor("#A7A7A7")
        .setFont("MANROPE_BOLD", "40px")
        .writeText(`XP:`, 1060, illustrator.height / 2 + 120)
        .setColor(config.cardColor)
        .setFont("MANROPE_BOLD", "40px")
        .writeText(
            `${formatNumber(config.currentXp)}/${formatNumber(config.requiredXp)}`,
            1140,
            illustrator.height / 2 + 120
        )
        .setFont("MANROPE_BOLD", "50px")
        .setColor(config.cardColor)
        .writeText(`${perc.toFixed(2)}%`, illustrator.width - 330, illustrator.height / 2 + 15)
        .render();

    const progressLayer = illustrator.layers.createLayer({
        name: "progress bar"
    });

    const rectTool = progressLayer.tools.get("RectangleTool");
    rectTool.drawRounded({ x: 475, y: illustrator.height / 2 + 25, width: 1413, height: 50, radius: 50 });
    rectTool.setFillColor("#292929");//Empty bar color
    rectTool.fill();
    rectTool.drawRounded({ x: 475, y: illustrator.height / 2 + 25, width: barWidth, height: 50, radius: 50 });
    rectTool.setFillColor(config.cardColor);//Filled bar color
    rectTool.fill();
    rectTool.render();

    const avatarLayer = illustrator.layers.createLayer({
        name: "avatar"
    });

    let rectangleTool = avatarLayer.tools.get("RectangleTool");
    rectangleTool.setFillColor("#19151970");//2f3136
    rectangleTool.fill();
    rectangleTool.drawRounded({ x: 50, y: 50, width: 1948, height: 412, radius: 15 });
    rectangleTool.render();

    let aImgTool = avatarLayer.tools.get("ImageTool");
    let avatar = await ImageLoader.loadImage(config.avatar);
    aImgTool.draw(avatar, 100, 100, 312, 312, true);
    aImgTool.render();

    await illustrator.render();

    const output = await illustrator.export({ encoding: "png" });
    return output
}