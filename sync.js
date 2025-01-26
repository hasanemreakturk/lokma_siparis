const sequelize = require('./config/database'); // Veritabanı bağlantısı
const models = require('./models'); // Modelleri içe aktar

(async () => {
  try {
    // Veritabanı ile tüm modelleri senkronize et, veriler korunur
    await sequelize.sync({ alter: false });

    console.log('Modeller başarıyla senkronize edildi!');
  } catch (error) {
    console.error('Modeller senkronize edilirken hata oluştu:', error);
  } finally {
    // Bağlantıyı kapat
    await sequelize.close();
  }
})();