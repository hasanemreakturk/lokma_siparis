const DailyProduction = require('../models/DailyProduction');
const DailyOrder = require('../models/DailyOrder');
const Product = require('../models/Product');
const Branch = require('../models/Branch');
const { Op } = require('sequelize');



exports.getImalathanePage = async (req, res) => {
    try {
        const branches = await Branch.findAll();
        const defaultDate = new Date().toISOString().split('T')[0];
        const message = req.query.message || null; // URL'deki message parametresini alın

        res.render('imalathane', { branches, ordersByCategory: {}, defaultDate, message });
    } catch (error) {
        console.error('Error loading imalathane page:', error);
        res.status(500).send('An error occurred while loading the page.');
    }
};

exports.getFilteredOrders = async (req, res) => {
    try {
        const { branch_name, date } = req.query;

        // Şubeyi bul
        const branch = await Branch.findOne({ where: { name: branch_name } });
        if (!branch) {
            console.error('Şube bulunamadı:', branch_name);
            return res.status(404).send('Şube bulunamadı.');
        }

        // Seçilen tarih ve şube için daily_production kontrolü
        const existingProductions = await DailyProduction.findAll({
            where: {
                branch_id: branch.branch_id,
                createdAt: {
                    [Op.gte]: new Date(date), // Seçilen tarihten itibaren
                    [Op.lt]: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000), // Seçilen günün sonu
                },
            },
            include: [
                {
                    model: Product,
                    attributes: ['name'], // Ürün adı
                },
            ],
        });

        let message = null;
        if (existingProductions.length > 0) {
            const productNames = existingProductions.map(prod => prod.Product.name).join(', ');
            message = `Seçilen tarih ve şube için şu ürünler zaten üretilmiş: ${productNames}.`;
        }

        // Günlük siparişleri tarihe ve şubeye göre filtrele
        const orders = await DailyOrder.findAll({
            where: {
                branch_id: branch.branch_id,
                createdAt: {
                    [Op.gte]: new Date(date), // Seçilen tarihten itibaren
                    [Op.lt]: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000), // Seçilen günün sonu
                },
            },
            include: [
                {
                    model: Product,
                    attributes: ['product_id', 'name', 'category'], // Ürün bilgileri
                },
            ],
        });

        // Gelen verileri logla
        console.log('Filtrelenmiş Siparişler:', JSON.stringify(orders, null, 2));

        // Siparişleri kategorilere ayır
        const ordersByCategory = {
            1: [], // Kilogram
            2: [], // Adet
            3: [], // Çeşit
        };

        orders.forEach(order => {
            const category = order.Product.category; // Ürünün kategorisi
            if (ordersByCategory[category]) {
                ordersByCategory[category].push({
                    order_id: order.order_id,
                    product_name: order.Product.name,
                    amount: order.kg_amount || order.quantity_amount,
                    product_id: order.Product.product_id,
                });
            }
        });

        // Formu render et
        res.render('imalathane', {
            branches: await Branch.findAll(), // Şube listesini gönder
            ordersByCategory,
            branch_id: branch.branch_id,
            defaultDate: date,
            message, // Uyarı mesajı
        });
    } catch (error) {
        console.error('Sipariş filtreleme hatası:', error);
        res.status(500).send('Siparişler alınırken bir hata oluştu.');
    }
};

exports.saveProduction = async (req, res) => {
    try {
        const { branch_id, category1, category2, category3, product_id } = req.body;

        const productionEntries = [];

        // Kategori verilerini işleme
        if (category1) {
            for (const order_id in category1) {
                const producedAmount = parseFloat(category1[order_id]);
                if (isNaN(producedAmount) || producedAmount <= 0) continue;

                productionEntries.push({
                    branch_id: parseInt(branch_id),
                    product_id: parseInt(product_id[order_id]),
                    produced_amount: producedAmount,
                    produced_quantity: null,
                });
            }
        }

        if (category2) {
            for (const order_id in category2) {
                const producedQuantity = parseInt(category2[order_id]);
                if (isNaN(producedQuantity) || producedQuantity <= 0) continue;

                productionEntries.push({
                    branch_id: parseInt(branch_id),
                    product_id: parseInt(product_id[order_id]),
                    produced_amount: null,
                    produced_quantity: producedQuantity,
                });
            }
        }

        if (category3) {
            for (const order_id in category3) {
                const producedVariety = parseInt(category3[order_id]);
                if (isNaN(producedVariety) || producedVariety <= 0) continue;

                productionEntries.push({
                    branch_id: parseInt(branch_id),
                    product_id: parseInt(product_id[order_id]),
                    produced_amount: null,
                    produced_quantity: producedVariety,
                });
            }
        }

        if (productionEntries.length === 0) {
            return res.redirect('/imalathane?message=Kaydedilecek geçerli üretim verisi yok.');
        }

        await DailyProduction.bulkCreate(productionEntries);

        res.redirect('/imalathane?message=Üretim verileri başarıyla kaydedildi!');
    } catch (error) {
        console.error('Üretim kaydetme hatası:', error);
        res.redirect('/imalathane?message=Üretim verileri kaydedilirken bir hata oluştu.');
    }
};

