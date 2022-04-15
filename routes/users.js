import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = Router();

router.get("/", (req, res) => {
    try {
        res.render("auth/index");
    } catch {
        res.redirect("/");
    }
});

router.get("/signup", (req, res) => {
    res.render("auth/signup", { user: new User() });
});

router.post("/signup", async (req, res) => {
    const body = req.body;

    if (!(body.email && body.password)) {
        return res.status(400).send({ error: "Input not accepted. Try again." });
    }

    const user = new User(body);

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => res.status(201).send(doc));
});

router.get("/login", (req, res) => {
    res.render("auth/login");
})

router.post("/", async (req, res) => {
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (user) {
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (validPassword) {
            res.status(200).json({ message: "Password accepted" });
        } else {
            res.status(400).json({ error: "Wrong Password" });
        }
    } else {
        res.status(401).json({ error: "User non-existent. Try signing up." });
    }
});

router.delete("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
})

export default router;