const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")


const app = express()

const items = ["buy food", "cook food", "sell foood"]
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    const day =date.getDay()

    res.render("list", {kindOfDay: day, newListItems: items})
    


} )
app.post("/", function (req, res) {
        let item = req.body.newItem
        items.push(item)
        res.redirect("/")
    })

app.listen(3000, () => {
    console.log("server is running on port 3000")
})