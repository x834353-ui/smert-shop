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
        id: 'cardinal-bot',
        name: 'Cardinal Bot',
        description: 'Мощный бот для автоматизации задач и процессов',
        icon: '🤖'
    },
    {
        id: 'funpay-tools',
        name: 'FunPay Tools',
        description: 'Набор инструментов для работы с FunPay',
        icon: '🛠️'
    },
    {
        id: 'auto-clicker',
        name: 'Auto Clicker',
        description: 'Автоматический кликер с настройками',
        icon: '🖱️',
        link: 'https://github.com/oriash93/AutoClicker'
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Генератор надёжных паролей',
        icon: '🔐'
    }
];

// FunPay Cardinal плагины
const plugins = [
    {
        id: 'auto-stars',
        name: 'AutoStars',
        description: 'Автоматизация рейтингов и отзывов',
        icon: '⭐',
        type: 'Бесплатный плагин'
    },
    {
        id: 'cookie-changer',
        name: 'Cookie Changer',
        description: 'Смена golden_key прямо в боте',
        icon: '🍪',
        link: 'https://t.me/fpc_plugins',
        type: 'Бесплатный плагин'
    },
    {
        id: 'profile-stats',
        name: 'Advanced Profile Stats',
        description: 'Статистика, сумма к выводу и другие параметры',
        icon: '📊',
        type: 'Бесплатный плагин'
    },
    {
        id: 'fpc-plugins-repo',
        name: 'FunPay Cardinal Plugins',
        description: 'GitHub репозиторий с плагинами',
        icon: '🔌',
        link: 'https://github.com/SellPay1/FunPayCardinalPlugins',
        type: 'Репозиторий'
    }
];

// Получение программы по ID
function getProgramById(id) {
    return programs.find(p => p.id === id);
}
