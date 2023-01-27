//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//Boilerplate para firebase-admin
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://todoapp-v1-fe364-default-rtdb.firebaseio.com"
});


var items = [];
var workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"))

app.get("/", function (req, res) {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Monterrey'};
    var day = today.toLocaleDateString("es-MX", options);

    res.render('list', { listTitle: day, elements: items });
}

);

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", elements: workItems });
});

app.post("/", function (req, res) {
    let element = req.body.element;
    if (req.body.list === "Work List") {

        workItems.push(element);
        res.redirect("/work");
    }else{ 
        items.push(element);
        res.redirect("/");
    }

    

});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});