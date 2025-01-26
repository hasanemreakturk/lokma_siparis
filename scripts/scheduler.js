const axios = require('axios');
const { generatePastaData, generateTatliData, generateCesitData } = require('../utils/dynamicData');
const { Product, Prediction } = require('../models');

// Tatlı ve Pasta ürünlerini veritabanından çek ve tahmin sonuçlarını kaydet
const sendDynamicData = async () => {
    try {
        // Yeni ürün kategorisini veritabanından çek
        const cesitProducts = await Product.findAll({
            where: { category: 3 }, // 3: Yeni kategori
            attributes: ['product_id', 'name']
        });

        // Yeni model verilerini oluştur ve API'ye gönder
        if (cesitProducts.length > 0) {
            const cesitData = generateCesitData(cesitProducts.map(product => product.dataValues));
            const cesitResponse = await axios.post('http://127.0.0.1:5000/predict-cesit', cesitData);
            console.log('Çeşit tahmin sonuçları:', cesitResponse.data.predictions);

            // Tahmin sonuçlarını veritabanına kaydet
            for (let i = 0; i < cesitData.length; i++) {
                await Prediction.create({
                    product_id: cesitData[i].Product,
                    category: 3, // Yeni kategori
                    predicted_value: cesitResponse.data.predictions[i],
                });
            }
        }
        // Tatlı ürünlerini veritabanından çek
        const tatliProducts = await Product.findAll({
            where: { category: 1 }, // 1: Tatlı
            attributes: ['product_id', 'name']
        });

        // Pasta ürünlerini veritabanından çek
        const pastaProducts = await Product.findAll({
            where: { category: 2 }, // 2: Pasta
            attributes: ['product_id', 'name']
        });

        // Tatlı verilerini oluştur ve API'ye gönder
        if (tatliProducts.length > 0) {
            const tatliData = generateTatliData(tatliProducts.map(product => product.dataValues));
            const tatliResponse = await axios.post('http://127.0.0.1:5000/predict-tatli', tatliData);
            console.log('Tatlı tahmin sonuçları:', tatliResponse.data.predictions);

            // Tahmin sonuçlarını veritabanına kaydet
            for (let i = 0; i < tatliData.length; i++) {
                await Prediction.create({
                    product_id: tatliData[i].Product,
                    category: 1, // Tatlı
                    predicted_value: tatliResponse.data.predictions[i],
                });
            }
        }

        // Pasta verilerini oluştur ve API'ye gönder
        if (pastaProducts.length > 0) {
            const pastaData = generatePastaData(pastaProducts.map(product => product.dataValues));
            const pastaResponse = await axios.post('http://127.0.0.1:5000/predict-pasta', pastaData);
            console.log('Pasta tahmin sonuçları:', pastaResponse.data.predictions);

            // Tahmin sonuçlarını veritabanına kaydet
            for (let i = 0; i < pastaData.length; i++) {
                await Prediction.create({
                    product_id: pastaData[i].Product,
                    category: 2, // Pasta
                    predicted_value: pastaResponse.data.predictions[i],
                });
            }
        }

    } catch (error) {
        console.error('Veri gönderimi sırasında bir hata oluştu:', error.message);
    }
};

// Gönderim fonksiyonunu çalıştır
sendDynamicData();
