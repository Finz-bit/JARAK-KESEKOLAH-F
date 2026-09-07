/* =========================================
   JARAK KESEKOLAH
   MAIN JAVASCRIPT
   COMPLETE VERSION
========================================= */


/* =========================================
   ELEMENT
========================================= */

const pages = {
    dashboard: document.getElementById("dashboardPage"),
    map: document.getElementById("mapPage"),
    location: document.getElementById("locationPage"),
    schedule: document.getElementById("schedulePage"),
    settings: document.getElementById("settingsPage")
};

const navItems = document.querySelectorAll(".bottom-nav-item");

const loadingScreen =
    document.getElementById("loadingScreen");

const toastContainer =
    document.getElementById("toastContainer");

const confirmOverlay =
    document.getElementById("confirmOverlay");

const confirmTitle =
    document.getElementById("confirmTitle");

const confirmMessage =
    document.getElementById("confirmMessage");

const confirmCancel =
    document.getElementById("confirmCancel");

const confirmOk =
    document.getElementById("confirmOk");


/* =========================================
   DASHBOARD
========================================= */

const dashboardHome =
    document.getElementById("dashboardHome");

const dashboardSchool =
    document.getElementById("dashboardSchool");

const dashboardDistance =
    document.getElementById("dashboardDistance");

const dashboardTime =
    document.getElementById("dashboardTime");

const dashboardTransport =
    document.getElementById("dashboardTransport");

const dashboardMapType =
    document.getElementById("dashboardMapType");


/* =========================================
   MAP
========================================= */

const mapContainer =
    document.getElementById("map");

const mapTypeSelect =
    document.getElementById("mapTypeSelect");

const petaJalan =
    document.getElementById("petaJalan");

const petaSatelit =
    document.getElementById("petaSatelit");

const petaTerrain =
    document.getElementById("petaTerrain");

const petaDark =
    document.getElementById("petaDark");

const locateButton =
    document.getElementById("locateButton");

const resetMapButton =
    document.getElementById("resetMapButton");

const calculateRouteButton =
    document.getElementById("calculateRouteButton");

const googleMapsButton =
    document.getElementById("googleMapsButton");

const distanceResult =
    document.getElementById("distanceResult");

const timeResult =
    document.getElementById("timeResult");

const homeStatus =
    document.getElementById("homeStatus");

const schoolStatus =
    document.getElementById("schoolStatus");

const activeMapLabel =
    document.getElementById("activeMapLabel");


/* =========================================
   LOCATION
========================================= */

const homeLocationButton =
    document.getElementById("homeLocationButton");

const schoolLocationButton =
    document.getElementById("schoolLocationButton");

const homeSearchInput =
    document.getElementById("homeSearchInput");

const schoolSearchInput =
    document.getElementById("schoolSearchInput");

const searchHomeButton =
    document.getElementById("searchHomeButton");

const searchSchoolButton =
    document.getElementById("searchSchoolButton");

const manualHomeLat =
    document.getElementById("manualHomeLat");

const manualHomeLng =
    document.getElementById("manualHomeLng");

const manualSchoolLat =
    document.getElementById("manualSchoolLat");

const manualSchoolLng =
    document.getElementById("manualSchoolLng");

const saveManualHome =
    document.getElementById("saveManualHome");

const saveManualSchool =
    document.getElementById("saveManualSchool");

const locationInstruction =
    document.getElementById("locationInstruction");

const locationHomeName =
    document.getElementById("locationHomeName");

const locationSchoolName =
    document.getElementById("locationSchoolName");


/* =========================================
   TRANSPORT
========================================= */

const walkBtn =
    document.getElementById("walkBtn");

const motorBtn =
    document.getElementById("motorBtn");

const carBtn =
    document.getElementById("carBtn");


/* =========================================
   SETTINGS
========================================= */

const walkingSpeedInput =
    document.getElementById("walkingSpeed");

const motorSpeedInput =
    document.getElementById("motorSpeed");

const carSpeedInput =
    document.getElementById("carSpeed");

const defaultBufferSelect =
    document.getElementById("defaultBuffer");

const defaultMapSelect =
    document.getElementById("defaultMap");

const themeSelect =
    document.getElementById("themeSelect");

const saveSettingsButton =
    document.getElementById("saveSettingsButton");

const resetSettingsButton =
    document.getElementById("resetSettingsButton");


/* =========================================
   SCHEDULE
========================================= */

const scheduleDay =
    document.getElementById("scheduleDay");

const scheduleDate =
    document.getElementById("scheduleDate");

const scheduleEntryTime =
    document.getElementById("scheduleEntryTime");

const scheduleDepartureTime =
    document.getElementById("scheduleDepartureTime");

const scheduleBuffer =
    document.getElementById("scheduleBuffer");

const saveScheduleButton =
    document.getElementById("saveScheduleButton");

const scheduleResult =
    document.getElementById("scheduleResult");

const recommendedDeparture =
    document.getElementById("recommendedDeparture");

const scheduleStatus =
    document.getElementById("scheduleStatus");



/* =========================================
   HISTORY
========================================= */

const historyList =
    document.getElementById("historyList");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");


/* =========================================
   TUTORIAL
========================================= */

const tutorialOverlay =
    document.getElementById("tutorialOverlay");

const tutorialClose =
    document.getElementById("tutorialClose");

const tutorialStepLabel =
    document.getElementById("tutorialStepLabel");

const tutorialDots =
    document.getElementById("tutorialDots");

const tutorialTitle =
    document.getElementById("tutorialTitle");

const tutorialDescription =
    document.getElementById("tutorialDescription");

const tutorialSkip =
    document.getElementById("tutorialSkip");

const tutorialBack =
    document.getElementById("tutorialBack");

const tutorialNext =
    document.getElementById("tutorialNext");

const openTutorialButton =
    document.getElementById("openTutorialButton");


/* =========================================
   STORAGE
========================================= */

const STORAGE_KEY =
    "jarak_ke_sekolah_data";

const SETTINGS_KEY =
    "jarak_ke_sekolah_settings";

const HISTORY_KEY =
    "jarak_ke_sekolah_history";

const SCHEDULE_KEY =
    "jarak_ke_sekolah_schedule";

const TUTORIAL_KEY =
    "jarak_ke_sekolah_tutorial_seen_v3";

const REMINDER_KEY =
    "jarak_ke_sekolah_departure_reminder";


/* =========================================
   DEFAULT SETTINGS
========================================= */

const DEFAULT_SETTINGS = {
    walkingSpeed: 4.5,
    motorSpeed: 30,
    carSpeed: 45,
    defaultBuffer: 10,
    defaultMap: "street",
    theme: "system"
};


/* =========================================
   APP DATA
========================================= */

let appData = {
    home: null,
    school: null
};

let settings = {
    ...DEFAULT_SETTINGS
};


/* =========================================
   MAP VARIABLES
========================================= */

let map = null;

let mapInitialized = false;

let markerRumah = null;

let markerSekolah = null;

let garisRute = null;

let latLngRumah = null;

let latLngSekolah = null;

let jarakKmGlobal = null;

let profilRouting = "driving";

let kecepatanAktif =
    settings.motorSpeed;

let transportAktif = "motor";

let currentMapType =
    settings.defaultMap;

let modePilihLokasi = null;

let mapLayers = {};


/* =========================================
   OTHER VARIABLES
========================================= */

let confirmCallback = null;

let tutorialCurrentStep = 0;

let tutorialIsOpen = false;

let reminderTimer = null;

let audioContext = null;


/* =========================================
   MAP TYPE NAMES
========================================= */

const MAP_TYPE_NAMES = {
    street: "Peta Jalan",
    satellite: "Peta Satelit",
    terrain: "Peta Terrain",
    dark: "Peta Dark"
};


/* =========================================
   TUTORIAL DATA
========================================= */

const tutorialSteps = [
    {
        title: "Pilih lokasi rumah",
        description:
            "Klik pilih lokasi rumah. Kamu bisa mencari lokasi secara manual atau menggunakan GPS. Jika memilih manual, cari lokasi rumah lalu klik titik di peta.",
        icon: `
            <svg viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 11.5 12 4l9 7.5"/>
                <path d="M5.5 10.5V20h13v-9.5"/>
                <path d="M9.5 20v-5h5v5"/>
            </svg>
        `
    },
    {
        title: "Pilih lokasi sekolah",
        description:
            "Kembali ke Dashboard lalu pilih sekolah. Caranya sama seperti memilih rumah: gunakan pencarian, GPS, atau klik langsung lokasi sekolah pada peta.",
        icon: `
            <svg viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 21V6l8-3 8 3v15"/>
                <path d="M8 21v-5h8v5"/>
                <path d="M8 9h.01M12 9h.01M16 9h.01"/>
            </svg>
        `
    },
    {
        title: "Hasilkan perjalanan",
        description:
            "Setelah rumah dan sekolah dipilih, scroll ke bawah. Pilih motor, mobil, atau jalan kaki, lalu klik HASILKAN PERJALANAN. Jarak dan waktu perjalanan akan muncul.",
        icon: `
            <svg viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 19h14"/>
                <path d="M7 16V8h10v8"/>
                <path d="m9 8 3-4 3 4"/>
            </svg>
        `
    },
    {
        title: "Atur kecepatan",
        description:
            "Untuk mengubah kecepatan motor, mobil, atau jalan kaki, buka Pengaturan. Atur kecepatannya lalu klik Simpan. Pengaturan akan tersimpan otomatis.",
        icon: `
            <svg viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.5v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6.4v-2.5h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1h2.5v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1Z"/>
            </svg>
        `
    },
    {
        title: "Buka Google Maps",
        description:
            "Untuk mengecek perjalanan langsung melalui Google Maps, klik tombol Buka di Google Maps setelah rute berhasil dibuat.",
        icon: `
            <svg viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"/>
                <circle cx="12" cy="10" r="2.5"/>
            </svg>
        `
    },
    {
        title: "Reset perjalanan",
        description:
            "Jika ingin mulai dari awal, klik Reset perjalanan. Lokasi rumah, sekolah, dan rute saat ini akan dihapus.",
        icon: `
            <svg viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8"/>
                <path d="M20 4v4h-4"/>
                <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16"/>
                <path d="M4 20v-4h4"/>
            </svg>
        `
    }
];


