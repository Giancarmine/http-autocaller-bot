import { Bot, Context, webhookCallback } from 'grammy';

export interface Env {
	BOT_INFO: string;
	BOT_TOKEN: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });

		bot.command('start', async (ctx: Context) => {
			await ctx.reply(`${ctx.me.username} started!`);
			await ctx.reply(`The purpose of this bot is to schedule an HTTP call every X minutes`);
			await bot.api.setMyCommands([
				{ command: 'start', description: 'Start the bot' },
				{ command: 'help', description: 'Show help text' },
			]);

			console.log(`@${ctx.me.username} started!`);
		});

		bot.command("help", async (ctx: Context) => {
			await ctx.reply("NO-ONE can help you.");
		});

		return webhookCallback(bot, 'cloudflare-mod')(request);
	},
};
