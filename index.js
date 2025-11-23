require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

const SELLER_ID = process.env.SELLER_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN must be provided!");

const bot = new Telegraf(BOT_TOKEN);
const WEB_APP_URL = process.env.WEB_APP_URL;

bot.command("start", (ctx) => {
	ctx.reply(
		"Выберите действие:",
		Markup.keyboard([
			Markup.button.webApp("Открыть каталог 🧸", WEB_APP_URL)
		]).resize()
	);
});

bot.command("web", (ctx) => {
	ctx.replyWithMarkdownV2("Наш оригинальный [сайт](https://dev-richer.ru)");
});

bot.command("id", (ctx) => {
	ctx.reply(`Ваш Telegram ID: ${ctx.from.id}`);
});

// bot.hears("Написать продавцу 📨", (ctx) => {
// 	ctx.replyWithPhoto(
// 		{ url: "./app/assets/img/user/" },
// 		{
// 			caption: `🧑‍💼 Продавец: Иван Иванов\n📱 Телефон: +7 999 123-45-67\n🌐 Telegram: [@username_pravovogo](https://t.me/username_pravovogo)\n💬 Работаем с 10:00 до 20:00`,
// 			parse_mode: "Markdown",
// 		}
// 	);
// });

bot.on("web_app_data", async (ctx) => {
	try {
		const data = JSON.parse(ctx.message.web_app_data.data);
		const user = ctx.from;

		// Данные из Mini App
		const toyName = data.toyName;
		const price = data.price;

		const contactLink = user.username
			? `https://t.me/${user.username}`
			: `tg://user?id=${user.id}`;

		// Отправляем продавцу
		await ctx.telegram.sendMessage(
			SELLER_ID,
			`<b>🛒 Новая заявка!</b>
👤 Клиент: @${user.username || "нет username"}
🆔 ID: ${user.id}

🎁 Товар: <b>${toyName}</b>
💵 Цена: <b>${price}</b>

💬 Приветствие:
"Здравствуйте! Клиент интересуется этой игрушкой."`,
			{
				parse_mode: "HTML",
				reply_markup: Markup.inlineKeyboard([
					[Markup.button.url("Написать клиенту", contactLink)],
				]),
			}
		);

		// Ответ клиенту
		await ctx.reply(
			"Вы подключены к продавцу! Он скоро с вами свяжется 👌"
		);
	} catch (err) {
		console.error(err);
	}
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