/* =========================================
   UTILITIES
========================================= */

function showToast(
    message,
    type = "info",
    duration = 3000
) {

    if (!toastContainer) return;

    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;

    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">
                ${escapeHtml(message)}
            </span>
        </div>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, duration);
}


function escapeHtml(value) {

    if (value === null ||
        value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatDistance(km) {

    if (
        km === null ||
        km === undefined ||
        Number.isNaN(Number(km))
    ) {
        return "--";
    }

    const value = Number(km);

    if (value < 1) {
        return `${Math.round(value * 1000)} m`;
    }

    return `${value.toFixed(2)} km`;
}


function formatTime(minutes) {

    if (
        minutes === null ||
        minutes === undefined ||
        Number.isNaN(Number(minutes))
    ) {
        return "--";
    }

    const totalMinutes =
        Math.max(1, Math.round(Number(minutes)));

    if (totalMinutes < 60) {
        return `${totalMinutes} menit`;
    }

    const hours =
        Math.floor(totalMinutes / 60);

    const mins =
        totalMinutes % 60;

    if (mins === 0) {
        return `${hours} jam`;
    }

    return `${hours} jam ${mins} menit`;
}


function formatTimeClock(date) {

    if (!(date instanceof Date)) {
        return "--:--";
    }

    return date.toLocaleTimeString(
        "id-ID",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }
    );
}


/* =========================================
   STORAGE
========================================= */

function loadAppData() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (saved) {

            const parsed =
                JSON.parse(saved);

            if (
                parsed &&
                typeof parsed === "object"
            ) {
                appData = {
                    ...appData,
                    ...parsed
                };
            }
        }

    } catch (error) {

        console.error(
            "Gagal membaca data:",
            error
        );
    }
}


function saveAppData() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(appData)
        );

    } catch (error) {

        console.error(
            "Gagal menyimpan data:",
            error
        );
    }
}


function loadSettings() {

    try {

        const saved =
            localStorage.getItem(SETTINGS_KEY);

        if (saved) {

            const parsed =
                JSON.parse(saved);

            if (
                parsed &&
                typeof parsed === "object"
            ) {
                settings = {
                    ...DEFAULT_SETTINGS,
                    ...parsed
                };
            }
        }

    } catch (error) {

        console.error(
            "Gagal membaca pengaturan:",
            error
        );

        settings = {
            ...DEFAULT_SETTINGS
        };
    }
}


function saveSettingsToStorage() {

    try {

        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings)
        );

    } catch (error) {

        console.error(
            "Gagal menyimpan pengaturan:",
            error
        );
    }
}


/* =========================================
   HISTORY
========================================= */

function loadHistory() {

    try {

        const saved =
            localStorage.getItem(HISTORY_KEY);

        if (!saved) {
            return [];
        }

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Gagal membaca riwayat:",
            error
        );

        return [];
    }
}


function saveHistory(item) {

    try {

        const history =
            loadHistory();

        history.unshift(item);

        const limitedHistory =
            history.slice(0, 20);

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(limitedHistory)
        );

        renderHistory();

    } catch (error) {

        console.error(
            "Gagal menyimpan riwayat:",
            error
        );
    }
}


function clearHistory() {

    localStorage.removeItem(
        HISTORY_KEY
    );

    renderHistory();

    showToast(
        "Riwayat berhasil dihapus.",
        "success"
    );
}


