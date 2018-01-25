$(document).ready(function () {
    // hide the New\Edit activity div
    toggleElement(".new-activity", "hide");
    
    ///////////////////////////////////////////////////////////////////////////////////////////
    // declare objects and variables
    var newActivityObj;
    var activityId;
    var updateActivity;
    var url = window.location.search;
    var userId;
    // Variable to hold our activities from the database
    var activities;
    // Variable to hold our user data from the database
    var userData;

    // runContainer holds all of our activities
    var runContainer = $(".run-history-tbody");

    // Sets the user ID to the url value
    if (url.indexOf("?UserId=") !== -1) {
        userId = url.split("=")[1];
    }
    ///////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Click events for all buttons
    $(document).on("click", "button.delete", handleActivityDelete);
    $(document).on("click", "button.edit", handleActivityEdit);
    $(document).on("click", "button.toggle-activity", handleNewActivity);
    $(document).on("click", "button.cancel-activity", cancelNewActivity);
    $(document).on("click", "button.update-activity", updateActivity);
    $(document).on("click", "button.add-activity", createNewActivty);
    ///////////////////////////////////////////////////////////////////////////////////////////

    // Gets user data from the user table
    getUserData();
    // gets activity data by used id
    getActivities();

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Functions

    ///////////////////////////////////////////////////////////////////////////////////////////
    // database operations functions (CRUD)

    function createNewActivty() {
        // creates a new activity in the activities table
        newActivityObj = {
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
    }

    function getUserData() {
        // grabs userdata from the user table and stores values in the userData object
        $.get("/api/users/" + userId, function (data) {
            // console.log("UserData", data);
            userData = data;
            // Sets the id "user-name to display the username"
            setText("#user-name",userData.name + "'s");
        });
    }

    function getActivities() {
        // grabs activities from the activity table and updates the view
        $.get("/api/activity/" + userId, function (data) {
            activities = data;
            // console.log("Activities", activities);
            if (!activities || !activities.length) {
                displayEmpty();
            }
            else {
                initializeRows();
            }
        });
    }

    function updateActivity() {
        // Update an activity
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
            location.reload();
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Data display functions

    function initializeRows() {
        // InitializeRows handles appending all of our constructed post HTML inside blogContainer
        runContainer.empty();
        var activitiesToAdd = [];
        for (var i = 0; i < activities.length; i++) {
            activitiesToAdd.push(createNewRow(activities[i]));
        }
        runContainer.append(activitiesToAdd);
    }

    function createNewRow(activity) {
        // creates new td's within the row with data from the current activity object
        var momentDate = moment(activity.date).format("LL");
        $(".run-history-table").find(".run-history-tbody").append($("<tr>").append
            ($("<td>").append(momentDate),
            $("<td>").append(activity.distance),
            $("<td>").append(activity.totalActivityTime),
            $("<td>").append(activity.pace),
            $("<td>").append("<button class='edit btn btn-primary' data-activity-id='" + activity.id + "' aria-hidden='true'>Edit</button>"),
            $("<td>").append("<button class='delete btn btn-danger' data-activity-id='" + activity.id + "' aria-hidden='true'>Delete</button>")
            )
        );
    }

    function handleActivityDelete() {
        // This function figures out which post we want to delete and then calls deletePost
        // console.log("in handleActivityDelete");
        activityId = $(this).attr("data-activity-id");
        // console.log("this.attr('data-activity-id)'", $(this).attr("data-activity-id"));
        // convert to integer
        activityId = parseInt(activityId);
        
        $.ajax({
            method: "DELETE",
            url: "/api/activity/" + activityId
        })
            .then(function () {
                location.reload();
            });
    }


    function readAttr(target, attr) {
        // console.log("In the readAttr function");
        var readData = $(target).attr(attr);
        // console.log("read: '" + target + "' attribute: '" + attr + "' is: '" + readData + "'");
        return readData
    }

    function setAttr(target, attr, val) {
        // console.log("In the setAttr function");
        var setTargetData = $(target).attr(attr, val);
        // console.log("Set: '" + target + "' attribute: '" + attr + "' to: '" + val + "'");
    }

    function setText(target, val) {
        // console.log("In the setVal function");
        var setTargetData = $(target).text(val);
        // console.log("Set: '" + target + "' value: '" + val + "'");
    }

    function toggleElement(element, value) {
        // show the element
        // console.log("In the toggleElement function");
        if (value === "show") {
            // console.log("In the toggleElement 'show' function");
            if (readAttr(element, "data-visible") === "not-set" || readAttr(element, "data-visible") === "hidden") {
                // Set attribute "data-visible" to visible
                setAttr(element, "data-visible", "visible");
                // show the element
                $(element).show();
            }
        }
        // hide the element
        if (value === "hide") {
            // console.log("In the toggleElement 'hide' function");
            if (readAttr(element, "data-visible") === "not-set" || readAttr(element, "data-visible") === "visible") {
                // Set attribute "data-visible" to hidden
                setAttr(element, "data-visible", "hidden");
                // hide the element
                $(element).hide()
            }
        }

    }
    
    function handleNewActivity() {
        // console.log("in handleNewActivity");
        setText(".span-title", "Enter a new run:");
        // hide the update activity button
        toggleElement(".update-activity", "hide");
        
        // show the new activity submit button
        toggleElement(".new-activity", "show");
        
        // show the add-activity button
        toggleElement(".add-activity", "show");
    }

    
    function handleActivityEdit() {
        // This function figures out which activity we want to edit and takes it to the appropriate url
        // console.log("in handleActivityEdit");
        activityId = $(this).attr("data-activity-id");
        // console.log("this.attr('data-activity-id)'", $(this).attr("data-activity-id"));
        // convert to integer
        activityId = parseInt(activityId);
        // loop through activities array to find the index of the activity we want to edit
        for (var i = 0; i < activities.length; i++) {
            var editIndex;
            var currentId = activities[i].id;

            if (currentId === activityId) {
                editIndex = i;
                // console.log("Index of activity id:", editIndex);
            }
        }
        // populate the edit fields with the activity data
        var momentDate = moment(activities[editIndex].date).format("MM/DD/YYYY");
        // console.log("activities[editIndex].date", activities[editIndex].date);
        $("#activityDate").val(momentDate);
        $("#totalDistance").val(activities[editIndex].distance);
        $("#totalRunTime").val(activities[editIndex].totalActivityTime);

        // set the title
        setText(".span-title", "Update an existing run:");

        // show the update activity button
        toggleElement(".update-activity", "show");
               
        // hide the add-activity button
        toggleElement(".add-activity", "hide");

        // show the new activity div
        toggleElement(".new-activity", "show");
    }

    function clearFields() {
        // clear the new\edit fields
        $("#activityDate").val("");
        $("#totalDistance").val("");
        $("#totalRunTime").val("");
    }

    function cancelNewActivity() {
        // cancels an edit or new activity
        // console.log("in cancelNewActivity");
        var currentState = $(".new-activity").attr("data-visible");
        // console.log("currentState", currentState);
        if (currentState === "visible") {
            // set the property data-visible to hidden
            $(".new-activity").attr("data-visible", "hidden");
            currentState = $(".new-activity").attr("data-visible");
            // console.log("currentState", currentState);
            // hide the new activity
            $(".new-activity").hide();
            clearFields();
        }
    }
    
    function displayEmpty() {
        // This function displays a message when there are no posts
        var query = window.location.search;
        var partial = "";
        if (userId) {
            partial = " for User: " + userData.name;
        }
        runContainer.empty();
        var messageh2 = $("<h2>");
        messageh2.css({ "text-align": "center", "margin-top": "50px" });
        messageh2.html("No activities yet" + partial + ", click 'Add Run' to get started.");
        runContainer.append(messageh2);
    }

});
