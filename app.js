const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const _ = require("lodash")
require('dotenv').config();


const app = express()
app.set('view engine', 'ejs')


mongoose.connect(process.env.DB_URI);

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

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model("List", listSchema)

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const foundItems = await Item.find()

    if(foundItems.length === 0) {
        Item.insertMany(defaultItems)
        res.redirect("/")
    } else{
        res.render("list", {listTitle: "Today", newListItems: foundItems})
    }
} )
app.get("/:customListName", async function(req, res) {
    const customListname = _.capitalize(req.params.customListName)
    try {
        const foundList = await List.findOne({name: customListname})
        if(!foundList){
            const list = new List({
                name: customListname,
                items: defaultItems
            })
            await list.save()
            res.redirect("/" + customListname)
        } else {
            res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
        }
    } catch (err) {
        console.error(err)
        // Handle the error appropriately
        res.status(500).send("An error occurred")
    }
})


app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName

    if(listName === "Today") {
        Item.findByIdAndDelete(checkedItemId)
            .then(() => {
                
                res.redirect("/")
            })
            .catch((err) => {
                console.log(err);
                console.log("Error deleting item");
            });
    } else {
        const foundList = List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
        res.redirect("/" + listName)
    }
});


app.post("/", async function (req, res) {
    let itemName = req.body.newItem
    const listName = req.body.list

    const item = new Item({
        name: itemName
    })

    if (listName === "Today") {
        await item.save()
        res.redirect("/")
    } else {
        const foundList = await List.findOne({ name: listName })
        foundList.items.push(item)
        await foundList.save()
        res.redirect("/" + listName)
    }
})


app.listen(3000, () => {
    console.log("server is running on port 3000")
})