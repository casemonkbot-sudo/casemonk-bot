const { Telegraf, session } = require('telegraf');
const express = require('express');
const path = require('path');

const bot = new Telegraf('8774206010:AAHmvdYuN0xUOCL8poGlLYuy_SkaV2r9cUg');
const app = express();

// Добавляем простую сессию, чтобы бот помнил, что ты вводишь пароль
bot.use(session());

const ADMIN_ID = 999313063;
const ADMIN_PASSWORD = "9993133063";

app.use(express.static(path.join(__dirname, 'public')));

bot.start((ctx) => {
    ctx.reply(`🎁 Добро пожаловать в CASEMONK!`, {
        reply_markup: {
            inline_keyboard: [[{ text: "Играть 🚀", web_app: { url: "https://" + process.env.RENDER_EXTERNAL_HOSTNAME } }]]
        }
    });
});

// Секретная команда
bot.command('manage', (ctx) => {
    if (ctx.from.id === ADMIN_ID) {
        ctx.session = { waitPass: true };
        ctx.reply("Введите секретный пароль:");
    }
});

// Проверка пароля
bot.on('text', (ctx) => {
    if (ctx.session?.waitPass) {
        if (ctx.message.text === ADMIN_PASSWORD) {
            ctx.session.waitPass = false;
            ctx.reply("✅ Доступ разрешен. Открываю админ-панель...", {
                reply_markup: {
                    inline_keyboard: [[{ text: "⚙️ Войти в Админку", web_app: { url: "https://" + process.env.RENDER_EXTERNAL_HOSTNAME + "/admin.html" } }]]
                }
            });
        } else {
            ctx.reply("❌ Неверный пароль.");
            ctx.session.waitPass = false;
        }
    }
});

bot.launch();
app.listen(process.env.PORT || 3000);
