const { Telegraf, session } = require('telegraf');
const express = require('express');
const path = require('path');

const bot = new Telegraf('8774206010:AAHmVdfuN0xUDCL8p0G1LYuy_SkaV2r9c9g');
const app = express();
bot.use(session());

const ADMIN_ID = 999313063;
const ADMIN_PASSWORD = "999313063";

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
                web_app: { url: "https://" + (process.env.RENDER_EXTERNAL_HOSTNAME || "casemonk-bot.onrender.com") } 
            }]]
        }
    });
});

// АДМИНКА
bot.command('manage', (ctx) => {
    if (ctx.from.id === ADMIN_ID) {
        ctx.session = { waitPass: true };
        ctx.reply("Введите секретный пароль:");
    }
});

// ОБРАБОТКА STARS (ЧЕРЕЗ WEB_APP_DATA)
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
    } catch (e) { console.error("Ошибка парсинга:", e); }
});

// ОБРАБОТКА ПАРОЛЯ
bot.on('text', async (ctx) => {
    if (ctx.session && ctx.session.waitPass) {
        if (ctx.message.text === ADMIN_PASSWORD) {
            ctx.session.waitPass = false;
            return ctx.reply("✅ Доступ разрешен:", {
                reply_markup: {
                    inline_keyboard: [[{ 
                        text: "⚙️ Админ-панель", 
                        web_app: { url: "https://" + (process.env.RENDER_EXTERNAL_HOSTNAME || "casemonk-bot.onrender.com") + "/admin.html" } 
                    }]]
                }
            });
        }
    }
});

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
bot.on('successful_payment', (ctx) => ctx.reply("✅ Оплата Stars прошла успешно!"));

bot.launch();
// ИСПРАВЛЕНО: listen (было listan в твоем коде)
app.listen(process.env.PORT || 3000, () => {
    console.log("Сервер запущен!");
});
