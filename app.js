/* =========================================
   JARAK KESEKOLAH
   MAIN JAVASCRIPT
   COMPLETE VERSION
   SISTEM PILIH LOKASI LANGSUNG DI PETA
   + TUTORIAL PENGGUNAAN
   + INDIKATOR JENIS PETA
   + MARKER RUMAH/SEKOLAH LEBIH BESAR
========================================= */


/* =========================================
   ELEMENT
========================================= */

const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");
const navigationButtons = document.querySelectorAll("[data-target]");

const settingsButton = document.getElementById("settingsButton");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

const confirmModal = document.getElementById("confirmModal");
const confirmModalTitle = document.getElementById("confirmModalTitle");
const confirmModalMessage = document.getElementById("confirmModalMessage");
const confirmCancelButton = document.getElementById("confirmCancelButton");
const confirmActionButton = document.getElementById("confirmActionButton");


/* =========================================
   TUTORIAL ELEMENT
========================================= */

const tutorialOverlay =
    document.getElementById("tutorialOverlay");

const tutorialCloseButton =
    document.getElementById("tutorialCloseButton");

const tutorialIcon =
    document.getElementById("tutorialIcon");

const tutorialStepLabel =
    document.getElementById("tutorialStepLabel");

const tutorialDots =
    document.getElementById("tutorialDots");

const tutorialTitle =
    document.getElementById("tutorialTitle");

const tutorialDescription =
    document.getElementById("tutorialDescription");

const tutorialSkipButton =
    document.getElementById("tutorialSkipButton");

const tutorialBackButton =
    document.getElementById("tutorialBackButton");

const tutorialNextButton =
    document.getElementById("tutorialNextButton");

const openTutorialButton =
    document.getElementById("openTutorialButton");


/* =========================================
   STORAGE KEYS
========================================= */

const STORAGE_KEY = "jarak_ke_sekolah_data";
const SETTINGS_KEY = "jarak_ke_sekolah_settings";
const HISTORY_KEY = "jarak_ke_sekolah_history";
const SCHEDULE_KEY = "jarak_ke_sekolah_schedule";
const TUTORIAL_KEY = "jarak_ke_sekolah_tutorial_seen_v3";


/* =========================================
   DEFAULT DATA
========================================= */

const DEFAULT_SETTINGS = {
    walkingSpeed: 4.5,
    motorSpeed: 30,
    carSpeed: 45,
    defaultBuffer: 10,
    defaultMap: "street",
    theme: "system"
};

let settings = loadSettings();

let appData = {
    home: null,
    school: null
};

let scheduleData = loadStorage(
    SCHEDULE_KEY,
    null
);


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

let jarakKmGlobal = 0;

let profilRouting = "driving";
let kecepatanAktif = settings.motorSpeed;

let transportAktif = "motor";

let currentMapType = settings.defaultMap;


/* =========================================
   MODE PILIH LOKASI DI PETA
========================================= */

let modePilihLokasi = null;


/*
   null     = tidak sedang memilih
   home     = klik berikutnya menjadi rumah
   school   = klik berikutnya menjadi sekolah
*/


/* =========================================
   MAP LAYERS
========================================= */

let mapLayers = {};


/* =========================================
   NAMA PETA
========================================= */

const MAP_TYPE_NAMES = {
    street: "Peta Jalan",
    satellite: "Peta Satelit",
    terrain: "Peta Terrain",
    dark: "Peta Dark"
};


/* =========================================
   GENERAL HELPERS
========================================= */

function loadStorage(key, fallback) {

    try {

        const saved =
            localStorage.getItem(key);

        if (!saved) {
            return fallback;
        }

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Gagal membaca storage:",
            error
        );

        return fallback;
    }
}


function saveStorage(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "Gagal menyimpan storage:",
            error
        );

        return false;
    }
}


function loadSettings() {

    const saved =
        loadStorage(
            SETTINGS_KEY,
            DEFAULT_SETTINGS
        );

    return {
        ...DEFAULT_SETTINGS,
        ...saved
    };
}


/* =========================================
   TOAST
========================================= */

let toastTimer = null;

function showToast(message) {

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


/* =========================================
   LOADING
========================================= */

function showLoading(
    message = "Memproses..."
) {

    if (!loadingOverlay) {
        return;
    }

    if (loadingText) {
        loadingText.textContent =
            message;
    }

    loadingOverlay.classList.add(
        "show"
    );
}


function hideLoading() {

    if (!loadingOverlay) {
        return;
    }

    loadingOverlay.classList.remove(
        "show"
    );
}


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageId) {

    if (!pageId) {
        return;
    }

    pages.forEach((page) => {

        page.classList.remove(
            "active"
        );

    });

    const targetPage =
        document.getElementById(
            pageId
        );

    if (!targetPage) {
        return;
    }

    targetPage.classList.add(
        "active"
    );

    navItems.forEach((item) => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageId
        );

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "mapPage") {

        setTimeout(() => {

            initializeMap();

            if (map) {
                map.invalidateSize();
            }

        }, 150);

    }

}


/* =========================================
   BOTTOM NAVIGATION
========================================= */

navItems.forEach((item) => {

    item.addEventListener(
        "click",
        () => {

            const pageId =
                item.dataset.page;

            showPage(pageId);

        }
    );

});


/* =========================================
   INTERNAL NAVIGATION
========================================= */

navigationButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const target =
                button.dataset.target;

            if (target) {
                showPage(target);
            }

        }
    );

});


/* =========================================
   SETTINGS BUTTON
========================================= */

if (settingsButton) {

    settingsButton.addEventListener(
        "click",
        () => {

            showPage(
                "settingsPage"
            );

        }
    );

}


/* =========================================
   MAP ACTIVE INDICATOR
========================================= */

function updateActiveMapUI() {

    const mapName =
        MAP_TYPE_NAMES[currentMapType] ||
        "Peta Jalan";

    /*
       Mendukung beberapa kemungkinan ID
       agar indikator tetap bekerja tanpa
       mengganggu HTML yang sudah ada.
    */

    const possibleElements = [

        document.getElementById(
            "activeMapName"
        ),

        document.getElementById(
            "activeMapType"
        ),

        document.getElementById(
            "activeMapLabel"
        ),

        document.getElementById(
            "activeMapText"
        ),

        document.querySelector(
            ".active-map-name"
        ),

        document.querySelector(
            ".active-map-type"
        ),

        document.querySelector(
            ".active-map-label"
        )

    ];

    const updated =
        new Set();

    possibleElements.forEach((element) => {

        if (
            element &&
            !updated.has(element)
        ) {

            element.textContent =
                mapName;

            updated.add(element);

        }

    });

}


