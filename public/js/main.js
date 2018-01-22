$(function() {
    $(".form-signup").hide();
    // On click hide login screen to begin
    // Show sign-up screen
    
    // change to new user signup
    $("#linkToNewUser").on("click", function(event) {
        event.preventDefault();
        $(".form-login").hide();
        $(".form-signup").show();


    })
    $("#login-submit").on("click", function(event) {
        event.preventDefault();

    })

    // On click hide sign-up screen to begin
    // Show login screen
});