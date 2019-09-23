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
            url: "news/saved/" + newId
        }).done(function (data) {
            console.log(data)
            window.loction = "/"
        });
});

$("#delete-unsaved-news").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/clear"
    }).done(function(data) {
        console.log("CLEAR")
        window.location = '/'
    })
})

$(".save-note").on("click", function() {
    var thisId = $(this).attr("data-id");
    if (!$("#note-body" + thisId).val()) {
        alert("please enter a note to save")
    }else {
      $.ajax({
            method: "POST",
            url: "/notes/saved/" + thisId,
            data: {
              text: $("#note-body" + thisId).val()
            }
          }).done(function(data) {
              console.log(data);
              $("#note-Body" + thisId).val("");
              $(".modalNote").modal("hide");
              window.location = "/saved"
          });
    }
});

$(".delete-note-btn").on("click", function() {
    var noteId = $(this).attr("data-note-id");
    var articleId = $(this).attr("data-article-id");
    $.ajax({
        method: "DELETE",
        url: "/notes/delete/" + noteId + "/" + articleId
    }).done(function(data) {
        console.log(data)
        $(".modalNote").modal("hide");
        window.location = "/saved"
    })
});



//dfjkskldfjsdjf

