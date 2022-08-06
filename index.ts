import {Client, GatewayIntentBits} from "discord.js";

const client = new Client({intents: [GatewayIntentBits.GuildMessages]});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    let ids = [message.content.matchAll(/https:\/\/discordapp\.com\/channels\/([0-9]*)\/([0-9]*)\/([0-9]*)/gm)]
    if (ids.length === 3) {

    }
})