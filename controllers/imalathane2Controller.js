const DailyProduction = require('../models/DailyProduction');
const DailyOrder = require('../models/DailyOrder');
const Product = require('../models/Product');
const Branch = require('../models/Branch');
const Category = require('../models/Category'); // Eksik olan import

const { Op } = require('sequelize');

// İmalathane sayfasını render et
const getImalathane2Page = async (req, res) => {
    try {
        // Şubeleri ve kategorileri alın
        const branches = await Branch.findAll({ attributes: ['branch_id', 'name'] });
        const categories = await Category.findAll({ attributes: ['category_id', 'name'] });

        // Şablonu render et ve boş mesaj gönder
        res.render('imalathane2', {
            branches,
            categories,
            message: null, // Başlangıçta boş bir mesaj gönderiyoruz
            error: null,   // Hata mesajı için de boş bırakıyoruz
        });
    } catch (error) {
        console.error('Error loading imalathane2 page:', error);
        res.status(500).send('Bir hata oluştu.');
    }
};

// Kategoriye göre ürünleri getir
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query; // Kategori ID

        // Seçilen kategoriye göre ürünleri getir
        const products = await Product.findAll({
            where: { category }, // category sütunu ile eşleşen ürünler
            attributes: ['product_id', 'name'], // Ürün bilgilerini al
        });

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).send('Ürünler getirilirken bir hata oluştu.');
    }
};

// Üretim kaydetme işlemi
const saveSelectedProduction = async (req, res) => {
    try {
        const { branch_id, product_id, amount } = req.body;

        if (!branch_id || !product_id || !amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Geçerli şube, ürün ve miktar bilgisi gönderiniz.' });
        }

        // Mevcut üretim kaydını kontrol et
        const existingProduction = await DailyProduction.findOne({
            where: {
                branch_id,
                product_id,
                createdAt: {
                    [Op.gte]: new Date().setHours(0, 0, 0, 0), // Bugünün başlangıcı
                    [Op.lt]: new Date().setHours(23, 59, 59, 999), // Bugünün sonu
                },
            },
        });

        if (existingProduction) {
            const product = await Product.findByPk(product_id, { attributes: ['name'] });
            const branch = await Branch.findByPk(branch_id, { attributes: ['name'] });
            return res.status(200).json({
                error: `Bu ürün (${product.name}) ve şube (${branch.name}) için bugün zaten bir üretim kaydı mevcut.`,
            });
        }

        // Üretim verisini kaydet
        await DailyProduction.create({
            branch_id: parseInt(branch_id),
            product_id: parseInt(product_id),
            produced_amount: parseFloat(amount),
        });

        res.status(200).json({ message: 'Üretim verisi başarıyla kaydedildi!' });
    } catch (error) {
        console.error('Üretim kaydetme hatası:', error);
        res.status(500).json({ error: 'Üretim verisi kaydedilirken bir hata oluştu.' });
    }
};

// Export fonksiyonları
module.exports = {
    getImalathane2Page,
    getProductsByCategory,
    saveSelectedProduction,
};
