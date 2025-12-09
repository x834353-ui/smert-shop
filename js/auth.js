// ============================================
// SMERT-SHOP - Система авторизации
// ============================================

// Регистрация нового пользователя
function register(email, password, confirmPassword) {
    // Валидация
    if (!email || !password || !confirmPassword) {
        return { success: false, message: 'Заполните все поля' };
    }

    if (!isValidEmail(email)) {
        return { success: false, message: 'Некорректный email адрес' };
    }

    if (password.length < 6) {
        return { success: false, message: 'Пароль должен быть не менее 6 символов' };
    }

    if (password !== confirmPassword) {
        return { success: false, message: 'Пароли не совпадают' };
    }

    // Проверка существования пользователя
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Пользователь с таким email уже существует' };
    }

    // Создание нового пользователя
    const newUser = {
        id: Date.now(),
        email: email,
        password: password, // В реальном приложении пароль должен быть зашифрован
        registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true, message: 'Регистрация успешна!' };
}

// Вход пользователя
function login(email, password) {
    // Валидация
    if (!email || !password) {
        return { success: false, message: 'Заполните все поля' };
    }

    // Поиск пользователя
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return { success: false, message: 'Неверный email или пароль' };
    }

    // Сохранение сессии
    const session = {
        id: user.id,
        email: user.email,
        loginAt: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(session));

    return { success: true, message: 'Вход выполнен успешно!', user: session };
}

// Выход пользователя
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Проверка авторизации (для защищённых страниц)
function requireAuth() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Получение всех пользователей
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Получение текущего пользователя
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Проверка авторизации
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Валидация email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Получение истории скачиваний пользователя
function getUserDownloads() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const downloads = localStorage.getItem(`downloads_${currentUser.id}`);
    return downloads ? JSON.parse(downloads) : [];
}

// Добавление скачивания в историю
function addDownload(programName) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const downloads = getUserDownloads();
    downloads.unshift({
        name: programName,
        date: new Date().toISOString()
    });

    // Ограничение истории до 50 записей
    if (downloads.length > 50) {
        downloads.pop();
    }

    localStorage.setItem(`downloads_${currentUser.id}`, JSON.stringify(downloads));
}
