const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");

async function generateCollage(items) {
	// Скачиваем изображения
	const images = await Promise.all(
		items.map(async (item) => {
			const response = await axios.get(item.imageUrl, {
				responseType: "arraybuffer",
			});
			const img = await loadImage(Buffer.from(response.data));
			return { ...item, img };
		})
	);

	// Кол-во колонок (2 или 3)
	const columns = items.length <= 4 ? 2 : 3;
	const rows = Math.ceil(items.length / columns);

	const cardWidth = 400; // ширина плитки
	const cardHeight = 420; // высота плитки + подпись

	const canvasWidth = cardWidth * columns;
	const canvasHeight = cardHeight * rows;

	const canvas = createCanvas(canvasWidth, canvasHeight);
	const ctx = canvas.getContext("2d");

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	let index = 0;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < columns; col++) {
			if (index >= images.length) break;

			const { img, name, price } = images[index];

			const x = col * cardWidth;
			const y = row * cardHeight;

			// Рисуем карточку
			ctx.fillStyle = "#f7f7f7";
			ctx.fillRect(x, y, cardWidth, cardHeight);

			// Пропорционально вписываем картинку
			const maxW = cardWidth - 40;
			const maxH = cardHeight - 120;

			const ratio = img.width / img.height;

			let newW = maxW;
			let newH = newW / ratio;

			if (newH > maxH) {
				newH = maxH;
				newW = newH * ratio;
			}

			const imgX = x + (cardWidth - newW) / 2;
			const imgY = y + 20 + (maxH - newH) / 2;

			ctx.drawImage(img, imgX, imgY, newW, newH);

			// Текст: название + цена
			ctx.fillStyle = "#111111";
			ctx.font = "bold 20px Sans-serif";
			ctx.textAlign = "center";

			ctx.fillText(name, x + cardWidth / 2, y + cardHeight - 60);
			ctx.fillStyle = "#444444";
			ctx.fillText(`${price} ₽`, x + cardWidth / 2, y + cardHeight - 30);

			// Рамка
			ctx.strokeStyle = "#e0e0e0";
			ctx.lineWidth = 4;
			ctx.strokeRect(x, y, cardWidth, cardHeight);

			index++;
		}
	}

	return canvas.toBuffer("image/png");
}

module.exports = generateCollage;
