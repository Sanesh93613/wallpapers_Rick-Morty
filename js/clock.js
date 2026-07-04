// ============================================================================
// ЧАСЫ — ПОЛНАЯ ЛОГИКА (с рабочим перетаскиванием)
// ============================================================================

// ============================================================================
// 1. ОТОБРАЖЕНИЕ ВРЕМЕНИ
// ============================================================================

let timeFormat = localStorage.getItem("timeFormat") || "24";

function updatePlanetClock() {
    const now = new Date();
    let timeStr;
    if (timeFormat === "12") {
        timeStr = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    } else {
        timeStr = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    }
    const dayStr = now.toLocaleDateString("ru-RU", { weekday: "long" });
    const monthStr = now.toLocaleDateString("ru-RU", { month: "long" });
    const dateStr = now.getDate();

    const timeEl = document.getElementById("clockTime");
    const dayEl = document.getElementById("clockDay");
    const dateEl = document.getElementById("clockDate");
    if (timeEl) timeEl.textContent = timeStr;
    if (dayEl) dayEl.textContent = dayStr;
    if (dateEl) dateEl.textContent = `${monthStr} ${dateStr}`;
}

setInterval(updatePlanetClock, 1000);
updatePlanetClock();

// ============================================================================
// 2. ПЕРЕТАСКИВАНИЕ ЧАСОВ
// ============================================================================

const draggableClock = document.getElementById("planetClock");

function setClockPosition(x, y) {
    // Сохраняем текущий масштаб
    const currentTransform = draggableClock.style.transform;
    
    draggableClock.style.position = "fixed";
    draggableClock.style.left = x + "px";
    draggableClock.style.top = y + "px";
    draggableClock.style.right = "auto";
    draggableClock.style.bottom = "auto";
    
    // Возвращаем масштаб
    if (currentTransform && currentTransform !== 'none') {
        draggableClock.style.transform = currentTransform;
    }
}

function resetClockToCenter() {
    const currentTransform = draggableClock.style.transform;
    
    // Временно убираем transform для расчёта
    draggableClock.style.transform = 'none';
    
    const centerX = (window.innerWidth - draggableClock.offsetWidth) / 2;
    const centerY = (window.innerHeight - draggableClock.offsetHeight) / 2;
    
    draggableClock.style.position = "fixed";
    draggableClock.style.left = centerX + "px";
    draggableClock.style.top = centerY + "px";
    draggableClock.style.right = "auto";
    draggableClock.style.bottom = "auto";
    
    // Возвращаем масштаб
    if (currentTransform && currentTransform !== 'none') {
        draggableClock.style.transform = currentTransform;
    }
    
    localStorage.setItem("clockLeft", centerX + "px");
    localStorage.setItem("clockTop", centerY + "px");
}

let clockLayer = localStorage.getItem("clockLayer") || "normal";

if (draggableClock) {
    const savedLeft = localStorage.getItem("clockLeft");
    const savedTop = localStorage.getItem("clockTop");

    if (savedLeft && savedTop) {
        draggableClock.style.position = "fixed";
        draggableClock.style.left = savedLeft;
        draggableClock.style.top = savedTop;
        draggableClock.style.transform = "none";
        draggableClock.style.right = "auto";
        draggableClock.style.bottom = "auto";
    } else {
        resetClockToCenter();
    }

    let isDragging = false;
    let dragStartX, dragStartY;
    let clockLeft, clockTop;

    draggableClock.addEventListener("mousedown", (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const left = parseInt(draggableClock.style.left);
        const top = parseInt(draggableClock.style.top);
        clockLeft = isNaN(left) ? draggableClock.offsetLeft : left;
        clockTop = isNaN(top) ? draggableClock.offsetTop : top;
        draggableClock.style.cursor = "grabbing";
        e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        setClockPosition(clockLeft + dx, clockTop + dy);
    });

    window.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            draggableClock.style.cursor = "grab";
            localStorage.setItem("clockLeft", draggableClock.style.left);
            localStorage.setItem("clockTop", draggableClock.style.top);
        }
    });

    // ===== ВРЕМЕННОЕ ПОДНЯТИЕ ПРИ ПРИБЛИЖЕНИИ МЫШИ =====
    document.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const clockRect = draggableClock.getBoundingClientRect();
        const clockCenterX = clockRect.left + clockRect.width / 2;
        const clockCenterY = clockRect.top + clockRect.height / 2;

        const distance = Math.sqrt(
            Math.pow(mouseX - clockCenterX, 2) +
                Math.pow(mouseY - clockCenterY, 2),
        );

        if (distance < 100) {
            // Мышь рядом — поднимаем часы и разрешаем перетаскивание
            draggableClock.style.zIndex = "200";
            draggableClock.style.pointerEvents = "auto";
            draggableClock.style.cursor = "grab";
        } else {
            // Мышь далеко — возвращаем исходное состояние
            if (clockLayer === "normal") {
                draggableClock.style.zIndex = "10";
                draggableClock.style.pointerEvents = "auto";
                draggableClock.style.cursor = "grab";
            } else {
                switch (clockLayer) {
                    case "back":
                        draggableClock.style.zIndex = "-5";
                        break;
                    case "stars":
                        draggableClock.style.zIndex = "-7";
                        break;
                    case "space":
                        draggableClock.style.zIndex = "-9";
                        break;
                    default:
                        draggableClock.style.zIndex = "10";
                }
                draggableClock.style.pointerEvents = "none";
                draggableClock.style.cursor = "default";
            }
        }
    });
}

