exports.renderIndex = (req, res) => {
    const user = req.session.user; // Oturumdaki kullanıcı bilgilerini al
    res.render('index', { user }); // Ana sayfa görünümünü render et
};
