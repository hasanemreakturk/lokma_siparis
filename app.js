require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const sequelize = require('./config/database');
const globalAuthMiddleware = require('./middlewares/globalAuthMiddleware'); // Yetkilendirme Middleware'i
require('./scripts/scheduler');

const indexRouter = require('./routes/index');
const imalathaneRouter = require('./routes/imalathane');
const imalathane2Router = require('./routes/imalathane2');
const siparisRouter = require('./routes/siparis');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware'ler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SECRET_KEY || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));

// Veritabanı Bağlantısı
sequelize.authenticate()
    .then(() => console.log('Veritabanına başarıyla bağlanıldı.'))
    .catch((err) => {
        console.error('Veritabanı bağlantı hatası:', err.message);
    });

// Rotalar
app.use('/user', userRouter); 
app.use('/',globalAuthMiddleware,indexRouter);
app.use('/siparis', globalAuthMiddleware, siparisRouter); // Sipariş işlemleri
app.use('/imalathane', globalAuthMiddleware, imalathaneRouter); // İmalathane işlemleri
app.use('/imalathane2', globalAuthMiddleware, imalathane2Router);
app.use('/admin', globalAuthMiddleware, adminRouter);

// Hata Yönetimi Middleware'i
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Sunucu Hatası');
});

// Sunucu Başlatma
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