function renderHistory() {

    if (!historyList) {
        return;
    }

    const history =
        loadHistory();

    if (!history.length) {

        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">
                    Belum ada riwayat
                </div>
                <div class="empty-state-text">
                    Perjalanan yang sudah dihitung
                    akan muncul di sini.
                </div>
            </div>
        `;

        return;
    }

    historyList.innerHTML =
        history.map(item => {

            const date =
                item.date
                    ? new Date(item.date)
                    : null;

            const dateText =
                date
                    ? date.toLocaleString(
                        "id-ID",
                        {
                            dateStyle: "medium",
                            timeStyle: "short"
                        }
                    )
                    : "";

            return `
                <div class="history-item">
                    <div class="history-main">
                        <strong>
                            ${escapeHtml(
                                item.transportName || "Perjalanan"
                            )}
                        </strong>

                        <span>
                            ${formatDistance(item.distance)}
                            ·
                            ${formatTime(item.time)}
                        </span>
                    </div>

                    <div class="history-date">
                        ${escapeHtml(dateText)}
                    </div>
                </div>
            `;

        }).join("");
}


/* =========================================
   THEME
========================================= */

function applyTheme(theme) {

    const root =
        document.documentElement;

    if (theme === "dark") {

        root.setAttribute(
            "data-theme",
            "dark"
        );

        return;
    }

    if (theme === "light") {

        root.setAttribute(
            "data-theme",
            "light"
        );

        return;
    }

    root.removeAttribute("data-theme");
}


function initializeTheme() {

    applyTheme(settings.theme);

    if (themeSelect) {
        themeSelect.value =
            settings.theme;
    }
}


/* =========================================
   MAP ICONS
========================================= */

function createHomeIcon() {

    return L.divIcon({

        className: "custom-map-marker home-marker",

        html: `
            <div style="
                width:60px;
                height:68px;
                display:flex;
                align-items:flex-start;
                justify-content:center;
                transform:scale(1.25);
                transform-origin:center bottom;
                filter:drop-shadow(0 4px 7px rgba(0,0,0,.22));
            ">
                <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M17 32C17 32 28 21.6 28 13.2C28 7.01 23.075 2 17 2C10.925 2 6 7.01 6 13.2C6 21.6 17 32 17 32Z"
                        fill="#2563EB"
                    />
                    <path
                        d="M10.5 14.1L17 8.7L23.5 14.1V22.8H10.5V14.1Z"
                        fill="white"
                    />
                    <path
                        d="M14.1 22.8V17.3H19.9V22.8"
                        fill="#2563EB"
                    />
                    <path
                        d="M13.2 14.3H13.21M17 14.3H17.01M20.8 14.3H20.81"
                        stroke="#2563EB"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                </svg>
            </div>
        `,

        iconSize: [60, 68],

        iconAnchor: [30, 68],

        popupAnchor: [0, -68]
    });
}


function createSchoolIcon() {

    return L.divIcon({

        className: "custom-map-marker school-marker",

        html: `
            <div style="
                width:60px;
                height:68px;
                display:flex;
                align-items:flex-start;
                justify-content:center;
                transform:scale(1.25);
                transform-origin:center bottom;
                filter:drop-shadow(0 4px 7px rgba(0,0,0,.22));
            ">
                <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M17 32C17 32 28 21.6 28 13.2C28 7.01 23.075 2 17 2C10.925 2 6 7.01 6 13.2C6 21.6 17 32 17 32Z"
                        fill="#DC2626"
                    />
                    <path
                        d="M9.5 14.1L17 8.8L24.5 14.1V23H9.5V14.1Z"
                        fill="white"
                    />
                    <path
                        d="M12.5 14H21.5"
                        stroke="#DC2626"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                    <path
                        d="M13.2 17.2H20.8V23H13.2V17.2Z"
                        fill="#DC2626"
                    />
                    <path
                        d="M16 17.2V23"
                        stroke="white"
                        stroke-width="1.3"
                    />
                    <path
                        d="M17 6.2V9"
                        stroke="#DC2626"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                </svg>
            </div>
        `,

        iconSize: [60, 68],

        iconAnchor: [30, 68],

        popupAnchor: [0, -68]
    });
}


/* =========================================
   MAP INITIALIZATION
========================================= */

function initializeMap() {

    if (
        mapInitialized ||
        !mapContainer ||
        typeof L === "undefined"
    ) {
        return;
    }

    map = L.map(
        mapContainer,
        {
            zoomControl: true,
            attributionControl: true
        }
    );

    map.setView(
        [-6.5891, 110.6677],
        15
    );

    mapLayers.street =
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    '&copy; OpenStreetMap contributors'
            }
        );

    mapLayers.satellite =
        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                maxZoom: 19,
                attribution:
                    "Tiles &copy; Esri"
            }
        );

    mapLayers.terrain =
        L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 17,
                attribution:
                    '&copy; OpenTopoMap'
            }
        );

    mapLayers.dark =
        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            {
                maxZoom: 19,
                attribution:
                    '&copy; CARTO'
            }
        );

    const selectedLayer =
        mapLayers[currentMapType] ||
        mapLayers.street;

    selectedLayer.addTo(map);

    mapInitialized = true;

    map.on(
        "click",
        handleMapClick
    );

    updateActiveMapUI();

    restoreMapLocations();
}


/* =========================================
   MAP TYPE
========================================= */

function changeMapType(type) {

    if (
        !map ||
        !mapLayers[type]
    ) {
        return;
    }

    Object.values(mapLayers)
        .forEach(layer => {

            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }

        });

    mapLayers[type].addTo(map);

    currentMapType = type;

    updateActiveMapUI();

    if (mapTypeSelect) {
        mapTypeSelect.value = type;
    }

    settings.defaultMap = type;

    saveSettingsToStorage();

    showToast(
        `${MAP_TYPE_NAMES[type] || "Peta"} aktif.`,
        "success",
        1800
    );
}


function updateActiveMapUI() {

    const label =
        MAP_TYPE_NAMES[currentMapType] ||
        "Peta Jalan";

    if (activeMapLabel) {
        activeMapLabel.textContent =
            label;
    }

    const candidates = [
        petaJalan,
        petaSatelit,
        petaTerrain,
        petaDark
    ];

    candidates.forEach(button => {

        if (!button) return;

        const type =
            button.dataset.map ||
            button.dataset.mapType;

        button.classList.toggle(
            "active",
            type === currentMapType
        );

    });

    document
        .querySelectorAll(
            "[data-map-type]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.mapType ===
                currentMapType
            );

        });

    document
        .querySelectorAll(
            "[data-map]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.map ===
                currentMapType
            );

        });

}


/* =========================================
   MAP CLICK LOCATION SELECTION
========================================= */

function handleMapClick(event) {

    if (!modePilihLokasi) {
        return;
    }

    const latlng =
        event.latlng;

    if (
        !latlng ||
        typeof latlng.lat !== "number" ||
        typeof latlng.lng !== "number"
    ) {
        return;
    }

    if (modePilihLokasi === "home") {

        setHomeLocation(
            latlng.lat,
            latlng.lng,
            "Lokasi rumah dipilih dari peta"
        );

        modePilihLokasi = null;

        updateLocationInstruction();

        showToast(
            "Lokasi rumah berhasil dipilih.",
            "success"
        );

        setTimeout(() => {

            modePilihLokasi = "school";

            updateLocationInstruction();

            showToast(
                "Sekarang pilih lokasi sekolah di peta.",
                "info",
                3000
            );

        }, 700);

        return;
    }

    if (modePilihLokasi === "school") {

        setSchoolLocation(
            latlng.lat,
            latlng.lng,
            "Lokasi sekolah dipilih dari peta"
        );

        modePilihLokasi = null;

        updateLocationInstruction();

        showToast(
            "Lokasi sekolah berhasil dipilih.",
            "success"
        );

        setTimeout(() => {

            if (
                latLngRumah &&
                latLngSekolah
            ) {
                calculateRoute();
            }

        }, 400);
    }
}


function startSelectHome() {

    initializeMap();

    modePilihLokasi = "home";

    updateLocationInstruction();

    showToast(
        "Klik lokasi rumah kamu pada peta.",
        "info",
        3000
    );

    navigateTo("map");
}


function startSelectSchool() {

    initializeMap();

    modePilihLokasi = "school";

    updateLocationInstruction();

    showToast(
        "Klik lokasi sekolah pada peta.",
        "info",
        3000
    );

    navigateTo("map");
}


function updateLocationInstruction() {

    if (!locationInstruction) {
        return;
    }

    if (modePilihLokasi === "home") {

        locationInstruction.textContent =
            "Klik titik lokasi rumah kamu pada peta.";

        locationInstruction.classList.add(
            "active"
        );

        return;
    }

    if (modePilihLokasi === "school") {

        locationInstruction.textContent =
            "Klik titik lokasi sekolah pada peta.";

        locationInstruction.classList.add(
            "active"
        );

        return;
    }

    locationInstruction.textContent =
        "Pilih rumah atau sekolah untuk menentukan lokasi.";

    locationInstruction.classList.remove(
        "active"
    );
}


/* =========================================
   SET HOME LOCATION
========================================= */

function setHomeLocation(
    lat,
    lng,
    name = "Rumah"
) {

    const latitude =
        Number(lat);

    const longitude =
        Number(lng);

    if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
    ) {
        showToast(
            "Koordinat rumah tidak valid.",
            "error"
        );

        return;
    }

    latLngRumah = [
        latitude,
        longitude
    ];

    appData.home = {
        lat: latitude,
        lng: longitude,
        name
    };

    saveAppData();

    initializeMap();

    if (markerRumah) {
        markerRumah.remove();
    }

    markerRumah =
        L.marker(
            latLngRumah,
            {
                icon: createHomeIcon(),
                zIndexOffset: 1000
            }
        )
        .addTo(map)
        .bindPopup(
            `<strong>Rumah</strong><br>${escapeHtml(name)}`
        );

    updateHomeUI();

    map.setView(
        latLngRumah,
        Math.max(map.getZoom(), 15)
    );

    recalculateIfLocationsReady();
}


/* =========================================
   SET SCHOOL LOCATION
========================================= */

function setSchoolLocation(
    lat,
    lng,
    name = "Sekolah"
) {

    const latitude =
        Number(lat);

    const longitude =
        Number(lng);

    if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
    ) {
        showToast(
            "Koordinat sekolah tidak valid.",
            "error"
        );

        return;
    }

    latLngSekolah = [
        latitude,
        longitude
    ];

    appData.school = {
        lat: latitude,
        lng: longitude,
        name
    };

    saveAppData();

    initializeMap();

    if (markerSekolah) {
        markerSekolah.remove();
    }

    markerSekolah =
        L.marker(
            latLngSekolah,
            {
                icon: createSchoolIcon(),
                zIndexOffset: 900
            }
        )
        .addTo(map)
        .bindPopup(
            `<strong>Sekolah</strong><br>${escapeHtml(name)}`
        );

    updateSchoolUI();

    map.setView(
        latLngSekolah,
        Math.max(map.getZoom(), 15)
    );

    recalculateIfLocationsReady();
}


/* =========================================
   RESTORE MAP LOCATIONS
========================================= */

function restoreMapLocations() {

    if (!map) {
        return;
    }

    if (
        appData.home &&
        typeof appData.home.lat === "number" &&
        typeof appData.home.lng === "number"
    ) {

        latLngRumah = [
            appData.home.lat,
            appData.home.lng
        ];

        markerRumah =
            L.marker(
                latLngRumah,
                {
                    icon: createHomeIcon(),
                    zIndexOffset: 1000
                }
            )
            .addTo(map)
            .bindPopup(
                `<strong>Rumah</strong><br>${escapeHtml(
                    appData.home.name || "Rumah"
                )}`
            );
    }

    if (
        appData.school &&
        typeof appData.school.lat === "number" &&
        typeof appData.school.lng === "number"
    ) {

        latLngSekolah = [
            appData.school.lat,
            appData.school.lng
        ];

        markerSekolah =
            L.marker(
                latLngSekolah,
                {
                    icon: createSchoolIcon(),
                    zIndexOffset: 900
                }
            )
            .addTo(map)
            .bindPopup(
                `<strong>Sekolah</strong><br>${escapeHtml(
                    appData.school.name || "Sekolah"
                )}`
            );
    }

    updateHomeUI();

    updateSchoolUI();

    if (
        latLngRumah &&
        latLngSekolah
    ) {
        fitMapToLocations();
    }
}


/* =========================================
   FIT MAP TO LOCATIONS
========================================= */

function fitMapToLocations() {

    if (
        !map ||
        !latLngRumah ||
        !latLngSekolah
    ) {
        return;
    }

    const bounds =
        L.latLngBounds([
            latLngRumah,
            latLngSekolah
        ]);

    map.fitBounds(
        bounds,
        {
            padding: [50, 50],
            maxZoom: 16
        }
    );
}


/* =========================================
   LOCATION UI
========================================= */

function updateHomeUI() {

    const hasHome =
        !!latLngRumah;

    if (homeStatus) {

        homeStatus.textContent =
            hasHome
                ? (
                    appData.home?.name ||
                    "Lokasi rumah sudah dipilih"
                )
                : "Lokasi rumah belum dipilih";

        homeStatus.classList.toggle(
            "success",
            hasHome
        );
    }

    if (locationHomeName) {

        locationHomeName.textContent =
            hasHome
                ? (
                    appData.home?.name ||
                    "Lokasi rumah"
                )
                : "Belum dipilih";
    }

    if (dashboardHome) {

        dashboardHome.textContent =
            hasHome
                ? (
                    appData.home?.name ||
                    "Lokasi rumah"
                )
                : "Belum dipilih";
    }
}


function updateSchoolUI() {

    const hasSchool =
        !!latLngSekolah;

    if (schoolStatus) {

        schoolStatus.textContent =
            hasSchool
                ? (
                    appData.school?.name ||
                    "Lokasi sekolah sudah dipilih"
                )
                : "Lokasi sekolah belum dipilih";

        schoolStatus.classList.toggle(
            "success",
            hasSchool
        );
    }

    if (locationSchoolName) {

        locationSchoolName.textContent =
            hasSchool
                ? (
                    appData.school?.name ||
                    "Lokasi sekolah"
                )
                : "Belum dipilih";
    }

    if (dashboardSchool) {

        dashboardSchool.textContent =
            hasSchool
                ? (
                    appData.school?.name ||
                    "Belum dipilih"
                )
                : "Belum dipilih";
    }
}


/* =========================================
   GPS
========================================= */

function useGPSForHome() {

    if (!navigator.geolocation) {

        showToast(
            "GPS tidak didukung oleh perangkat ini.",
            "error"
        );

        return;
    }

    showLoading(true);

    navigator.geolocation.getCurrentPosition(
        position => {

            const {
                latitude,
                longitude
            } = position.coords;

            setHomeLocation(
                latitude,
                longitude,
                "Lokasi GPS"
            );

            modePilihLokasi = null;

            updateLocationInstruction();

            showLoading(false);

            showToast(
                "Lokasi GPS berhasil digunakan sebagai rumah.",
                "success"
            );

        },

        error => {

            showLoading(false);

            console.error(
                "GPS error:",
                error
            );

            let message =
                "Gagal mendapatkan lokasi GPS.";

            if (error.code === 1) {
                message =
                    "Izin lokasi ditolak. Aktifkan izin lokasi di browser.";
            }

            if (error.code === 2) {
                message =
                    "Lokasi tidak tersedia.";
            }

            if (error.code === 3) {
                message =
                    "GPS terlalu lama merespons.";
            }

            showToast(
                message,
                "error",
                4000
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


function locateUserOnMap() {

    if (!navigator.geolocation) {

        showToast(
            "GPS tidak didukung.",
            "error"
        );

        return;
    }

    showLoading(true);

    navigator.geolocation.getCurrentPosition(
        position => {

            const {
                latitude,
                longitude
            } = position.coords;

            initializeMap();

            map.setView(
                [latitude, longitude],
                17
            );

            showLoading(false);

            showToast(
                "Lokasi kamu ditemukan.",
                "success"
            );

        },

        error => {

            showLoading(false);

            console.error(
                "GPS error:",
                error
            );

            showToast(
                "Tidak dapat mendapatkan lokasi kamu.",
                "error"
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


/* =========================================
   NOMINATIM SEARCH
========================================= */

async function searchLocation(
    query,
    type
) {

    const cleanQuery =
        String(query || "").trim();

    if (!cleanQuery) {

        showToast(
            "Masukkan nama atau alamat terlebih dahulu.",
            "warning"
        );

        return;
    }

    showLoading(true);

    try {

        const url =
            "https://nominatim.openstreetmap.org/search" +
            `?format=jsonv2&limit=1&q=${encodeURIComponent(cleanQuery)}`;

        const response =
            await fetch(
                url,
                {
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "Gagal menghubungi pencarian lokasi."
            );
        }

        const results =
            await response.json();

        if (
            !Array.isArray(results) ||
            !results.length
        ) {

            showToast(
                "Lokasi tidak ditemukan.",
                "warning"
            );

            return;
        }

        const result =
            results[0];

        const lat =
            Number(result.lat);

        const lng =
            Number(result.lon);

        const name =
            result.display_name ||
            cleanQuery;

        if (
            Number.isNaN(lat) ||
            Number.isNaN(lng)
        ) {

            showToast(
                "Koordinat hasil pencarian tidak valid.",
                "error"
            );

            return;
        }

        if (type === "home") {

            setHomeLocation(
                lat,
                lng,
                name
            );

            modePilihLokasi = null;

        } else if (type === "school") {

            setSchoolLocation(
                lat,
                lng,
                name
            );

            modePilihLokasi = null;
        }

        updateLocationInstruction();

        initializeMap();

        map.setView(
            [lat, lng],
            16
        );

        showToast(
            "Lokasi berhasil ditemukan.",
            "success"
        );

    } catch (error) {

        console.error(
            "Search error:",
            error
        );

        showToast(
            "Gagal mencari lokasi. Coba lagi.",
            "error"
        );

    } finally {

        showLoading(false);
    }
}


/* =========================================
   MANUAL COORDINATES
========================================= */

function saveManualLocation(type) {

    const latInput =
        type === "home"
            ? manualHomeLat
            : manualSchoolLat;

    const lngInput =
        type === "home"
            ? manualHomeLng
            : manualSchoolLng;

    if (!latInput || !lngInput) {
        return;
    }

    const lat =
        Number(latInput.value);

    const lng =
        Number(lngInput.value);

    if (
        Number.isNaN(lat) ||
        Number.isNaN(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
    ) {

        showToast(
            "Koordinat tidak valid.",
            "warning"
        );

        return;
    }

    if (type === "home") {

        setHomeLocation(
            lat,
            lng,
            "Lokasi manual"
        );

    } else {

        setSchoolLocation(
            lat,
            lng,
            "Lokasi manual"
        );
    }

    modePilihLokasi = null;

    updateLocationInstruction();

    initializeMap();

    map.setView(
        [lat, lng],
        16
    );

    showToast(
        type === "home"
            ? "Lokasi rumah disimpan."
            : "Lokasi sekolah disimpan.",
        "success"
    );
}


/* =========================================
   TRANSPORT
========================================= */

function setTransport(
    transport
) {

    transportAktif =
        transport;

    if (transport === "walking") {

        profilRouting = "foot";

        kecepatanAktif =
            Number(settings.walkingSpeed) ||
            4.5;

    } else if (transport === "car") {

        profilRouting = "driving";

        kecepatanAktif =
            Number(settings.carSpeed) ||
            45;

    } else {

        profilRouting = "driving";

        kecepatanAktif =
            Number(settings.motorSpeed) ||
            30;

        transportAktif = "motor";
    }

    updateTransportUI();

    if (
        latLngRumah &&
        latLngSekolah
    ) {
        calculateRoute();
    }
}


function updateTransportUI() {

    const buttons = [
        {
            element: walkBtn,
            value: "walking"
        },
        {
            element: motorBtn,
            value: "motor"
        },
        {
            element: carBtn,
            value: "car"
        }
    ];

    buttons.forEach(item => {

        if (!item.element) {
            return;
        }

        item.element.classList.toggle(
            "active",
            item.value === transportAktif
        );

    });

    if (dashboardTransport) {

        const names = {
            walking: "Jalan kaki",
            motor: "Motor",
            car: "Mobil"
        };

        dashboardTransport.textContent =
            names[transportAktif] ||
            "Motor";
    }
}


/* =========================================
   ROUTING
========================================= */

async function calculateRoute() {

    if (
        !latLngRumah ||
        !latLngSekolah
    ) {

        showToast(
            "Pilih lokasi rumah dan sekolah terlebih dahulu.",
            "warning"
        );

        return;
    }

    initializeMap();

    showLoading(true);

    if (garisRute) {

        garisRute.remove();

        garisRute = null;
    }

    try {

        const [homeLat, homeLng] =
            latLngRumah;

        const [schoolLat, schoolLng] =
            latLngSekolah;

        const profile =
            profilRouting === "foot"
                ? "foot"
                : "driving";

        const url =
            `https://router.project-osrm.org/route/v1/${profile}/` +
            `${homeLng},${homeLat};${schoolLng},${schoolLat}` +
            "?overview=full&geometries=geojson";

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                "Routing server error"
            );
        }

        const data =
            await response.json();

        if (
            data.code !== "Ok" ||
            !data.routes ||
            !data.routes.length
        ) {
            throw new Error(
                "Rute tidak ditemukan"
            );
        }

        const route =
            data.routes[0];

        jarakKmGlobal =
            Number(route.distance) / 1000;

        const routeCoordinates =
            route.geometry.coordinates
                .map(coord => [
                    coord[1],
                    coord[0]
                ]);

        garisRute =
            L.polyline(
                routeCoordinates,
                {
                    weight: 5,
                    opacity: 0.85
                }
            ).addTo(map);

        const distanceMeters =
            Number(route.distance);

        const estimatedMinutes =
            (
                distanceMeters / 1000
            ) /
            Math.max(
                Number(kecepatanAktif) || 1,
                0.1
            ) *
            60;

        updateRouteResult(
            jarakKmGlobal,
            estimatedMinutes
        );

        fitMapToRoute(
            routeCoordinates
        );

        saveHistory({
            date:
                new Date().toISOString(),
            transport:
                transportAktif,
            transportName:
                getTransportName(
                    transportAktif
                ),
            distance:
                jarakKmGlobal,
            time:
                estimatedMinutes
        });

        updateDashboard();

        showToast(
            "Rute berhasil dibuat.",
            "success"
        );

    } catch (error) {

        console.error(
            "Routing error:",
            error
        );

        showToast(
            "Rute gagal dibuat. Pastikan kedua lokasi sudah benar dan coba lagi.",
            "error",
            4000
        );

    } finally {

        showLoading(false);
    }
}