/* =========================================
   MAP INITIALIZATION
========================================= */

function initializeMap() {

    if (mapInitialized) {
        return;
    }

    const mapElement =
        document.getElementById("map");

    if (!mapElement) {
        return;
    }

    map = L.map(
        "map",
        {
            zoomControl: true,
            attributionControl: true
        }
    );

    map.setView(
        [-6.5891, 110.6677],
        13
    );


    /* =====================================
       STREET
    ===================================== */

    mapLayers.street =
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        );


    /* =====================================
       SATELLITE
    ===================================== */

    mapLayers.satellite =
        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                maxZoom: 19,
                attribution:
                    "Tiles &copy; Esri"
            }
        );


    /* =====================================
       TERRAIN
    ===================================== */

    mapLayers.terrain =
        L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 17,
                attribution:
                    "Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy; OpenTopoMap"
            }
        );


    /* =====================================
       DARK
    ===================================== */

    mapLayers.dark =
        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            {
                maxZoom: 20,
                attribution:
                    "&copy; OpenStreetMap &copy; CARTO"
            }
        );


    const selectedLayer =
        mapLayers[currentMapType] ||
        mapLayers.street;

    selectedLayer.addTo(map);

    mapInitialized = true;


    /* =====================================
       KLIK PETA
    ===================================== */

    map.on(
        "click",
        handleMapClick
    );


    setTimeout(() => {

        map.invalidateSize();

    }, 200);

    updateMapSelect();

    updateActiveMapUI();

    restoreMapLocations();

    console.log(
        "Leaflet map berhasil dibuat."
    );

}


/* =========================================
   HANDLE KLIK PETA
========================================= */

function handleMapClick(event) {

    if (!modePilihLokasi) {
        return;
    }

    const latitude =
        event.latlng.lat;

    const longitude =
        event.latlng.lng;


    /* =====================================
       PILIH RUMAH
    ===================================== */

    if (modePilihLokasi === "home") {

        setHomeLocation(
            latitude,
            longitude,
            "Lokasi rumah dari peta"
        );

        modePilihLokasi = null;

        map.setView(
            [latitude, longitude],
            16,
            {
                animate: true
            }
        );

        showToast(
            "Rumah berhasil dipilih. Sekarang pilih lokasi sekolah di peta."
        );

        setTimeout(() => {

            startMapLocationSelection(
                "school"
            );

        }, 700);

        return;
    }


    /* =====================================
       PILIH SEKOLAH
    ===================================== */

    if (modePilihLokasi === "school") {

        setSchoolLocation(
            latitude,
            longitude,
            "Lokasi sekolah dari peta"
        );

        modePilihLokasi = null;

        map.setView(
            [latitude, longitude],
            15,
            {
                animate: true
            }
        );

        showToast(
            "Sekolah berhasil dipilih. Menghitung perjalanan..."
        );

        if (
            latLngRumah &&
            latLngSekolah
        ) {

            setTimeout(() => {

                calculateRoute();

            }, 400);

        }

    }

}


/* =========================================
   OPEN MAP PAGE
========================================= */

function openMapPage() {

    showPage(
        "mapPage"
    );

    setTimeout(() => {

        initializeMap();

        if (map) {
            map.invalidateSize();
        }

    }, 100);

}


/* =========================================
   MULAI PILIH LOKASI DI PETA
========================================= */

function startMapLocationSelection(
    target
) {

    if (
        target !== "home" &&
        target !== "school"
    ) {
        return;
    }

    showPage(
        "mapPage"
    );

    setTimeout(() => {

        initializeMap();

        if (!map) {

            showToast(
                "Peta belum siap."
            );

            return;
        }

        modePilihLokasi =
            target;

        if (target === "home") {

            showToast(
                "Silakan ketuk peta untuk menentukan lokasi RUMAH."
            );

        } else {

            showToast(
                "Silakan ketuk peta untuk menentukan lokasi SEKOLAH."
            );

        }

    }, 180);

}


/* =========================================
   MAP TYPE
========================================= */

const mapTypeSelect =
    document.getElementById(
        "mapTypeSelect"
    );

if (mapTypeSelect) {

    mapTypeSelect.addEventListener(
        "change",
        () => {

            changeMapType(
                mapTypeSelect.value
            );

        }
    );

}


function changeMapType(type) {

    if (!map) {
        initializeMap();
    }

    if (
        !map ||
        !mapLayers[type]
    ) {
        return;
    }

    Object.values(
        mapLayers
    ).forEach((layer) => {

        if (map.hasLayer(layer)) {

            map.removeLayer(
                layer
            );

        }

    });

    mapLayers[type].addTo(map);

    currentMapType =
        type;

    settings.defaultMap =
        type;

    saveStorage(
        SETTINGS_KEY,
        settings
    );

    updateActiveMapUI();

    showToast(
        `${MAP_TYPE_NAMES[type] || "Jenis peta"} aktif.`
    );

}


function updateMapSelect() {

    if (mapTypeSelect) {

        mapTypeSelect.value =
            currentMapType;

    }

    updateActiveMapUI();

}


/* =========================================
   CUSTOM MAP MARKER
   UKURAN DIPERBESAR
========================================= */

function createHomeIcon() {

    return L.divIcon({

        className:
            "custom-marker",

        html: `
            <div
                class="marker-pin marker-home"
                style="
                    width:60px;
                    height:60px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    transform:scale(1.25);
                    transform-origin:center bottom;
                "
            >
                <svg
                    viewBox="0 0 24 24"
                    width="34"
                    height="34"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M3 10.5 12 3l9 7.5"></path>
                    <path d="M5 9.5V21h14V9.5"></path>
                    <path d="M9 21v-6h6v6"></path>
                </svg>
            </div>
        `,

        iconSize: [
            60,
            68
        ],

        iconAnchor: [
            30,
            68
        ],

        popupAnchor: [
            0,
            -62
        ]

    });

}


function createSchoolIcon() {

    return L.divIcon({

        className:
            "custom-marker",

        html: `
            <div
                class="marker-pin marker-school"
                style="
                    width:60px;
                    height:60px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    transform:scale(1.25);
                    transform-origin:center bottom;
                "
            >
                <svg
                    viewBox="0 0 24 24"
                    width="34"
                    height="34"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M3 21h18"></path>
                    <path d="M5 21V8l7-5 7 5v13"></path>
                    <path d="M9 21v-4h6v4"></path>
                    <path d="M9 10h.01"></path>
                    <path d="M15 10h.01"></path>
                </svg>
            </div>
        `,

        iconSize: [
            60,
            68
        ],

        iconAnchor: [
            30,
            68
        ],

        popupAnchor: [
            0,
            -62
        ]

    });

}


