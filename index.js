require("dotenv").config();

const generateCollage = require("./app/collage");

const fs = require("fs");
const Handlebars = require("handlebars");
const nodeHtmlToImage = require("node-html-to-image");

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
			Markup.button.webApp("Открыть каталог 🧸", WEB_APP_URL),
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

// bot.on("web_app_data", async (ctx) => {
// 	try {
// 		const data = JSON.parse(ctx.message.web_app_data.data);
// 		const user = ctx.from;

// 		// Данные из Mini App
// 		const items = data.items;
// 		const total = data.total;

// 		const contactLink = user.username
// 			? `https://t.me/${user.username}`
// 			: `tg://user?id=${user.id}`;

// 		// Отправляем продавцу
// 		await ctx.telegram.sendMessage(
// 			SELLER_ID,
// 			`<b>🛒 Новая заявка!</b>

// 👤 Клиент: @${user.username || "нет username"}
// 🆔 ID: ${user.id}

// 🧸 Все товары:
// ${items.map((item) => `(${item.quantity}) ${item.name} - <b>${item.price} руб.</b>`).join("\n")}
// 💵 Общая стоимость: <b>${total} руб.</b>

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

// bot.on("web_app_data", async (ctx) => {
// 	const data = JSON.parse(ctx.message.web_app_data.data);
// 	const user = ctx.from;
// 	const contactLink = user.username
// 		? `https://t.me/${user.username}`
// 		: `tg://user?id=${user.id}`;

// 	const { items, total } = data;

// 	// Отправляем продавцу
// 	await ctx.telegram.sendMessage(
// 		SELLER_ID,
// 		// `<b>🛒 Новая заявка!</b>
// // 👤 Клиент: @${user.username || "нет username"}
// 		`<b>Заявка от @${user.username || "нет username"}</b>
// 🆔 ID: ${user.id}

// 🧸 Все товары:
// ${items
// 	.map(
// 		(item) => `${item.name} - <b>${item.price} руб.</b>`
// 	)
// 	.join("\n")}
// 💵 Общая стоимость: <b>${total} руб.</b>

// 💬 Приветствие:
// "Здравствуйте! Клиент интересуется этой игрушкой."`,
// 		{
// 			parse_mode: "HTML",
// 			reply_markup: Markup.inlineKeyboard([
// 				[Markup.button.url("Написать клиенту", contactLink)],
// 			]),
// 		}
// 	);

// 	// Формируем текст чека
// 	let text = `🧾 <b>Ваш чек</b>\n\n`;

// 	items.forEach((item) => {
// 		text +=
// 			`🧸 <b>${item.name}</b>\n` +
// 			`💰 Цена: ${item.price} ₽\n` +
// 			// `🔢 Кол-во: ${item.quantity}\n` +
// 			`— — — — — — — — — — —\n`;
// 	});

// 	text += `\n💳 <b>Итого: ${total} ₽</b>`;

// 	const collageBuffer = await generateCollage(items);

// 	// Отправляем первое фото (preview)
// 	await ctx.replyWithPhoto(
// 		{ source: collageBuffer },
// 		{
// 			caption: text,
// 			parse_mode: "HTML",
// 		}
// 	);
// });

bot.on("web_app_data", async (ctx) => {
	const data = JSON.parse(ctx.message.web_app_data.data);
	const user = ctx.from;
	const contactLink = user.username
		? `https://t.me/${user.username}`
		: `tg://user?id=${user.id}`;

	const { items, total } = data;

	// Отправляем продавцу
	await ctx.telegram.sendMessage(
		SELLER_ID,
		// `<b>🛒 Новая заявка!</b>
		// 👤 Клиент: @${user.username || "нет username"}
		`<b>Заявка от @${user.username || "нет username"}</b>
🆔 ID: ${user.id}

🧸 Все товары:
${items.map((item) => `${item.name} - <b>${item.price} руб.</b>`).join("\n")}
💵 Общая стоимость: <b>${total} руб.</b>

💬 Приветствие:
"Здравствуйте! Клиент интересуется этой игрушкой."`,
		{
			parse_mode: "HTML",
			reply_markup: Markup.inlineKeyboard([
				[Markup.button.url("Написать клиенту", contactLink)],
			]),
		}
	);

	try {
		const data = JSON.parse(ctx.message.web_app_data.data);

		const template = fs.readFileSync("./app/catalogTemplate.html", "utf8");
		const compile = Handlebars.compile(template);
		const html = compile(data);

		const imageBuffer = await nodeHtmlToImage({
			html,
			puppeteerArgs: { args: ["--no-sandbox"] },
			type: "png",
			quality: 75,
		});

		await ctx.replyWithPhoto(
			{ source: imageBuffer },
			{
				caption: `🛒 Ваш заказ (${data.items.length} товаров)`,
			}
		);
	} catch (err) {
		console.error(err);
		ctx.reply("Ошибка при рендере X-UI каталога");
	}
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
