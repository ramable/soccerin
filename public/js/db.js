const dbPromised = idb.open("teamfc", 1, function (upgradeDb) {
    let teamsObjectStore = upgradeDb.createObjectStore("teamfc", {
        keyPath: "id"
    });
    teamsObjectStore.createIndex("name", "name", {
        unique: false
    });
});

function saveTeams(team) {
    dbPromised
        .then((db) => {
            let tx = db.transaction("teamfc", "readwrite");
            let store = tx.objectStore("teamfc");
            console.log(store);
            store.put(team);
            return tx.complete;
        })
        .then(function () {
            console.log("Team berhasil difavoritkan ..");
        });
}

function getAll(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("teamfc", "readonly");
                let store = tx.objectStore("teamfc");
                return store.getAll(id);
            })
            .then(function (teams) {
                resolve(teams);
            });
    });
}

function getById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("teamfc", "readonly");
                let store = tx.objectStore("teamfc");
                return store.get(id);
            })
            .then(function (teams) {
                resolve(teams);
            })
    })
}

function deleteSaved() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = parseInt(urlParams.get("id"));
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("teamfc", "readwrite");
                let store = tx.objectStore("teamfc");
                store.delete(idParam);
                return tx.complete;
            })
            .then(function () {
                console.log("Data berhasil dihapus ..");
            });
    });
}