/* =========================================
   SET HOME MARKER
========================================= */

function setHomeLocation(
    latitude,
    longitude,
    label = "Lokasi rumah"
) {

    latLngRumah =
        L.latLng(
            latitude,
            longitude
        );

    appData.home = {
        latitude,
        longitude,
        label
    };

    saveStorage(
        STORAGE_KEY,
        appData
    );

    if (!map) {
        initializeMap();
    }

    if (!map) {
        return;
    }

    if (markerRumah) {

        map.removeLayer(
            markerRumah
        );

    }

    markerRumah =
        L.marker(
            latLngRumah,
            {
                icon:
                    createHomeIcon(),
                draggable: false
            }
        )
        .addTo(map)
        .bindPopup(
            `<strong>Rumah</strong><br>${escapeHtml(label)}`
        );

    updateLocationUI();

}


/* =========================================
   SET SCHOOL MARKER
========================================= */

function setSchoolLocation(
    latitude,
    longitude,
    label = "Lokasi sekolah"
) {

    latLngSekolah =
        L.latLng(
            latitude,
            longitude
        );

    appData.school = {
        latitude,
        longitude,
        label
    };

    saveStorage(
        STORAGE_KEY,
        appData
    );

    if (!map) {
        initializeMap();
    }

    if (!map) {
        return;
    }

    if (markerSekolah) {

        map.removeLayer(
            markerSekolah
        );

    }

    markerSekolah =
        L.marker(
            latLngSekolah,
            {
                icon:
                    createSchoolIcon(),
                draggable: false
            }
        )
        .addTo(map)
        .bindPopup(
            `<strong>Sekolah</strong><br>${escapeHtml(label)}`
        );

    updateLocationUI();

}


/* =========================================
   RESTORE LOCATIONS
========================================= */

function restoreMapLocations() {

    const saved =
        loadStorage(
            STORAGE_KEY,
            {
                home: null,
                school: null
            }
        );

    appData =
        saved || {
            home: null,
            school: null
        };

    if (appData.home) {

        latLngRumah =
            L.latLng(
                appData.home.latitude,
                appData.home.longitude
            );

        markerRumah =
            L.marker(
                latLngRumah,
                {
                    icon:
                        createHomeIcon(),
                    draggable: false
                }
            )
            .addTo(map)
            .bindPopup(
                `<strong>Rumah</strong><br>${escapeHtml(appData.home.label || "Lokasi rumah")}`
            );

    }

    if (appData.school) {

        latLngSekolah =
            L.latLng(
                appData.school.latitude,
                appData.school.longitude
            );

        markerSekolah =
            L.marker(
                latLngSekolah,
                {
                    icon:
                        createSchoolIcon(),
                    draggable: false
                }
            )
            .addTo(map)
            .bindPopup(
                `<strong>Sekolah</strong><br>${escapeHtml(appData.school.label || "Lokasi sekolah")}`
            );

    }

    updateLocationUI();

}


/* =========================================
   LOCATION UI
========================================= */

function updateLocationUI() {

    const homeValue =
        document.getElementById(
            "homeLocationValue"
        );

    const schoolValue =
        document.getElementById(
            "schoolLocationValue"
        );

    const homeStatus =
        document.getElementById(
            "homeStatus"
        );

    const schoolStatus =
        document.getElementById(
            "schoolStatus"
        );

    if (homeValue) {

        homeValue.textContent =
            appData.home
                ? appData.home.label ||
                  "Lokasi rumah tersimpan"
                : "Belum ditentukan";

    }

    if (schoolValue) {

        schoolValue.textContent =
            appData.school
                ? appData.school.label ||
                  "Lokasi sekolah tersimpan"
                : "Belum ditentukan";

    }

    if (homeStatus) {

        homeStatus.textContent =
            appData.home
                ? "Tersimpan"
                : "Belum tersedia";

    }

    if (schoolStatus) {

        schoolStatus.textContent =
            appData.school
                ? "Tersimpan"
                : "Belum tersedia";

    }

}


/* =========================================
   LOCATION BUTTONS
========================================= */

const homeLocationButton =
    document.getElementById(
        "homeLocationButton"
    );

const schoolLocationButton =
    document.getElementById(
        "schoolLocationButton"
    );


if (homeLocationButton) {

    homeLocationButton.addEventListener(
        "click",
        () => {

            startMapLocationSelection(
                "home"
            );

        }
    );

}


if (schoolLocationButton) {

    schoolLocationButton.addEventListener(
        "click",
        () => {

            startMapLocationSelection(
                "school"
            );

        }
    );

}


/* =========================================
   LOCATION PAGE
========================================= */

function openLocationPage(
    target
) {

    const targetSelect =
        document.getElementById(
            "locationTarget"
        );

    if (targetSelect) {

        targetSelect.value =
            target;

    }

    updateLocationTargetStatus();

    showPage(
        "locationPage"
    );

}


/* =========================================
   LOCATION TARGET
========================================= */

const locationTarget =
    document.getElementById(
        "locationTarget"
    );

if (locationTarget) {

    locationTarget.addEventListener(
        "change",
        updateLocationTargetStatus
    );

}


function updateLocationTargetStatus() {

    const target =
        locationTarget
            ? locationTarget.value
            : "home";

    const status =
        document.getElementById(
            "locationTargetStatus"
        );

    if (!status) {
        return;
    }

    if (target === "home") {

        status.textContent =
            "Mode lokasi rumah aktif. Kamu juga bisa langsung memilih titik rumah di peta.";

    } else {

        status.textContent =
            "Mode lokasi sekolah aktif. Kamu juga bisa langsung memilih titik sekolah di peta.";

    }

}


/* =========================================
   GPS BUTTON
========================================= */

const gpsButton =
    document.getElementById(
        "gpsButton"
    );

if (gpsButton) {

    gpsButton.addEventListener(
        "click",
        getCurrentLocation
    );

}


