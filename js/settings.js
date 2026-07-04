// ============================================================================
// ПАНЕЛИ НАСТРОЕК — УПРАВЛЕНИЕ И СОХРАНЕНИЕ
// ============================================================================
// Этот файл отвечает за:
//
// 1. УПРАВЛЕНИЕ ПАНЕЛЯМИ
//    - Открытие/закрытие меню категорий
//    - Переключение между панелями (НЛО и дым / Часы)
//    - Кнопки "Назад" для возврата в меню
//    - Плавные анимации появления/исчезновения
//
// 2. НАСТРОЙКИ НЛО И ДЫМА
//    - Сохранение настроек в localStorage
//    - Загрузка настроек из localStorage
//    - Применение настроек к НЛО через window.updateSquidParams()
//    - Кнопка сброса к значениям по умолчанию
//
// 3. ОБРАБОТЧИКИ СОБЫТИЙ
//    - При изменении любого ползунка — сохраняем и применяем
//    - При загрузке страницы — восстанавливаем сохранённые настройки
// ============================================================================

// ============================================================================
// 1. ПОЛУЧЕНИЕ DOM-ЭЛЕМЕНТОВ
// ============================================================================

// Панель меню выбора категорий (первое окно)
const menuPanel = document.getElementById("categoryMenu");

// Панель настроек НЛО и дыма
const ufoPanel = document.getElementById("ufoSettings");

// Панель настроек часов
const clockPanel = document.getElementById("clockSettings");

// Главная кнопка настроек (шестерёнка)
const settingsBtn = document.getElementById("settingsBtn");

// Флаг: открыто ли сейчас меню категорий
let isMenuVisible = false;

// ============================================================================
// 2. УПРАВЛЕНИЕ ПАНЕЛЯМИ (ПЛАВНОЕ ОТКРЫТИЕ/ЗАКРЫТИЕ)
// ============================================================================

// Закрывает все панели (убирает класс .show)
function hideAllPanels() {
    // Перебираем все три панели и удаляем класс .show
    [menuPanel, ufoPanel, clockPanel].forEach((panel) => {
        if (panel) panel.classList.remove("show");
    });
}

// Показывает нужную панель (с плавной анимацией)
// Сначала закрывает все, затем через 10 миллисекунд показывает нужную
function showPanel(panelToShow) {
    hideAllPanels(); // Закрываем всё
    setTimeout(() => {
        if (panelToShow) panelToShow.classList.add("show"); // Открываем нужную
    }, 10); // Небольшая задержка для плавности CSS-переходов
}

// ============================================================================
// 3. ОБРАБОТЧИК ГЛАВНОЙ КНОПКИ НАСТРОЕК
// ============================================================================

// При клике на шестерёнку — открываем или закрываем меню категорий
settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Чтобы событие не всплыло и не закрыло панель сразу

    if (isMenuVisible) {
        // Если меню открыто — закрываем
        menuPanel.classList.remove("show");
        isMenuVisible = false;
    } else {
        // Если меню закрыто — открываем
        hideAllPanels(); // Закрываем все панели на всякий случай
        setTimeout(() => {
            menuPanel.classList.add("show"); // Показываем меню
            isMenuVisible = true;
        }, 10);
    }
});

// ============================================================================
// 4. ОБРАБОТЧИКИ КНОПОК В МЕНЮ КАТЕГОРИЙ
// ============================================================================

// Кнопка "🛸 НЛО и дым" — открывает панель настроек НЛО
document.getElementById("chooseUFO").addEventListener("click", () => {
    showPanel(ufoPanel);
    isMenuVisible = false; // Меню категорий больше не видно
});

// Кнопка "🕒 Часы" — открывает панель настроек часов
document.getElementById("chooseClock").addEventListener("click", () => {
    showPanel(clockPanel);
    isMenuVisible = false;
});

// ============================================================================
// 5. ОБРАБОТЧИКИ КНОПОК "НАЗАД" В ПАНЕЛЯХ
// ============================================================================

// Кнопка "Назад" в панели НЛО — возвращает в меню категорий
document.getElementById("backFromUFO").addEventListener("click", () => {
    showPanel(menuPanel);
    isMenuVisible = true;
});

// Кнопка "Назад" в панели часов — возвращает в меню категорий
document.getElementById("backFromClock").addEventListener("click", () => {
    showPanel(menuPanel);
    isMenuVisible = true;
});

// ============================================================================
// 6. ЗНАЧЕНИЯ НАСТРОЕК ПО УМОЛЧАНИЮ
// ============================================================================
// Эти значения используются при первом запуске или при сбросе настроек
// Все значения — строки, так как они сохраняются в localStorage как строки