// ============================================================================
// 3. ПОЛУЧЕНИЕ DOM-ЭЛЕМЕНТОВ
// ============================================================================

const clockEl = document.getElementById("planetClock");
const dayEl = document.getElementById("clockDay");
const timeEl = document.getElementById("clockTime");
const dateEl = document.getElementById("clockDate");

const sizeSlider = document.getElementById("clock-size-slider");
const sizeValue = document.getElementById("clock-size-value");
const widthSlider = document.getElementById("clock-width");
const widthValue = document.getElementById("clock-width-value");
const heightSlider = document.getElementById("clock-height");
const heightValue = document.getElementById("clock-height-value");
const radiusSlider = document.getElementById("clock-border-radius");
const radiusValue = document.getElementById("clock-radius-value");

const dayFontSlider = document.getElementById("clock-day-font-size");
const timeFontSlider = document.getElementById("clock-time-font-size");
const dateFontSlider = document.getElementById("clock-date-font-size");

const gap1Slider = document.getElementById("clock-gap1");
const gap2Slider = document.getElementById("clock-gap2");

const textColorPicker = document.getElementById("clock-text-color");
const glowPicker = document.getElementById("clock-glow");
const glowIntensity = document.getElementById("clock-glow-intensity");
const glowIntensityValue = document.getElementById(
    "clock-glow-intensity-value",
);
const bgOpacitySlider = document.getElementById("clock-bg-opacity");

const resetPosBtn = document.getElementById("reset-clock-pos");
const resetAllBtn = document.getElementById("reset-clock-settings");

// ============================================================================
// 4. ПРИМЕНЕНИЕ ВСЕХ СТИЛЕЙ
// ============================================================================

function applyClockStyles() {
    if (!clockEl) return;

    if (sizeSlider) {
        const scale = sizeSlider.value / 100;
        clockEl.style.transform = `scale(${scale})`;
        if (sizeValue) sizeValue.textContent = sizeSlider.value;
    }
    if (widthSlider) {
        clockEl.style.width = widthSlider.value + "px";
        if (widthValue) widthValue.textContent = widthSlider.value;
    }
    if (heightSlider) {
        clockEl.style.height = heightSlider.value + "px";
        if (heightValue) heightValue.textContent = heightSlider.value;
    }
    if (radiusSlider) {
        clockEl.style.borderRadius = radiusSlider.value + "%";
        if (radiusValue) radiusValue.textContent = radiusSlider.value;
    }
    if (dayFontSlider && dayEl) {
        dayEl.style.fontSize = dayFontSlider.value + "px";
    }
    if (timeFontSlider && timeEl) {
        timeEl.style.fontSize = timeFontSlider.value + "px";
    }
    if (dateFontSlider && dateEl) {
        dateEl.style.fontSize = dateFontSlider.value + "px";
    }
    if (gap1Slider && dayEl && timeEl) {
        dayEl.style.marginBottom = gap1Slider.value + "px";
    }
    if (gap2Slider && timeEl && dateEl) {
        timeEl.style.marginBottom = gap2Slider.value + "px";
    }
    if (textColorPicker) {
        const color = textColorPicker.value;
        if (dayEl) dayEl.style.color = color;
        if (timeEl) timeEl.style.color = color;
        if (dateEl) dateEl.style.color = color;
    }
    if (glowPicker && glowIntensity) {
        const color = glowPicker.value;
        const intensity = glowIntensity.value;
        const glowStyle = `0 0 ${intensity}px ${color}`;
        if (dayEl) dayEl.style.textShadow = glowStyle;
        if (timeEl) timeEl.style.textShadow = glowStyle;
        if (dateEl) dateEl.style.textShadow = glowStyle;
        clockEl.style.boxShadow = `0 0 ${intensity}px ${color}`;
        if (glowIntensityValue) glowIntensityValue.textContent = intensity;
    }
    if (bgOpacitySlider) {
        const opacity = bgOpacitySlider.value / 100;
        clockEl.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;

        // При 0% прозрачности убираем размытие и обводку
        if (opacity === 0) {
            clockEl.style.backdropFilter = "none";
            clockEl.style.border = "none";
        } else {
            clockEl.style.backdropFilter = "blur(4px)";
            clockEl.style.border = "1px solid rgba(255, 255, 255, 0.2)";
        }
    }

    // Настройка слоя (z-index)
    switch (clockLayer) {
        case "back":
            clockEl.style.zIndex = "-5";
            break;
        case "stars":
            clockEl.style.zIndex = "-7";
            break;
        case "space":
            clockEl.style.zIndex = "-9";
            break;
        default:
            clockEl.style.zIndex = "10";
    }
}
// ============================================================================
// 5. ЗАГРУЗКА И СОХРАНЕНИЕ
// ============================================================================

