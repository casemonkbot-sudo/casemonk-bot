const { Telegraf, session } = require('telegraf');
const express = require('express');
const path = require('path');

const bot = new Telegraf('8774206010:AAHmVdfuN0xUDCL8p0G1LYuy_SkaV2r9c9g');
const app = express();
bot.use(session());

const ADMIN_ID = 999313063;
const ADMIN_PASSWORD = "999313063";

app.use(express.static(path.join(__dirname, 'public')));

// Приветствие (сохранено как на скриншоте)
bot.start((ctx) => {
    ctx.reply("🎁 Привет, на связи команда CASEMONK и теперь ты вместе с нами! ⚡\n\nОткрывай кейсы и выигрывай самые дорогие и лучшие NFT подарки!\n\n💸 Делись своей реферальной ссылкой с друзьями - и за каждого проведённого друга который сделает депозит ты получаешь 15% от суммы их пополнений!\nКруто - действуй!\n\n🚀 Хочешь выиграть дорогие подарки? Время пришло!\nЖми «Играть» и забирай свой NFT-приз!", {
        reply_markup: {
            inline_keyboard: [[{ text: "Играть 🚀", web_app: { url: "https://" + (process.env.RENDER_EXTERNAL_HOSTNAME || "casemonk-bot.onrender.com") } }]]
        }
    });
});

// Админка
bot.command('manage', (ctx) => {
    if (ctx.from.id === ADMIN_ID) {
        ctx.session = { waitPass: true };
        ctx.reply("Введите секретный пароль:");
    }
});

// ПРИЕМ STARS (Чтобы кнопка в HTML сработала)
bot.on('web_app_data', async (ctx) => {
    try {
        const data = JSON.parse(ctx.webAppData.data());
        if (data.action === 'buy_stars') {
            await ctx.replyWithInvoice(
                "Пополнение", `Покупка ${data.amount} Stars`, "payload", "", "XTR", 
                [{ label: "Stars", amount: parseInt(data.amount) }]
            );
        }
    } catch (e) { console.error(e); }
});

bot.on('text', async (ctx) => {
    if (ctx.session?.waitPass && ctx.message.text === ADMIN_PASSWORD) {
        ctx.session.waitPass = false;
        ctx.reply("✅ Доступ разрешен:", {
            reply_markup: { inline_keyboard: [[{ text: "⚙️ Админ-панель", web_app: { url: "https://" + (process.env.RENDER_EXTERNAL_HOSTNAME || "casemonk-bot.onrender.com") + "/admin.html" } }]] }
        });
    }
});

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
bot.on('successful_payment', (ctx) => ctx.reply("✅ Баланс пополнен!"));

bot.launch();
// ИСПРАВЛЕННАЯ СТРОКА (было listar)
app.listen(process.env.PORT || 3000, () => console.log("LIVE"));
