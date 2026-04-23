const { Telegraf, session } = require('telegraf');
const express = require('express');
const path = require('path');

// Твой исправленный токен
const bot = new Telegraf('8774206010:AAHmvdYuN0xUOCL8poGlLYuy_SkaV2r9cUg');
const app = express();
bot.use(session());

const ADMIN_ID = 999313063;
const ADMIN_PASSWORD = "999313063";

// Раздача файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// ПРИВЕТСТВИЕ
bot.start((ctx) => {
    const welcomeMessage = "🎁 Привет, на связи команда CASEMONK и теперь ты вместе с нами! ⚡\n\n" +
        "Открывай кейсы и выигрывай самые дорогие и лучшие NFT подарки!\n\n" +
        "💸 Делись своей реферальной ссылкой с друзьями - и за каждого проведённого друга который сделает депозит ты получаешь 15% от суммы их пополнений!\n" +
        "Круто - действуй!\n\n" +
        "🚀 Хочешь выиграть дорогие подарки? Время пришло!\n" +
        "Жми «Играть» и забирай свой NFT-приз!";

    ctx.reply(welcomeMessage, {
        reply_markup: {
            inline_keyboard: [[{ 
                text: "Играть 🚀", 
                web_app: { url: "https://casemonk-bot.onrender.com" } 
            }]]
        }
    });
});

// ОБРАБОТКА ДАННЫХ ИЗ MINI APP (Stars)
bot.on('web_app_data', async (ctx) => {
    try {
        const data = JSON.parse(ctx.webAppData.data());
        if (data.action === 'buy_stars') {
            const amount = parseInt(data.amount);
            await ctx.replyWithInvoice(
                "Пополнение баланса",
                `Покупка ${amount} Stars`,
                "stars_payload",
                "", 
                "XTR", 
                [{ label: "Stars", amount: amount }]
            );
        }
    } catch (e) {
        console.error("Ошибка обработки WebApp данных:", e);
    }
});

// АДМИН-ПАНЕЛЬ
bot.command('manage', (ctx) => {
    if (ctx.from.id === ADMIN_ID) {
        ctx.session = { waitPass: true };
        ctx.reply("Введите секретный пароль:");
    }
});

bot.on('text', async (ctx) => {
    if (ctx.session && ctx.session.waitPass) {
        if (ctx.message.text === ADMIN_PASSWORD) {
            ctx.session.waitPass = false;
            return ctx.reply("✅ Доступ разрешен:", {
                reply_markup: {
                    inline_keyboard: [[{ 
                        text: "⚙️ Админ-панель", 
                        web_app: { url: "https://casemonk-bot.onrender.com/admin.html" } 
                    }]]
                }
            });
        }
    }
});

// ПЛАТЕЖНЫЕ ОБРАБОТЧИКИ
bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
bot.on('successful_payment', (ctx) => ctx.reply("✅ Оплата Stars прошла успешно! Ваш баланс пополнен."));

// ЗАПУСК
bot.launch().then(() => {
    console.log("=> Бот успешно авторизован и запущен!");
}).catch((err) => {
    console.error("=> КРИТИЧЕСКАЯ ОШИБКА АВТОРИЗАЦИИ:", err.message);
});

// Исправлено: listen вместо listar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=> Сервер слушает порт ${PORT}`);
});

// Мягкая остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
