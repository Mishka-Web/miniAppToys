const app = window.Telegram.WebApp;

let cart = [];
let total = 0;

// const items = [
// 	{
// 		title: "Лампа Закат",
// 		price: 1990,
// 		photo: "https://dev-richer.ru/telegram-bot/assets/img/products/other/image-5.png",
// 		actions: ["Купить", "Подробнее"],
// 	},
// 	{
// 		title: "Проектор Звёзд",
// 		price: 2590,
// 		photo: "https://dev-richer.ru/telegram-bot/assets/img/products/other/image-6.png",
// 		actions: ["Купить", "Удалить"],
// 	},
// 	{
// 		title: "Ночник Луна",
// 		price: 1490,
// 		photo: "https://dev-richer.ru/telegram-bot/assets/img/products/other/image-7.png",
// 		actions: ["Купить"],
// 	},
// 	{
// 		title: "Светильник Облако",
// 		price: 1790,
// 		photo: "https://dev-richer.ru/telegram-bot/assets/img/products/other/image-8.png",
// 		actions: ["Купить", "Подробнее"],
// 	},
// ];

// const catalog = document.getElementById("catalog");

// items.forEach((item) => {
// 	const card = document.createElement("div");
// 	card.className = "card";
// 	card.dataset.parallax = (Math.random() * 0.08 + 0.03).toFixed(2); // скорость движения

// 	card.innerHTML = `
//     <img src="${item.photo}" />
//     <div class="title">${item.title}</div>
//     <div class="price">${item.price} ₽</div>
//     <div class="actions">
//       ${item.actions.map((a) => `<div class="action">${a}</div>`).join("")}
//     </div>
//   `;
// 	catalog.appendChild(card);
// });

const sliders = document.querySelectorAll(".swiper");

sliders.forEach((swiper) => {
	new Swiper(swiper, {
		slidesPerView: 1,
		spaceBetween: 10,
		speed: 750,
	});
});

(function () {
	const themeTokens = {
		light: {
			"--c-bg": "#ffffff",
			"--c-bg-secondary": "#f6f6f7",
			"--c-text": "#111111",
			"--c-text-secondary": "#6b6b6c",
			// "--c-accent": "#ff7795",
			"--c-accent": "#FABEC2",
			"--c-border": "#e5e5e5",
			"--linear-gradient":
				"linear-gradient(63deg, #FABEC2 0%, #FFDFE3 100%)",
			"--transition": "all 0.3s ease-in-out",
			"--c-card-image-color": "#fdfcf9",
			"--c-card-image-bg": "url('./assets/img/bg-light.png?v=1')",
			"--c-card-btn-order-bg": "var(--linear-gradient)",
			"--c-card-btn-order-text": " #ffffff",
			"--c-card-shadow": "0px 4.57px 54.85px 0 rgba(197, 197, 197, 0.25)",
			"--c-card-bg": "#ffffff",
			"--c-card-text": " #111111",

			"--c-card-decor-1-url": "url('./assets/img/decor-1-light.png?v=1')",
			"--c-card-decor-2-url": "url('./assets/img/decor-2-light.png?v=1')",
		},
		dark: {
			"--c-bg": "#0d0d0f",
			"--c-bg-secondary": "#161618",
			"--c-text": "#f1f1f2",
			"--c-text-secondary": "#a1a1a3",
			"--c-accent": "#981D36",
			"--c-border": "#2a2a2d",
			"--linear-gradient":
				"linear-gradient(63deg, #981D36 0%, #371317 100%)",
			"--transition": "all 0.3s ease-in-out",
			"--c-card-image-color": "#0d0d0f8c",
			"--c-card-image-bg": "url('./assets/img/bg.png?v=1')",
			"--c-card-btn-order-bg": "var(--linear-gradient)",
			"--c-card-btn-order-text": " #ffffff",
			"--c-card-shadow": "none",
			"--c-card-bg": "#1F1F1F",
			"--c-card-text": " #FFFFFF",

			"--c-card-decor-1-url": "url('./assets/img/decor-1.png?v=1')",
			"--c-card-decor-2-url": "url('./assets/img/decor-2.png?v=1')",
		},
	};

	function applyTheme() {
		const isDark = app.colorScheme === "dark";
		const tokens = isDark ? themeTokens.light : themeTokens.light;

		document.documentElement.classList.toggle("dark", isDark);

		for (const key in tokens) {
			document.documentElement.style.setProperty(key, tokens[key]);
		}
	}

	if (app.onEvent) {
		app.onEvent("themeChanged", applyTheme);
	} else {
		app.onThemeChanged = applyTheme;
	}

	applyTheme();
})();

app.ready();

const checkoutBtn = document.getElementById("checkout");
checkoutBtn.style.display = "none";

app.MainButton.text = "ОФОРМИТЬ ЗАКАЗ (0 руб.)";
app.MainButton.show();

function updateCart() {
	total = cart.reduce((sum, item) => sum + item.price, 0);
	app.MainButton.setText(`ОФОРМИТЬ ЗАКАЗ (${total} руб.)`);

	if (cart.length > 0) {
		app.MainButton.show();
	} else {
		app.MainButton.hide();
	}
}

function sendOrder(name, price, imageUrl) {
	Toastify({
		text: `${name} - добавлен`,
		duration: 2000,
		newWindow: true,
		gravity: "top",
		position: "center",
		stopOnFocus: true,
		style: {
			background: "var(--linear-gradient)",
			boxShadow: "0px 7px 24px 0 rgba(255, 255, 255, 0.05)",
			fontSize: "14px",
			padding: "10px 18px",
		},
		onClick: function () {},
	}).showToast();

	cart.push({ name, price, imageUrl, quantity: 1 });
	app.HapticFeedback.notificationOccurred("success");
	updateCart();
}

app.MainButton.onClick(() => {
	if (cart.length === 0) return;

	const orderData = {
		action: "checkout",
		total: total,
		items: cart,
	};

	app.sendData(JSON.stringify(orderData));
	app.close();
});
