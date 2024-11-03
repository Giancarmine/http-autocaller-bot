import { Bot, Context, webhookCallback } from 'grammy';
import axios from 'axios';

export interface Env {
	BOT_INFO: string;
	BOT_TOKEN: string;
}

async function makeHttpGetRequest(url: string) {
	try {
		const response = await axios.get(url);
		console.log(`HTTP GET request successful. Status: ${response.status}`);
		return response.data;
	} catch (error) {
		console.log('Error making HTTP GET request:', error.message);
		throw error;
	}
}

// Schedule the HTTP GET request every 15 minutes
const scheduleHttpCall = () => {
	const url = 'https://inverso-backend.onrender.com/api/items?populate=*&pagination[pageSize]=5';
	console.log(`HTTP GET request calling: ${url}`);
	makeHttpGetRequest(url).catch((error) => {
		console.error('Failed to make HTTP GET request:', error.message);
	});
};

const intervalId = setInterval(scheduleHttpCall, 15 * 60 * 1000); // Every 15 minutes

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });

		bot.command('start', async (ctx: Context) => {
			await ctx.reply(`${ctx.me.username} started!`);
			await ctx.reply(`The purpose of this bot is to schedule an HTTP call every X minutes`);
			await bot.api.setMyCommands([
				{ command: 'start', description: 'Start the bot' },
				{ command: 'call', description: 'Call inverso strapi backend for test =]' },
				{ command: 'help', description: 'Show help text' },
			]);

			console.log(`@${ctx.me.username} started!`);
		});

		bot.command('help', async (ctx: Context) => {
			await ctx.reply('NO-ONE can help you.');
		});

		bot.command('call', async (ctx: Context) => {
			scheduleHttpCall();
			await ctx.reply('Inverso has been called');
		});

		return webhookCallback(bot, 'cloudflare-mod')(request);
	},
};
