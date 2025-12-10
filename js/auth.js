// ============================================
// SMERT-SHOP - Система авторизации
// ============================================

// Генерация кода верификации
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Отправка кода верификации (имитация)
function sendVerificationCode(email, code) {
    // В реальном приложении здесь был бы вызов API для отправки email
    console.log(`Verification code for ${email}: ${code}`);
    
    // Сохраняем код в localStorage с timestamp
    const verificationData = {
        code: code,
        email: email,
        timestamp: Date.now(),
        expiresIn: 10 * 60 * 1000 // 10 минут
    };
    localStorage.setItem('verificationCode', JSON.stringify(verificationData));
    
    return { success: true, message: 'Код отправлен на email' };
}

// Проверка кода верификации
function verifyCode(email, inputCode) {
    const savedData = localStorage.getItem('verificationCode');
    
    if (!savedData) {
        return { success: false, message: 'Код верификации не найден' };
    }
    
    const verificationData = JSON.parse(savedData);
    
    // Проверка срока действия кода
    if (Date.now() - verificationData.timestamp > verificationData.expiresIn) {
        localStorage.removeItem('verificationCode');
        return { success: false, message: 'Код верификации истёк. Запросите новый код' };
    }
    
    // Проверка email
    if (verificationData.email !== email) {
        return { success: false, message: 'Email не совпадает' };
    }
    
    // Проверка кода
    if (verificationData.code !== inputCode.trim()) {
        return { success: false, message: 'Неверный код верификации' };
    }
    
    // Удаляем использованный код
    localStorage.removeItem('verificationCode');
    
    return { success: true, message: 'Email успешно подтверждён' };
}

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

    // Генерация и отправка кода верификации
    const verificationCode = generateVerificationCode();
    sendVerificationCode(email, verificationCode);

    // Сохраняем временные данные регистрации
    const tempRegistration = {
        email: email,
        password: password,
        timestamp: Date.now()
    };
    localStorage.setItem('tempRegistration', JSON.stringify(tempRegistration));

    return { 
        success: true, 
        message: 'Код верификации отправлен на ваш email',
        needsVerification: true,
        code: verificationCode // В демо-режиме показываем код
    };
}

// Завершение регистрации после верификации
function completeRegistration(email, verificationCode) {
    // Проверка кода
    const verifyResult = verifyCode(email, verificationCode);
    if (!verifyResult.success) {
        return verifyResult;
    }
    
    // Получаем временные данные регистрации
    const tempData = localStorage.getItem('tempRegistration');
    if (!tempData) {
        return { success: false, message: 'Данные регистрации не найдены' };
    }
    
    const tempRegistration = JSON.parse(tempData);
    
    // Проверка email
    if (tempRegistration.email !== email) {
        return { success: false, message: 'Email не совпадает' };
    }
    
    // Создание нового пользователя
    const users = getUsers();
    const newUser = {
        id: Date.now(),
        email: email,
        password: tempRegistration.password,
        registeredAt: new Date().toISOString(),
        verified: true
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.removeItem('tempRegistration');

    return { success: true, message: 'Регистрация успешно завершена!' };
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

