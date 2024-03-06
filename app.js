const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express()
app.set('view engine', 'ejs')

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB")

const itemsSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
    name: "Hello"
})
const item2 = new Item({
    name: "Hiee"
})
const item3 = new Item({
    name: "Byee"
})

const defaultItems = [item1, item2, item3]
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const foundItems = await Item.find()

    if(foundItems.length === 0) {
        Item.insertMany(defaultItems)
        res.redirect("/")
    } else{
        res.render("list", {kindOfDay: "Today", newListItems: foundItems})
    }
} )

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndDelete(checkedItemId)
        .then(() => {
            console.log("Item deleted successfully");
            res.redirect("/")
        })
        .catch((err) => {
            console.log(err);
            console.log("Error deleting item");
        });
});


app.post("/", function (req, res) {
        let itemName = req.body.newItem

        const item = new Item ({
            name: itemName
        })
        item.save()
        res.redirect("/")
    })

app.listen(3000, () => {
    console.log("server is running on port 3000")
})