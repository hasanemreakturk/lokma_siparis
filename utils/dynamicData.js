// Pasta ürünleri için veri oluşturma (8 özellik)
const generatePastaData = (products, branch_id) => {
    const today = new Date();

    const getKindValue = (name) => {
        if (name.includes("FRAMBUAZLI")) return 1;
        if (name.includes("KROKANLI")) return 2;
        if (name.includes("KARDAN ADAM")) return 3;
        if (name.includes("ÇİKOLATALI")) return 4;
        if (name.includes("MEYVELİ")) return 5;
        if (name.includes("KARAMEL")) return 6;
        if (name.includes("VANİLLİ")) return 7;
        if (name.includes("ÇİLEKLİ")) return 8;
        if (name.includes("KÜLÇE")) return 9;
        if (name.includes("PASTANE")) return 10;
        return 0; // Varsayılan değer
    };

    return products.map(product => ({
        Branch: branch_id || 1, // Session'dan gelen Branch ID, yoksa varsayılan 1
        Product: product.product_id,
        Kind: getKindValue(product.name), // Pasta için Kind özelliği
        Category: 2, // 2: Pasta
        DayOfWeek: today.getDay(),
        IsWeekend: today.getDay() === 0 || today.getDay() === 6 ? 1 : 0,
        Month: today.getMonth() + 1,
        Quarter: Math.floor((today.getMonth() + 3) / 3),
        Year: today.getFullYear(),
    }));
};

// Tatlı ürünleri için veri oluşturma (7 özellik)
const generateTatliData = (products, branch_id) => {
    const today = new Date();

    return products.map(product => ({
        Branch: branch_id || 1, // Session'dan gelen Branch ID, yoksa varsayılan 1
        Product: product.product_id,
        Category: 1, // 1: Tatlı
        DayOfWeek: today.getDay(),
        IsWeekend: ((today.getDay()) === 0 || (today.getDay()) === 6) ? 1 : 0, // Haftasonu kontrolü
        Month: today.getMonth() + 1,
        Quarter: Math.floor((today.getMonth() + 3) / 3),
        Year: today.getFullYear(),
    }));
};

// Çeşit ürünleri için veri oluşturma
const generateCesitData = (products, branch_id) => {
    const today = new Date();

    const getRandomValue = (min, max) => Math.random() * (max - min) + min;

    return products.map(product => ({
        Branch: branch_id || 1, // Session'dan gelen Branch ID, yoksa varsayılan 1
        Product: product.product_id,
        Category: 3, // 3: Yeni model kategorisi
        daily_order: Math.floor(Math.random() * 50) + 1, // Günlük sipariş (örnek rastgele değer)
        DayOfWeek: today.getDay(),
        IsWeekend: today.getDay() === 0 || today.getDay() === 6 ? 1 : 0,
        Month: today.getMonth() + 1,
        Quarter: Math.floor((today.getMonth() + 3) / 3),
        Year: today.getFullYear(),
        RollingMean: getRandomValue(10, 100), // Rastgele hareketli ortalama
        RollingStd: getRandomValue(1, 10), // Rastgele standart sapma
        RollingMean_7: getRandomValue(20, 120), // 7 günlük ortalama
        RollingStd_7: getRandomValue(2, 15), // 7 günlük standart sapma
        Branch_Avg: getRandomValue(50, 200), // Şube bazlı ortalama
        Category_Sum: getRandomValue(1000, 5000), // Kategori toplamı
    }));
};

// Modül olarak dışa aktarma
module.exports = {
    generatePastaData,
    generateTatliData,
    generateCesitData,
};
