const { Telegraf, session } = require('telegraf');
const express = require('express');
const path = require('path');

const bot = new Telegraf('8174206010:AAHeVdYuNOxUOCL8poGlLYuy_SkaV2r9c9g');
const app = express();
bot.use(session());

const ADMIN_ID = 999313063;
const ADMIN_PASSWORD = "999313063";

app.use(express.static(path.join(__dirname, 'public')));

// Приветствие (сохранено)
bot.start((ctx) => {
    const welcomeMessage = `🎁 Привет, на связи команда CASEMONK и теперь ты вместе с нами! ⚡️\n\n` +
        `Открывай кейсы и выигрывай самые дорогие и лучшие NFT подарки!\n\n` +
        `💸 Делись своей реферальной ссылкой с друзьями - и за каждого приведенного друга который сделает депозит ты получишь бонус!\n` +
        `Круто - действуй!\n\n` +
        `🚀 Хочешь выиграть дорогие подарки? Время пришло!\n` +
        `Жми «Играть» и забирай свой NFT-приз!`;

    ctx.reply(welcomeMessage, {
        reply_markup: {
            inline_keyboard: [[{ text: "Играть 🚀", web_app: { url: "https://" + process.env.RENDER_EXTERNAL_HOSTNAME } }]]
        }
    });
});

// --- ЛОГИКА ЗВЕЗД (НОВОЕ) ---

// Слушаем данные из Mini App
bot.on('web_app_data', async (ctx) => {
    try {
        const data = JSON.parse(ctx.webAppData.data());
        if (data.action === 'buy_stars') {
            const starsAmount = parseInt(data.amount);
            await ctx.replyWithInvoice(
                "Пополнение баланса",
                `Покупка ${starsAmount} Stars для CaseMonk`,
                "stars_payload",
                "", // Для Stars пусто
                "XTR", 
                [{ label: "Stars", amount: starsAmount }]
            );
        }
    } catch (e) { console.error(e); }
});

// Подтверждение платежа
bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));

// Успешная оплата
bot.on('successful_payment', async (ctx) => {
    await ctx.reply("✅ Оплата прошла успешно! Баланс начислен.");
});

// --- АДМИН ПАНЕЛЬ (СОХРАНЕНО) ---
bot.command('manage', (ctx) => {
    if (ctx.from.id === ADMIN_ID) {
        ctx.session = { waitPass: true };
        ctx.reply("Введите секретный пароль:");
    }
});

bot.on('text', (ctx) => {
    if (ctx.session?.waitPass) {
        if (ctx.message.text === ADMIN_PASSWORD) {
            ctx.session.waitPass = false;
            ctx.reply("✅ Доступ разрешен:", {
                reply_markup: {
                    inline_keyboard: [[{ text: "⚙️ Админ-панель", web_app: { url: "https://" + process.env.RENDER_EXTERNAL_HOSTNAME + "/admin.html" } }]]
                }
            });
        }
    }
});

bot.launch();
app.listen(process.env.PORT || 3000);
