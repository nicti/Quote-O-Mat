import {Client, GatewayIntentBits, ChannelType, TextChannel} from "discord.js";
import { config } from 'dotenv-flow'

config()

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', async (message) => {
    let ids = [...message.content.matchAll(/https:\/\/discordapp\.com\/channels\/([0-9]*)\/([0-9]*)\/([0-9]*)/gm)][0]
    // 0 => full group, 1 => guildId, 2=> channelId, 3 => messageId
    if (ids !== undefined && ids.length !== undefined && ids.length === 4) {
        try {
            let guild = await client.guilds.resolve(ids[1])
            if (guild === null) return
            let channel: TextChannel = await guild.channels.resolve(ids[2]) as TextChannel
            if (channel === null || !channel.isTextBased()) return
            // @ts-ignore
            let linkedMessage = await channel.messages.fetch(ids[3])
            if (linkedMessage === null) return
            await message.reply({
                content: `**${linkedMessage.author.username}#${linkedMessage.author.discriminator}** said:\n${linkedMessage.content}`,
                embeds: linkedMessage.embeds
            })
            let a = 'b'
        } catch (e: any) {
            if (typeof e.status !== "undefined" && e.status === 403) {
                return
            } else {
                console.log(e.message)
                return
            }
        }
    }
});

client.login(process.env.BOT_TOKEN)