const permissions = {
    1: { routes: ['*'], branches: null }, // Admin: Tüm rotalara ve şubelere erişim
    2: { routes: ['/siparis', '/user/login'], branches: null }, // Worker: Belirli rotalar
    3: { routes: ['/imalathane','/imalathane2'], branches: null}
};

const globalAuthMiddleware = (req, res, next) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect('/user/login');
    }

    console.log('Kullanıcı Bilgisi:', user);
    console.log('İstek URL:', req.originalUrl);

    const userPermissions = permissions[user.role_id] || { routes: [], branches: [] };

    // Rota kontrolü
    const hasRouteAccess = userPermissions.routes.some(route => 
        route === '*' || req.originalUrl.startsWith(route)
    );

    if (!hasRouteAccess) {
        console.log(
            `Yetkisiz erişim: ${req.originalUrl} - Role ID: ${user.role_id}, Branch ID: ${user.branch_id}`
        );
        return res.status(403).send('Erişim Yetkiniz Yok.');
    }

    return next();
};

module.exports = globalAuthMiddleware;