function recalculateIfLocationsReady() {

    if (
        latLngRumah &&
        latLngSekolah
    ) {
        setTimeout(() => {
            calculateRoute();
        }, 300);
    }
}


function fitMapToRoute(
    coordinates
) {

    if (
        !map ||
        !Array.isArray(coordinates) ||
        !coordinates.length
    ) {
        return;
    }

    const bounds =
        L.latLngBounds(
            coordinates
        );

    map.fitBounds(
        bounds,
        {
            padding: [60, 60]
        }
    );
}


/* =========================================
   ROUTE RESULT
========================================= */

function updateRouteResult(
    distance,
    minutes
) {

    if (distanceResult) {

        distanceResult.textContent =
            formatDistance(distance);
    }

    if (timeResult) {

        timeResult.textContent =
            formatTime(minutes);
    }

    if (dashboardDistance) {

        dashboardDistance.textContent =
            formatDistance(distance);
    }

    if (dashboardTime) {

        dashboardTime.textContent =
            formatTime(minutes);
    }

    if (dashboardTransport) {

        dashboardTransport.textContent =
            getTransportName(
                transportAktif
            );
    }
}


function getTransportName(
    transport
) {

    const names = {
        walking: "Jalan kaki",
        motor: "Motor",
        car: "Mobil"
    };

    return names[transport] ||
        "Motor";
}


/* =========================================
   GOOGLE MAPS
========================================= */

function openGoogleMaps() {

    if (
        !latLngRumah ||
        !latLngSekolah
    ) {

        showToast(
            "Buat rute terlebih dahulu.",
            "warning"
        );

        return;
    }

    const [
        homeLat,
        homeLng
    ] = latLngRumah;

    const [
        schoolLat,
        schoolLng
    ] = latLngSekolah;

    const url =
        "https://www.google.com/maps/dir/?api=1" +
        `&origin=${homeLat},${homeLng}` +
        `&destination=${schoolLat},${schoolLng}` +
        "&travelmode=driving";

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================
   RESET MAP ONLY
========================================= */

function resetMap() {

    if (markerRumah) {

        markerRumah.remove();

        markerRumah = null;
    }

    if (markerSekolah) {

        markerSekolah.remove();

        markerSekolah = null;
    }

    if (garisRute) {

        garisRute.remove();

        garisRute = null;
    }

    latLngRumah = null;

    latLngSekolah = null;

    jarakKmGlobal = null;

    modePilihLokasi = null;

    appData.home = null;

    appData.school = null;

    saveAppData();

    if (distanceResult) {
        distanceResult.textContent = "--";
    }

    if (timeResult) {
        timeResult.textContent = "--";
    }

    updateHomeUI();

    updateSchoolUI();

    updateLocationInstruction();

    updateDashboard();

    if (map) {

        map.setView(
            [-6.5891, 110.6677],
            15
        );
    }

    showToast(
        "Peta berhasil direset.",
        "success"
    );
}


/* =========================================
   RESET JOURNEY
========================================= */

function initializeResetJourneyButton() {

    const resetJourneyButton =
        document.getElementById(
            "resetJourneyButton"
        );

    if (!resetJourneyButton) {
        return;
    }

    resetJourneyButton.addEventListener(
        "click",
        () => {

            openConfirmModal(
                "Reset perjalanan?",
                "Lokasi rumah, sekolah, dan rute saat ini akan dihapus.",
                resetJourney
            );

        }
    );function resetJourney() {

    appData = {
        home: null,
        school: null
    };

    latLngRumah = null;
    latLngSekolah = null;
    jarakKmGlobal = 0;

    modePilihLokasi = null;

    saveStorage(
        STORAGE_KEY,
        appData
    );

    if (
        markerRumah &&
        map
    ) {

        map.removeLayer(
            markerRumah
        );

    }

    if (
        markerSekolah &&
        map
    ) {

        map.removeLayer(
            markerSekolah
        );

    }

    if (
        garisRute &&
        map
    ) {

        map.removeLayer(
            garisRute
        );

    }

    markerRumah = null;
    markerSekolah = null;
    garisRute = null;

    updateLocationUI();

    updateRouteResult(
        NaN,
        NaN
    );

    showToast(
        "Perjalanan berhasil direset."
    );

}


/* =========================================
   HISTORY
========================================= */

function saveHistory(
    distanceKm,
    timeMinutes
) {

    const history =
        loadStorage(
            HISTORY_KEY,
            []
        );

    const item = {

        id:
            Date.now(),

        date:
            new Date().toLocaleString(
                "id-ID"
            ),

        distance:
            distanceKm,

        time:
            timeMinutes,

        transport:
            transportAktif,

        speed:
            kecepatanAktif

    };

    history.unshift(
        item
    );

    const limitedHistory =
        history.slice(
            0,
            20
        );

    saveStorage(
        HISTORY_KEY,
        limitedHistory
    );

    renderHistory();

}


function renderHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );

    if (!historyList) {
        return;
    }

    const history =
        loadStorage(
            HISTORY_KEY,
            []
        );

    if (!history.length) {

        historyList.innerHTML = `
            <div class="history-empty">
                Belum ada riwayat perjalanan.
            </div>
        `;

        return;
    }

    historyList.innerHTML =
        history
            .map((item) => {

                const transportName =
                    item.transport ===
                    "walking"
                        ? "Jalan kaki"
                        : item.transport ===
                          "motor"
                            ? "Motor"
                            : "Mobil";

                return `
                    <div class="history-item">

                        <div class="history-item-top">

                            <strong>
                                ${transportName}
                            </strong>

                            <span>
                                ${escapeHtml(item.date)}
                            </span>

                        </div>

                        <div class="history-item-bottom">

                            <span>
                                ${formatDistance(
                                    Number(
                                        item.distance
                                    )
                                )}
                            </span>

                            <span>
                                ${formatDuration(
                                    Number(
                                        item.time
                                    )
                                )}
                            </span>

                        </div>

                    </div>
                `;

            })
            .join("");

}