function getCurrentLocation() {

    if (!navigator.geolocation) {

        showToast(
            "GPS tidak tersedia di perangkat ini."
        );

        return;
    }

    showLoading(
        "Mencari lokasi perangkat..."
    );

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const target =
                locationTarget
                    ? locationTarget.value
                    : "home";

            if (target === "home") {

                setHomeLocation(
                    latitude,
                    longitude,
                    "Lokasi rumah dari GPS"
                );

            } else {

                setSchoolLocation(
                    latitude,
                    longitude,
                    "Lokasi sekolah dari GPS"
                );

            }

            initializeMap();

            if (map) {

                map.setView(
                    [
                        latitude,
                        longitude
                    ],
                    16,
                    {
                        animate: true
                    }
                );

            }

            hideLoading();

            showToast(
                "Lokasi berhasil ditemukan."
            );

        },

        (error) => {

            hideLoading();

            console.error(
                "GPS Error:",
                error
            );

            let message =
                "Lokasi tidak dapat ditemukan.";

            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                message =
                    "Izin lokasi ditolak. Izinkan akses lokasi untuk menggunakan GPS.";

            } else if (
                error.code ===
                error.TIMEOUT
            ) {

                message =
                    "GPS terlalu lama merespons. Coba lagi.";

            }

            showToast(
                message
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
   SELECT ON MAP BUTTON
========================================= */

const selectOnMapButton =
    document.getElementById(
        "selectOnMapButton"
    );

if (selectOnMapButton) {

    selectOnMapButton.addEventListener(
        "click",
        () => {

            const target =
                locationTarget
                    ? locationTarget.value
                    : "home";

            startMapLocationSelection(
                target
            );

        }
    );

}


/* =========================================
   MANUAL COORDINATES
========================================= */

const saveManualLocationButton =
    document.getElementById(
        "saveManualLocationButton"
    );

if (saveManualLocationButton) {

    saveManualLocationButton.addEventListener(
        "click",
        saveManualLocation
    );

}


function saveManualLocation() {

    const latitudeInput =
        document.getElementById(
            "manualLatitude"
        );

    const longitudeInput =
        document.getElementById(
            "manualLongitude"
        );

    const latitude =
        parseFloat(
            latitudeInput?.value
        );

    const longitude =
        parseFloat(
            longitudeInput?.value
        );

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {

        showToast(
            "Masukkan latitude dan longitude yang valid."
        );

        return;
    }

    if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {

        showToast(
            "Koordinat berada di luar batas."
        );

        return;
    }

    const target =
        locationTarget
            ? locationTarget.value
            : "home";

    if (target === "home") {

        setHomeLocation(
            latitude,
            longitude,
            "Lokasi rumah manual"
        );

    } else {

        setSchoolLocation(
            latitude,
            longitude,
            "Lokasi sekolah manual"
        );

    }

    initializeMap();

    if (map) {

        map.setView(
            [
                latitude,
                longitude
            ],
            16,
            {
                animate: true
            }
        );

    }

    showToast(
        "Lokasi berhasil disimpan."
    );

}


/* =========================================
   LOCATION SEARCH
========================================= */

const searchLocationButton =
    document.getElementById(
        "searchLocationButton"
    );

if (searchLocationButton) {

    searchLocationButton.addEventListener(
        "click",
        searchLocation
    );

}


async function searchLocation() {

    const input =
        document.getElementById(
            "locationSearchInput"
        );

    const results =
        document.getElementById(
            "locationSearchResults"
        );

    const query =
        input?.value.trim();

    if (!query) {

        showToast(
            "Masukkan nama lokasi terlebih dahulu."
        );

        return;
    }

    showLoading(
        "Mencari lokasi..."
    );

    try {

        const url =
            "https://nominatim.openstreetmap.org/search" +
            "?format=jsonv2" +
            "&limit=5" +
            "&accept-language=id" +
            "&q=" +
            encodeURIComponent(query);

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Pencarian lokasi gagal."
            );

        }

        const data =
            await response.json();

        if (!results) {

            hideLoading();

            return;
        }

        results.innerHTML = "";

        if (!data.length) {

            results.innerHTML = `
                <div class="history-empty">
                    Lokasi tidak ditemukan.
                </div>
            `;

            hideLoading();

            return;
        }

        data.forEach((place) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "search-result-item";

            button.textContent =
                place.display_name;

            button.addEventListener(
                "click",
                () => {

                    const latitude =
                        parseFloat(
                            place.lat
                        );

                    const longitude =
                        parseFloat(
                            place.lon
                        );

                    const target =
                        locationTarget
                            ? locationTarget.value
                            : "home";

                    if (
                        target ===
                        "home"
                    ) {

                        setHomeLocation(
                            latitude,
                            longitude,
                            place.display_name
                        );

                    } else {

                        setSchoolLocation(
                            latitude,
                            longitude,
                            place.display_name
                        );

                    }

                    initializeMap();

                    if (map) {

                        map.setView(
                            [
                                latitude,
                                longitude
                            ],
                            16,
                            {
                                animate: true
                            }
                        );

                    }

                    showToast(
                        "Lokasi berhasil dipilih."
                    );

                }
            );

            results.appendChild(
                button
            );

        });

        hideLoading();

    } catch (error) {

        console.error(
            error
        );

        hideLoading();

        showToast(
            "Pencarian lokasi gagal. Periksa koneksi internet."
        );

    }

}


/* =========================================
   TRANSPORT BUTTONS
========================================= */

const walkBtn =
    document.getElementById(
        "walkBtn"
    );

const motorBtn =
    document.getElementById(
        "motorBtn"
    );

const carBtn =
    document.getElementById(
        "carBtn"
    );


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


function selectTransport(
    type
) {

    transportAktif =
        type;

    if (type === "walking") {

        profilRouting =
            "foot";

        kecepatanAktif =
            Number(
                settings.walkingSpeed
            );

    } else if (
        type === "motor"
    ) {

        profilRouting =
            "driving";

        kecepatanAktif =
            Number(
                settings.motorSpeed
            );

    } else {

        profilRouting =
            "driving";

        kecepatanAktif =
            Number(
                settings.carSpeed
            );

    }

    walkBtn?.classList.toggle(
        "active",
        type === "walking"
    );

    motorBtn?.classList.toggle(
        "active",
        type === "motor"
    );

    carBtn?.classList.toggle(
        "active",
        type === "car"
    );

    updateSpeedLabels();

    if (
        latLngRumah &&
        latLngSekolah
    ) {

        calculateRoute();

    }

}


/* =========================================
   SPEED LABELS
========================================= */

