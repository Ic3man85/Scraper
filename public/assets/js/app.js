$("#main-scraper-btn").on("click", function() {

    $(".main-container").empty();
    $.ajax({
        method: "GET",
        url: "/scrape-main",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});
$("#outdoor-scraper-btn").on("click", function() {

    $(".main-container").empty();
    $.ajax({
        method: "GET",
        url: "/scrape-outdoor",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});
$("#entertainment-scraper-btn").on("click", function() {

    $(".main-container").empty();
    $.ajax({
        method: "GET",
        url: "/scrape-entertainment",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});

$('#save').on("click",function() {
     $.ajax({
         
     })
})