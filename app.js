/* =========================================
   JARAK KESEKOLAH
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   ELEMENT
========================================= */

const pages =
    document.querySelectorAll(".page");

const navItems =
    document.querySelectorAll(".nav-item");

const navigationButtons =
    document.querySelectorAll("[data-target]");

const settingsButton =
    document.getElementById("settingsButton");

const gpsButton =
    document.getElementById("gpsButton");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageId) {

    if (!pageId) {
        return;
    }


    pages.forEach((page) => {

        page.classList.remove("active");

    });


    const targetPage =
        document.getElementById(pageId);


    if (!targetPage) {
        return;
    }


    targetPage.classList.add("active");


    navItems.forEach((item) => {

        const itemPage =
            item.dataset.page;

        item.classList.toggle(
            "active",
            itemPage === pageId
        );

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   BOTTOM NAVIGATION EVENT
========================================= */

navItems.forEach((item) => {

    item.addEventListener(
        "click",
        () => {

            const pageId =
                item.dataset.page;


            if (pageId === "mapPage") {

                openMapPage();

                return;

            }


            showPage(pageId);

        }
    );

});


/* =========================================
   INTERNAL NAVIGATION BUTTONS
========================================= */

navigationButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const target =
                button.dataset.target;


            if (target === "mapPage") {

                openMapPage();

                return;

            }


            showPage(target);

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

            showPage("settingsPage");

        }
    );

}


/* =========================================
   GPS
   UNTUK SEKARANG HANYA TEST GPS.
   FITUR LENGKAP AKAN DITAMBAHKAN
   PADA TAHAP 4.
========================================= */

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


    showToast(
        "Meminta lokasi perangkat..."
    );


    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log(
                "Latitude:",
                latitude
            );


            console.log(
                "Longitude:",
                longitude
            );


            showToast(
                "Lokasi berhasil ditemukan."
            );

        },

        (error) => {

            console.error(
                "GPS Error:",
                error
            );


            showToast(
                "Lokasi tidak dapat ditemukan. Pastikan GPS aktif dan izin lokasi diberikan."
            );

        },

        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

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


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}

/* =========================================
   LEAFLET MAP
========================================= */

let map = null;

let mapInitialized = false;


/* =========================================
   INITIALIZE MAP
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


    /*
     * Koordinat awal.
     * Untuk sementara menggunakan area
     * Jepara sebagai posisi awal peta.
     */

    const defaultLatitude =
        -6.5891;

    const defaultLongitude =
        110.6677;


    map = L.map(
        "map",
        {
            zoomControl: true,

            attributionControl: true
        }
    );


    map.setView(
        [
            defaultLatitude,
            defaultLongitude
        ],
        13
    );


    /*
     * OpenStreetMap
     */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);


    mapInitialized = true;


    /*
     * Leaflet terkadang perlu diberi tahu
     * ukuran container setelah halaman
     * ditampilkan.
     */

    setTimeout(() => {

        map.invalidateSize();

    }, 200);


    console.log(
        "Leaflet map berhasil dibuat."
    );

}


/* =========================================
   INITIALIZE MAP WHEN MAP PAGE OPENS
========================================= */

function openMapPage() {

    showPage("mapPage");


    setTimeout(() => {

        initializeMap();


        if (map) {

            map.invalidateSize();

        }

    }, 100);

}


/* =========================================
   INITIALIZATION
========================================= */

function initializeApp() {

    showPage("dashboardPage");


    console.log(
        "JARAK KESEKOLAH berhasil dimuat."
    );

}


/* =========================================
   START APP
========================================= */

initializeApp();


/* =========================================
   CENTER MAP BUTTON
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
                showToast(
                    "Peta belum siap."
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
