// Initialize Firebase
var config = {
  apiKey: "AIzaSyAbK_0U7e_gmTiC92HLlWleJOSUUKKOAs8",
  authDomain: "train-scheduler-573d7.firebaseapp.com",
  databaseURL: "https://train-scheduler-573d7.firebaseio.com",
  projectId: "train-scheduler-573d7",
  storageBucket: "train-scheduler-573d7.appspot.com",
  messagingSenderId: "2202145889"
};
firebase.initializeApp(config);

var database = firebase.database();
var trains = [];

$("#submit-train").on("click", function () {
  event.preventDefault();

  //Get submitted train info
  var name = $("#train-name-input").val().trim();
  var destination = $("#train-destination-input").val().trim();
  var start = $("#train-start-input").val().trim();
  var frequency = $("#train-frequency-input").val().trim();

  console.log(`Name: ${name}`);
  console.log(`Destination: ${destination}`);
  console.log(`Start Time: ${start}`);
  console.log(`Frequency: ${frequency}`);


  var newTrain = {
    trainName: name,
    trainDestination: destination,
    trainStart: start,
    trainFrequency: frequency
  }

  database.ref().push(newTrain);

  $("#train-name-input").val("");
  $("#train-destination-input").val("");
  $("#train-start-input").val("");
  $("#train-frequency-input").val("");
});

database.ref().on("child_added", function (data) {
  // console.log(data);
  //Get train info
  var train = {
    name: data.val().trainName,
    destination: data.val().trainDestination,
    start: data.val().trainStart,
    frequency: data.val().trainFrequency
  }

  console.log(train);

  //Get next train and arrival time
  var convertedStart = moment(train.start, "HH:mm").subtract(14, "days");
  console.log(`convertedStart: ${convertedStart}`);

  convertedStart = convertedStart.year(moment().year()).month(moment().month()).date(moment().date());
  var diffTime = moment().diff(convertedStart, "minutes");
  var tRemainder = diffTime % train.frequency;
  var minAway = train.frequency - tRemainder;
  var nextArrival = moment().add(minAway, "minutes").format("h:mm A");

  if (diffTime < 0) {
    nextArrival = convertedStart.format("hh:mm A");
  }

  console.log(`convertedStart: ${convertedStart}`);
  console.log(`diffTime: ${diffTime}`);
  console.log(`tRemainder: ${tRemainder}`);
  console.log(`minAway: ${minAway}`);
  console.log(`nextArrival: ${nextArrival}`);

  // var firstTimeConverted = moment(train.start, "HH:mm").subtract(1, "years");
  // var currentTime = moment();
  // var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // var tRemainder = diffTime % train.frequency;
  // var minAway = train.frequency - tRemainder;
  // var nextArrival = moment().add(minAway, "minutes");


  //Add train to list
  var newRow = $("<tr>").append(
    $("<td>").append(train.name),
    $("<td>").append(train.destination),
    $("<td>").append(train.frequency),
    $("<td>").append(nextArrival),
    $("<td>").append(minAway)
  );

  $("#train-table > tbody").append(newRow);

  // console.log(`Data Name: ${train.name}`);
  // console.log(`Data Destination: ${train.destination}`);
  // console.log(`Data Start Time: ${train.start}`);
  // console.log(`Data Frequency: ${train.frequency}`);
});