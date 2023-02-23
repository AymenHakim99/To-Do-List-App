//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://aymennacer:test123@cluster0.igqlfpd.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true});

const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema);

// adding default items to the list
const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Tap + button to add an item."
});

const item3 = new Item({
  name: " <- click checkbox to delete item."
});


const defaultItems = [item1, item2, item3];


app.get("/", function(req, res) {
const day = date.getDate();

Item.find({}, function(err, foundItems){

  if (foundItems.length === 0){
    Item.insertMany(defaultItems, function(err){
    if (err){
      console.log(err);
    }
    else {
      console.log("Success: Saved default items to the database.");
    }
    });
     res.redirect("/");
  } else {
  res.render("list", {listTitle: day, newListItems: foundItems});
}
});





});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  console.log("Successfully saved this item to the database")


  res.redirect("/");
});

app.post("/delete", function(req, res){
 const checkedItemId = req.body.checkbox;

 Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });

});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