function loadClockSettings() {
    if (!clockEl) return;

    const items = [
        { slider: sizeSlider, key: "clockSize", default: 100 },
        { slider: widthSlider, key: "clockWidth", default: 170 },
        { slider: heightSlider, key: "clockHeight", default: 170 },
        { slider: radiusSlider, key: "clockRadius", default: 50 },
        { slider: dayFontSlider, key: "clockDayFontSize", default: 14 },
        { slider: timeFontSlider, key: "clockTimeFontSize", default: 24 },
        { slider: dateFontSlider, key: "clockDateFontSize", default: 16 },
        { slider: gap1Slider, key: "clockGap1", default: 5 },
        { slider: gap2Slider, key: "clockGap2", default: 5 },
    ];

    items.forEach((item) => {
        if (item.slider && localStorage.getItem(item.key)) {
            item.slider.value = localStorage.getItem(item.key);
        } else if (item.slider) {
            item.slider.value = item.default;
        }
    });

    if (textColorPicker && localStorage.getItem("clockTextColor"))
        textColorPicker.value = localStorage.getItem("clockTextColor");
    if (glowPicker && localStorage.getItem("clockGlow"))
        glowPicker.value = localStorage.getItem("clockGlow");
    if (glowIntensity && localStorage.getItem("clockGlowIntensity"))
        glowIntensity.value = localStorage.getItem("clockGlowIntensity");
    if (bgOpacitySlider && localStorage.getItem("clockBgOpacity"))
        bgOpacitySlider.value = localStorage.getItem("clockBgOpacity");

    const savedLayer = localStorage.getItem("clockLayer");
    if (savedLayer) clockLayer = savedLayer;

    applyClockStyles();
}

function saveClockSettings() {
    if (sizeSlider) localStorage.setItem("clockSize", sizeSlider.value);
    if (widthSlider) localStorage.setItem("clockWidth", widthSlider.value);
    if (heightSlider) localStorage.setItem("clockHeight", heightSlider.value);
    if (radiusSlider) localStorage.setItem("clockRadius", radiusSlider.value);
    if (dayFontSlider)
        localStorage.setItem("clockDayFontSize", dayFontSlider.value);
    if (timeFontSlider)
        localStorage.setItem("clockTimeFontSize", timeFontSlider.value);
    if (dateFontSlider)
        localStorage.setItem("clockDateFontSize", dateFontSlider.value);
    if (gap1Slider) localStorage.setItem("clockGap1", gap1Slider.value);
    if (gap2Slider) localStorage.setItem("clockGap2", gap2Slider.value);
    if (textColorPicker)
        localStorage.setItem("clockTextColor", textColorPicker.value);
    if (glowPicker) localStorage.setItem("clockGlow", glowPicker.value);
    if (glowIntensity)
        localStorage.setItem("clockGlowIntensity", glowIntensity.value);
    if (bgOpacitySlider)
        localStorage.setItem("clockBgOpacity", bgOpacitySlider.value);
    if (clockLayer) localStorage.setItem("clockLayer", clockLayer);
}

const clockInputs = [
    sizeSlider,
    widthSlider,
    heightSlider,
    radiusSlider,
    dayFontSlider,
    timeFontSlider,
    dateFontSlider,
    gap1Slider,
    gap2Slider,
    textColorPicker,
    glowPicker,
    glowIntensity,
    bgOpacitySlider,
];

