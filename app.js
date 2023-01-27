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

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Monterrey' };
    var day = today.toLocaleDateString("es-MX", options);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }



    const notesArray = [];
     db.collection("notes").get().then((documents)=>{
         documents.forEach((document) => {

            const note = document.data().noteDescription;
            notesArray.push(note);
        });
        
        res.render('list', { listTitle: capitalizeFirstLetter(day), elements: notesArray });
    });
}

);

app.get("/work", function (req, res) {
    const workNotesArray = [];
     db.collection("notes").get().then((documents)=>{
         documents.forEach((document) => {
            if(document.data().isWork === true){
                const note = document.data().noteDescription;
                workNotesArray.push(note);
            }
        });
        
        res.render("list", { listTitle: "Work List", elements: workNotesArray });
    });
    
});

app.post("/", function (req, res) {

    let noteDescription = req.body.element;

    if (req.body.list === "Work List") {

        db.collection("notes").add({
            noteDescription,
            isWork : true
        });

        res.redirect("/work");
    } else {


        db.collection("notes").add({
            noteDescription
        });

        res.redirect("/");
    }
});

app.get("/notes", (req, res) => {
    db.collection("notes").get()
        .then((queryDocuments) => {
            const notesArray = [];

            const data = queryDocuments.forEach((each) => {
                const documentId = each.id;
                const documentDate = each.data().date;
                const documentNote = each.data().note;

                const document = {
                    id: documentId,
                    ...each.data()
                };

                notesArray.push(document);
            });

            /*const docs = queryDocuments.docs.map(doc => ({
                id: doc.id,
                    date : doc.data().date,
                        note: doc.data().note
            }));*/


            res.send(notesArray);
        })
        .catch((error) => {
            console.log("error: ", error);
        })
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
});