/* =========================================
   CLEAR HISTORY
========================================= */

const clearHistoryButton =
    document.getElementById(
        "clearHistoryButton"
    );

if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        () => {

            openConfirmModal(
                "Hapus riwayat?",
                "Semua riwayat perjalanan akan dihapus.",
                () => {

                    localStorage.removeItem(
                        HISTORY_KEY
                    );

                    renderHistory();

                    showToast(
                        "Riwayat berhasil dihapus."
                    );

                }
            );

        }
    );

}


/* =========================================
   PENGINGAT BERANGKAT - ELEMENTS
========================================= */

const departureReminderToggle =
    document.getElementById(
        "departureReminderToggle"
    );

const reminderSoundSelect =
    document.getElementById(
        "reminderSoundSelect"
    );

const testReminderSoundButton =
    document.getElementById(
        "testReminderSoundButton"
    );

const reminderStatusTitle =
    document.getElementById(
        "reminderStatusTitle"
    );

const reminderStatusText =
    document.getElementById(
        "reminderStatusText"
    );

const departureReminderCard =
    document.querySelector(
        ".departure-reminder-card"
    );

let reminderData = loadStorage(
    REMINDER_KEY,
    {
        enabled: false,
        sound: "classic"
    }
);

let reminderTimer = null;
let reminderAudioContext = null;
let reminderTriggeredKey = null;


/* =========================================
   PENGINGAT BERANGKAT - AUDIO
========================================= */

function getReminderAudioContext() {

    if (!reminderAudioContext) {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        reminderAudioContext =
            new AudioContextClass();

    }

    if (
        reminderAudioContext.state ===
        "suspended"
    ) {

        reminderAudioContext
            .resume()
            .catch(() => {});

    }

    return reminderAudioContext;
}


function playReminderSound(
    sound = "classic"
) {

    const audioContext =
        getReminderAudioContext();

    if (!audioContext) {

        showToast(
            "Perangkat tidak mendukung suara pengingat."
        );

        return;
    }

    const now =
        audioContext.currentTime;

    const patterns = {

        classic: [
            {
                frequency: 880,
                start: 0,
                duration: 0.18
            },
            {
                frequency: 1175,
                start: 0.22,
                duration: 0.22
            }
        ],

        soft: [
            {
                frequency: 659,
                start: 0,
                duration: 0.28
            },
            {
                frequency: 784,
                start: 0.32,
                duration: 0.32
            }
        ],

        double: [
            {
                frequency: 988,
                start: 0,
                duration: 0.14
            },
            {
                frequency: 988,
                start: 0.20,
                duration: 0.14
            },
            {
                frequency: 1319,
                start: 0.40,
                duration: 0.22
            }
        ]

    };

    const pattern =
        patterns[sound] ||
        patterns.classic;

    pattern.forEach(
        (tone) => {

            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();

            oscillator.type =
                "sine";

            oscillator.frequency.setValueAtTime(
                tone.frequency,
                now + tone.start
            );

            gain.gain.setValueAtTime(
                0.0001,
                now + tone.start
            );

            gain.gain.exponentialRampToValueAtTime(
                0.18,
                now +
                    tone.start +
                    0.025
            );

            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                now +
                    tone.start +
                    tone.duration
            );

            oscillator.connect(
                gain
            );

            gain.connect(
                audioContext.destination
            );

            oscillator.start(
                now + tone.start
            );

            oscillator.stop(
                now +
                    tone.start +
                    tone.duration +
                    0.02
            );

        }
    );

}


/* =========================================
   PENGINGAT BERANGKAT - NOTIFICATION
========================================= */

async function requestReminderNotificationPermission() {

    if (
        !("Notification" in window)
    ) {
        return false;
    }

    if (
        Notification.permission ===
        "granted"
    ) {
        return true;
    }

    if (
        Notification.permission ===
        "denied"
    ) {
        return false;
    }

    try {

        const permission =
            await Notification.requestPermission();

        return (
            permission ===
            "granted"
        );

    } catch (error) {

        console.error(
            "Izin notifikasi gagal:",
            error
        );

        return false;
    }
}


function showDepartureNotification() {

    if (
        !("Notification" in window)
    ) {
        return;
    }

    if (
        Notification.permission !==
        "granted"
    ) {
        return;
    }

    try {

        const notification =
            new Notification(
                "Waktunya berangkat",
                {
                    body:
                        `Berangkat sekarang agar tiba di sekolah sekitar ${scheduleData?.schoolTime || "waktu yang ditentukan"}.`,

                    icon:
                        "./icon-192.png",

                    badge:
                        "./icon-192.png",

                    tag:
                        "jarak-ke-sekolah-departure"
                }
            );

        notification.onclick =
            () => {

                window.focus();

                notification.close();

                showPage(
                    "schedulePage"
                );

            };

    } catch (error) {

        console.error(
            "Notifikasi pengingat gagal:",
            error
        );

    }

}


/* =========================================
   PENGINGAT BERANGKAT - STATUS
========================================= */

function updateDepartureReminderUI() {

    const enabled =
        Boolean(
            reminderData?.enabled
        );

    if (departureReminderToggle) {

        departureReminderToggle.checked =
            enabled;

    }

    if (reminderSoundSelect) {

        reminderSoundSelect.value =
            reminderData?.sound ||
            "classic";

    }

    if (departureReminderCard) {

        departureReminderCard.classList.toggle(
            "reminder-active",
            enabled
        );

    }

    if (
        reminderStatusTitle &&
        reminderStatusText
    ) {

        if (enabled) {

            reminderStatusTitle.textContent =
                "Pengingat aktif";

            reminderStatusText.textContent =
                "Pengingat akan berbunyi sesuai waktu berangkat yang tersimpan.";

        } else {

            reminderStatusTitle.textContent =
                "Pengingat belum aktif";

            reminderStatusText.textContent =
                "Aktifkan pengingat setelah menyimpan jadwal berangkat.";

        }

    }

}


/* =========================================
   PENGINGAT BERANGKAT - SAVE
========================================= */

function saveReminderData() {

    saveStorage(
        REMINDER_KEY,
        reminderData
    );

    updateDepartureReminderUI();

}


/* =========================================
   PENGINGAT BERANGKAT - TRIGGER
========================================= */

function triggerDepartureReminder() {

    const todayKey =
        new Date()
            .toISOString()
            .slice(0, 10);

    const triggerKey =
        `${todayKey}_${scheduleData?.departureTime || ""}`;

    if (
        reminderTriggeredKey ===
        triggerKey
    ) {
        return;
    }

    reminderTriggeredKey =
        triggerKey;

    playReminderSound(
        reminderData?.sound ||
        "classic"
    );

    showDepartureNotification();

    showToast(
        "Waktunya berangkat!",
        "success",
        5000
    );

}


/* =========================================
   PENGINGAT BERANGKAT - TIMER
========================================= */

function stopDepartureReminderTimer() {

    if (reminderTimer) {

        clearInterval(
            reminderTimer
        );

        reminderTimer = null;

    }

}


function startDepartureReminderTimer() {

    stopDepartureReminderTimer();

    if (
        !reminderData?.enabled
    ) {
        return;
    }

    reminderTimer =
        setInterval(
            checkDepartureReminder,
            1000
        );

    checkDepartureReminder();

}


function checkDepartureReminder() {

    if (
        !reminderData?.enabled
    ) {
        return;
    }

    if (
        !scheduleData ||
        !scheduleData.departureTime
    ) {
        return;
    }

    const now =
        new Date();

    const [hour, minute] =
        String(
            scheduleData.departureTime
        )
        .split(":")
        .map(Number);

    if (
        Number.isNaN(hour) ||
        Number.isNaN(minute)
    ) {
        return;
    }

    const target =
        new Date();

    target.setHours(
        hour,
        minute,
        0,
        0
    );

    if (
        now.getHours() === hour &&
        now.getMinutes() === minute
    ) {

        triggerDepartureReminder();

    }

}


/* =========================================
   PENGINGAT BERANGKAT - EVENTS
========================================= */

if (departureReminderToggle) {

    departureReminderToggle.addEventListener(
        "change",
        async () => {

            if (
                departureReminderToggle.checked
            ) {

                reminderData.enabled =
                    true;

                await requestReminderNotificationPermission();

                showToast(
                    "Pengingat berangkat diaktifkan.",
                    "success"
                );

                startDepartureReminderTimer();

            } else {

                reminderData.enabled =
                    false;

                stopDepartureReminderTimer();

                showToast(
                    "Pengingat berangkat dimatikan."
                );

            }

            saveReminderData();

        }
    );

}


