import {Client, GatewayIntentBits, ChannelType, TextChannel} from "discord.js";
import { config } from 'dotenv-flow'

config()

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', async (message) => {
    let ids = [...message.content.matchAll(/https:\/\/(discordapp|discord)\.com\/channels\/([0-9]*)\/([0-9]*)\/([0-9]*)/gm)][0]
    // 0 => full group, 1 => discord, 2 => guildId, 3=> channelId, 4 => messageId
    if (ids !== undefined && ids.length !== undefined && ids.length === 5) {
        try {
            let guild = await client.guilds.resolve(ids[2])
            if (guild === null) return
            let channel: TextChannel = await guild.channels.resolve(ids[3]) as TextChannel
            if (channel === null || !channel.isTextBased()) return
            // @ts-ignore
            let linkedMessage = await channel.messages.fetch(ids[4])
            if (linkedMessage === null) return
            if (linkedMessage.author.id === client.user?.id) {
                await message.reply("I can't quote myself quoting, just link the original quote!")
                return
            }
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