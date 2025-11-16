require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN must be provided!");

const bot = new Telegraf(BOT_TOKEN);
const WEB_APP_URL = process.env.WEB_APP_URL;

bot.command("start", (ctx) => {
	ctx.reply(
		"Нажмите, чтобы открыть каталог:",
		Markup.inlineKeyboard([
			[Markup.button.webApp("Открыть каталог 🧸", WEB_APP_URL)],
		])
	);
});

// bot.on("web_app_data", (ctx) => {
// 	const rawData = ctx.webAppData.data.toString();
// 	console.log("Данные получены:", rawData);

// 	try {
// 		const order = JSON.parse(rawData);

// 		if (order.action === "checkout" && order.items) {
// 			const totalItems = order.items.length;
// 			ctx.reply(
// 				`✅ Заказ принят! Позиций: ${totalItems}. Сумма: ${order.total} руб.`
// 			);
// 		} else {
// 			ctx.reply("Ошибка: неверный формат заказа.");
// 		}
// 	} catch (e) {
// 		ctx.reply("Произошла ошибка обработки данных.");
// 	}
// });

bot.launch();

console.log("Бот запущен...");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
