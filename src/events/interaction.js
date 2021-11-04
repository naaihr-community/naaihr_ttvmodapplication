const { MessageEmbed, MessageSelectMenu, MessageActionRow, CommandInteraction, AutocompleteInteraction, ButtonInteraction, MessageButton, Message } = require("discord.js");
const BaseEvent = require("../classes/Event.js");
const Bot = require("../classes/Bot.js");
const BaseCommand = require("../classes/Command.js");

module.exports = class extends BaseEvent {
    constructor() {
        super('interactionCreate');
    };

    /**
     * 
     * @param {Bot} client 
     * @param {ButtonInteraction} interaction 
     */

    async run(client, interaction) {
        if(interaction.isButton()) {
            if(interaction.customId === "ttvapp") {
                let userId = interaction.user.id;
                let username = interaction.user.username;
                let userApp = await client.schemas.ttvapp.findOne({ user: userId, status: "open" });
                if(userApp) return await interaction.reply({ ephemeral: true, content: `Du bist bereits in einer Bewerbung. <#${userApp.channel}>`});

                let guild = interaction.guild;
                guild.channels.create(`ttv-${username}`, {
                    type: "GUILD_TEXT",
                    permissionOverwrites: [{ 
                        id: "699742801939922966",
                        deny: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                    },{
                        id: "801773138459361351",
                        deny: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                    },{
                        id: guild.roles.everyone,
                        deny: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                    },{
                        id: interaction.member,
                        type: "member",
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "READ_MESSAGE_HISTORY", "EMBED_LINKS"]
                    }],
                    parent: "905891878677925928"
                }).then(async channel => {
                    let appRow = new MessageActionRow()
                        .addComponents([
                            new MessageButton()
                                .setStyle("DANGER")
                                .setEmoji("❌")
                                .setLabel("Abbrechen")
                                .setCustomId("exit")
                        ]);

                    channel.send({ components: [ appRow ], content: `<@!${userId}>`, embeds: [ new MessageEmbed()
                        .setColor("PURPLE")
                        .setTitle("🎫 Twitch Mod Bewerbung")
                        .setDescription("Bitte schreibe in diesen Kanal jetzt deine Bewerbung.\nBitte denke daran, deinen Twitch Username anzugeben.")
                        .setFooter("Bitte gedulde dich, bis du eine Antwort bekommst. Dieser Prozess kann mehrere Wochen dauern.")
                    ]}).catch(client.Logger.error);

                    let appDb = new client.schemas.ttvapp({
                        user: userId,
                        channel: channel.id
                    });
                    await appDb.save();

                    return await interaction.reply({ ephemeral: true, content: `Bitte schreibe deine Bewerbung jetzt in <#${channel.id}>!`});
                }).catch(client.Logger.error);

            } else if(interaction.customId === "exit") {
                let channelId = interaction.channel.id;
                let userId = interaction.user.id;
                let appDb = await client.schemas.ttvapp.findOne({ user: userId, channel: channelId });
                if(!appDb || appDb.user != userId) return await interaction.deferUpdate();

                appDb.status = "closed";

                await appDb.save();

                await interaction.reply({ content: ":x: Deine Bewerbung wurde abgebrochen."});

                return await interaction.channel.delete("App Closed");
            };
        };
    };
};