const DEFAULT_SETTINGS = {
    // Параметры НЛО
    squidRadius: "20", // Радиус НЛО (размер)
    squidWidthFactor: "15", // Растяжение по ширине
    squidHeightFactor: "12", // Растяжение по высоте
    squidDistance: "50", // Порог дистанции для поворота
    squidSpeed: "100", // Скорость НЛО (меньше = быстрее)

    // Параметры дыма
    smokeSize: "20", // Размер частицы дыма
    smokeFrequency: "1", // Частота появления (количество частиц за раз)
    smokeFade: "0.01", // Скорость угасания (меньше = дольше живёт)
    smokeSpread: "1", // Разлёт частиц в стороны
    smokeColor: "#ffffff", // Цвет дыма (HEX, #ffffff = белый)

    // Расстояние до курсора, на котором перестаёт идти дым
    distanceThreshold: "100",
};

// ============================================================================
// 7. СОХРАНЕНИЕ НАСТРОЕК В localStorage
// ============================================================================

// Собирает текущие значения из всех полей ввода и сохраняет в localStorage
// Возвращает объект с настройками
function saveSettings() {
    const settings = {
        // Параметры НЛО
        squidRadius:
            document.getElementById("squid-radius")?.value ||
            DEFAULT_SETTINGS.squidRadius,
        squidWidthFactor:
            document.getElementById("squid-width-factor")?.value ||
            DEFAULT_SETTINGS.squidWidthFactor,
        squidHeightFactor:
            document.getElementById("squid-height-factor")?.value ||
            DEFAULT_SETTINGS.squidHeightFactor,
        squidDistance:
            document.getElementById("squid-distance")?.value ||
            DEFAULT_SETTINGS.squidDistance,
        squidSpeed:
            document.getElementById("squidSpeed")?.value ||
            DEFAULT_SETTINGS.squidSpeed,

        // Параметры дыма
        smokeSize:
            document.getElementById("smoke-size")?.value ||
            DEFAULT_SETTINGS.smokeSize,
        smokeFrequency:
            document.getElementById("smoke-frequency")?.value ||
            DEFAULT_SETTINGS.smokeFrequency,
        smokeFade:
            document.getElementById("smoke-fade")?.value ||
            DEFAULT_SETTINGS.smokeFade,
        smokeSpread:
            document.getElementById("smoke-spread")?.value ||
            DEFAULT_SETTINGS.smokeSpread,
        smokeColor:
            document.getElementById("smoke-color")?.value ||
            DEFAULT_SETTINGS.smokeColor,
        distanceThreshold:
            document.getElementById("distance-threshold")?.value ||
            DEFAULT_SETTINGS.distanceThreshold,
    };

    // Сохраняем в localStorage под ключом "ufoSettings"
    localStorage.setItem("ufoSettings", JSON.stringify(settings));
    console.log("💾 Настройки НЛО сохранены:", settings);
    return settings;
}

// ============================================================================
// 8. ПРИМЕНЕНИЕ НАСТРОЕК К НЛО
// ============================================================================

// Принимает объект с настройками и применяет их к НЛО
// Вызывает функции из main.js: updateSquidParams() и updateSmokeColor()
function applySettingsToSquid(settings) {
    // Если в main.js есть функция updateSquidParams — вызываем её
    if (window.updateSquidParams) {
        window.updateSquidParams({
            squidRadius: parseFloat(settings.squidRadius),
            squidWidthFactor: parseFloat(settings.squidWidthFactor),
            squidHeightFactor: parseFloat(settings.squidHeightFactor),
            squidDistanceThreshold: parseFloat(settings.squidDistance),
            squidSpeedFactor: parseFloat(settings.squidSpeed),
            smokeSize: parseFloat(settings.smokeSize),
            smokeFrequency: parseFloat(settings.smokeFrequency),
            smokeFade: parseFloat(settings.smokeFade),
            smokeSpread: parseFloat(settings.smokeSpread),
            cursorDistanceThreshold: parseFloat(settings.distanceThreshold),
        });
    }

    // Если в main.js есть функция updateSmokeColor — вызываем её
    if (window.updateSmokeColor) {
        window.updateSmokeColor(settings.smokeColor);
    }
}

// ============================================================================
// 9. УСТАНОВКА ЗНАЧЕНИЙ В ПОЛЯ ВВОДА
// ============================================================================

// Принимает объект с настройками и заполняет ими все поля ввода на панели
function setInputValues(settings) {
    if (document.getElementById("squid-radius"))
        document.getElementById("squid-radius").value = settings.squidRadius;
    if (document.getElementById("squid-width-factor"))
        document.getElementById("squid-width-factor").value =
            settings.squidWidthFactor;
    if (document.getElementById("squid-height-factor"))
        document.getElementById("squid-height-factor").value =
            settings.squidHeightFactor;
    if (document.getElementById("squid-distance"))
        document.getElementById("squid-distance").value =
            settings.squidDistance;
    if (document.getElementById("squidSpeed"))
        document.getElementById("squidSpeed").value = settings.squidSpeed;
    if (document.getElementById("smoke-size"))
        document.getElementById("smoke-size").value = settings.smokeSize;
    if (document.getElementById("smoke-frequency"))
        document.getElementById("smoke-frequency").value =
            settings.smokeFrequency;
    if (document.getElementById("smoke-fade"))
        document.getElementById("smoke-fade").value = settings.smokeFade;
    if (document.getElementById("smoke-spread"))
        document.getElementById("smoke-spread").value = settings.smokeSpread;
    if (document.getElementById("smoke-color"))
        document.getElementById("smoke-color").value = settings.smokeColor;
    if (document.getElementById("distance-threshold"))
        document.getElementById("distance-threshold").value =
            settings.distanceThreshold;
}

