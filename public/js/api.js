const API_KEY = "1c8290d6c1b545f69d134a4acf488853";
const BASE_URL = "https://api.football-data.org/v2/";
const ENDPOINT_EPL = `${BASE_URL}competitions/2021/`;

const fetchAPI = url => {
    let responseAPI = fetch(url, {
            headers: {
                "X-Auth-Token": API_KEY
            }
        })
        .then(status)
        .then(json)
    return responseAPI;
};

// Response status on fetch
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

// Parsing json to array
function json(response) {
    return response.json();
}

// Error handling to block catch
function error(err) {
    console.log("Error : " + err);
}

// Request upcoming match from API
function getUpcomingMatch() {
    if ("caches" in window) {
        caches.match(BASE_URL + "matches").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    showUpcomingCard(data);
                })
            }
        })
    }

    fetchAPI(BASE_URL + "matches")
        .then(data => {
            showUpcomingCard(data);
        })
        .catch(error);
}

function showUpcomingCard(data) {
    const upcoming = data.matches;
    let cards = "";
    upcoming.forEach((m) => {
        cards += `
                    <div class="col upcoming-card">
                        <div class="card">
                            <div class="card-content black-text">
                                <h6>${dateConvert(m.utcDate)} - <span class="teal-text"><strong>${timeConvert(m.utcDate)}</strong></span></h6>
                                <p class="grey-text">${m.competition.name} (Matchday ${m.matchday === null ? '-' : m.matchday})</p><br>
                                <p><strong>${m.homeTeam.name}</strong></p>
                                <span class="red-text">vs</span>
                                <p><strong>${m.awayTeam.name}</strong></p>
                            </div>
                        </div>
                    </div>
                `;
    });
    isLoaded()
    document.getElementById("upcoming-card").innerHTML = cards;
}

// Request team list from API
function getTeamList() {
    if ("caches" in window) {
        caches.match(ENDPOINT_EPL + "teams").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    showTeamList(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_EPL + "teams")
        .then(data => {
            showTeamList(data);
        })
        .catch(error);
}

function showTeamList(data) {

    const teamList = data.teams;
    let teams = "";
    teamList.forEach((m) => {
        teams += `
                <div class="col s12 m4">
                    <div class="card card-liga">
                        <div class="card-content black-text">
                            <span class="card-title truncate">${m.name}</span>
                            <img class="logo-liga" src="${m.crestUrl === null ? 'images/error-badge.png' : m.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="">
                        </div>
                        <div class="card-action">
                            <a class="waves-effect waves-light btn-small" href="./detail.html?id=${m.id}">lihat detail</a>       
                        </div>
                    </div>
                </div>
                `;
    });
    isLoaded()
    document.getElementById("team-list").innerHTML = teams;
}

// Request detail team from API
function getDetailTeams() {

    isLoading()
    return new Promise(function (resolve, reject) {

        // Get parameter query from id
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        if ("caches" in window) {
            caches.match(BASE_URL + "teams/" + idParam).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        showDetailTeam(data);
                        resolve(data);
                    })
                }
            })
        }

        fetchAPI(BASE_URL + "teams/" + idParam)
            .then(data => {
                showDetailTeam(data);
                resolve(data);
            })
            .catch(err => {
                error(err)
                showError()
            })
    });
}

function showDetailTeam(data) {

    let detailTitle = ""
    let detailSquad = ""
    const squadList = data.squad;

    detailTitle += `
        <div class="col s3 col-team">
            <img src="${data.crestUrl === null ? 'images/error-badge.png' : data.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="" height="190px">
        </div>
        <div class="col s6 col-team about-team">
            <h4>${data.name}</h4>
            <p>Berdiri sejak : ${data.founded}</p>
            <p>Stadion : ${data.venue}</p>
            <p>Official Website : <a href="${data.website}">${data.website}</a></p>
        </div>
        <div class="col btn-favorite s3 col-team" id="btnSaveDel">
            <button class="waves-effect waves-light btn" href="#" id="favorite" type="submit">favoritkan</button>
        </div>
    `;
    squadList.forEach((m) => {
        detailSquad += `
        <tr>
            <td>${m.position === null ? '-' : m.position}</td>
            <td>${m.name}</td>
            <td class="center">${m.shirtNumber === null ? '-' : m.shirtNumber}</td>
            <td>${m.nationality}</td>
            <td>${dateConvert(m.dateOfBirth)}</td>
        </tr> 
        `;
    });
    let detailContent = `
        <div class="card table-card black-text">
            <div class="row">${detailTitle}</div>
            <div class="row table-scroll">
                <table class="highlight">
                    <thead>
                        <tr>
                            <th>Posisi</th>
                            <th>Nama Pemain</th>
                            <th class="center">No. Pemain</th>
                            <th>Kewarganegaraan</th>
                            <th>Tanggal Lahir</th>
                        </tr>
                    </thead>
                    <tbody>${detailSquad}</tbody>
                </table>
            </div>
        </div>   
    `;
    isLoaded()
    document.getElementById("detail-content").innerHTML = detailContent;

    const btnFav = document.getElementById("favorite");
    btnFav.onclick = function () {
        M.toast({
            html: "Yeayy! tim ini jadi favorit kamu",
            classes: "green"
        })

        getDetailTeams()
            .then((team) => {
                console.log(team)
                saveTeams(team)
            })
    }
}

