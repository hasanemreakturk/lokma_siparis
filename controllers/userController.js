const { User, Role, Branch } = require('../models');
const bcrypt = require('bcryptjs');

// Kullanıcı Kaydı Sayfasını Getir
exports.getRegisterForm = async (req, res) => {
  try {
    const roles = await Role.findAll(); // Tüm rolleri al
    const branches = await Branch.findAll(); // Tüm şubeleri al
    res.render('register', { roles, branches }); // Verileri şablona gönder
  } catch (error) {
    console.error('Rol veya şube bilgileri alınırken hata oluştu:', error);
    res.status(500).send('Bir hata oluştu.');
  }
};

// Kullanıcı Kaydı Yap
exports.registerUser = async (req, res) => {
  try {
    const { username, password, role_id, branch_id } = req.body;

    // Alanların eksik olup olmadığını kontrol et
    if (!username || !password || !role_id || !branch_id) {
      return res.status(400).send('Tüm alanlar doldurulmalıdır.');
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 14);

    // Yeni kullanıcı oluştur
    await User.create({
      username,
      password: hashedPassword,
      role_id,
      branch_id,
    });

    console.log('Kayıt başarılı!');
    res.redirect('/user/login');
  } catch (error) {
    console.error('Kayıt sırasında hata:', error);
    res.status(500).send('Bir hata oluştu.');
  }
};

// Kullanıcı Giriş Formunu Getir
exports.getLoginForm = (req, res) => {
  res.render('login', { error: null }); // Giriş formunu render et
};

// Kullanıcı Girişi Yap
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kullanıcıyı veritabanında ara
    const user = await User.findOne({
      where: { username },
      include: [
        { model: Role, attributes: ['role_name'] },
        { model: Branch, attributes: ['name'] },
      ],
    });

    if (!user) {
      return res.render('login', { error: 'Kullanıcı adı veya şifre hatalı!' });
    }

    // Şifre doğrulama
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render('login', { error: 'Kullanıcı adı veya şifre hatalı!' });
    }

    // Giriş başarılı, oturum oluştur
    req.session.user = {
      id: user.user_id,
      username: user.username,
      role: user.Role.role_name,
      branch: user.Branch.name,
      role_id: user.role_id,
      branch_id: user.branch_id,
    };
  
    if (user.role_id === 1) {
      res.redirect('/admin'); // Admin yönlendirmesi
    } else if (user.role_id === 2) {
      res.redirect('/siparis'); // Sipariş sayfasına yönlendirme
    } else if (user.role_id === 3) {
      res.redirect('/imalathane'); // İmalathane yönlendirmesi
    } else {
      res.status(403).send('Yetkisiz giriş'); // Yetkisiz rol için hata mesajı
    }
  } catch (error) {
    console.error('Giriş sırasında hata oluştu:', error);
    res.status(500).send('Bir hata oluştu.');
  }
};

// Kullanıcı Çıkışı Yap
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Oturum kapatılırken hata oluştu:', err);
      return res.status(500).send('Bir hata oluştu.');
    }
    res.redirect('/user/login'); // Oturum kapatıldıktan sonra login sayfasına yönlendirme
  });
};
