<script>
        // Tatlı Siparişinden Pasta Siparişine Geçiş
        document.getElementById('next-to-pasta').addEventListener('click', () => {
            toggleVisibility('tatli-siparis', 'pasta-siparis');
        });
    
        // Pasta Siparişinden Tatlı Siparişine Geri Dönüş
        document.getElementById('back-to-tatli').addEventListener('click', () => {
            toggleVisibility('pasta-siparis', 'tatli-siparis');
        });
    
        // Pasta Siparişinden Çeşit Siparişine Geçiş
        document.getElementById('next-to-cesit').addEventListener('click', () => {
            toggleVisibility('pasta-siparis', 'cesit-siparis');
        });
    
        // Çeşit Siparişinden Pasta Siparişine Geri Dönüş
        document.getElementById('back-to-pasta').addEventListener('click', () => {
            toggleVisibility('cesit-siparis', 'pasta-siparis');
        });
    
        // Tüm Siparişleri Göster
        document.getElementById('show-all-orders').addEventListener('click', () => {
            const orders = collectOrders();
            displayOrders(orders);
            toggleVisibility('cesit-siparis', 'all-orders');
        });
        // Çeşit Siparişine Dön Butonu
document.getElementById('back-to-cesit').addEventListener('click', () => {
    document.getElementById('all-orders').classList.add('d-none');
    document.getElementById('cesit-siparis').classList.remove('d-none');
});

// Pasta Siparişine Dön Butonu
document.getElementById('back-to-pasta').addEventListener('click', () => {
    document.getElementById('all-orders').classList.add('d-none');
    document.getElementById('pasta-siparis').classList.remove('d-none');
});
    
        // Siparişleri Onayla ve Gönder
        document.getElementById('confirm-orders').addEventListener('click', () => {
            const { tatlilar, pastalar, cesitler } = collectOrders();
            submitOrders(tatlilar, pastalar, cesitler);
        });
    
        // Yardımcı Fonksiyonlar
    
        // Ekranlar arasında geçiş yapar
        function toggleVisibility(hideId, showId) {
            document.getElementById(hideId).classList.add('d-none');
            document.getElementById(showId).classList.remove('d-none');
        }
    
        // Formlardan siparişleri toplar
        function collectOrders() {
            const tatliForm = new FormData(document.getElementById('tatli-form'));
            const pastaForm = new FormData(document.getElementById('pasta-form'));
            const cesitForm = new FormData(document.getElementById('cesit-form'));
    
            const tatlilar = parseFormData(tatliForm, 'tatlilar');
            const pastalar = parseFormData(pastaForm, 'pastalar');
            const cesitler = parseFormData(cesitForm, 'cesitler');
    
            return { tatlilar, pastalar, cesitler };
        }
    
        // Form verilerini belirli bir formata göre işler
        function parseFormData(formData, type) {
            const result = [];
            formData.forEach((value, key) => {
                const match = key.match(new RegExp(`^${type}\\[(\\d+)]\\[(\\w+)]$`));
                if (match) {
                    const index = match[1];
                    const field = match[2];
                    result[index] = result[index] || {};
                    result[index][field] = value;
                }
            });
            return result;
        }
    
        // Sipariş özetini ekranda gösterir
        function displayOrders({ tatlilar, pastalar, cesitler }) {
            const ordersSummary = document.getElementById('orders-summary');
            ordersSummary.innerHTML = '';
    
            [...tatlilar, ...pastalar, ...cesitler].forEach((order, index) => {
                if (order.kg > 0 || order.adet > 0) {
                    ordersSummary.innerHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${order.tatli || order.pasta || order.cesit}</td>
                            <td>${order.kg || order.adet}</td>
                        </tr>
                    `;
                }
            });
        }
    
        // Siparişleri sunucuya gönderir
        function submitOrders(tatlilar, pastalar, cesitler) {
            fetch('/siparis/siparisGonder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tatlilar, pastalar, cesitler }),
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Siparişler başarıyla gönderildi!');
                        window.location.href = '/siparis';
                    } else {
                        response.text().then((text) => alert(`Hata: ${text}`));
                    }
                })
                .catch((error) => console.error('Fetch sırasında hata:', error));
        }
    </script>