if (reminderSoundSelect) {

    reminderSoundSelect.addEventListener(
        "change",
        () => {

            reminderData.sound =
                reminderSoundSelect.value;

            saveReminderData();

        }
    );

}


if (testReminderSoundButton) {

    testReminderSoundButton.addEventListener(
        "click",
        () => {

            const sound =
                reminderSoundSelect?.value ||
                "classic";

            playReminderSound(
                sound
            );

            showToast(
                "Tes suara pengingat.",
                "success"
            );

        }
    );

}


/* =========================================
   SCHEDULE
========================================= */

let scheduleData =
    loadStorage(
        SCHEDULE_KEY,
        {
            day: "",
            date: "",
            schoolTime: "",
            departureTime: "",
            buffer: 10
        }
    );


function saveSchedule() {

    if (
        !scheduleEntryTime ||
        !scheduleDepartureTime
    ) {
        return;
    }

    const schoolTime =
        scheduleEntryTime.value;

    const departureTime =
        scheduleDepartureTime.value;

    if (!schoolTime) {

        showToast(
            "Masukkan jam masuk sekolah.",
            "warning"
        );

        return;
    }

    if (!departureTime) {

        showToast(
            "Masukkan waktu berangkat.",
            "warning"
        );

        return;
    }

    scheduleData = {

        day:
            scheduleDay?.value ||
            "",

        date:
            scheduleDate?.value ||
            "",

        schoolTime,

        departureTime,

        buffer:
            Number(
                scheduleBuffer?.value ||
                settings.defaultBuffer ||
                10
            )

    };

    saveStorage(
        SCHEDULE_KEY,
        scheduleData
    );

    updateScheduleUI();

    if (
        reminderData?.enabled
    ) {

        startDepartureReminderTimer();

    }

    showToast(
        "Jadwal berhasil disimpan.",
        "success"
    );

}


function updateScheduleUI() {

    if (!scheduleData) {
        return;
    }

    if (scheduleDay) {

        scheduleDay.value =
            scheduleData.day ||
            "";

    }

    if (scheduleDate) {

        scheduleDate.value =
            scheduleData.date ||
            "";

    }

    if (scheduleEntryTime) {

        scheduleEntryTime.value =
            scheduleData.schoolTime ||
            "";

    }

    if (scheduleDepartureTime) {

        scheduleDepartureTime.value =
            scheduleData.departureTime ||
            "";

    }

    if (scheduleBuffer) {

        scheduleBuffer.value =
            String(
                scheduleData.buffer ??
                settings.defaultBuffer ??
                10
            );

    }

    if (
        recommendedDeparture
    ) {

        recommendedDeparture.textContent =
            scheduleData.departureTime ||
            "--:--";

    }

    if (
        scheduleStatus
    ) {

        scheduleStatus.textContent =
            scheduleData.departureTime
                ? "Jadwal berangkat tersimpan."
                : "Belum ada jadwal berangkat.";

    }

    if (
        scheduleResult
    ) {

        scheduleResult.classList.toggle(
            "has-result",
            Boolean(
                scheduleData.departureTime
            )
        );

    }

}


function calculateSchedule() {

    if (!scheduleEntryTime) {
        return;
    }

    const schoolTime =
        scheduleEntryTime.value;

    if (!schoolTime) {

        showToast(
            "Masukkan jam masuk sekolah terlebih dahulu.",
            "warning"
        );

        return;
    }

    let travelMinutes = 0;

    if (
        jarakKmGlobal &&
        Number(jarakKmGlobal) > 0
    ) {

        travelMinutes =
            (
                Number(jarakKmGlobal) /
                Math.max(
                    Number(kecepatanAktif) || 1,
                    0.1
                )
            ) *
            60;

    }

    const buffer =
        Number(
            scheduleBuffer?.value ||
            settings.defaultBuffer ||
            10
        );

    const totalMinutes =
        Math.ceil(
            travelMinutes +
            buffer
        );

    const [
        hour,
        minute
    ] =
        schoolTime
            .split(":")
            .map(Number);

    if (
        Number.isNaN(hour) ||
        Number.isNaN(minute)
    ) {

        showToast(
            "Jam masuk sekolah tidak valid.",
            "error"
        );

        return;
    }

    const schoolDate =
        new Date();

    schoolDate.setHours(
        hour,
        minute,
        0,
        0
    );

    schoolDate.setMinutes(
        schoolDate.getMinutes() -
        totalMinutes
    );

    const departure =
        formatTimeClock(
            schoolDate
        );

    if (scheduleDepartureTime) {

        scheduleDepartureTime.value =
            departure;

    }

    if (recommendedDeparture) {

        recommendedDeparture.textContent =
            departure;

    }

    scheduleData = {

        day:
            scheduleDay?.value ||
            "",

        date:
            scheduleDate?.value ||
            "",

        schoolTime,

        departureTime:
            departure,

        buffer

    };

    saveStorage(
        SCHEDULE_KEY,
        scheduleData
    );

    updateScheduleUI();

    if (
        reminderData?.enabled
    ) {

        startDepartureReminderTimer();

    }

    showToast(
        `Disarankan berangkat pukul ${departure}.`,
        "success",
        4000
    );

}


/* =========================================
   SETTINGS UI
========================================= */

function populateSettingsUI() {

    if (walkingSpeedInput) {

        walkingSpeedInput.value =
            settings.walkingSpeed;

    }

    if (motorSpeedInput) {

        motorSpeedInput.value =
            settings.motorSpeed;

    }

    if (carSpeedInput) {

        carSpeedInput.value =
            settings.carSpeed;

    }

    if (defaultBufferSelect) {

        defaultBufferSelect.value =
            String(
                settings.defaultBuffer
            );

    }

    if (defaultMapSelect) {

        defaultMapSelect.value =
            settings.defaultMap;

    }

    if (themeSelect) {

        themeSelect.value =
            settings.theme;

    }

}


/* =========================================
   SAVE SETTINGS
========================================= */

function saveSettings() {

    const walking =
        Number(
            walkingSpeedInput?.value
        );

    const motor =
        Number(
            motorSpeedInput?.value
        );

    const car =
        Number(
            carSpeedInput?.value
        );

    if (
        !walking ||
        walking <= 0 ||
        !motor ||
        motor <= 0 ||
        !car ||
        car <= 0
    ) {

        showToast(
            "Kecepatan harus lebih dari 0.",
            "warning"
        );

        return;
    }

    settings.walkingSpeed =
        walking;

    settings.motorSpeed =
        motor;

    settings.carSpeed =
        car;

    settings.defaultBuffer =
        Number(
            defaultBufferSelect?.value ||
            10
        );

    settings.defaultMap =
        defaultMapSelect?.value ||
        "street";

    settings.theme =
        themeSelect?.value ||
        "system";

    saveStorage(
        SETTINGS_KEY,
        settings
    );

    applyTheme(
        settings.theme
    );

    if (
        currentMapType !==
        settings.defaultMap
    ) {

        changeMapType(
            settings.defaultMap
        );

    }

    selectTransport(
        transportAktif
    );

    updateSpeedLabels();

    showToast(
        "Pengaturan berhasil disimpan.",
        "success"
    );

}


function resetSettings() {

    openConfirmModal(
        "Reset pengaturan?",
        "Semua pengaturan kecepatan, peta, dan tema akan dikembalikan ke bawaan.",
        () => {

            settings = {
                ...DEFAULT_SETTINGS
            };

            saveStorage(
                SETTINGS_KEY,
                settings
            );

            populateSettingsUI();

            applyTheme(
                settings.theme
            );

            changeMapType(
                settings.defaultMap
            );

            selectTransport(
                "motor"
            );

            updateSpeedLabels();

            showToast(
                "Pengaturan dikembalikan.",
                "success"
            );

        }
    );

}


/* =========================================
   SPEED LABELS
========================================= */

function updateSpeedLabels() {

    document
        .querySelectorAll(
            "[data-speed-value]"
        )
        .forEach(element => {

            const type =
                element.dataset.speedValue;

            if (
                type === "walking"
            ) {

                element.textContent =
                    `${settings.walkingSpeed} km/jam`;

            } else if (
                type === "motor"
            ) {

                element.textContent =
                    `${settings.motorSpeed} km/jam`;

            } else if (
                type === "car"
            ) {

                element.textContent =
                    `${settings.carSpeed} km/jam`;

            }

        });

}


/* =========================================
   SELECT TRANSPORT
========================================= */

function selectTransport(
    transport
) {

    transportAktif =
        transport;

    if (
        transport ===
        "walking"
    ) {

        profilRouting =
            "foot";

        kecepatanAktif =
            Number(
                settings.walkingSpeed
            ) ||
            4.5;

    } else if (
        transport ===
        "car"
    ) {

        profilRouting =
            "driving";

        kecepatanAktif =
            Number(
                settings.carSpeed
            ) ||
            45;

    } else {

        transportAktif =
            "motor";

        profilRouting =
            "driving";

        kecepatanAktif =
            Number(
                settings.motorSpeed
            ) ||
            30;

    }

    updateTransportUI();

}


/* =========================================
   LOCATION UI
========================================= */

function updateLocationUI() {

    const homeText =
        appData?.home?.name ||
        "Belum dipilih";

    const schoolText =
        appData?.school?.name ||
        "Belum dipilih";

    if (dashboardHome) {

        dashboardHome.textContent =
            homeText;

    }

    if (dashboardSchool) {

        dashboardSchool.textContent =
            schoolText;

    }

    if (locationHomeName) {

        locationHomeName.textContent =
            homeText;

    }

    if (locationSchoolName) {

        locationSchoolName.textContent =
            schoolText;

    }

    if (homeStatus) {

        homeStatus.textContent =
            appData?.home
                ? "Lokasi rumah sudah dipilih."
                : "Lokasi rumah belum dipilih.";

    }

    if (schoolStatus) {

        schoolStatus.textContent =
            appData?.school
                ? "Lokasi sekolah sudah dipilih."
                : "Lokasi sekolah belum dipilih.";

    }

}


