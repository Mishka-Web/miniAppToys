require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

// const SELLER_ID = process.env.SELLER_ID;
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

// bot.command("start", (ctx) => {
// 	return ctx.reply(
// 		"Выберите действие:",
// 		Markup.inlineKeyboard([
// 			[Markup.button.callback("Купить игрушку 🧸", "buy_toy")],
// 		])
// 	);
// });

bot.command("id", (ctx) => {
	ctx.reply(`Ваш Telegram ID: ${ctx.from.id}`);
});

// bot.action("buy_toy", async (ctx) => {
// 	await ctx.answerCbQuery();

// 	const user = ctx.from;

// 	const toyName = "Мягкая игрушка Лисёнок";
// 	const price = "1500 ₽";

// 	// Сообщение продавцу
// 	await ctx.telegram.sendMessage(
// 		SELLER_ID,
// 		`<b>🛒 Новая заявка!</b>

// 👤 Клиент: @${user.username || "нет username"}
// 🆔 ID: ${user.id}

// 🎁 Товар: <b>Мягкая игрушка Лисёнок</b>
// 💵 Цена: <b>1500 ₽</b>

// 💬 Приветствие:
// "Здравствуйте! Клиент интересуется этой игрушкой."`,
// 		{
// 			parse_mode: "HTML",
// 			reply_markup: Markup.inlineKeyboard([
// 				[
// 					Markup.button.url(
// 						"Написать клиенту",
// 						`https://t.me/${user.username}`
// 					),
// 				],
// 			]),
// 		}
// 	);

// 	// Ответ клиенту
// 	await ctx.reply(`Вы подключены к продавцу!\nОн скоро с вами свяжется 👌`);
// });

// bot.on("web_app_data", async (ctx) => {
// 	try {
// 		const data = JSON.parse(ctx.message.web_app_data.data);
// 		const user = ctx.from;

// 		// Данные из Mini App
// 		const toyName = data.toyName;
// 		const price = data.price;

// 		const contactLink = user.username
// 			? `https://t.me/${user.username}`
// 			: `tg://user?id=${user.id}`;

// 		// Отправляем продавцу
// 		await ctx.telegram.sendMessage(
// 			SELLER_ID,
// 			`<b>🛒 Новая заявка!</b>

// 👤 Клиент: @${user.username || "нет username"}
// 🆔 ID: ${user.id}

// 🎁 Товар: <b>${toyName}</b>
// 💵 Цена: <b>${price}</b>

// 💬 Приветствие:
// "Здравствуйте! Клиент интересуется этой игрушкой."`,
// 			{
// 				parse_mode: "HTML",
// 				reply_markup: Markup.inlineKeyboard([
// 					[Markup.button.url("Написать клиенту", contactLink)],
// 				]),
// 			}
// 		);

// 		// Ответ клиенту
// 		await ctx.reply(
// 			"Вы подключены к продавцу! Он скоро с вами свяжется 👌"
// 		);
// 	} catch (err) {
// 		console.error(err);
// 	}
// });

// bot.action('web_app_data', async (ctx) => {
//   console.log('Данные из Mini App:', ctx.message.web_app_data.data);
//   await ctx.reply('Бот получил данные!');
// });

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
