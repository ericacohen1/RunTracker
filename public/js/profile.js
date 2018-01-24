$(document).ready(function () {
    /* global moment */
    // set the property data-visible to hidden
    $(".new-activity").attr("data-visible", "hidden");
    // hide the new activity
    $(".new-activity").hide()

    toggleNewActivity();
    var activityId;
    var updateActivity;
    var url = window.location.search;
    var userId;
    if (url.indexOf("?UserId=") !== -1) {
        userId = url.split("=")[1];
        // console.log("userId", userId);
    }

    $(function () {
        $(".add-activity").on("click", function (e) {
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
    $(document).on("click", "button.toggle-activity", handleNewActivity);
    $(document).on("click", "button.cancel-activity", cancelNewActivity);
    $(document).on("click", "button.update-activity", updateActivity);

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
            $("<td>").append("<button class='delete btn btn-danger' data-action='delete' aria-hidden='true'>Delete</button>")
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

    // function to toggle the new\edit activity div
    function toggleNewActivity() {
        var currentState = $(".new-activity").attr("data-visible");
        console.log("currentState", currentState);
    }
    function handleNewActivity() {
        console.log("in handleNewActivity");
        // empty existing data

        var currentState = $(".new-activity").attr("data-visible");
        console.log("currentState", currentState);
        if (currentState === "hidden") {
            // set the property data-visible to hidden
            $(".new-activity").attr("data-visible", "visible");
            currentState = $(".new-activity").attr("data-visible");
            console.log("currentState", currentState);
            // show the new activity div
            $(".new-activity").show();
        }
        // get current state of submit and update button
        var submitBtnState = $(".add-activity").attr("data-visible");
        var updateBtnState = $(".update-activity").attr("data-visible");
        // if submit button is not-set or hidden show it
        if (submitBtnState === "not-set" || submitBtnState === "hidden") {
            // show the submit button
            $(".add-activity").attr("data-visible", "visible");
            $(".add-activity").show()
            // hide the update button
            $(".update-activity").attr("data-visible", "hidden");
            $(".update-activity").hide()
        }

    }

    // This function figures out which activity we want to edit and takes it to the appropriate url
    function handleActivityEdit() {
        console.log("in handleActivityEdit");
        var currentState = $(".new-activity").attr("data-visible");
        console.log("currentState", currentState);
        if (currentState === "hidden") {
            // set the property data-visible to hidden
            $(".new-activity").attr("data-visible", "visible");
            currentState = $(".new-activity").attr("data-visible");
            console.log("currentState", currentState);
            // hide the new activity
            $(".new-activity").show();

        }
        activityId = $(this).attr("data-activity-id");
        console.log("this.attr('data-activity-id)'", $(this).attr("data-activity-id"));
        // convert to integer
        activityId = parseInt(activityId);
        // loop through activities array to find the index of the activity we want to edit
        for (var i = 0; i < activities.length; i++) {
            var editIndex;
            var currentId = activities[i].id;

            if (currentId === activityId) {
                editIndex = i;
                console.log("Index of activity id:", editIndex);
            }
        }
        // populate the edit fields with the activity data
        var momentDate = moment(activities[editIndex].date).format("MM/DD/YYYY");
        console.log("activities[editIndex].date", activities[editIndex].date);
        $("#activityDate").val(momentDate);
        $("#totalDistance").val(activities[editIndex].distance);
        $("#totalRunTime").val(activities[editIndex].totalActivityTime);
        // toggle to see the update button and hide the submit button
        // get the current state of the buttons
        var submitBtnState = $(".add-activity").attr("data-visible");
        var updateBtnState = $(".update-activity").attr("data-visible");
        console.log("submitBtnState", submitBtnState);
        console.log("updateBtnState", updateBtnState);
        // if submit is not-set or visible hide it with jQuery
        if (submitBtnState === "not-set" || submitBtnState === "visible") {
            $(".add-activity").attr("data-visible", "hidden");
            $(".add-activity").hide();
        }
        // if update button is not-set or hidden show it with jQuery
        if (updateBtnState === "not-set" || updateBtnState === "hidden") {
            $(".update-activity").attr("data-visible", "visible");
            $(".update-activity").show();
        }
        // updatedActivity = {
        //     id: activityId,
        //     date: $("#activityDate").val().trim(),
        //     distance: $("#totalDistance").val().trim(),
        //     totalActivityTime: $("#totalRunTime").val().trim(),
        //     UserId: userId,
        //     pace: 7
        // }

    }
    function updateActivity() {
        // activityId = id;
        // path to update a record: /api/activity/:id
        updatedActivity = {
            id: activityId,
            date: $("#activityDate").val().trim(),
            distance: $("#totalDistance").val().trim(),
            totalActivityTime: $("#totalRunTime").val().trim(),
            UserId: userId,
            pace: 7
        }
        $.ajax({
            method: "PUT",
            url: "/api/activity/" + activityId,
            data: updatedActivity
        }).then(function () {
            // location.reload();
        });
    }
    function clearFields() {
        // clear the new\edit fields
        $("#activityDate").val("");
        $("#totalDistance").val("");
        $("#totalRunTime").val("");
    }

    function cancelNewActivity() {
        // cancels an edit or new activity
        console.log("in cancelNewActivity");
        var currentState = $(".new-activity").attr("data-visible");
        console.log("currentState", currentState);
        if (currentState === "visible") {
            // set the property data-visible to hidden
            $(".new-activity").attr("data-visible", "hidden");
            currentState = $(".new-activity").attr("data-visible");
            console.log("currentState", currentState);
            // hide the new activity
            $(".new-activity").hide();
            clearFields();
        }
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
