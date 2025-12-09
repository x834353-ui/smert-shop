// ============================================
// SMERT-SHOP - Каталог программ
// ============================================

// Каталог программ с реальными GitHub репозиториями
const programs = [
    {
        id: 'funpay-cardinal',
        name: 'FunPay Cardinal',
        description: 'Мощный бот для автоматизации продаж на платформе FunPay',
        icon: '🤖',
        github: 'https://github.com/sidor0912/FunPayCardinal'
    },
    {
        id: 'auto-clicker',
        name: 'Auto Clicker',
        description: 'Автоматический кликер с настройками интервалов и горячих клавиш',
        icon: '🖱️',
        github: 'https://github.com/oxodao/AutoClicker'
    },
    {
        id: 'python-telegram-bot',
        name: 'Python Telegram Bot',
        description: 'Библиотека для создания Telegram ботов на Python',
        icon: '💬',
        github: 'https://github.com/python-telegram-bot/python-telegram-bot'
    },
    {
        id: 'selenium',
        name: 'Selenium',
        description: 'Фреймворк для автоматизации веб-браузеров',
        icon: '🌐',
        github: 'https://github.com/SeleniumHQ/selenium'
    },
    {
        id: 'pyautogui',
        name: 'PyAutoGUI',
        description: 'Кросс-платформенная библиотека для автоматизации GUI',
        icon: '⌨️',
        github: 'https://github.com/asweigart/pyautogui'
    },
    {
        id: 'scrapy',
        name: 'Scrapy',
        description: 'Мощный фреймворк для веб-скрапинга и парсинга данных',
        icon: '🕷️',
        github: 'https://github.com/scrapy/scrapy'
    }
];

// Отрисовка программ на главной странице
document.addEventListener('DOMContentLoaded', function() {
    const containers = ['programs-grid', 'catalog-programs'];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = programs.map(program => `
                <div class="program-card">
                    <span class="program-icon">${program.icon}</span>
                    <h3>${program.name}</h3>
                    <p>${program.description}</p>
                    <a href="${program.github}" target="_blank" class="btn btn-primary">
                        Перейти на GitHub
                    </a>
                </div>
            `).join('');
        }
    });
});

// Получение программы по ID
function getProgramById(id) {
    return programs.find(p => p.id === id);
}
