const { Telegraf, session } = require('telegraf');
const express = require('express');
const path = require('path');

const bot = new Telegraf('8774206010:AAHmvdYuN0xUOCL8poGlLYuy_SkaV2r9cUg');
const app = express();
bot.use(session());

const ADMIN_ID = 999313063;
const ADMIN_PASSWORD = "9993133063";

app.use(express.static(path.join(__dirname, 'public')));

bot.start((ctx) => {
    const welcomeMessage = `🎁Привет, на связи команда CASEMONK и теперь ты вместе с нами! ⚡️\n\n` +
        `Открывай кейсы и выигрывай самые дорогие и лучшие NFT подарки!\n\n` +
        `💸Делись своей реферальной ссылкой с друзьями - и за каждого проведённого друга который сделает депозит ты получаешь 15% от суммы их пополнений!\n` +
        `Круто - действуй\n\n` +
        `🎉Хочешь выиграть дорогие подарки? Время пришло!\n` +
        `Жми «Играть» и забирай свой NFT-приз!`;

    ctx.reply(welcomeMessage, {
        reply_markup: {
            inline_keyboard: [[{ text: "Играть 🚀", web_app: { url: "https://" + process.env.RENDER_EXTERNAL_HOSTNAME } }]]
        }
    });
});

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
