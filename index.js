"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_flow_1 = require("dotenv-flow");
dotenv_flow_1.config();
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent] });
client.on('ready', () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
});
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    let ids = [...message.content.matchAll(/https:\/\/discordapp\.com\/channels\/([0-9]*)\/([0-9]*)\/([0-9]*)/gm)][0];
    // 0 => full group, 1 => guildId, 2=> channelId, 3 => messageId
    if (ids !== undefined && ids.length !== undefined && ids.length === 4) {
        try {
            let guild = yield client.guilds.resolve(ids[1]);
            if (guild === null)
                return;
            let channel = yield guild.channels.resolve(ids[2]);
            if (channel === null || !channel.isTextBased())
                return;
            // @ts-ignore
            let linkedMessage = yield channel.messages.fetch(ids[3]);
            if (linkedMessage === null)
                return;
            yield message.reply({
                content: `**${linkedMessage.author.username}#${linkedMessage.author.discriminator}** said:\n${linkedMessage.content}`,
                embeds: linkedMessage.embeds
            });
            let a = 'b';
        }
        catch (e) {
            if (typeof e.status !== "undefined" && e.status === 403) {
                return;
            }
            else {
                console.log(e.message);
                return;
            }
        }
    }
}));
client.login(process.env.BOT_TOKEN);
