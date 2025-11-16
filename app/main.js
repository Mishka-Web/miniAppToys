const app = window.Telegram.WebApp;
let cart = [];
let total = 0;

app.ready();

const checkoutBtn = document.getElementById("checkout");
checkoutBtn.style.display = "none"; 

app.MainButton.text = "ОФОРМИТЬ ЗАКАЗ (0 руб.)";
app.MainButton.show();

function updateCart() {
	total = cart.reduce((sum, item) => sum + item.price, 0);
	document.getElementById(
		"status"
	).innerText = `Корзина: ${cart.length} товаров`;
	app.MainButton.setText(`ОФОРМИТЬ ЗАКАЗ (${total} руб.)`);

	if (cart.length > 0) {
		app.MainButton.show();
	} else {
		app.MainButton.hide();
	}
}

function addToCart(name, price) {
	cart.push({ name, price, quantity: 1 });
	app.HapticFeedback.notificationOccurred("success");
	updateCart();
}

// --- Действие при нажатии Главной кнопки ---
app.MainButton.onClick(() => {
	if (cart.length === 0) return;

	const orderData = {
		action: "checkout",
		total: total,
		items: cart, // Отправляем массив товаров
	};

	// ОТПРАВКА ДАННЫХ В TELEGRAF
	app.sendData(JSON.stringify(orderData));

	app.close(); // Закрываем TWA после отправки
});
