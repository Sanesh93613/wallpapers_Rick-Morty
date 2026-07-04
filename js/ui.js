// ============================================================================
// UI — КНОПКА НАСТРОЕК С КРЕСТИКОМ И АВТОСКРЫТИЕМ
// ============================================================================
// Этот файл отвечает за:
//
// 1. КНОПКА НАСТРОЕК
//    - Добавляет крестик справа (для автоскрытия)
//    - Добавляет иконку часов слева (для показа/скрытия часов)
//    - Анимация исчезновения (vanish) и появления (appear)
//    - Подсказка-стрелочка, когда кнопка скрыта
//
// 2. АВТОСКРЫТИЕ
//    - При клике на крестик кнопка плавно исчезает
//    - При наведении в левый нижний угол — плавно появляется
//    - Через 5 секунд бездействия — снова исчезает
//    - Состояние сохраняется в localStorage
//
// 3. ЧАСЫ
//    - Иконка часов слева включает/выключает отображение часов
//    - Состояние сохраняется в localStorage
// ============================================================================

// ============================================================================
// 1. ЗАГРУЗКА СОХРАНЁННОГО СОСТОЯНИЯ ПРИ СТАРТЕ
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Получаем главную кнопку настроек
    const settingsBtn = document.getElementById("settingsBtn");

    // --- ЗАГРУЗКА СОСТОЯНИЯ АВТОСКРЫТИЯ ---
    // autoHideEnabled: включён ли режим автоскрытия (зелёный крестик = 🔓)
    let autoHideEnabled = localStorage.getItem("autoHideEnabled") === "true";
    // isHidden: скрыта ли сейчас кнопка
    let isHidden = localStorage.getItem("isHidden") === "true";

    // --- ЗАГРУЗКА СОСТОЯНИЯ ЧАСОВ ---
    // clockEnabled: показаны ли часы
    // По умолчанию включены ( !== "false" ), а не выключены
    let clockEnabled = localStorage.getItem("planetClockEnabled") !== "false";

    // Если в localStorage ничего нет — устанавливаем значения по умолчанию
    if (localStorage.getItem("autoHideEnabled") === null) {
        autoHideEnabled = false; // Автоскрытие выключено
        isHidden = false; // Кнопка видна
    }
    if (localStorage.getItem("planetClockEnabled") === null) {
        clockEnabled = true; // Часы скрыты по умолчанию
    }

    // ============================================================================
    // 2. ДОБАВЛЕНИЕ КРЕСТИКА И ИКОНКИ ЧАСОВ
    // ============================================================================

    if (settingsBtn) {
        // --- КРЕСТИК (справа от кнопки) ---
        const cross = document.createElement("span");
        // Если автоскрытие включено — замок 🔓, если выключено — крестик ✖
        cross.textContent = autoHideEnabled ? "🔓" : "✖";
        cross.style.position = "absolute";
        cross.style.top = "-8px"; // Выступает над кнопкой
        cross.style.right = "-8px"; // Выступает справа от кнопки
        cross.style.width = "20px";
        cross.style.height = "20px";
        cross.style.backgroundColor = autoHideEnabled ? "#44ff44" : "#ff4444"; // Зелёный или красный
        cross.style.color = "white";
        cross.style.borderRadius = "50%"; // Круглая форма
        cross.style.display = "flex";
        cross.style.alignItems = "center";
        cross.style.justifyContent = "center";
        cross.style.fontSize = "12px";
        cross.style.fontWeight = "bold";
        cross.style.cursor = "pointer";
        cross.style.border = "1px solid white";
        cross.style.zIndex = "1000";
        cross.style.transition = "all 0.2s ease";
        settingsBtn.appendChild(cross);

        // --- ИКОНКА ЧАСОВ (слева от кнопки) ---
        const clockIcon = document.createElement("span");
        clockIcon.textContent = "🕒";
        clockIcon.style.position = "absolute";
        clockIcon.style.top = "-8px"; // Выступает над кнопкой
        clockIcon.style.left = "-8px"; // Выступает слева от кнопки
        clockIcon.style.width = "20px";
        clockIcon.style.height = "20px";
        clockIcon.style.backgroundColor = clockEnabled ? "#44ff44" : "#444444"; // Зелёный или серый
        clockIcon.style.color = "white";
        clockIcon.style.borderRadius = "50%";
        clockIcon.style.display = "flex";
        clockIcon.style.alignItems = "center";
        clockIcon.style.justifyContent = "center";
        clockIcon.style.fontSize = "12px";
        clockIcon.style.cursor = "pointer";
        clockIcon.style.border = "1px solid white";
        clockIcon.style.zIndex = "1000";
        clockIcon.style.transition = "all 0.2s ease";
        settingsBtn.appendChild(clockIcon);

        // Если кнопка должна быть скрыта — сразу прячем
        if (isHidden) {
            settingsBtn.style.display = "none";
        }

        // ============================================================================
        // 3. АНИМАЦИИ ДЛЯ КНОПКИ (vanish / appear)
        // ============================================================================

        // Динамически добавляем CSS-анимации в head
        const style = document.createElement("style");
        style.textContent = `
            /* Анимация исчезновения кнопки */
            .btn-vanish {
                animation: vanishAnim 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
            }
            /* Анимация появления кнопки */
            .btn-appear {
                animation: appearAnim 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
            }
            /* Исчезновение: масштаб → 0, прозрачность → 0, размытие → 12px */
            @keyframes vanishAnim {
                0% { transform: scale(1); opacity: 1; filter: blur(0); }
                30% { transform: scale(1.02); opacity: 0.9; filter: blur(0); }
                100% { transform: scale(0); opacity: 0; filter: blur(12px); display: none; }
            }
            /* Появление: масштаб → 1, прозрачность → 1, размытие → 0 */
            @keyframes appearAnim {
                0% { transform: scale(0); opacity: 0; filter: blur(12px); display: inline-block; }
                60% { transform: scale(1.02); opacity: 0.9; filter: blur(2px); }
                100% { transform: scale(1); opacity: 1; filter: blur(0); }
            }
        `;
        document.head.appendChild(style);

        // ============================================================================
        // 4. ПЕРЕМЕННЫЕ ДЛЯ ТАЙМЕРОВ И АНИМАЦИЙ
        // ============================================================================

        let timeoutId = null; // Таймер для автоматического исчезновения
        let animating = false; // Флаг: выполняется ли анимация
        let vanishTimer = null; // Таймер для анимации исчезновения
        let hintTimeout = null; // Таймер для подсказки-стрелочки

        // ============================================================================
        // 5. ПОДСКАЗКА-СТРЕЛОЧКА (появляется, когда кнопка скрыта)
        // ============================================================================

        const showHint = () => {
            // Удаляем старую подсказку, если есть
            const oldHint = document.querySelector(".hint-dot");
            if (oldHint) oldHint.remove();

            // Создаём новую подсказку
            const hint = document.createElement("div");
            hint.className = "hint-dot";
            hint.innerHTML = "⬅️"; // Стрелочка влево

            // Стрелочка появляется в левом нижнем углу (где ожидается кнопка)
            hint.style.position = "fixed";
            hint.style.bottom = "20px";
            hint.style.left = "60px";
            hint.style.fontSize = "36px";
            hint.style.opacity = "1";
            hint.style.pointerEvents = "none"; // Чтобы не мешала кликам
            hint.style.zIndex = "999";
            hint.style.textShadow = "0 0 5px black";
            hint.style.transition = "opacity 0.2s ease";
            document.body.appendChild(hint);

            // Эффект пульсации (меняем прозрачность туда-сюда)
            let pulseDirection = -1; // -1 = уменьшение, 1 = увеличение
            const interval = setInterval(() => {
                if (!hint.isConnected) {
                    clearInterval(interval);
                    return;
                }
                let currentOp = parseFloat(hint.style.opacity);
                if (isNaN(currentOp)) currentOp = 1;
                let newOp = currentOp + pulseDirection * 0.05;
                if (newOp <= 0.3) {
                    newOp = 0.3;
                    pulseDirection = 1; // Достигли минимума — начинаем увеличивать
                } else if (newOp >= 1) {
                    newOp = 1;
                    pulseDirection = -1; // Достигли максимума — начинаем уменьшать
                }
                hint.style.opacity = newOp;
            }, 50);

            // Через 9.5 секунд начинаем исчезать, через 10 секунд удаляем
            setTimeout(() => {
                clearInterval(interval);
                if (hint.isConnected) {
                    hint.style.transition = "opacity 0.5s ease";
                    hint.style.opacity = "0";
                    setTimeout(() => hint.remove(), 500);
                }
            }, 9500);
        };

        // ============================================================================
        // 6. ОБНОВЛЕНИЕ ВНЕШНЕГО ВИДА КРЕСТИКА И ИКОНКИ ЧАСОВ
        // ============================================================================

        // Обновляет цвет и символ крестика в зависимости от режима автоскрытия
        const updateCrossUI = () => {
            if (autoHideEnabled) {
                cross.textContent = "🔓"; // Открытый замок
                cross.style.backgroundColor = "#44ff44"; // Зелёный
                cross.style.transform = "scale(1.05)"; // Чуть увеличен
            } else {
                cross.textContent = "✖"; // Крестик
                cross.style.backgroundColor = "#ff4444"; // Красный
                cross.style.transform = "scale(1)";
            }
            localStorage.setItem("autoHideEnabled", autoHideEnabled);
        };

        // Обновляет цвет иконки часов в зависимости от видимости часов
        const updateClockIconUI = () => {
            if (clockEnabled) {
                clockIcon.style.backgroundColor = "#44ff44"; // Зелёный (часы видны)
                clockIcon.style.transform = "scale(1.05)";
            } else {
                clockIcon.style.backgroundColor = "#444444"; // Серый (часы скрыты)
                clockIcon.style.transform = "scale(1)";
            }
            localStorage.setItem("planetClockEnabled", clockEnabled);
        };

        // ============================================================================
        // 7. УПРАВЛЕНИЕ АНИМАЦИЯМИ (stop, vanish, appear)
        // ============================================================================

        // Останавливает текущую анимацию и возвращает кнопку в нормальное состояние
        const stopAnimation = () => {
            if (vanishTimer) clearTimeout(vanishTimer);
            settingsBtn.classList.remove("btn-vanish", "btn-appear");
            settingsBtn.style.display = "inline-block";
            settingsBtn.style.transform = "";
            settingsBtn.style.opacity = "";
            settingsBtn.style.filter = "";
            animating = false;
        };

        // Анимация исчезновения кнопки
        const vanish = (callback) => {
            if (animating) stopAnimation(); // Останавливаем текущую анимацию
            animating = true;
            settingsBtn.classList.add("btn-vanish"); // Запускаем анимацию исчезновения
            vanishTimer = setTimeout(() => {
                settingsBtn.style.display = "none"; // Скрываем кнопку после анимации
                settingsBtn.classList.remove("btn-vanish");
                if (callback) callback();
                animating = false;
                vanishTimer = null;

                // Если автоскрытие включено и кнопка скрыта — показываем подсказку
                if (autoHideEnabled && isHidden) {
                    if (hintTimeout) clearTimeout(hintTimeout);
                    hintTimeout = setTimeout(showHint, 500);
                }
            }, 1500); // Длительность анимации 1.5 секунды
        };

        // Анимация появления кнопки
        const appear = () => {
            if (animating) stopAnimation();
            settingsBtn.style.display = "inline-block";
            settingsBtn.classList.add("btn-appear"); // Запускаем анимацию появления
            setTimeout(() => {
                settingsBtn.classList.remove("btn-appear");
            }, 1500);
        };

        // ============================================================================
        // 8. ОБРАБОТЧИК КЛИКА ПО КРЕСТИКУ (включение/выключение автоскрытия)
        // ============================================================================

        cross.addEventListener("click", (event) => {
            event.stopPropagation(); // Чтобы не закрылись панели настроек
            autoHideEnabled = !autoHideEnabled; // Переключаем режим
            updateCrossUI(); // Обновляем внешний вид крестика

            if (autoHideEnabled) {
                // Включаем автоскрытие — прячем кнопку
                if (!isHidden) {
                    vanish(() => {
                        isHidden = true;
                        localStorage.setItem("isHidden", true);
                    });
                    if (timeoutId) clearTimeout(timeoutId);
                }
            } else {
                // Выключаем автоскрытие — показываем кнопку
                if (vanishTimer) stopAnimation();
                settingsBtn.style.display = "inline-block";
                isHidden = false;
                localStorage.setItem("isHidden", false);
                if (timeoutId) clearTimeout(timeoutId);
            }
        });

        // ============================================================================
        // 9. ОБРАБОТЧИК КЛИКА ПО ИКОНКЕ ЧАСОВ (включение/выключение часов)
        // ============================================================================

        clockIcon.addEventListener("click", (event) => {
            event.stopPropagation();
            clockEnabled = !clockEnabled;
            updateClockIconUI(); // Обновляем внешний вид иконки

            // Показываем или скрываем блок часов
            const clockWrapper = document.getElementById("planetClock");
            if (clockWrapper) {
                clockWrapper.style.display = clockEnabled ? "flex" : "none";
            }
        });

        // ============================================================================
        // 10. ОТСЛЕЖИВАНИЕ ДВИЖЕНИЯ МЫШИ (появление при наведении в левый нижний угол)
        // ============================================================================

        document.addEventListener("mousemove", (e) => {
            // Проверяем, находится ли курсор в левом нижнем углу
            // clientY > высота_экрана - 80 (нижние 80 пикселей)
            // clientX < 100 (левые 100 пикселей)
            const inBottomLeft =
                e.clientY > window.innerHeight - 80 && e.clientX < 100;

            // Если курсор в углу, кнопка скрыта, автоскрытие включено, нет анимации
            if (inBottomLeft && isHidden && autoHideEnabled && !animating) {
                // Удаляем старую подсказку, если есть
                const existingHint = document.querySelector(".hint-dot");
                if (existingHint) existingHint.remove();
                if (hintTimeout) clearTimeout(hintTimeout);

                // Показываем кнопку
                appear();

                // Сбрасываем старый таймер
                if (timeoutId) clearTimeout(timeoutId);

                // Заводим новый таймер: через 5 секунд снова скрываем кнопку
                timeoutId = setTimeout(() => {
                    if (isHidden && autoHideEnabled && !animating) {
                        vanish(() => {});
                    }
                    timeoutId = null;
                }, 5000);
            }
        });

        // ============================================================================
        // 11. ПРИМЕНЕНИЕ СОСТОЯНИЯ ПРИ ЗАГРУЗКЕ
        // ============================================================================

        updateCrossUI();
        updateClockIconUI();

        // Применяем состояние часов при загрузке
        const clockWrapper = document.getElementById("planetClock");
        if (clockWrapper) {
            clockWrapper.style.display = clockEnabled ? "flex" : "none";
        }
    }
});