clockInputs.forEach((input) => {
    if (input) {
        input.addEventListener("input", () => {
            applyClockStyles();
            saveClockSettings();
        });
    }
});

// ============================================================================
// 6. ЦЕНТРИРОВАНИЕ И КНОПКИ СБРОСА
// ============================================================================

function centerClock() {
    if (!clockEl) return;
    const centerX = (window.innerWidth - clockEl.offsetWidth) / 2;
    const centerY = (window.innerHeight - clockEl.offsetHeight) / 2;
    setClockPosition(centerX, centerY);
    localStorage.setItem("clockLeft", centerX + "px");
    localStorage.setItem("clockTop", centerY + "px");
    if (draggableClock) {
        draggableClock.style.left = centerX + "px";
        draggableClock.style.top = centerY + "px";
        draggableClock.style.transform = "none";
    }
}

if (resetPosBtn) {
    resetPosBtn.addEventListener("click", () => centerClock());
}

if (resetAllBtn) {
    resetAllBtn.addEventListener("click", () => {
        if (sizeSlider) sizeSlider.value = 100;
        if (widthSlider) widthSlider.value = 170;
        if (heightSlider) heightSlider.value = 170;
        if (radiusSlider) radiusSlider.value = 50;
        if (dayFontSlider) dayFontSlider.value = 14;
        if (timeFontSlider) timeFontSlider.value = 24;
        if (dateFontSlider) dateFontSlider.value = 16;
        if (gap1Slider) gap1Slider.value = 5;
        if (gap2Slider) gap2Slider.value = 5;
        if (textColorPicker) textColorPicker.value = "#ffffff";
        if (glowPicker) glowPicker.value = "#00ffff";
        if (glowIntensity) glowIntensity.value = 6;
        if (bgOpacitySlider) bgOpacitySlider.value = 30;

        const defaultFont = "'Arial', sans-serif";
        if (clockEl) clockEl.style.fontFamily = defaultFont;
        localStorage.setItem("clockFont", defaultFont);

        const trigger = document.querySelector(
            "#font-select .custom-select-trigger",
        );
        if (trigger) trigger.textContent = "Arial";

        centerClock();
        localStorage.removeItem("customFontName");
        localStorage.removeItem("customFontData");

        clockLayer = "normal";
        localStorage.setItem("clockLayer", clockLayer);

        applyClockStyles();
        saveClockSettings();
    });
}

// ============================================================================
// 7. КАСТОМНЫЙ СЕЛЕКТ ШРИФТОВ
// ============================================================================