/* =========================================
   LOCATION TARGET STATUS
========================================= */

function updateLocationTargetStatus() {

    if (!locationInstruction) {
        return;
    }

    if (
        modePilihLokasi ===
        "home"
    ) {

        locationInstruction.textContent =
            "Klik lokasi rumah kamu pada peta.";

        return;
    }

    if (
        modePilihLokasi ===
        "school"
    ) {

        locationInstruction.textContent =
            "Klik lokasi sekolah pada peta.";

        return;
    }

    locationInstruction.textContent =
        "Pilih rumah atau sekolah untuk menentukan lokasi.";

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    updateLocationUI();

    if (dashboardDistance) {

        dashboardDistance.textContent =
            jarakKmGlobal > 0
                ? formatDistance(
                    jarakKmGlobal
                )
                : "--";

    }

    if (dashboardTime) {

        if (
            jarakKmGlobal > 0
        ) {

            const minutes =
                (
                    jarakKmGlobal /
                    Math.max(
                        Number(
                            kecepatanAktif
                        ) || 1,
                        0.1
                    )
                ) *
                60;

            dashboardTime.textContent =
                formatDuration(
                    minutes
                );

        } else {

            dashboardTime.textContent =
                "--";

        }

    }

    if (dashboardTransport) {

        dashboardTransport.textContent =
            getTransportName(
                transportAktif
            );

    }

    if (dashboardMapType) {

        dashboardMapType.textContent =
            MAP_TYPE_NAMES[
                currentMapType
            ] ||
            "Peta Jalan";

    }

}


/* =========================================
   NAVIGATION
========================================= */

function showPage(
    pageId
) {

    Object.values(pages)
        .forEach(page => {

            if (!page) {
                return;
            }

            page.classList.toggle(
                "active",
                page.id === pageId
            );

        });

    navItems.forEach(item => {

        const target =
            item.dataset.page ||
            item.dataset.target;

        item.classList.toggle(
            "active",
            target === pageId
        );

    });

    if (
        pageId ===
        "mapPage"
    ) {

        setTimeout(() => {

            initializeMap();

            if (map) {
                map.invalidateSize();
            }

        }, 100);

    }

}


function navigateTo(
    page
) {

    const pageId =
        page === "dashboard"
            ? "dashboardPage"
            : page === "map"
                ? "mapPage"
                : page === "location"
                    ? "locationPage"
                    : page === "schedule"
                        ? "schedulePage"
                        : page === "settings"
                            ? "settingsPage"
                            : page;

    showPage(
        pageId
    );

}


/* =========================================
   LOADING
========================================= */

function showLoading(
    show
) {

    if (!loadingScreen) {
        return;
    }

    loadingScreen.classList.toggle(
        "show",
        Boolean(show)
    );

}


/* =========================================
   CONFIRM MODAL
========================================= */

function openConfirmModal(
    title,
    message,
    callback
) {

    if (
        !confirmOverlay
    ) {

        if (typeof callback === "function") {
            callback();
        }

        return;
    }

    confirmCallback =
        callback;

    if (confirmTitle) {

        confirmTitle.textContent =
            title;

    }

    if (confirmMessage) {

        confirmMessage.textContent =
            message;

    }

    confirmOverlay.classList.add(
        "show"
    );

}


function closeConfirmModal() {

    if (confirmOverlay) {

        confirmOverlay.classList.remove(
            "show"
        );

    }

    confirmCallback =
        null;

}


function runConfirmCallback() {

    const callback =
        confirmCallback;

    closeConfirmModal();

    if (
        typeof callback ===
        "function"
    ) {

        callback();

    }

}


/* =========================================
   TUTORIAL
========================================= */

function renderTutorialStep() {

    if (
        !tutorialOverlay ||
        !tutorialSteps.length
    ) {
        return;
    }

    const step =
        tutorialSteps[
            tutorialCurrentStep
        ];

    const icon =
        tutorialOverlay.querySelector(
            ".tutorial-icon"
        );

    if (icon) {
        icon.innerHTML =
            step.icon;
    }

    if (tutorialStepLabel) {

        tutorialStepLabel.textContent =
            `LANGKAH ${
                tutorialCurrentStep + 1
            } DARI ${
                tutorialSteps.length
            }`;

    }

    if (tutorialTitle) {

        tutorialTitle.textContent =
            step.title;

    }

    if (tutorialDescription) {

        tutorialDescription.textContent =
            step.description;

    }

    if (tutorialDots) {

        tutorialDots.innerHTML =
            tutorialSteps
                .map(
                    (_, index) =>
                        `<span class="tutorial-dot ${
                            index ===
                            tutorialCurrentStep
                                ? "active"
                                : ""
                        }"></span>`
                )
                .join("");

    }

    if (tutorialBack) {

        tutorialBack.disabled =
            tutorialCurrentStep === 0;

    }

    if (tutorialNext) {

        tutorialNext.textContent =
            tutorialCurrentStep ===
            tutorialSteps.length - 1
                ? "Selesai"
                : "Lanjut";

    }

}


/* =========================================
   OPEN TUTORIAL
========================================= */

function openTutorial(
    fromFirstStep = true
) {

    if (!tutorialOverlay) {

        console.warn(
            "Tutorial overlay tidak ditemukan."
        );

        return;
    }

    if (fromFirstStep) {

        tutorialCurrentStep =
            0;

    }

    tutorialIsOpen =
        true;

    renderTutorialStep();

    tutorialOverlay.classList.add(
        "show"
    );

}


/* =========================================
   CLOSE TUTORIAL
========================================= */

function closeTutorial(
    markAsSeen = true
) {

    if (tutorialOverlay) {

        tutorialOverlay.classList.remove(
            "show"
        );

    }

    tutorialIsOpen =
        false;

    if (markAsSeen) {

        localStorage.setItem(
            TUTORIAL_KEY,
            "true"
        );

    }

}


/* =========================================
   TUTORIAL EVENTS
========================================= */

if (tutorialClose) {

    tutorialClose.addEventListener(
        "click",
        () => {
            closeTutorial();
        }
    );

}


if (tutorialSkip) {

    tutorialSkip.addEventListener(
        "click",
        () => {
            closeTutorial();
        }
    );

}


if (tutorialBack) {

    tutorialBack.addEventListener(
        "click",
        () => {

            if (
                tutorialCurrentStep > 0
            ) {

                tutorialCurrentStep--;

                renderTutorialStep();

            }

        }
    );

}


if (tutorialNext) {

    tutorialNext.addEventListener(
        "click",
        () => {

            if (
                tutorialCurrentStep <
                tutorialSteps.length - 1
            ) {

                tutorialCurrentStep++;

                renderTutorialStep();

            } else {

                closeTutorial();

            }

        }
    );

}


if (openTutorialButton) {

    openTutorialButton.addEventListener(
        "click",
        () => {

            openTutorial(
                true
            );

        }
    );

}


if (tutorialOverlay) {

    tutorialOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                tutorialOverlay
            ) {

                closeTutorial();

            }

        }
    );

}


/* =========================================
   KEYBOARD ESC
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape" &&
            tutorialIsOpen
        ) {

            closeTutorial();

        }

    }
);


/* =========================================
   EVENT LISTENERS
========================================= */

navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const target =
                item.dataset.page ||
                item.dataset.target;

            if (target) {

                showPage(
                    target
                );

            }

        }
    );

});


if (homeLocationButton) {

    homeLocationButton.addEventListener(
        "click",
        startSelectHome
    );

}


if (schoolLocationButton) {

    schoolLocationButton.addEventListener(
        "click",
        startSelectSchool
    );

}


if (locateButton) {

    locateButton.addEventListener(
        "click",
        locateUserOnMap
    );

}


if (resetMapButton) {

    resetMapButton.addEventListener(
        "click",
        () => {

            openConfirmModal(
                "Reset peta?",
                "Semua lokasi dan rute pada peta akan dihapus.",
                resetMap
            );

        }
    );

}


if (calculateRouteButton) {

    calculateRouteButton.addEventListener(
        "click",
        calculateRoute
    );

}


if (googleMapsButton) {

    googleMapsButton.addEventListener(
        "click",
        openGoogleMaps
    );

}


if (walkBtn) {

    walkBtn.addEventListener(
        "click",
        () => {
            selectTransport(
                "walking"
            );
        }
    );

}


if (motorBtn) {

    motorBtn.addEventListener(
        "click",
        () => {
            selectTransport(
                "motor"
            );
        }
    );

}


if (carBtn) {

    carBtn.addEventListener(
        "click",
        () => {
            selectTransport(
                "car"
            );
        }
    );

}


if (mapTypeSelect) {

    mapTypeSelect.addEventListener(
        "change",
        event => {

            changeMapType(
                event.target.value
            );

        }
    );

}


document
    .querySelectorAll(
        "[data-map]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                changeMapType(
                    button.dataset.map
                );

            }
        );

    });


document
    .querySelectorAll(
        "[data-map-type]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                changeMapType(
                    button.dataset.mapType
                );

            }
        );

    });


if (searchHomeButton) {

    searchHomeButton.addEventListener(
        "click",
        () => {

            searchLocation(
                homeSearchInput?.value,
                "home"
            );

        }
    );

}


if (searchSchoolButton) {

    searchSchoolButton.addEventListener(
        "click",
        () => {

            searchLocation(
                schoolSearchInput?.value,
                "school"
            );

        }
    );

}


if (homeSearchInput) {

    homeSearchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                searchLocation(
                    homeSearchInput.value,
                    "home"
                );

            }

        }
    );

}


if (schoolSearchInput) {

    schoolSearchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                searchLocation(
                    schoolSearchInput.value,
                    "school"
                );

            }

        }
    );

}


if (saveManualHome) {

    saveManualHome.addEventListener(
        "click",
        () => {

            saveManualLocation(
                "home"
            );

        }
    );

}


if (saveManualSchool) {

    saveManualSchool.addEventListener(
        "click",
        () => {

            saveManualLocation(
                "school"
            );

        }
    );

}


if (saveSettingsButton) {

    saveSettingsButton.addEventListener(
        "click",
        saveSettings
    );

}


