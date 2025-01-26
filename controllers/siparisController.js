const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const Product = require('../models/Product');
const DailyOrder = require('../models/DailyOrder');
const Category = require('../models/Category');
const { Prediction } = require('../models');

exports.renderSiparis = async (req, res) => {
    try {
        const branchId = req.session.user.branch_id;
        // Tatlılar için benzersiz product_id'leri al
        const tatliProductIds = await sequelize.query(
            `SELECT DISTINCT product_id
             FROM daily_order
             WHERE branch_id = :branchId
               AND createdAt >= DATE_SUB(2024-09-12, INTERVAL 14 DAY)`,
            {
                replacements: { branchId },
                type: sequelize.QueryTypes.SELECT,
            }
        );
        const tatliIds = tatliProductIds.map(row => row.product_id);

        // Tatlı bilgilerini Product modelinden al
        const tatliBilgileri = await Product.findAll({
            where: {
                product_id: { [Sequelize.Op.in]: tatliIds },
                category: 1,
            },
            attributes: ['product_id', 'name'],
        });

        // Tatlı tahminlerini Prediction modelinden al
        const tatliTahminleri = await Prediction.findAll({
            where: { category: 1 },
            attributes: ['predicted_value', 'product_id'],
        });


        // Tatlı bilgilerini ve tahminlerini birleştir
        let tatliListesi = tatliBilgileri.map((tatli) => {
            const tahmin = tatliTahminleri.find(t => t.product_id === tatli.product_id);
            return {
                name: tatli.name,
                prediction: tahmin ? tahmin.predicted_value : 0 // Tahmin yoksa 0 olarak ayarla
            };
        });

       
        const pastaProductIds = await sequelize.query(
            `SELECT DISTINCT product_id
             FROM daily_order
             WHERE branch_id = :branchId
               AND createdAt >= DATE_SUB(NOW(), INTERVAL 14 DAY)`,
            {
                replacements: { branchId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const pastaIds = pastaProductIds.map(row => row.product_id);

        // Pasta bilgilerini Product modelinden al
        const pastaBilgileri = await Product.findAll({
            where: {
                product_id: { [Sequelize.Op.in]: pastaIds },
                category: 2,
            },
            attributes: ['product_id', 'name'],
        });


        // Pasta tahminlerini Prediction modelinden al
        const pastaTahminleri = await Prediction.findAll({
            where: { category: 2 },
            attributes: ['predicted_value', 'product_id'],
        });

        // Pasta bilgilerini ve tahminlerini birleştir
        let pastaListesi = pastaBilgileri.map((pasta) => {
            const tahmin = pastaTahminleri.find(p => p.product_id === pasta.product_id);
            return {
                name: pasta.name,
                prediction: tahmin ? tahmin.predicted_value : 0,
            };
        });

        const cesitProductIds = await sequelize.query(
            `SELECT DISTINCT product_id
             FROM daily_order
             WHERE branch_id = :branchId
               AND createdAt >= DATE_SUB(NOW(), INTERVAL 14 DAY)`,
            {
                replacements: { branchId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const cesitIds = cesitProductIds.map(row => row.product_id);

        // Çeşit bilgilerini Product modelinden al
        const cesitBilgileri = await Product.findAll({
            where: {
                product_id: { [Sequelize.Op.in]: cesitIds },
                category: 3,
            },
            attributes: ['product_id', 'name'],
        });


        // Çeşit tahminlerini Prediction modelinden al
        const cesitTahminleri = await Prediction.findAll({
            where: { category: 3 },
            attributes: ['predicted_value', 'product_id'],
        });


        // Çeşit bilgilerini ve tahminlerini birleştir
        let cesitListesi = cesitBilgileri.map((cesit) => {
            
            const tahmin = cesitTahminleri.find(c => c.product_id === cesit.product_id);
            return {
                name: cesit.name,
                prediction: tahmin ? tahmin.predicted_value : 1,
            };
        });


        

        // EJS'ye verileri gönder
        res.render('siparis', {
            tatliTahminleri: tatliListesi,
            pastaTahminleri: pastaListesi,
            cesitTahminleri: cesitListesi
        });
    } catch (error) {
        console.error('Sipariş ekranı verileri alınırken hata oluştu:', error.message);
        res.status(500).send('Sunucu hatası: Sipariş verileri alınamadı.');
    }
};


exports.handleTatliSiparis = async (req, res) => {
    try {
        const { tatlilar = [] } = req.body;
        const girilenTatliSiparisleri = tatlilar.filter(t => t.kg && parseFloat(t.kg) > 0);

        if (girilenTatliSiparisleri.length === 0) {
            return res.status(400).send('Herhangi bir tatlı siparişi girilmedi.');
        }

        for (const tatli of girilenTatliSiparisleri) {
            const product = await Product.findOne({ where: { name: tatli.tatli } });
            if (!product) throw new Error(`Ürün bulunamadı: ${tatli.tatli}`);

            await DailyOrder.create({
                product_id: product.product_id,
                kg_amount: parseFloat(tatli.kg),
                branch_id: req.session.user.branch_id, // Varsayılan şube ID
            });
        }

        res.status(200).json({ message: 'Tatlı siparişleri kaydedildi.' });
    } catch (error) {
        console.error('Tatlı siparişi kaydedilirken hata oluştu:', error);
        res.status(500).send('Sunucu hatası: Tatlı siparişi kaydedilemedi.');
    }
};

exports.handlePastaSiparis = async (req, res) => {
    try {
        const { pastalar = [] } = req.body;
        const girilenPastaSiparisleri = pastalar.filter(p => p.adet && parseInt(p.adet) > 0);

        if (girilenPastaSiparisleri.length === 0) {
            return res.status(400).send('Herhangi bir pasta siparişi girilmedi.');
        }

        for (const pasta of girilenPastaSiparisleri) {
            const product = await Product.findOne({ where: { name: pasta.pasta } });
            if (!product) throw new Error(`Ürün bulunamadı: ${pasta.pasta}`);

            await DailyOrder.create({
                product_id: product.product_id,
                quantity_amount: parseInt(pasta.adet),
                branch_id: req.session.user.branch_id, // Varsayılan şube ID
            });
        }

        res.status(200).json({ message: 'Pasta siparişleri kaydedildi.' });
    } catch (error) {
        console.error('Pasta siparişi kaydedilirken hata oluştu:', error);
        res.status(500).send('Sunucu hatası: Pasta siparişi kaydedilemedi.');
    }
};

exports.handleCesitSiparis = async (req, res) => {
    try {
        const { cesitler = [] } = req.body;
        const girilenCesitSiparisleri = cesitler.filter(c => c.kg && parseFloat(c.kg) > 0);

        if (girilenCesitSiparisleri.length === 0) {
            return res.status(400).send('Herhangi bir çeşit siparişi girilmedi.');
        }

        for (const cesit of girilenCesitSiparisleri) {
            const product = await Product.findOne({ where: { name: cesit.cesit } });
            if (!product) throw new Error(`Ürün bulunamadı: ${cesit.cesit}`);

            await DailyOrder.create({
                product_id: product.product_id,
                kg_amount: parseFloat(cesit.kg),
                branch_id: req.session.user.branch_id, // Varsayılan şube ID
            });
        }

        res.status(200).json({ message: 'Çeşit siparişleri kaydedildi.' });
    } catch (error) {
        console.error('Çeşit siparişi kaydedilirken hata oluştu:', error);
        res.status(500).send('Sunucu hatası: Çeşit siparişi kaydedilemedi.');
    }
};


exports.renderAllOrders = async (req, res) => {
    try {
        const tatliSiparisleri = await DailyOrder.findAll({ where: { kg_amount: { [Op.ne]: null } } });
        const pastaSiparisleri = await DailyOrder.findAll({ where: { quantity_amount: { [Op.ne]: null } } });
        const cesitSiparisleri = await DailyOrder.findAll({ where: { cesit_amount: { [Op.ne]: null } } });

        res.render('allOrders', {
            tatliSiparisleri,
            pastaSiparisleri,
            cesitSiparisleri,
        });
    } catch (error) {
        console.error('Siparişler alınırken hata oluştu:', error);
        res.status(500).send('Sunucu hatası: Siparişler alınamadı.');
    }
};

exports.sendOrdersToDaily = async (req, res) => {
    try {
        const { tatlilar = [], pastalar = [], cesitler = [] } = req.body;
         

        // Tatlılar için işlem
        for (const tatli of tatlilar) {
            if (tatli.kg && parseFloat(tatli.kg) > 0) {
                const product = await Product.findOne({
                    where: { name: tatli.tatli },
                    attributes: ['product_id', 'name', 'category'],
                });

                if (!product) throw new Error(`Ürün bulunamadı: ${tatli.tatli}`);

                await DailyOrder.create({
                    date: new Date(),
                    product_id: product.product_id,
                    product: product.name,
                    kg_amount: parseFloat(tatli.kg),
                    quantity_amount: null,
                    branch_id: req.session.user.branch_id,
                    category: product.category,
                });
            }
        }

        // Pastalar için işlem
        for (const pasta of pastalar) {
            if (pasta.adet && parseInt(pasta.adet) > 0) {
                const product = await Product.findOne({
                    where: { name: pasta.pasta },
                    attributes: ['product_id', 'name', 'category'],
                });

                if (!product) throw new Error(`Ürün bulunamadı: ${pasta.pasta}`);

                await DailyOrder.create({
                    date: new Date(),
                    product_id: product.product_id,
                    product: product.name,
                    kg_amount: null,
                    quantity_amount: parseInt(pasta.adet),
                    branch_id: req.session.user.branch_id,
                    category: product.category,
                });
            }
        }

        // Çeşitler için işlem
        for (const cesit of cesitler) {
            if (cesit.kg && parseFloat(cesit.kg) > 0) {
                const product = await Product.findOne({
                    where: { name: cesit.cesit },
                    attributes: ['product_id', 'name', 'category'],
                });

                if (!product) throw new Error(`Ürün bulunamadı: ${cesit.cesit}`);

                await DailyOrder.create({
                    date: new Date(),
                    product_id: product.product_id,
                    product: product.name,
                    kg_amount: parseFloat(cesit.kg),
                    quantity_amount: null,
                    branch_id: req.session.user.branch_id,
                    category: product.category,
                });
            }
        }

        res.status(200).json({ message: 'Siparişler günlük sipariş tablosuna başarıyla kaydedildi.' });
    } catch (error) {
        console.error('Siparişler gönderilirken hata oluştu:', error);
        res.status(500).send('Sunucu hatası: Siparişler gönderilemedi.');
    }
};

exports.handleSubmitOrders = async (req, res) => {
    try {
        const tatliSiparisleri = await Order.findAll({ where: { order_type: 'tatli' } });
        const pastaSiparisleri = await Order.findAll({ where: { order_type: 'pasta' } });
        const cesitSiparisleri = await Order.findAll({ where: { order_type: 'cesit' } });

        for (const siparis of [...tatliSiparisleri, ...pastaSiparisleri, ...cesitSiparisleri]) {
            await DailyOrder.create({
                date: new Date(),
                product_id: siparis.product_id,
                product: siparis.product_name,
                kg_amount: siparis.order_type === 'tatli' || siparis.order_type === 'cesit' ? siparis.quantity : null,
                quantity_amount: siparis.order_type === 'pasta' ? siparis.quantity : null,
                branch_id: req.session.user.branch_id, // Varsayılan şube ID
            });
            await siparis.destroy(); // Siparişi işlendikten sonra sil
        }

        res.status(200).json({ message: 'Tüm siparişler başarıyla veritabanına gönderildi.' });
    } catch (error) {
        console.error('Siparişler gönderilirken hata oluştu:', error);
        res.status(500).send('Sunucu hatası: Siparişler gönderilemedi.');
    }
};
