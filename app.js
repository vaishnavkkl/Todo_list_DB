const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
var items = ["buy"];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://dbVaishnav:v@ishnav@123@project.9zuti.mongodb.net/dbVaishnav?retryWrites=true&w=majority/todoDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Enter Item"
});

const item2 = new Item({
    name: "Click on checkbox to delete items"
});

const defaultItems = [item1, item2]


const listSchema = {
    name: String,
    items: [itemSchema]
};
const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("succesfull")
                }
            });
            res.redirect("/");
        } else { res.render("list", { kindofDay: day, listItem: foundItems }); }
    });



    var today = new Date();

    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    var day = today.toLocaleDateString("en-US", options);



});

app.get("/:customListName", function(req, res) {
    const customListName = req.params.customListName;


    List.findOne({ name: customListName }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect('/'+customListName);
            } else {
                res.render("list",{ kindofDay: foundList.name, listItem: foundList.items } );
            }

        }
    });


})

app.post("/", function(req, res) {

    var itemName = req.body.item;

    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/")
});
app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox

    Item.findByIdAndRemove(checkedItemId, function(err) {
        if (!err) {
            console.log("deleted");
            res.redirect("/");
        }
        else{
        	res.redirect("/")
        }
    })
});

app.listen(process.env.PORT || 3000, function() {
    console.log("server running");
});