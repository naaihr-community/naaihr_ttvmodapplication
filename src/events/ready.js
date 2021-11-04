const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const BaseEvent = require("../classes/Event.js");
const Bot = require("../classes/Bot.js")

module.exports = class extends BaseEvent {
    constructor() {
        super('ready');
    };

    /**
     * 
     * @param {Bot} client 
     */

    async run(client) {
        client.Logger.info(`Logged in at ${new Date().toLocaleString().replace(",","")} as ${client.user.tag} [${client.user.id}]`, "CLIENT");

        client.commands.forEach(command => {
            command.initialize("699742385919229963");
        });

        let applyChannel = client.channels.cache.get(client.config.applyChannel)
        let appRow = new MessageActionRow()
            .addComponents([ new MessageButton()
                .setCustomId("ttvapp")
                .setStyle("PRIMARY")
                .setLabel("TTV Mod Bewerbung")
                .setEmoji("🎫")
            ]);

        applyChannel.send({ components: [ appRow ], embeds: [ new MessageEmbed()
            .setColor("PURPLE")
            .setDescription("Klicke unten auf den Button, um dich als Twitch Mod zu bewerben.\nSende deine Bewerbung anschließend in den neu erstellen Kanal.\nBitte gebe alle relevanten Informationen wie Username & Watchtime an.")
        ]});
    };
};