function updateSpeedLabels() {

    const walkingSpeedLabel =
        document.getElementById(
            "walkingSpeedLabel"
        );

    const motorSpeedLabel =
        document.getElementById(
            "motorSpeedLabel"
        );

    const carSpeedLabel =
        document.getElementById(
            "carSpeedLabel"
        );

    const activeSpeed =
        document.getElementById(
            "activeSpeed"
        );

    if (walkingSpeedLabel) {

        walkingSpeedLabel.textContent =
            `${Number(settings.walkingSpeed).toFixed(1)} km/jam`;

    }

    if (motorSpeedLabel) {

        motorSpeedLabel.textContent =
            `${Number(settings.motorSpeed).toFixed(1)} km/jam`;

    }

    if (carSpeedLabel) {

        carSpeedLabel.textContent =
            `${Number(settings.carSpeed).toFixed(1)} km/jam`;

    }

    if (activeSpeed) {

        activeSpeed.textContent =
            `${Number(kecepatanAktif).toFixed(1)} km/jam`;

    }

}


/* =========================================
   CALCULATE ROUTE
========================================= */

const calculateRouteButton =
    document.getElementById(
        "calculateRouteButton"
    );

if (calculateRouteButton) {

    calculateRouteButton.addEventListener(
        "click",
        calculateRoute
    );

}


async function calculateRoute() {

    if (!latLngRumah) {

        showToast(
            "Lokasi rumah belum ditentukan."
        );

        return;
    }

    if (!latLngSekolah) {

        showToast(
            "Lokasi sekolah belum ditentukan."
        );

        return;
    }

    if (!map) {
        initializeMap();
    }

    if (!map) {

        showToast(
            "Peta belum siap."
        );

        return;
    }

    showLoading(
        "Menghitung perjalanan..."
    );

    try {

        const coordinates =
            `${latLngRumah.lng},${latLngRumah.lat};` +
            `${latLngSekolah.lng},${latLngSekolah.lat}`;

        const url =
            `https://router.project-osrm.org/route/v1/${profilRouting}/${coordinates}` +
            "?overview=full&geometries=geojson&steps=false";

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Routing server tidak dapat diakses."
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
                "Rute tidak ditemukan."
            );

        }

        const route =
            data.routes[0];

        const distanceKm =
            route.distance / 1000;

        jarakKmGlobal =
            distanceKm;

        const timeHours =
            distanceKm /
            Number(
                kecepatanAktif
            );

        const timeMinutes =
            Math.max(
                1,
                Math.round(
                    timeHours * 60
                )
            );

        drawRoute(
            route.geometry
        );

        updateRouteResult(
            distanceKm,
            timeMinutes
        );

        saveHistory(
            distanceKm,
            timeMinutes
        );

        if (route.geometry) {

            const bounds =
                L.geoJSON(
                    route.geometry
                ).getBounds();

            map.fitBounds(
                bounds,
                {
                    padding: [
                        35,
                        35
                    ]
                }
            );

        }

        hideLoading();

        showToast(
            "Rute berhasil ditemukan."
        );

        updateScheduleRecommendation();

    } catch (error) {

        console.error(
            "Route Error:",
            error
        );

        hideLoading();

        showToast(
            "Rute tidak dapat dihitung. Pastikan koneksi internet tersedia."
        );

    }

}


/* =========================================
   DRAW ROUTE
========================================= */

function drawRoute(
    geometry
) {

    if (
        !map ||
        !geometry
    ) {
        return;
    }

    if (garisRute) {

        map.removeLayer(
            garisRute
        );

    }

    garisRute =
        L.geoJSON(
            geometry,
            {
                style: {
                    weight: 6,
                    opacity: 0.85
                }
            }
        ).addTo(map);

}


/* =========================================
   ROUTE RESULT UI
========================================= */

function updateRouteResult(
    distanceKm,
    timeMinutes
) {

    const routeDistance =
        document.getElementById(
            "routeDistance"
        );

    const routeTime =
        document.getElementById(
            "routeTime"
        );

    const dashboardDistance =
        document.getElementById(
            "dashboardDistance"
        );

    const dashboardTime =
        document.getElementById(
            "dashboardTime"
        );

    if (routeDistance) {

        routeDistance.textContent =
            formatDistance(
                distanceKm
            );

    }

    if (routeTime) {

        routeTime.textContent =
            formatDuration(
                timeMinutes
            );

    }

    if (dashboardDistance) {

        dashboardDistance.textContent =
            formatDistance(
                distanceKm
            );

    }

    if (dashboardTime) {

        dashboardTime.textContent =
            formatDuration(
                timeMinutes
            );

    }

}


/* =========================================
   FORMAT DISTANCE
========================================= */

function formatDistance(
    km
) {

    if (!Number.isFinite(km)) {
        return "--";
    }

    if (km < 1) {

        return `${Math.round(km * 1000)} m`;

    }

    return `${km.toFixed(2)} km`;
}


/* =========================================
   FORMAT DURATION
========================================= */

function formatDuration(
    minutes
) {

    if (!Number.isFinite(minutes)) {
        return "--";
    }

    const rounded =
        Math.max(
            1,
            Math.round(minutes)
        );

    if (rounded < 60) {

        return `${rounded} menit`;

    }

    const hours =
        Math.floor(
            rounded / 60
        );

    const mins =
        rounded % 60;

    if (mins === 0) {

        return `${hours} jam`;

    }

    return `${hours} jam ${mins} menit`;
}


/* =========================================
   MAP LOCATE BUTTON
========================================= */

const locateMapButton =
    document.getElementById(
        "locateMapButton"
    );

if (locateMapButton) {

    locateMapButton.addEventListener(
        "click",
        () => {

            if (!map) {
                initializeMap();
            }

            if (!map) {
                return;
            }

            if (latLngRumah) {

                map.setView(
                    latLngRumah,
                    16,
                    {
                        animate: true
                    }
                );

                showToast(
                    "Peta dipusatkan ke lokasi rumah."
                );

                return;
            }

            map.setView(
                [
                    -6.5891,
                    110.6677
                ],
                15,
                {
                    animate: true
                }
            );

            showToast(
                "Peta dipusatkan."
            );

        }
    );

}


/* =========================================
   GOOGLE MAPS
========================================= */

const googleMapsButton =
    document.getElementById(
        "googleMapsButton"
    );

if (googleMapsButton) {

    googleMapsButton.addEventListener(
        "click",
        openGoogleMaps
    );

}


function openGoogleMaps() {

    if (
        !latLngRumah ||
        !latLngSekolah
    ) {

        showToast(
            "Tentukan lokasi rumah dan sekolah terlebih dahulu."
        );

        return;
    }

    const url =
        "https://www.google.com/maps/dir/?api=1" +
        `&origin=${latLngRumah.lat},${latLngRumah.lng}` +
        `&destination=${latLngSekolah.lat},${latLngSekolah.lng}` +
        "&travelmode=driving";

    window.open(
        url,
        "_blank"
    );

}


