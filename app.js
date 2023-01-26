//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items = ["Thing 1", "Thing 2", "Thing 3", "Thing 4"];
var workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"))

app.get("/", function (req, res) {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
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