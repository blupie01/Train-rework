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