// Get favorited teams
function getSavedTeams() {
    isLoaded()
    getAll().then(function (teams) {
        console.log(teams);

        if (teams.length > 0) {

            let teamSaved = "";
            teams.forEach((data) => {
                teamSaved += `
                <div class="card table-card black-text">
                    <div class="row">
                        <div class="col s3 col-team">
                            <img src="${data.crestUrl === null ? 'images/error-badge.png' : data.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="" height="190px">
                        </div>
                        <div class="col s6 col-team about-team">
                            <h4>${data.name}</h4>
                            <p>Berdiri sejak : ${data.founded}</p>
                            <p>Stadion : ${data.venue}</p>
                            <p>Official Website : <a href="${data.website}">${data.website}</a></p>
                        </div>
                        <div class="col btn-favorite s3 col-team">
                            <a class="waves-effect waves-light btn" href="/detail.html?id=${data.id}&saved=true">lihat detail</a>
                        </div>
                    </div>    
                </div>   
            `;
            })
            document.getElementById("fav-team").innerHTML = teamSaved;

        } else {
            document.getElementById("empty-fav").innerHTML = `
                    <div class="col s12">
                        <div class="card">
                            <div class="card-content black-text">
                                <span class="card-title">Ooppss</span>
                                <p>Sepertinya kamu belum memilih tim favorit.</p>
                                <p>Silakan kembali ke halaman awal dan pilih tim Liga
                                Inggris favoritmu</p>
                            </div>
                            <div class="card-action">
                                <a href="">Back to home</a>
                            </div>
                        </div>
                    </div> 
            `;
        }
    })
}

function getDetailSaved() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = parseInt(urlParams.get("id"));
    getById(idParam).then(teams => {

        let detailTitle = ""
        let detailSquad = ""
        const squadList = teams.squad;

        detailTitle += `
            <div class="col s3 col-team">
                <img src="${teams.crestUrl === null ? 'images/error-badge.png' : teams.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="" height="190px">
            </div>
            <div class="col s6 col-team about-team">
                <h4>${teams.name}</h4>
                <p>Berdiri sejak : ${teams.founded}</p>
                <p>Stadion : ${teams.venue}</p>
                <p>Official Website : <a href="${teams.website}">${teams.website}</a></p>
            </div>
            <div class="col btn-favorite s3 col-team">
                <button class="waves-effect waves-light btn red darken-2" href="#" id="delete">delete</button>
            </div>
        `;
        squadList.forEach((m) => {
            detailSquad += `
            <tr>
                <td>${m.position}</td>
                <td>${m.name}</td>
                <td class="center">${m.shirtNumber}</td>
                <td>${m.nationality}</td>
                <td>${dateConvert(m.dateOfBirth)}</td>
            </tr> 
            `;
        });
        let detailContent = `
            <div class="card table-card black-text">
                <div class="row">${detailTitle}</div>
                <div class="row table-scroll">
                    <table class="highlight">
                        <thead>
                            <tr>
                                <th>Posisi</th>
                                <th>Nama Pemain</th>
                                <th class="center">No. Pemain</th>
                                <th>Kewarganegaraan</th>
                                <th>Tanggal Lahir</th>
                            </tr>
                        </thead>
                        <tbody>${detailSquad}</tbody>
                    </table>
                </div>
            </div>
        `;
        document.getElementById("detail-content").innerHTML = detailContent;

        const btnDelete = document.getElementById("delete");
        btnDelete.addEventListener('click', () => {
            M.toast({
                html: "Hmm.. tim ini bukan favorit kamu",
                classes: "red"
            })
            deleteSaved()
        })
    });
}

// Request standings from API
function getStanding() {
    if ("caches" in window) {
        caches.match(ENDPOINT_EPL + "standings?standingType=TOTAL").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    showStanding(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_EPL + "standings?standingType=TOTAL")
        .then(data => {
            showStanding(data);
        })
        .catch(error)
}

function showStanding(data) {

    const standing = data.standings[0].table;
    let tables = "";
    standing.forEach((m) => {
        tables += `
                <tr>
                    <td>${m.position}.</td>
                    <td><img height="30px" src="${m.team.crestUrl === null ? 'images/error-badge.png' : m.team.crestUrl.replace(/^http:\/\//i, 'https://')}" alt=""></td>
                    <td class="left">${m.team.name}</td>
                    <td>${m.playedGames}</td>
                    <td class="green-text">${m.won}</td>
                    <td class="orange-text">${m.draw}</td>
                    <td class="red-text">${m.lost}</td>
                    <td>${m.goalDifference}</td>
                    <td><b>${m.points}<b></td>
                </tr>
                `;
    });

    isLoaded()
    document.getElementById("klasemen").innerHTML = tables;

}

// Request matchlist from API
function getMatchList() {
    if ("caches" in window) {
        caches.match(ENDPOINT_EPL + "matches").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    showMatchList(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_EPL + "matches")
        .then(data => {
            showMatchList(data);
        })
        .catch(error)
}

function showMatchList(data) {

    const matchList = data.matches;
    let tableMatch = "";
    matchList.forEach((m) => {
        tableMatch += `
                    <tr>
                        <td>${m.matchday}<br>
                        <td>${dateConvert(m.utcDate)}</td>
                        <td>${timeConvert(m.utcDate)}</td>
                        <td>${m.homeTeam.name} <span class="red-text">vs</span> ${m.awayTeam.name}</td>
                        <td>${m.status}</td>
                        <td>${m.score.halfTime.homeTeam} - ${m.score.halfTime.awayTeam}</td>
                        <td>${m.score.fullTime.homeTeam} - ${m.score.fullTime.awayTeam}</td>
                    </tr>
                `;
    });

    isLoaded()
    document.getElementById("jadwal").innerHTML = tableMatch;
}
