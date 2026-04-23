const { Telegraf, session } = require('telegraf');
const express = require('express');
const path = require('path');

// Твой рабочий токен и приложение
const bot = new Telegraf('8774206010:AAHmvdYuN0xUOCL8poGlLYuy_SkaV2r9cUg');
const app = express();
bot.use(session());

const ADMIN_ID = 999313063;
const ADMIN_PASSWORD = "999313063";

// Раздача статики
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
                web_app: { url: "https://casemonk-bot-akm8.onrender.com" } 
            }]]
        }
    });
});

// АДМИН-ПАНЕЛЬ
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

// ЗАПУСК
bot.launch().then(() => console.log("БОТ ЖИВ")).catch(err => console.error("ОШИБКА:", err));

// Исправлено: listen
app.listen(process.env.PORT || 3000, () => {
    console.log("СЕРВЕР LIVE");
});
