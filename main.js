const tg = window.Telegram.WebApp;
let cart = [];
let total = 0;

// --- Инициализация TWA ---
tg.ready();

// Показываем Главную кнопку (вместо обычной кнопки Оформить заказ)
const checkoutBtn = document.getElementById("checkout");
checkoutBtn.style.display = "none"; // Скрываем HTML кнопку

tg.MainButton.text = "ОФОРМИТЬ ЗАКАЗ (0 руб.)";
tg.MainButton.show();

function updateCart() {
	total = cart.reduce((sum, item) => sum + item.price, 0);
	document.getElementById(
		"status"
	).innerText = `Корзина: ${cart.length} товаров`;
	tg.MainButton.setText(`ОФОРМИТЬ ЗАКАЗ (${total} руб.)`);

	if (cart.length > 0) {
		tg.MainButton.show();
	} else {
		tg.MainButton.hide();
	}
}

function addToCart(name, price) {
	cart.push({ name, price, quantity: 1 });
	tg.HapticFeedback.notificationOccurred("success"); // Обратная связь
	updateCart();
}

// --- Действие при нажатии Главной кнопки ---
tg.MainButton.onClick(() => {
	if (cart.length === 0) return;

	const orderData = {
		action: "checkout",
		total: total,
		items: cart, // Отправляем массив товаров
	};

	// ОТПРАВКА ДАННЫХ В TELEGRAF
	tg.sendData(JSON.stringify(orderData));

	tg.close(); // Закрываем TWA после отправки
});
