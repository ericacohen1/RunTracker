$(function () {
    $("#new-workout").on("click", function (e) {
        e.preventDefault();
        var newActivityObj = {
            totalDistance: $("#totalDistance").val().trim(),
            totalRunTime: $("#totalRunTime").val().trim()
        };

        $.ajax({
            method: "POST",
            url: "/api/users/:id",
            data: newActivityObj
        }).done(function (data) {
            console.log(data);
        });

    });
});