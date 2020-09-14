document.addEventListener("DOMContentLoaded", function () {

    // Activate sidebar nav
    let elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    function loadNav() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status !== 200) return;

                // Load link menu
                document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
                    elm.innerHTML = xhttp.responseText;
                });

                // Event listener for the links menu
                document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
                    elm.addEventListener("click", function (event) {

                        // Close sidebar nav
                        const sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        // Load content page on the link
                        page = event.target.getAttribute("href").substr(1);
                        loadPage(page);

                        // Load content position
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    })
                })
            }
        };
        xhttp.open("GET", "pages/navigator.html", true);
        xhttp.send();
    }

    // Load page on click
    let page = window.location.hash.substr(1);
    if (page === "") page = "home";
    loadPage(page);

    function loadPage(page) {
        isLoading()
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                const content = document.querySelector("#body-content");
                if (page === "home") {
                    getUpcomingMatch()
                    getTeamList()
                } else if (page === "klasemen") {
                    getStanding()
                } else if (page === "pertandingan") {
                    getMatchList()
                } else if (page === "favorited") {
                    getSavedTeams()
                }
                if (this.status === 200) {
                    content.innerHTML = xhttp.responseText;
                } else if (this.status === 404) {
                    content.innerHTML = "<p>Ooppss.. halaman tidak ditemukan</p>";
                } else {
                    content.innerHTML = "<p>Ooppss.. halaman tidak dapat diakses</p>";
                }
            }
        };
        xhttp.open("GET", "pages/" + page + ".html", true);
        xhttp.send();
    }
});