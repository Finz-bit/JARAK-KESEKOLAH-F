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
