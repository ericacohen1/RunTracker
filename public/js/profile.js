$(document).ready(function () {
    /* global moment */
    var url = window.location.search;
    var userId;
    if (url.indexOf("?UserId=") !== -1) {
        userId = url.split("=")[1];
        // console.log("userId", userId);
    }

    $(function () {
        $("#new-workout").on("click", function (e) {
            e.preventDefault();
            var newActivityObj = {
                date: $("#activityDate").val().trim(),
                distance: $("#totalDistance").val().trim(),
                totalActivityTime: $("#totalRunTime").val().trim(),
                UserId: userId,
                pace: 7
            };

            $.ajax({
                method: "POST",
                url: "/api/activity",
                data: newActivityObj
            }).done(function (data) {
                // console.log(data);
            });
            location.reload();
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
    // Variable to hold our user data
    var userData;
    // The code below handles the case where we want to get activities for a specific user
    // Looks for a query param in the url for UserId

    if (url.indexOf("?UserId=") !== -1) {
        // userId = url.split("=")[1];
        // console.log("userId", userId);
        getUserData(userId);
        getActivities(userId);
    }

    // This function grabs posts from the database and updates the view
    function getUserData(user) {
        userId = user || "";
        $.get("/api/users/" + userId, function (data) {
            console.log("UserData", data);
            userData = data;
            $("#user-name").text(userData.name + "'s");
        });

    }

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
    function deleteRecord(id) {
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
        var momentDate = moment(activity.date).format("LL");
        $(".run-history-table").find(".run-history-tbody").append($("<tr>").append
            ($("<td>").append(momentDate),
            $("<td>").append(activity.distance),
            $("<td>").append(activity.totalActivityTime),
            $("<td>").append(activity.pace),
            $("<td>").append("<button class='edit btn btn-primary' data-activity-id='" + activity.id + "' aria-hidden='true'>Edit</button>"),
            $("<td>").append("<button class='btn btn-primary' data-action='delete' aria-hidden='true'>Delete</button>")
        )
        );
    }

    // This function figures out which post we want to delete and then calls deletePost
    function handleActivityDelete() {
        var currentPost = $(this)
            .parent()
            .parent()
            .data("activity");
        deletePost(currentPost.id);
    }

    // This function figures out which activity we want to edit and takes it to the appropriate url
    function handleActivityEdit() {
        var activityId = $(this).attr("data-activity-id");
        console.log("this.attr('data-activity-id)'",$(this).attr("data-activity-id"));
        // var currentActivity = $(this)
        //     .parent()
        //     .parent()
        //     .data("data-activity-id");
        //     console.log("currentActivity",currentActivity);
            // .attr("data-activity-id");
        window.location.href = "/activity?activity_id=" + activityId;
    }

    // This function displays a messgae when there are no posts
    function displayEmpty(id) {
        var query = window.location.search;
        var partial = "";
        if (id) {
            partial = " for User: " + userData.name;
        }
        runContainer.empty();
        var messageh2 = $("<h2>");
        messageh2.css({ "text-align": "center", "margin-top": "50px" });
        messageh2.html("No posts yet" + partial + ", navigate <a href='/cms" + query +
            "'>here</a> in order to get started.");
        runContainer.append(messageh2);
    }

});
