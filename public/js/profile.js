$(document).ready(function () {
    /* global moment */
    var url = window.location.search;
    var userId;
    if (url.indexOf("?UserId=") !== -1) {
        userId = url.split("=")[1];
        console.log("userId", userId);
    }
    $(function () {
        $("#new-workout").on("click", function (e) {
            e.preventDefault();
            var newActivityObj = {
                distance: $("#totalDistance").val().trim(),
                totalActivityTime: $("#totalRunTime").val().trim(),
                UserId: userId,
                averagePace: 7,
                averageSpeed: 8,
            };

            $.ajax({
                method: "POST",
                url: "/api/activity",
                data: newActivityObj
            }).done(function (data) {
                console.log(data);
            });

        });
    });
    // runContainer holds all of our posts
    var runContainer = $(".run-history-tbody");
    var postCategorySelect = $("#category");
    // Click events for the edit and delete buttons
    $(document).on("click", "button.delete", handleActivityDelete);
    $(document).on("click", "button.edit", handleActivityEdit);
    // Variable to hold our activities
    var activities;

    // The code below handles the case where we want to get activities for a specific user
    // Looks for a query param in the url for author_id
    
    if (url.indexOf("?UserId=") !== -1) {
        // userId = url.split("=")[1];
        // console.log("userId", userId);
        getActivities(userId);
    }
    // If there's no userId we just get all posts as usual
    // else {
    //     getActivities();
    // }

    // This function grabs posts from the database and updates the view
    function getActivities(user) {
        userId = user || "";
        // if (userId) {
        //     userId = "/?UserId=" + userId;
        // }
        $.get("/api/activity/" + userId, function (data) {
            console.log("Activities", data);
            activities = data;
            if (!activities || !activities.length) {
                displayEmpty(user);
            }
            else {
                initializeRows();
            }
        });
    }

    // This function does an API call to delete posts
    function deletePost(id) {
        $.ajax({
            method: "DELETE",
            url: "/api/activity/" + id
        })
            .then(function () {
                getActivities(postCategorySelect.val());
            });
    }

    // InitializeRows handles appending all of our constructed post HTML inside blogContainer
    function initializeRows() {
        runContainer.empty();
        var activitiesToAdd = [];
        for (var i = 0; i < activities.length; i++) {
            activitiesToAdd.push(createNewRow(activities[i]));
        }
        runContainer.append(activitiesToAdd);
    }

    // This function constructs a post's HTML
    function createNewRow(activity) {
        // var formattedDate = new Date(activity.createdAt);
        // formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
        console.log("activity.distance", activity.distance);
        $(".run-history-table").find(".run-history-tbody").append($("<tr>").append
            ($("<td>").append(activity.distance)));
        // var newactivityPanel = $("<div>");
        // newActivityPanel.addClass("panel panel-default");
        // var newActivityPanelHeading = $("<div>");
        // newActivityPanelHeading.addClass("panel-heading");
        // var deleteBtn = $("<button>");
        // deleteBtn.text("x");
        // deleteBtn.addClass("delete btn btn-danger");
        // var editBtn = $("<button>");
        // editBtn.text("EDIT");
        // editBtn.addClass("edit btn btn-info");
        // var newActivityTitle = $("<h2>");
        // var newActivityDate = $("<small>");
        // var newActivityUser = $("<h5>");
        // newActivityUser.text("Ran by: " + activity.User.name);
        // newActivityUser.css({
        //     float: "right",
        //     color: "blue",
        //     "margin-top":
        //         "-10px"
        // });
        // var newActivityPanelBody = $("<div>");
        // newActivityPanelBody.addClass("panel-body");
        // var newActivityBody = $("<p>");
        // newActivityTitle.text(activity.title + " ");
        // newActivityBody.text(activity.body);
        // newActivityDate.text(formattedDate);
        // newActivityTitle.append(newActivityDate);
        // newActivityPanelHeading.append(deleteBtn);
        // newActivityPanelHeading.append(editBtn);
        // newActivityPanelHeading.append(newActivityTitle);
        // newActivityPanelHeading.append(newActivityUser);
        // newActivityPanelBody.append(newActivityBody);
        // newActivityPanel.append(newActivityPanelHeading);
        // newActivityPanel.append(newActivityPanelBody);
        // newActivityPanel.data("activity", activity);
        // return newActivityPanel;
    }

    // This function figures out which post we want to delete and then calls deletePost
    function handleActivityDelete() {
        var currentPost = $(this)
            .parent()
            .parent()
            .data("post");
        deletePost(currentPost.id);
    }

    // This function figures out which post we want to edit and takes it to the appropriate url
    function handleActivityEdit() {
        var currentPost = $(this)
            .parent()
            .parent()
            .data("post");
        window.location.href = "/cms?post_id=" + currentPost.id;
    }

    // This function displays a messgae when there are no posts
    function displayEmpty(id) {
        var query = window.location.search;
        var partial = "";
        if (id) {
            partial = " for User #" + id;
        }
        runContainer.empty();
        var messageh2 = $("<h2>");
        messageh2.css({ "text-align": "center", "margin-top": "50px" });
        messageh2.html("No posts yet" + partial + ", navigate <a href='/cms" + query +
            "'>here</a> in order to get started.");
        runContainer.append(messageh2);
    }

});