/* =========================================
   RESET JOURNEY
========================================= */

const resetJourneyButton =
    document.getElementById(
        "resetJourneyButton"
    );

if (resetJourneyButton) {

    resetJourneyButton.addEventListener(
        "click",
        () => {

            openConfirmModal(
                "Reset perjalanan?",
                "Lokasi rumah, sekolah, dan rute saat ini akan dihapus.",
                resetJourney
            );

        }
    );

}


function resetJourney() {

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
   SCHEDULE
========================================= */

const calculateScheduleButton =
    document.getElementById(
        "calculateScheduleButton"
    );

if (calculateScheduleButton) {

    calculateScheduleButton.addEventListener(
        "click",
        calculateSchedule
    );

}


function calculateSchedule() {

    const dateInput =
        document.getElementById(
            "scheduleDate"
        );

    const schoolTimeInput =
        document.getElementById(
            "schoolStartTime"
        );

    const bufferSelect =
        document.getElementById(
            "bufferSelect"
        );

    if (
        !schoolTimeInput ||
        !schoolTimeInput.value
    ) {

        showToast(
            "Masukkan jam masuk sekolah."
        );

        return;
    }

    if (!jarakKmGlobal) {

        showToast(
            "Hitung rute terlebih dahulu."
        );

        return;
    }

    const schoolTime =
        schoolTimeInput.value;

    const buffer =
        Number(
            bufferSelect?.value ||
            settings.defaultBuffer
        );

    const routeMinutes =
        Math.ceil(
            (
                jarakKmGlobal /
                Number(
                    kecepatanAktif
                )
            ) * 60
        );

    const totalMinutes =
        routeMinutes +
        buffer;

    const departure =
        subtractMinutes(
            schoolTime,
            totalMinutes
        );

    const recommendedDeparture =
        document.getElementById(
            "recommendedDeparture"
        );

    if (recommendedDeparture) {

        recommendedDeparture.textContent =
            departure;

    }

    scheduleData = {

        date:
            dateInput?.value ||
            "",

        schoolTime,

        buffer,

        routeMinutes,

        departure,

        createdAt:
            Date.now()

    };

    saveStorage(
        SCHEDULE_KEY,
        scheduleData
    );

    updateScheduleUI();

    showToast(
        "Waktu keberangkatan berhasil dihitung."
    );

}


function subtractMinutes(
    time,
    minutes
) {

    const parts =
        time.split(":");

    let hour =
        Number(
            parts[0]
        );

    let minute =
        Number(
            parts[1]
        );

    minute -= minutes;

    while (minute < 0) {

        minute += 60;
        hour--;

    }

    while (hour < 0) {

        hour += 24;

    }

    return (
        String(hour).padStart(
            2,
            "0"
        ) +
        ":" +
        String(minute).padStart(
            2,
            "0"
        )
    );

}


function updateScheduleUI() {

    if (!scheduleData) {
        return;
    }

    const recommendedDeparture =
        document.getElementById(
            "recommendedDeparture"
        );

    if (recommendedDeparture) {

        recommendedDeparture.textContent =
            scheduleData.departure ||
            "--:--";

    }

}


function updateScheduleRecommendation() {

    if (
        scheduleData &&
        jarakKmGlobal
    ) {

        calculateSchedule();

    }

}


/* =========================================
   SAVE SCHEDULE
========================================= */

const saveScheduleButton =
    document.getElementById(
        "saveScheduleButton"
    );

if (saveScheduleButton) {

    saveScheduleButton.addEventListener(
        "click",
        () => {

            if (!scheduleData) {

                showToast(
                    "Hitung jadwal terlebih dahulu."
                );

                return;

            }

            saveStorage(
                SCHEDULE_KEY,
                scheduleData
            );

            showToast(
                "Jadwal berhasil disimpan."
            );

        }
    );

}


/* =========================================
   SETTINGS ELEMENTS
========================================= */

const walkingSpeedInput =
    document.getElementById(
        "walkingSpeed"
    );

const motorSpeedInput =
    document.getElementById(
        "motorSpeed"
    );

const carSpeedInput =
    document.getElementById(
        "carSpeed"
    );

const defaultBufferInput =
    document.getElementById(
        "defaultBuffer"
    );

const defaultMapInput =
    document.getElementById(
        "defaultMap"
    );

const themeSelect =
    document.getElementById(
        "themeSelect"
    );

const saveSettingsButton =
    document.getElementById(
        "saveSettingsButton"
    );

const resetSettingsButton =
    document.getElementById(
        "resetSettingsButton"
    );


/* =========================================
   LOAD SETTINGS UI
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

    if (defaultBufferInput) {

        defaultBufferInput.value =
            settings.defaultBuffer;

    }

    if (defaultMapInput) {

        defaultMapInput.value =
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

if (saveSettingsButton) {

    saveSettingsButton.addEventListener(
        "click",
        saveSettings
    );

}


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

    const buffer =
        Number(
            defaultBufferInput?.value
        );

    if (
        !Number.isFinite(walking) ||
        walking <= 0
    ) {

        showToast(
            "Kecepatan jalan kaki tidak valid."
        );

        return;
    }

    if (
        !Number.isFinite(motor) ||
        motor <= 0
    ) {

        showToast(
            "Kecepatan motor tidak valid."
        );

        return;
    }

    if (
        !Number.isFinite(car) ||
        car <= 0
    ) {

        showToast(
            "Kecepatan mobil tidak valid."
        );

        return;
    }

    if (
        !Number.isFinite(buffer) ||
        buffer < 0
    ) {

        showToast(
            "Waktu cadangan tidak valid."
        );

        return;
    }

    settings = {

        walkingSpeed:
            walking,

        motorSpeed:
            motor,

        carSpeed:
            car,

        defaultBuffer:
            buffer,

        defaultMap:
            defaultMapInput?.value ||
            "street",

        theme:
            themeSelect?.value ||
            "system"

    };

    saveStorage(
        SETTINGS_KEY,
        settings
    );

    currentMapType =
        settings.defaultMap;

    applyTheme(
        settings.theme
    );


    if (
        transportAktif ===
        "walking"
    ) {

        kecepatanAktif =
            settings.walkingSpeed;

    } else if (
        transportAktif ===
        "motor"
    ) {

        kecepatanAktif =
            settings.motorSpeed;

    } else {

        kecepatanAktif =
            settings.carSpeed;

    }

    updateSpeedLabels();

    if (
        map &&
        mapLayers[currentMapType]
    ) {

        changeMapType(
            currentMapType
        );

    } else {

        updateActiveMapUI();

    }

    showToast(
        "Pengaturan berhasil disimpan."
    );

}


/* =========================================
   RESET SETTINGS
========================================= */

if (resetSettingsButton) {

    resetSettingsButton.addEventListener(
        "click",
        () => {

            openConfirmModal(
                "Reset pengaturan?",
                "Semua pengaturan kecepatan dan tampilan akan kembali ke nilai awal.",
                resetSettings
            );

        }
    );

}


function resetSettings() {

    settings = {
        ...DEFAULT_SETTINGS
    };

    saveStorage(
        SETTINGS_KEY,
        settings
    );

    currentMapType =
        settings.defaultMap;

    populateSettingsUI();

    applyTheme(
        settings.theme
    );

    selectTransport(
        "motor"
    );

    updateSpeedLabels();

    if (map) {

        changeMapType(
            currentMapType
        );

    } else {

        updateActiveMapUI();

    }

    showToast(
        "Pengaturan berhasil direset."
    );

}


/* =========================================
   THEME
========================================= */

function applyTheme(
    theme
) {

    if (theme === "system") {

        document.body.setAttribute(
            "data-theme",
            "system"
        );

        if (
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        ) {

            document.documentElement
                .setAttribute(
                    "data-theme",
                    "dark"
                );

        } else {

            document.documentElement
                .setAttribute(
                    "data-theme",
                    "light"
                );

        }

        return;
    }

    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );

}


