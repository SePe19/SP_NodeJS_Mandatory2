import express from "express";
import Item from "../models/item.js";
const router = express.Router();


router.get("/", async (req, res) => {
    let searchItems = {};
    if (req.query.name != null && req.query.name !== "") {
        searchItems.name = new RegExp(req.query.name, "i")
    }
    try {
        const items = await Item.find(searchItems);
        res.render("items/index", {
            items: items,
            searchItems: req.query
        });
    } catch {
        res.redirect("/");
    }
});

router.get("/new", (req, res) => {
    res.render("items/new", { item: new Item() });
});

router.post("/", async (req, res) => {
    const item = new Item({
        name: req.body.name
    });
    try {
        const newItem = await item.save();
        //res.redirect(`items/${newItem.id}`)
        res.redirect(`items`)
    } catch {
        res.render("items/new", {
            item: item,
            errorMessage: "Error creating item"
        });
    }
});

export default router;