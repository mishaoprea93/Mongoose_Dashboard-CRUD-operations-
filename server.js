var express = require("express");
var app = express();
var session = require("express-session");
var port = 8000;
var bp = require("body-parser");
var path = require("path");
var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/mongoose");

var AnimalSchema = new mongoose.Schema({
    animalName: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });
mongoose.model('Animal', AnimalSchema);
var Animal = mongoose.model("Animal");


app.use(bp.urlencoded());
app.use(express.static(path.join(__dirname, "/client")));
app.use(session({ secret: "keylog" }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    Animal.find({}, function(err, animal) {
        res.render("index", { animals: animal });
    })
})

app.get("/mongoose/new", function(req, res) {
    res.render("add")
})

app.post("/mongoose/process", function(req, res) {
    var animal = new Animal({ animalName: req.body.animalName, description: req.body.description });
    animal.save(function(err) {
        if (err) {
            console.log('something went wrong');
            res.redirect("/mongoose/new")
        } else {
            console.log('successfully added an animal!');
            res.redirect("/");
        }
    })
})
app.get("/mongoose/show/:uid", function(req, res) {
    var id = req.params.uid;
    Animal.findById(id, function(err, animal) {
        console.log(animal);
        res.render("display", { animal: animal })
    })
})
app.get("/mongoose/destroy/:uid", function(req, res) {
    var id = req.params.uid;
    Animal.findByIdAndRemove(id, function(err) {
        res.redirect("/");
    })
})
app.get("/mongoose/update/:uid", function(req, res) {
    var id = req.params.uid;
    Animal.findById(id, function(err, animal) {
        console.log(animal);
        res.render("edit", { animal: animal })
    })

})
app.post("/mongoose/update/process/:uid", function(req, res) {
    var id = req.params.uid;
    console.log(req.body);
    Animal.findById({ id }, function(err, animal) {
        animal.animalName = req.body.animalName;
        console.log(animal.animalName);
        animal.description = req.body.description;
        animal.save({ new: true }, function(err) {
            if (err) {
                console.log('ERROR!');
            } else {
                res.redirect("/");
            }
        });
    })
})

app.listen(port, function() {
    console.log("listening to port:8000");
})