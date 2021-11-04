const { MessageEmbed, MessageButton, MessageActionRow, Message } = require("discord.js");
const BaseEvent = require("../classes/Event.js");
const Bot = require("../classes/Bot.js")

module.exports = class extends BaseEvent {
    constructor() {
        super('messageCreate');
    };

    /**
     * @param {Message} msg
     * @param {Bot} client 
     */

    async run(client, msg) {
        if(!msg.channel.name.startsWith("ttv") || msg.author.bot) return;

        let logChannel = client.channels.cache.get("857998864296312903") || await client.channels.fetch("857998864296312903").catch(client.Logger.error);
        if(!logChannel) return;

        let logEmbed = new MessageEmbed()
            .setColor("PURPLE")
            .setURL(msg.url)
            .setTimestamp()
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true }))
            .setDescription(msg.content);

        let i = 1;
        msg.attachments.forEach(att => {
            logEmbed.addField("Anhang "+i, att.url, true);
            i++;
        });

        logChannel.send({ embeds: [ logEmbed ]});
    };
};