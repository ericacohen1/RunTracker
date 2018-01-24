$(function() {
    // $(".form-signup").hide();
    // On click hide login screen to begin
    // Show sign-up screen

    // change to new user signup
    $("#linkToNewUser").on("click", function(event) {
        event.preventDefault();
        window.location.href = "/signup";

    });

    $("#already-member").on("click", function(event) {
        event.preventDefault();
        window.location.href = "/";

    });

    // On click hide sign-up screen to begin
    // Show login screen

    $("#user-login-btn").on("click", function(e) {
        e.preventDefault();
        var userObj = {
            email: $("#user-email").val().trim(),
            password: $("#user-password").val().trim()
        };

        $.ajax({
            method: "POST",
            url: "/api/users/new",
            data: userObj
        }).done(function(data){
            console.log(data);
            window.location.href = "http://localhost:8080/profile?UserId="+data.id
        });


    });
    $("#user-signup-btn").on("click", function(e) {
        e.preventDefault();
        var userObj = {
            name: $("#user-name").val().trim(),
            email: $("#user-email").val().trim(),
            age: $("#user-age").val().trim(),
            sex: $("#user-sex").val().trim(),
            password: $("#user-password").val().trim()
        };

        $.ajax({
            method: "POST",
            url: "/api/users/new",
            data: userObj
        }).done(function(data){
            console.log(data);
            window.location.href = "http://localhost:8080/profile?UserId="+data.id
        });


    });
});