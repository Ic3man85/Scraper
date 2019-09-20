$("#main-scraper-btn").on("click", function() {

    $.ajax({
        method: "GET",
        url: "/scrape-main",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});
$("#outdoor-scraper-btn").on("click", function() {

    $.ajax({
        method: "GET",
        url: "/scrape-outdoor",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});
$("#entertainment-scraper-btn").on("click", function() {

    $.ajax({
        method: "GET",
        url: "/scrape-entertainment",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});

$('#save').on("click",function() {

    let newId = $(this).attr("data-id");
    $.ajax({
         method: "POST",
         url: "/articles/saved/" + newId
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    });
});

$('#delete-unsaved').on("click",function(){

    let newId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/clear"
    }).done(function(data) {
        console.log("CLEARED");
        window.location = "/"
    });
});