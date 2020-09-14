// Times convert from UTC date
function dateConvert(d) {
    const dateFormat = new Date(d);
    const months = dateFormat.toLocaleString("default", {
        month: "long"
    });
    const dates = dateFormat.getDate();
    const years = dateFormat.getFullYear();
    return `${dates} ${months} ${years}`;
}

function timeConvert(t) {
    const timeFormat = new Date(t);

    let hours = timeFormat.getHours();
    hours = ("0" + hours).slice(-2);

    let minutes = timeFormat.getMinutes();
    minutes = ("0" + minutes).slice(-2);
    return `${hours}:${minutes} WIB`;
}

// Preloader
function isLoading() {
    const preLoader = document.getElementById("loader")
    let loadHTML = `
            <div class="container">
                        <div class="row loader-wrapper">
                            <div class="preloader-wrapper big active">
                                <div class="spinner-layer spinner-teal">
                                    <div class="circle-clipper left">
                                        <div class="circle"></div>
                                    </div>
                                    <div class="gap-patch">
                                        <div class="circle"></div>
                                    </div>
                                    <div class="circle-clipper right">
                                        <div class="circle"></div>
                                    </div>
                                </div>
                            </div>
                            <h6>Tunggu sebentar ya ... </h6>
                        </div>
                    </div>
    `;
    preLoader.innerHTML = loadHTML;
    preLoader.style.display = 'block';
    document.getElementById("body-content").style.display = 'none';
}

function isLoaded() {
    document.getElementById("loader").style.display = 'none';
    document.getElementById("body-content").style.display = 'block';
}

// Render Error
function showError() {
    document.getElementById("detail-content").innerHTML = `
                    <div class="col s12">
                        <div class="card">
                            <div class="card-content black-text">
                                <span class="card-title">Ooppss ...</span>
                                <p>Halaman tidak dapat diakses. Silakan periksa kembali koneksi jaringan kamu</p>
                            </div>
                        </div>
                    </div>
                `;
}