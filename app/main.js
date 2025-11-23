const app = window.Telegram.WebApp;

let cart = [];
let total = 0;

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

function sendOrder(name, price) {
	Toastify({
		text: `${name} - добавлен`,
		duration: 2000,
		destination: "https://github.com/apvarun/toastify-js",
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

	cart.push({ name, price, quantity: 1 });
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
	// app.close();
});
