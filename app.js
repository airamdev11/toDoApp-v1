//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//Boilerplate para firebase-admin
var admin = require("firebase-admin");

var passwords = require("./cert.json");

admin.initializeApp({
  credential: admin.credential.cert(passwords),
  databaseURL: "https://todoapp-v1-fe364-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

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

app.get("/notes", (req,res)=>{
    db.collection("notes").get()
    .then((queryDocuments)=>{
        console.log(queryDocuments);
        const notesArray = [];
        const data = queryDocuments.forEach((each)=>{
            const data = each.data();
            notesArray.push(data);
        });
        res.send(notesArray);
    })
    .catch((error)=>{
        console.log("error: ", error);
    })
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
});