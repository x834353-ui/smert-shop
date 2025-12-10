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
function downloadProgram(programName) {
    // Добавление в историю скачиваний
    if (isAuthenticated()) {
        addDownload(programName);
    }
    
    // Демо-алерт (в реальном приложении здесь был бы реальный файл)
    showNotification(`Скачивание ${programName} начато...`);
    
    // Имитация скачивания
    setTimeout(() => {
        showNotification(`${programName} успешно скачан!`);
    }, 2000);
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
            downloadProgram(program.name);
        }, index * 500);
    });

    // Очистка корзины после скачивания
    setTimeout(() => {
        clearCart();
        if (window.location.pathname.includes('cart.html')) {
            window.location.reload();
        }
    }, cart.length * 500 + 2500);
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
            </div>
            <div>
                <button class="btn btn-primary" onclick="downloadProgram('${item.name}')">Скачать</button>
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
        description: 'Бот для автоматизации продаж на FunPay. Полный функционал для управления заказами.',
        icon: '🤖',
        link: 'https://github.com/sidor0912/FunPayCardinal',
        linkText: 'GitHub'
    },
    {
        id: 'auto-clicker',
        name: 'Auto Clicker',
        description: 'Автоматический кликер с гибкими настройками интервалов и горячих клавиш.',
        icon: '🖱️',
        link: 'https://github.com/robiot/xclicker',
        linkText: 'GitHub'
    },
    {
        id: 'autostars',
        name: 'AutoStars',
        description: 'Плагин для FPC: Автоматическое выставление звёзд и отзывов покупателям.',
        icon: '⭐',
        link: 'https://t.me/fpc_plugins',
        linkText: 'Telegram @fpc_plugins'
    },
    {
        id: 'cookie-changer',
        name: 'Cookie Changer',
        description: 'Плагин для FPC: Смена golden_key прямо в боте без перезагрузки.',
        icon: '🍪',
        link: 'https://t.me/fpc_plugins',
        linkText: 'Telegram @fpc_plugins'
    },
    {
        id: 'advanced-profile-stats',
        name: 'Advanced Profile Stats',
        description: 'Плагин для FPC: Расширенная статистика заработка и сумма к выводу.',
        icon: '📊',
        link: 'https://t.me/fpc_plugins',
        linkText: 'Telegram @fpc_plugins'
    }
];

// Получение программы по ID
function getProgramById(id) {
    return programs.find(p => p.id === id);
}
