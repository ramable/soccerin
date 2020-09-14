document.addEventListener("DOMContentLoaded", function () {

    let urlParams = new URLSearchParams(window.location.search);
    let isFromSaved = urlParams.get("saved");

    if (isFromSaved) {
        getDetailSaved()
    } else {
        getDetailTeams()
    }
});