/* =========================================
   CONFIRM MODAL
========================================= */

let confirmCallback =
    null;


function openConfirmModal(
    title,
    message,
    callback
) {

    if (!confirmModal) {
        return;
    }

    if (confirmModalTitle) {

        confirmModalTitle.textContent =
            title;

    }

    if (confirmModalMessage) {

        confirmModalMessage.textContent =
            message;

    }

    confirmCallback =
        callback;

    confirmModal.classList.add(
        "show"
    );

}


function closeConfirmModal() {

    if (!confirmModal) {
        return;
    }

    confirmModal.classList.remove(
        "show"
    );

    confirmCallback =
        null;

}


if (confirmCancelButton) {

    confirmCancelButton.addEventListener(
        "click",
        closeConfirmModal
    );

}


if (confirmActionButton) {

    confirmActionButton.addEventListener(
        "click",
        () => {

            const callback =
                confirmCallback;

            closeConfirmModal();

            if (callback) {
                callback();
            }

        }
    );

}


if (confirmModal) {

    confirmModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                confirmModal
            ) {

                closeConfirmModal();

            }

        }
    );

}


/* =========================================
   TUTORIAL DATA
========================================= */

const tutorialSteps = [

    {
        title:
            "Pilih lokasi rumah",

        description:
            "Klik <strong>Pilih lokasi</strong> pada bagian Rumah. Kamu dapat menggunakan GPS atau mencari lokasi secara manual. Jika memilih secara manual, cari lokasi rumah lalu ketuk titiknya pada peta.",

        icon: `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M3 10.5 12 3l9 7.5"></path>
                <path d="M5 9.5V21h14V9.5"></path>
                <path d="M9 21v-6h6v6"></path>
            </svg>
        `
    },

    {
        title:
            "Pilih lokasi sekolah",

        description:
            "Setelah lokasi rumah dipilih, kembali ke Dashboard lalu pilih lokasi <strong>Sekolah</strong>. Caranya sama: gunakan GPS, pencarian manual, atau langsung ketuk titik sekolah pada peta.",

        icon: `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M3 21h18"></path>
                <path d="M5 21V8l7-5 7 5v13"></path>
                <path d="M9 21v-4h6v4"></path>
                <path d="M9 10h.01"></path>
                <path d="M15 10h.01"></path>
            </svg>
        `
    },

    {
        title:
            "Hasilkan perjalanan",

        description:
            "Setelah lokasi rumah dan sekolah tersedia, scroll ke bawah. Pilih <strong>Motor</strong>, <strong>Mobil</strong>, atau <strong>Jalan kaki</strong>, lalu tekan <strong>Hasilkan Perjalanan</strong>. Jarak dan perkiraan waktu akan muncul.",

        icon: `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <circle cx="6" cy="17" r="3"></circle>
                <circle cx="18" cy="17" r="3"></circle>
                <path d="M6 17h3l3-8h3l3 8"></path>
                <path d="M9 17h6"></path>
            </svg>
        `
    },

    {
        title:
            "Atur kecepatan",

        description:
            "Untuk mengubah kecepatan Motor, Mobil, atau Jalan kaki, buka <strong>Pengaturan</strong>. Atur kecepatannya sesuai kebutuhan, lalu tekan <strong>Simpan Pengaturan</strong>. Pengaturan akan tersimpan otomatis.",

        icon: `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1h2.6V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1V14h-.1a1.7 1.7 0 0 0-1.6 1z"></path>
            </svg>
        `
    },

    {
        title:
            "Gunakan Google Maps",

        description:
            "Untuk melihat perjalanan langsung melalui Google Maps, buka halaman Peta lalu tekan tombol <strong>Buka di Google Maps</strong>. Untuk memulai dari awal, tekan <strong>Reset perjalanan</strong>.",

        icon: `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z"></path>
                <circle cx="12" cy="9" r="2.5"></circle>
            </svg>
        `
    }

];


/* =========================================
   TUTORIAL STATE
========================================= */

let tutorialCurrentStep =
    0;

let tutorialIsOpen =
    false;


/* =========================================
   RENDER TUTORIAL
========================================= */