// ============================================================================
// 10. ЗАГРУЗКА НАСТРОЕК И ПРИМЕНЕНИЕ
// ============================================================================

// Загружает настройки из localStorage (или берёт значения по умолчанию)
// Затем заполняет поля ввода и применяет настройки к НЛО
function loadAndApplySettings() {
    // Пытаемся загрузить сохранённые настройки
    const saved = localStorage.getItem("ufoSettings");
    let settings;

    if (saved) {
        // Если есть сохранённые настройки — используем их
        settings = JSON.parse(saved);
        console.log("📂 Загружены сохранённые настройки:", settings);
    } else {
        // Если сохранённых настроек нет — используем значения по умолчанию
        settings = { ...DEFAULT_SETTINGS };
        console.log("📂 Загружены настройки по умолчанию:", settings);
    }

    // Заполняем поля ввода
    setInputValues(settings);

    // Применяем настройки к НЛО
    applySettingsToSquid(settings);

    console.log("✅ Настройки НЛО загружены и применены");
}

// ============================================================================
// 11. ОБРАБОТЧИКИ ИЗМЕНЕНИЯ ПОЛЗУНКОВ
// ============================================================================

// Список ID всех полей ввода, за которыми нужно следить
const inputs = [
    "squid-radius",
    "squid-width-factor",
    "squid-height-factor",
    "squid-distance",
    "squidSpeed",
    "smoke-size",
    "smoke-frequency",
    "smoke-fade",
    "smoke-spread",
    "smoke-color",
    "distance-threshold",
];

// На каждый ползунок вешаем обработчик:
// при любом изменении — сохраняем настройки и применяем их к НЛО
function bindSettingsHandlers() {
    inputs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", () => {
                // Собираем текущие значения из всех полей
                const settings = {
                    squidRadius:
                        document.getElementById("squid-radius")?.value ||
                        DEFAULT_SETTINGS.squidRadius,
                    squidWidthFactor:
                        document.getElementById("squid-width-factor")?.value ||
                        DEFAULT_SETTINGS.squidWidthFactor,
                    squidHeightFactor:
                        document.getElementById("squid-height-factor")?.value ||
                        DEFAULT_SETTINGS.squidHeightFactor,
                    squidDistance:
                        document.getElementById("squid-distance")?.value ||
                        DEFAULT_SETTINGS.squidDistance,
                    squidSpeed:
                        document.getElementById("squidSpeed")?.value ||
                        DEFAULT_SETTINGS.squidSpeed,
                    smokeSize:
                        document.getElementById("smoke-size")?.value ||
                        DEFAULT_SETTINGS.smokeSize,
                    smokeFrequency:
                        document.getElementById("smoke-frequency")?.value ||
                        DEFAULT_SETTINGS.smokeFrequency,
                    smokeFade:
                        document.getElementById("smoke-fade")?.value ||
                        DEFAULT_SETTINGS.smokeFade,
                    smokeSpread:
                        document.getElementById("smoke-spread")?.value ||
                        DEFAULT_SETTINGS.smokeSpread,
                    smokeColor:
                        document.getElementById("smoke-color")?.value ||
                        DEFAULT_SETTINGS.smokeColor,
                    distanceThreshold:
                        document.getElementById("distance-threshold")?.value ||
                        DEFAULT_SETTINGS.distanceThreshold,
                };
                // Сохраняем в localStorage
                localStorage.setItem("ufoSettings", JSON.stringify(settings));
                // Применяем к НЛО
                applySettingsToSquid(settings);
            });
        }
    });
}

// ============================================================================
// 12. КНОПКА СБРОСА НАСТРОЕК
// ============================================================================

// При клике на кнопку "Сбросить настройки" —
// устанавливаем значения по умолчанию в поля ввода,
// сохраняем их в localStorage и применяем к НЛО
document.getElementById("reset-button")?.addEventListener("click", () => {
    console.log("🔄 СБРОС НАСТРОЕК НЛО к значениям по умолчанию");

    // Устанавливаем значения по умолчанию в поля ввода
    setInputValues(DEFAULT_SETTINGS);

    // Сохраняем настройки по умолчанию в localStorage
    localStorage.setItem("ufoSettings", JSON.stringify(DEFAULT_SETTINGS));

    // Применяем к НЛО
    applySettingsToSquid(DEFAULT_SETTINGS);

    console.log("✅ Сброс завершён! Значения по умолчанию:", DEFAULT_SETTINGS);
});

// ============================================================================
// 13. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================================================

// Запускаем всё через 100 миллисекунд после загрузки страницы
// Небольшая задержка нужна, чтобы все DOM-элементы точно были готовы
setTimeout(() => {
    bindSettingsHandlers(); // Вешаем обработчики на все ползунки
    loadAndApplySettings(); // Загружаем настройки и применяем их
}, 100);