if (resetSettingsButton) {

    resetSettingsButton.addEventListener(
        "click",
        resetSettings
    );

}


if (saveScheduleButton) {

    saveScheduleButton.addEventListener(
        "click",
        calculateSchedule
    );

}


if (scheduleEntryTime) {

    scheduleEntryTime.addEventListener(
        "change",
        () => {

            if (
                scheduleDepartureTime &&
                !scheduleDepartureTime.value
            ) {

                calculateSchedule();

            }

        }
    );

}


/* =========================================
   STORAGE HELPERS
========================================= */

function saveStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.error(
            "Gagal menyimpan storage:",
            error
        );

    }

}


function loadStorage(
    key,
    fallback
) {

    try {

        const saved =
            localStorage.getItem(
                key
            );

        if (!saved) {
            return fallback;
        }

        return JSON.parse(
            saved
        );

    } catch (error) {

        console.error(
            "Gagal membaca storage:",
            error
        );

        return fallback;

    }

}


/* =========================================
   FORMAT DURATION
========================================= */

function formatDuration(
    minutes
) {

    if (
        minutes === null ||
        minutes === undefined ||
        Number.isNaN(
            Number(minutes)
        )
    ) {

        return "--";

    }

    const total =
        Math.max(
            1,
            Math.round(
                Number(minutes)
            )
        );

    if (total < 60) {

        return `${total} menit`;

    }

    const hours =
        Math.floor(
            total / 60
        );

    const mins =
        total % 60;

    if (!mins) {

        return `${hours} jam`;

    }

    return `${hours} jam ${mins} menit`;

}


/* =========================================
   INITIALIZE APP
========================================= */

function initializeApp() {

    loadAppData();

    loadSettings();

    applyTheme(
        settings.theme
    );

    populateSettingsUI();

    initializeTheme();

    initializeMap();

    restoreMapLocations();

    selectTransport(
        "motor"
    );

    updateSpeedLabels();

    updateLocationUI();

    updateLocationTargetStatus();

    updateDashboard();

    updateScheduleUI();

    updateDepartureReminderUI();

    if (
        reminderData?.enabled
    ) {

        startDepartureReminderTimer();

    }

    renderHistory();

    updateActiveMapUI();

    showPage(
        "dashboardPage"
    );

    console.log(
        "JARAK KESEKOLAH berhasil dimuat."
    );

    setTimeout(
        () => {

            if (
                tutorialOverlay &&
                !tutorialIsOpen
            ) {

                openTutorial(
                    false
                );

            }

        },
        1500
    );

}


/* =========================================
   SYSTEM THEME CHANGE
========================================= */

if (window.matchMedia) {

    const mediaQuery =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

    const handleThemeChange =
        () => {

            if (
                settings.theme ===
                "system"
            ) {

                applyTheme(
                    "system"
                );

            }

        };

    if (
        typeof mediaQuery.addEventListener ===
        "function"
    ) {

        mediaQuery.addEventListener(
            "change",
            handleThemeChange
        );

    } else if (
        typeof mediaQuery.addListener ===
        "function"
    ) {

        mediaQuery.addListener(
            handleThemeChange
        );

    }

}


/* =========================================
   START
========================================= */

initializeApp();


/* =========================================
   FIX TUTORIAL + SCROLL
========================================= */

document.documentElement.style.overflowY =
    "auto";

document.body.style.overflowY =
    "auto";

document.body.style.overflowX =
    "hidden";


(function fixTutorialUI() {

    const oldStyle =
        document.getElementById(
            "tutorial-fix-style"
        );

    if (oldStyle) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "tutorial-fix-style";

    style.textContent = `
        .tutorial-overlay {
            position: fixed !important;
            inset: 0 !important;
            z-index: 99999 !important;
            display: none !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
            background: rgba(0,0,0,.55) !important;
            overflow-y: auto !important;
            box-sizing: border-box !important;
        }

        .tutorial-overlay.show {
            display: flex !important;
        }

        .tutorial-modal {
            width: 100% !important;
            max-width: 430px !important;
            max-height: calc(100vh - 40px) !important;
            overflow-y: auto !important;
            background: #ffffff !important;
            border-radius: 24px !important;
            padding: 24px !important;
            box-sizing: border-box !important;
            box-shadow: 0 20px 60px rgba(0,0,0,.25) !important;
            position: relative !important;
        }

        .tutorial-icon {
            width: 64px !important;
            height: 64px !important;
            margin: 0 auto 16px !important;
            border-radius: 18px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: #eef4ff !important;
        }

        .tutorial-icon svg {
            width: 32px !important;
            height: 32px !important;
        }

        .tutorial-step-label {
            text-align: center !important;
            font-size: 12px !important;
            font-weight: 700 !important;
            letter-spacing: .08em !important;
            opacity: .6 !important;
            margin-bottom: 10px !important;
        }

        .tutorial-title {
            text-align: center !important;
            font-size: 22px !important;
            font-weight: 800 !important;
            margin: 0 0 10px !important;
        }

        .tutorial-description {
            font-size: 15px !important;
            line-height: 1.65 !important;
            text-align: center !important;
            opacity: .78 !important;
            margin-bottom: 20px !important;
        }

        .tutorial-dots {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 7px !important;
            margin: 10px 0 20px !important;
        }

        .tutorial-dot {
            width: 7px !important;
            height: 7px !important;
            border-radius: 50% !important;
            background: #cbd5e1 !important;
        }

        .tutorial-dot.active {
            width: 22px !important;
            border-radius: 10px !important;
            background: #2563eb !important;
        }

        .tutorial-navigation {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 10px !important;
        }

        .tutorial-navigation button {
            min-height: 46px !important;
            border: 0 !important;
            border-radius: 14px !important;
            padding: 0 18px !important;
            font-weight: 700 !important;
        }

        #tutorialBackButton {
            background: #eef2f7 !important;
        }

        #tutorialNextButton {
            background: #2563eb !important;
            color: #ffffff !important;
        }

        #tutorialCloseButton {
            position: absolute !important;
            top: 14px !important;
            right: 14px !important;
            width: 38px !important;
            height: 38px !important;
            border: 0 !important;
            border-radius: 50% !important;
            background: #f1f5f9 !important;
        }
    `;

    document.head.appendChild(
        style
    );

})();


/* =========================================
   FIX TUTORIAL SCROLL LOCK
========================================= */

function unlockPageScroll() {

    document.documentElement.style.overflowY =
        "auto";

    document.body.style.overflow =
        "";

    document.body.style.overflowY =
        "auto";

    document.body.style.overflowX =
        "hidden";

}


/* =========================================
   PERBAIKI CLOSE TUTORIAL
========================================= */

const originalCloseTutorial =
    closeTutorial;

closeTutorial = function(
    markAsSeen = true
) {

    originalCloseTutorial(
        markAsSeen
    );

    unlockPageScroll();

};


/* =========================================
   PERBAIKI OPEN TUTORIAL
========================================= */

const originalOpenTutorial =
    openTutorial;

openTutorial = function(
    fromFirstStep = true
) {

    originalOpenTutorial(
        fromFirstStep
    );

    if (tutorialOverlay) {

        tutorialOverlay.style.overflowY =
            "auto";

    }

};


/* =========================================
   PAKSA SCROLL AKTIF SAAT APP DIMULAI
========================================= */

setTimeout(
    () => {

        if (
            !tutorialIsOpen
        ) {

            unlockPageScroll();

        }

    },
    1200
);


/* =========================================
   AUTO OPEN TUTORIAL SETIAP APP DIBUKA
========================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                if (
                    tutorialOverlay &&
                    !tutorialIsOpen
                ) {

                    openTutorial(
                        false
                    );

                }

            },
            1500
        );

    }
);


/* =========================================
   PWA SERVICE WORKER
========================================= */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./sw.js"
                )
                .then(
                    () => {

                        console.log(
                            "PWA Service Worker aktif"
                        );

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "Service Worker gagal:",
                            error
                        );

                    }
                );

        }
    );

}

}

/* =========================================
   AUTO UPDATE WAKTU BERANGKAT
   Saat jam masuk / waktu cadangan berubah
========================================= */

function autoUpdateDepartureTime() {

    const schoolTimeInput =
        document.getElementById(
            "schoolStartTime"
        );

    const bufferSelect =
        document.getElementById(
            "bufferSelect"
        );

    const recommendedDeparture =
        document.getElementById(
            "recommendedDeparture"
        );

    if (
        !schoolTimeInput ||
        !recommendedDeparture
    ) {
        return;
    }

    if (
        !schoolTimeInput.value ||
        !jarakKmGlobal ||
        !kecepatanAktif
    ) {
        return;
    }

    const schoolTime =
        schoolTimeInput.value;

    const buffer =
        Number(
            bufferSelect?.value ||
            settings.defaultBuffer ||
            10
        );

    const routeMinutes =
        Math.ceil(
            (
                Number(jarakKmGlobal) /
                Number(kecepatanAktif)
            ) * 60
        );

    const totalMinutes =
        routeMinutes + buffer;

    const departure =
        subtractMinutes(
            schoolTime,
            totalMinutes
        );

    recommendedDeparture.textContent =
        departure;

    /* Simpan hasil terbaru */
    scheduleData = {
        ...(scheduleData || {}),
        schoolTime: schoolTime,
        buffer: buffer,
        routeMinutes: routeMinutes,
        departure: departure
    };

    saveStorage(
        SCHEDULE_KEY,
        scheduleData
    );

    updateDepartureReminderUI();

}


/* =========================================
   JAM MASUK BERUBAH
========================================= */

const autoSchoolTimeInput =
    document.getElementById(
        "schoolStartTime"
    );

if (autoSchoolTimeInput) {

    autoSchoolTimeInput.addEventListener(
        "change",
        autoUpdateDepartureTime
    );

    autoSchoolTimeInput.addEventListener(
        "input",
        autoUpdateDepartureTime
    );

}


/* =========================================
   WAKTU CADANGAN BERUBAH
========================================= */

const autoBufferSelect =
    document.getElementById(
        "bufferSelect"
    );

if (autoBufferSelect) {

    autoBufferSelect.addEventListener(
        "change",
        autoUpdateDepartureTime
    );

}
