// Initialize Firebase
var config = {
    apiKey: "AIzaSyB8hJRJeScaWopXWCzPEgG7UA0VnG5Vo0E",
    authDomain: "trainspotter-45428.firebaseapp.com",
    databaseURL: "https://trainspotter-45428.firebaseio.com",
    storageBucket: "trainspotter-45428.appspot.com",
    messagingSenderId: "642093108830"
};
firebase.initializeApp(config);

//var to hold database info
var trainDataBase = firebase.database();

//var to hold information from form
var trainName = "";
var destination = "";
var firstTrainTime = "";
var trainFrequency = "";

$(document).ready(function() {
    //var to hold train-schedule div
    var currentTrainSchedule = $("#train-schedule");
    //var to hold form information
    var form = $("#train-adder-form");

    // Initialize modal
    $("#update-modal").modal();

    form.submit(function(e) {
        e.preventDefault();
        //var to hold info entered by user
        trainName = $("#train-name").val().trim();
        destination = $("#train-destination").val().trim();
        firstTrainTime = $("#first-train-time").val().trim();
        trainFrequency = $("#train-frequency").val().trim();
        console.log(trainName, destination, firstTrainTime, trainFrequency);

        // Creates local "temporary" object for holding employee data
        var newTrain = {
            name: trainName,
            dest: destination,
            firstTime: firstTrainTime,
            freq: trainFrequency
        };

        // Uploads train data to the database
        trainDataBase.ref().push(newTrain);

        // Clears all of the text-boxes
        $("#train-name").val("");
        $("#train-destination").val("");
        $("#first-train-time").val("");
        $("#train-frequency").val("");

        // Prevents moving to new page
        return false;
    });

    //pull from database and prints to screen/html
    trainDataBase.ref().on("child_added", function(childSnapshot) {
        //get key for each child
        var key = childSnapshot.key;

        trainDataBase.ref().child(key).once("value").then(function() {
            // Store everything into a variable.
            var trainName = childSnapshot.val().name;
            var destination = childSnapshot.val().dest;
            var firstTrainTime = childSnapshot.val().firstTime;
            var trainFrequency = childSnapshot.val().freq;

            // First Time (pushed back 1 year to make sure it comes before current time)
            var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
            // console.log(firstTimeConverted);

            // Current Time
            var currentTime = moment();
            // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            // console.log("DIFFERENCE IN TIME: " + diffTime);

            // Time apart (remainder)
            var tRemainder = diffTime % trainFrequency;
            // console.log(tRemainder);

            // Minutes Until Train
            var tMinutesTillTrain = trainFrequency - tRemainder;
            // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
            // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

            // Var to create new table row with data attribute for key
            var newTableRow = $("<tr data-key=\"" + key + "\">");
            // Var to hold table data for train name
            var dataTrain = $("<td>" + trainName + "</td>");
            // Var to hold table data for destination
            var dataDestination = $("<td>" + destination + "</td>");
            // Var to hold table data for frequency
            var dataFrequency = $("<td style='text-align: center'>" + trainFrequency + " Min." + "</td>");
            // Var to hold table data for next arrival
            var dataNextArrivalTime = $("<td style='text-align: center'>" + nextTrain + "</td>");
            // Var to hold table data for minutes till next train
            var dataNextArrivalMin = $("<td style='text-align: center'>" + tMinutesTillTrain + " Min." + "</td>");

            // Var to hold remove button
            var removeBtn = $("<td style='text-align: center'><button class='hvr-back-pulse remove'>Remove</button></td>");

            // Var to hold completed table row
            newTableRow.append(dataTrain).append(dataDestination).append(dataFrequency).append(
                dataNextArrivalTime).append(dataNextArrivalMin).append(removeBtn);

            // Append new row to table
            $("tbody").append(newTableRow);

            $(document).on("click", ".remove", function(){
                // Var to hold key for related table row
                var currentKey = $(this).parents("tr").attr("data-key");
                // Remove from html
                $(this).parents("tr").remove();
                // Remove from database
                trainDataBase.ref().child(currentKey).remove();
            });
        });
    });
});