// ============================================
// SMERT-SHOP - Логика корзины
// ============================================

// Добавление программы в корзину
function addToCart(program) {
    const cart = getCart();
    
    // Проверка, есть ли уже программа в корзине
    const existingItem = cart.find(item => item.id === program.id);
    
    if (existingItem) {
        showNotification('Программа уже в корзине', 'error');
        return;
    }

    cart.push({
        id: program.id,
        name: program.name,
        description: program.description,
        icon: program.icon,
        downloadUrl: program.downloadUrl,
        type: program.type,
        addedAt: new Date().toISOString()
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showNotification('Программа добавлена в корзину');
}

// Удаление программы из корзины
function removeFromCart(programId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== programId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showNotification('Программа удалена из корзины');
}

// Получение корзины
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Очистка корзины
function clearCart() {
    localStorage.removeItem('cart');
    updateCartBadge();
}

// Скачивание программы
function downloadProgram(programId) {
    const program = getProgramById(programId);
    if (!program) {
        showNotification('Программа не найдена', 'error');
        return;
    }

    // Добавление в историю скачиваний
    if (isAuthenticated()) {
        addDownload(program.name);
    }
    
    // Реальное скачивание
    if (program.type === 'plugin') {
        // Для плагинов открываем Telegram ссылку
        window.open(program.downloadUrl, '_blank');
        showNotification(`Открываем Telegram для ${program.name}...`);
    } else {
        // Для программ запускаем скачивание файла
        const link = document.createElement('a');
        link.href = program.downloadUrl;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification(`Скачивание ${program.name} начато...`);
    }
}

// Скачивание всех программ из корзины
function downloadAll() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }

    cart.forEach((program, index) => {
        setTimeout(() => {
            downloadProgram(program.id);
        }, index * 500);
    });

    // Очистка корзины после скачивания
    setTimeout(() => {
        clearCart();
        if (window.location.pathname.includes('cart.html')) {
            window.location.reload();
        }
    }, cart.length * 500 + 2000);
}

// Обновление счётчика корзины
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const cart = getCart();
        const itemCount = cart.length;
        badge.textContent = itemCount;
        badge.style.display = itemCount > 0 ? 'inline-block' : 'none';
    }
}

// Отрисовка элементов корзины
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartActions = document.querySelector('.cart-actions');
    
    if (!cartItemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartEmpty.style.display = 'block';
        cartActions.style.display = 'none';
        return;
    }

    cartItemsContainer.style.display = 'block';
    cartEmpty.style.display = 'none';
    cartActions.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h3>${item.icon} ${item.name}</h3>
                <p>${item.description}</p>
                <small style="color: var(--text-secondary);">${item.type === 'plugin' ? 'Плагин FPC' : 'Программа'}</small>
            </div>
            <div>
                <button class="btn btn-primary" onclick="downloadProgram('${item.id}')">${item.type === 'plugin' ? 'Открыть в Telegram' : 'Скачать'}</button>
                <button class="btn btn-danger" onclick="removeFromCart('${item.id}'); renderCartItems();">Удалить</button>
            </div>
        </div>
    `).join('');
}

// Каталог программ
const programs = [
    {
        id: 'funpay-cardinal',
        name: 'FunPay Cardinal',
        description: 'Бот для автоматизации продаж на FunPay',
        icon: '🤖',
        downloadUrl: 'https://github.com/sidor0912/FunPayCardinal/archive/refs/heads/master.zip',
        type: 'program'
    },
    {
        id: 'auto-clicker',
        name: 'Auto Clicker',
        description: 'Автоматический кликер с настройками',
        icon: '🖱️',
        downloadUrl: 'https://github.com/oriash93/AutoClicker/releases/download/v1.0.0.0/AutoClicker.zip',
        type: 'program'
    },
    {
        id: 'autostars',
        name: 'AutoStars',
        description: 'Автоматическое выставление звёзд/отзывов',
        icon: '⭐',
        downloadUrl: 'https://t.me/fpc_plugins',
        type: 'plugin'
    },
    {
        id: 'cookie-changer',
        name: 'Cookie Changer',
        description: 'Смена golden_key прямо в боте',
        icon: '🍪',
        downloadUrl: 'https://t.me/fpc_plugins',
        type: 'plugin'
    },
    {
        id: 'advanced-profile-stats',
        name: 'Advanced Profile Stats',
        description: 'Статистика заработка, сумма к выводу',
        icon: '📊',
        downloadUrl: 'https://t.me/fpc_plugins',
        type: 'plugin'
    }
];

// Получение программы по ID
function getProgramById(id) {
    return programs.find(p => p.id === id);
}
