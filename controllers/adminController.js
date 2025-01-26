const { Category } = require('../models');
const { Product } =require('../models');
const { Stock } =require('../models');
const { MonthlySales } =require('../models');


const adminController = {
    renderAdminPage: async (req, res) => {
        try {
            const categories = await Category.findAll(); // Kategorileri getir
            const products = await Product.findAll(); // Ürünleri getir

            res.render('admin', { categories, products });
        } catch (error) {
            console.error('Admin sayfası yüklenirken hata:', error);
            res.status(500).send('Sayfa yüklenirken hata oluştu.');
        }
    },
    
    getMonthlySalesData: async (req, res) => {
        const { product_id } = req.query;
        const branch_id = req.session.user.branch_id; // Oturumdan branch_id al
    
        try {
            const salesData = await MonthlySales.findAll({
                where: { product_id, branch_id },
                attributes: ['createdAt', 'kg_amount', 'porsion_amount', 'profit'],
                order: [['createdAt', 'ASC']],
            });
    
            // Bar ve Line verileri için ayrı hesaplamalar
            const kgProfitData = salesData
                .filter(sale => sale.kg_amount !== null)
                .map(sale => ({ x: sale.createdAt, y: sale.profit }));
    
            const porsionProfitData = salesData
                .filter(sale => sale.porsion_amount !== null)
                .map(sale => ({ x: sale.createdAt, y: sale.profit }));
    
            const lineProfitData = salesData.reduce((acc, sale) => {
                const dateKey = sale.createdAt.toISOString().split('T')[0];
                if (!acc[dateKey]) acc[dateKey] = 0;
                acc[dateKey] += sale.profit; // Aynı tarihteki profit değerlerini topla
                return acc;
            }, {});
    
            const lineData = Object.entries(lineProfitData).map(([date, totalProfit]) => ({
                x: date,
                y: totalProfit,
            }));
    
            // Tarih bazında kg_amount ve porsion_amount değerlerini gruplama
            const kgAmounts = salesData.reduce((acc, sale) => {
                const dateKey = sale.createdAt.toISOString().split('T')[0];
                if (!acc[dateKey]) acc[dateKey] = 0;
                acc[dateKey] += sale.kg_amount || 0;
                return acc;
            }, {});
    
            const porsionAmounts = salesData.reduce((acc, sale) => {
                const dateKey = sale.createdAt.toISOString().split('T')[0];
                if (!acc[dateKey]) acc[dateKey] = 0;
                acc[dateKey] += sale.porsion_amount || 0;
                return acc;
            }, {});
    
            const kgAmountData = Object.entries(kgAmounts).map(([date, totalKg]) => ({
                x: date,
                y: totalKg,
            }));
    
            const porsionAmountData = Object.entries(porsionAmounts).map(([date, totalPorsion]) => ({
                x: date,
                y: totalPorsion,
            }));
    
            res.json({ kgProfitData, porsionProfitData, lineData, kgAmountData, porsionAmountData });
        } catch (error) {
            console.error('Monthly sales data retrieval error:', error);
            res.status(500).send('Veri alınırken hata oluştu.');
        }
    },
    
    getStockData: async (req, res) => {
        const branch_id = req.session.user?.branch_id; // Oturumdan branch_id alınır
    
        if (!branch_id) {
            return res.status(401).json({ error: 'Şube bilgisi oturumdan alınamadı.' });
        }
    
        const { category } = req.query; // Kategori istekte belirtilir
    
        try {
            // Şube ve kategoriye göre stok verilerini getir
            const stocks = await Stock.findAll({
                where: { branch_id },
                include: {
                    model: Product,
                    where: { category },
                    attributes: ['name'] // Product tablosundan sadece 'name' alınır
                }
            });
    
            // Verileri frontend için şekillendir
            const data = stocks.map(stock => ({
                product_name: stock.Product.name, // Ürün adı
                amount: category == 1 ? stock.kg_amount : stock.quantity_amount
            }));
    
            res.json(data); // JSON formatında döner
        } catch (error) {
            console.error('Stok verileri alınırken hata:', error);
            res.status(500).send('Stok verileri alınırken hata oluştu.');
        }
    },
    
    
};


module.exports = adminController;