function renderTutorialStep() {

    if (!tutorialSteps.length) {
        return;
    }

    const step =
        tutorialSteps[
            tutorialCurrentStep
        ];

    const total =
        tutorialSteps.length;

    const current =
        tutorialCurrentStep + 1;


    if (tutorialStepLabel) {

        tutorialStepLabel.textContent =
            `LANGKAH ${current} DARI ${total}`;

    }


    if (tutorialTitle) {

        tutorialTitle.textContent =
            step.title;

    }


    if (tutorialDescription) {

        tutorialDescription.innerHTML =
            step.description;

    }


    if (tutorialIcon) {

        tutorialIcon.innerHTML =
            step.icon;

    }


    if (tutorialDots) {

        const dots =
            tutorialDots.querySelectorAll(
                ".tutorial-dot"
            );

        dots.forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "active",
                    index ===
                    tutorialCurrentStep
                );

            }
        );

    }


    if (tutorialBackButton) {

        tutorialBackButton.disabled =
            tutorialCurrentStep === 0;

        tutorialBackButton.style.visibility =
            tutorialCurrentStep === 0
                ? "hidden"
                : "visible";

    }


    if (tutorialNextButton) {

        tutorialNextButton.textContent =
            tutorialCurrentStep ===
            total - 1
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

    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE TUTORIAL
========================================= */

function closeTutorial(
    markAsSeen = true
) {

    if (!tutorialOverlay) {
        return;
    }

    tutorialIsOpen =
        false;

    tutorialOverlay.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

    if (markAsSeen) {

        localStorage.setItem(
            TUTORIAL_KEY,
            "true"
        );

    }

}


/* =========================================
   NEXT TUTORIAL STEP
========================================= */

function nextTutorialStep() {

    if (
        tutorialCurrentStep <
        tutorialSteps.length - 1
    ) {

        tutorialCurrentStep++;

        renderTutorialStep();

        return;
    }

    closeTutorial(
        true
    );

}


/* =========================================
   PREVIOUS TUTORIAL STEP
========================================= */

function previousTutorialStep() {

    if (
        tutorialCurrentStep <= 0
    ) {
        return;
    }

    tutorialCurrentStep--;

    renderTutorialStep();

}


/* =========================================
   TUTORIAL BUTTON EVENTS
========================================= */

if (tutorialNextButton) {

    tutorialNextButton.addEventListener(
        "click",
        nextTutorialStep
    );

}


if (tutorialBackButton) {

    tutorialBackButton.addEventListener(
        "click",
        previousTutorialStep
    );

}


if (tutorialCloseButton) {

    tutorialCloseButton.addEventListener(
        "click",
        () => {

            closeTutorial(
                true
            );

        }
    );

}


if (tutorialSkipButton) {

    tutorialSkipButton.addEventListener(
        "click",
        () => {

            closeTutorial(
                true
            );

        }
    );

}


/* =========================================
   CLICK OVERLAY TUTORIAL
========================================= */

if (tutorialOverlay) {

    tutorialOverlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                tutorialOverlay
            ) {

                closeTutorial(
                    true
                );

            }

        }
    );

}


/* =========================================
   TUTORIAL OPEN FROM SETTINGS
========================================= */

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


/* =========================================
   KEYBOARD ESCAPE
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            tutorialIsOpen
        ) {

            closeTutorial(
                true
            );

        }

    }
);


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   INITIALIZE APP
========================================= */

function initializeApp() {

    populateSettingsUI();

    applyTheme(
        settings.theme
    );

    selectTransport(
        "motor"
    );

    updateSpeedLabels();

    updateLocationUI();

    updateLocationTargetStatus();

    updateScheduleUI();

    renderHistory();

    updateActiveMapUI();

    showPage(
        "dashboardPage"
    );

    console.log(
        "JARAK KESEKOLAH berhasil dimuat."
    );


    /* =====================================
       TUTORIAL PERTAMA KALI
    ===================================== */

    const tutorialSeen =
        localStorage.getItem(
            TUTORIAL_KEY
        );

    if (!tutorialSeen) {

        setTimeout(() => {

            openTutorial(
                true
            );

        }, 700);

    }

}


/* =========================================
   SYSTEM THEME CHANGE
========================================= */

if (window.matchMedia) {

    const mediaQuery =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

    mediaQuery.addEventListener(
        "change",
        () => {

            if (
                settings.theme ===
                "system"
            ) {

                applyTheme(
                    "system"
                );

            }

        }
    );

}


/* =========================================
   START
========================================= */

initializeApp();


/* =========================================
   FIX TUTORIAL + SCROLL
========================================= */

/* Pastikan halaman selalu bisa di-scroll */
document.documentElement.style.overflowY = "auto";
document.body.style.overflowY = "auto";
document.body.style.overflowX = "hidden";


/* CSS tutorial dibuat langsung dari JavaScript
   supaya tetap tampil meskipun style.css belum
   memiliki class tutorial. */

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
            background: rgba(0, 0, 0, 0.55) !important;
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

        .tutorial-modal button {
            cursor: pointer !important;
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
            transition: .2s !important;
        }

        .tutorial-dot.active {
            width: 22px !important;
            border-radius: 10px !important;
            background: #2563eb !important;
        }

        .tutorial-actions,
        .tutorial-navigation {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }

        .tutorial-navigation {
            justify-content: space-between !important;
        }

        .tutorial-navigation button {
            min-height: 46px !important;
            border: 0 !important;
            border-radius: 14px !important;
            padding: 0 18px !important;
            font-weight: 700 !important;
        }

        .tutorial-skip {
            background: transparent !important;
            border: 0 !important;
            opacity: .65 !important;
            font-weight: 600 !important;
        }

        #tutorialBackButton {
            background: #eef2f7 !important;
        }

        #tutorialNextButton {
            background: #2563eb !important;
            color: white !important;
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
            font-size: 20px !important;
        }

        @media (max-width: 480px) {

            .tutorial-overlay {
                padding: 14px !important;
            }

            .tutorial-modal {
                max-height: calc(100vh - 28px) !important;
                border-radius: 22px !important;
                padding: 22px 18px !important;
            }

        }

        @media (prefers-color-scheme: dark) {

            html[data-theme="dark"] .tutorial-modal {
                background: #151922 !important;
                color: #ffffff !important;
            }

            html[data-theme="dark"] .tutorial-icon {
                background: #202b43 !important;
            }

            html[data-theme="dark"] #tutorialBackButton {
                background: #252b36 !important;
                color: #ffffff !important;
            }

            html[data-theme="dark"] #tutorialCloseButton {
                background: #252b36 !important;
                color: #ffffff !important;
            }

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

setTimeout(() => {

    if (
        !tutorialIsOpen
    ) {

        unlockPageScroll();

    }

}, 1200);


/* =========================================
   AUTO OPEN TUTORIAL SETIAP APP DIBUKA
========================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        if (
            tutorialOverlay &&
            !tutorialIsOpen
        ) {

            openTutorial(false);

        }

    }, 1500);

});

/* =========================================
   PWA SERVICE WORKER
========================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
                console.log("PWA Service Worker aktif");
            })
            .catch(error => {
                console.error(
                    "Service Worker gagal:",
                    error
                );
            });

    });

}
