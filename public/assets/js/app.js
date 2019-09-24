$("#main-scraper-btn").on("click", function () {

    $.ajax({
        method: "GET",
        url: "/scrape-main",
    }).done(function (err, data) {
        if (err) {
            console.log(err);
        }
        console.log(data)
        window.location = "/"
    })
});

$('.save-news').on("click", function () {

    let newId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/news/saved/" + newId
    }).done(function (data) {
        console.log(data)
        window.loction = "/"
    });
});

$("#delete-unsaved-news").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/clear"
    }).done(function (data) {
        console.log("CLEAR")
        window.location = '/'
    })
})

$(".save-note").on("click", function () {
    let thisId = $(this).attr("data-id");
    if (!$("#note-Body" + thisId).val()) {
        alert("please enter a note to save")
    } else {
        $.ajax({
            method: "POST",
            url: "/notes/saved/" + thisId,
            data: {
                text: $("#note-Body" + thisId).val()
            }
        }).done(function (data) {
            console.log(data);
            $("#note-Body" + thisId).val("");
            $(".modalNote").modal("hide");
            window.location = "/saved"
        });
    }
});




