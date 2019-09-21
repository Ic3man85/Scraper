$("#main-scraper-btn").on("click", function () {

    $.ajax({
        method: "GET",
        url: "/scrape-main",
    }).done(function (err,data) {
        if(err) {
            console.log(err);
        }
        console.log(data)
        window.location = "/news"
    })
});

$("#outdoor-scraper-btn").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/scrape-outdoor",
    }).done(function (err,data) {
        if (err) {
            console.log(err);
        }
        console.log(data)
        window.location = "/outdoor"
    })
});

$("#entertainment-scraper-btn").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/scrape-entertainment",
    }).done(function (data) {
        console.log(data)
        window.location = "/entertainment"
    })
});

$('.save-article').on("click", function () {

    let newId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/saved/" + newId
    }).done(function (data) {
        console.log(data)
        window.location = "/saved"
    });
});

$('#delete-unsaved-news').on("click", function () {

    $.ajax({
        method: "GET",
        url: "news/clear"
    }).done(function (data) {
        console.log("CLEARED");
        window.location = "/news"
    });
});

$('#delete-unsaved-outdoor').on("click", function () {

    $.ajax({
        method: "GET",
        url: "outdoor/clear"
    }).done(function (data) {
        console.log("CLEARED");
        window.location = "/outdoor"
    });
});

$('#delete-unsaved-entertainment').on("click", function () {

    $.ajax({
        method: "GET",
        url: "entertainment/clear"
    }).done(function (data) {
        console.log("CLEARED");
        window.location = "/entertainment"
    });
});