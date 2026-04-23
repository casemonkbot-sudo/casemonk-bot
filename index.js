const { Telegraf, session } = require('telegraf');
const express = require('express');
const path = require('path');

// Твой рабочий токен
const bot = new Telegraf('8774206010:AAHmvdYuN0xUOCL8poGlLYuy_SkaV2r9cUg');
const app = express();
bot.use(session());

const ADMIN_ID = 999313063;
const ADMIN_PASSWORD = "999313063";

// Раздача файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Приветствие с новой ссылкой на Mini App
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
                // ОБНОВЛЕННАЯ ССЫЛКА
                web_app: { url: "https://casemonk-bot-akm8.onrender.com" } 
            }]]
        }
    });
});

// Обработка покупки Stars
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
        console.error("Ошибка WebApp:", e);
    }
});

// Админ-панель
bot.command('manage', (ctx) => {
    if (ctx.from.id === ADMIN_ID) {
        ctx.session = { waitPass: true };
        ctx.reply("Введите секретный пароль:");
    }
});

bot.on('text', async (ctx) => {
    if (ctx.session?.waitPass && ctx.message.text === ADMIN_PASSWORD) {
        ctx.session.waitPass = false;
        return ctx.reply("✅ Доступ разрешен:", {
            reply_markup: {
                inline_keyboard: [[{ 
                    text: "⚙️ Админ-панель", 
                    web_app: { url: "https://casemonk-bot-akm8.onrender.com/admin.html" } 
                }]]
            }
        });
    }
});

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
bot.on('successful_payment', (ctx) => ctx.reply("✅ Оплата Stars прошла успешно!"));

// Запуск бота и сервера
bot.launch().then(() => console.log("Бот запущен!")).catch(err => console.error("Ошибка запуска:", err));

// Исправлено: listen
app.listen(process.env.PORT || 3000, () => {
    console.log("Сервер LIVE на порту " + (process.env.PORT || 3000));
});