const customSelect = document.getElementById("font-select");
if (customSelect) {
    const trigger = customSelect.querySelector(".custom-select-trigger");
    const options = customSelect.querySelectorAll(".custom-select-options div");
    const dropdown = customSelect.querySelector(".custom-select-options");
    const fontUpload = document.getElementById("font-upload");
    let customFontName = null;

    if (trigger) {
        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("open");
        });
    }

    document.addEventListener("click", () => {
        if (dropdown) dropdown.classList.remove("open");
    });

    options.forEach((opt) => {
        if (opt.id === "custom-font-option") return;
        if (opt.classList.contains("custom-font-divider")) return;

        opt.addEventListener("click", () => {
            const value = opt.dataset.value;
            const text = opt.textContent;
            trigger.textContent = text;
            localStorage.setItem("clockFont", value);
            localStorage.removeItem("customFontName");
            localStorage.removeItem("customFontData");
            if (clockEl) clockEl.style.fontFamily = value;
            dropdown.classList.remove("open");

            const customOpt = document.getElementById("custom-font-option");
            if (customOpt) customOpt.classList.remove("custom-font-loaded");
        });
    });

    const customFontOption = document.getElementById("custom-font-option");
    if (customFontOption) {
        customFontOption.addEventListener("click", () => {
            if (fontUpload) fontUpload.click();
            dropdown.classList.remove("open");
        });
    }

    if (fontUpload) {
        fontUpload.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const allowedTypes = ["ttf", "otf", "woff", "woff2"];
            const ext = file.name.split(".").pop().toLowerCase();
            if (!allowedTypes.includes(ext)) {
                alert("Поддерживаются только .ttf, .otf, .woff, .woff2");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const fontData = event.target.result;
                const fontName = file.name.replace(/\.[^/.]+$/, "");

                const style = document.createElement("style");
                const fontFace = `
                    @font-face {
                        font-family: '${fontName}';
                        src: url('${fontData}') format('${ext === "ttf" ? "truetype" : ext}');
                        font-weight: normal;
                        font-style: normal;
                    }
                `;
                style.textContent = fontFace;
                document.head.appendChild(style);

                customFontName = fontName;
                localStorage.setItem("customFontName", fontName);
                localStorage.setItem("customFontData", fontData);
                localStorage.setItem("clockFont", `'${fontName}', sans-serif`);

                if (clockEl)
                    clockEl.style.fontFamily = `'${fontName}', sans-serif`;
                trigger.textContent = fontName;

                if (customFontOption) {
                    customFontOption.classList.add("custom-font-loaded");
                    customFontOption.textContent = `✓ ${fontName}`;
                }

                const tempOption = document.createElement("div");
                tempOption.dataset.value = `'${fontName}', sans-serif`;
                tempOption.textContent = fontName;
                tempOption.style.backgroundColor = "#00aa44";
                tempOption.addEventListener("click", () => {
                    trigger.textContent = fontName;
                    localStorage.setItem(
                        "clockFont",
                        `'${fontName}', sans-serif`,
                    );
                    if (clockEl)
                        clockEl.style.fontFamily = `'${fontName}', sans-serif`;
                    dropdown.classList.remove("open");
                });

                dropdown.insertBefore(tempOption, customFontOption);

                alert(`Шрифт "${fontName}" загружен!`);
            };
            reader.readAsDataURL(file);
        });
    }

    function loadCustomFont() {
        const savedFontName = localStorage.getItem("customFontName");
        const savedFontData = localStorage.getItem("customFontData");

        if (savedFontName && savedFontData) {
            const style = document.createElement("style");
            const fontFace = `
                @font-face {
                    font-family: '${savedFontName}';
                    src: url('${savedFontData}') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
            `;
            style.textContent = fontFace;
            document.head.appendChild(style);

            customFontName = savedFontName;
            const customOpt = document.getElementById("custom-font-option");
            if (customOpt) {
                customOpt.classList.add("custom-font-loaded");
                customOpt.textContent = `✓ ${savedFontName}`;
            }
        }
    }

    loadCustomFont();

    const savedFont = localStorage.getItem("clockFont");
    if (savedFont && clockEl && !savedFont.includes("custom")) {
        clockEl.style.fontFamily = savedFont;
        const matchingOpt = [...options].find(
            (opt) => opt.dataset && opt.dataset.value === savedFont,
        );
        if (matchingOpt && trigger) {
            trigger.textContent = matchingOpt.textContent;
        }
    }
}

// ============================================================================
// 8. КАСТОМНЫЙ СЕЛЕКТ СЛОЯ ЧАСОВ
// ============================================================================

const layerCustomSelect = document.getElementById("layer-select");
if (layerCustomSelect) {
    const layerTrigger = layerCustomSelect.querySelector(
        ".custom-select-layer-trigger",
    );
    const layerOptions = layerCustomSelect.querySelectorAll(
        ".custom-select-layer-options div",
    );
    const layerDropdown = layerCustomSelect.querySelector(
        ".custom-select-layer-options",
    );

    if (layerTrigger) {
        layerTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            layerDropdown.classList.toggle("open");
        });
    }

    document.addEventListener("click", () => {
        if (layerDropdown) layerDropdown.classList.remove("open");
    });

    function applyLayer(layerValue, layerText) {
        clockLayer = layerValue;
        localStorage.setItem("clockLayer", clockLayer);
        if (layerTrigger && layerText) layerTrigger.textContent = layerText;
        applyClockStyles();
    }

    layerOptions.forEach((opt) => {
        opt.addEventListener("click", () => {
            applyLayer(opt.dataset.layer, opt.textContent);
            layerDropdown.classList.remove("open");
        });
    });

    const savedLayer = localStorage.getItem("clockLayer") || "normal";
    let savedText = "Нормальный";
    layerOptions.forEach((opt) => {
        if (opt.dataset.layer === savedLayer) savedText = opt.textContent;
    });
    applyLayer(savedLayer, savedText);
}

// ============================================================================
// 9. ПЕРЕКЛЮЧАТЕЛЬ ФОРМАТА ВРЕМЕНИ
// ============================================================================

const formatBtns = document.querySelectorAll(".format-btn");
if (formatBtns.length) {
    formatBtns.forEach((btn) => {
        if (btn.dataset.format === timeFormat) btn.classList.add("active");
        btn.addEventListener("click", () => {
            formatBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            timeFormat = btn.dataset.format;
            localStorage.setItem("timeFormat", timeFormat);
            updatePlanetClock();
        });
    });
}

// ============================================================================
// 10. ЗАПУСК
// ============================================================================

loadClockSettings();
