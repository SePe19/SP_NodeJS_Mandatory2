import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";
import initializePassport from "../passport-config.js";

const users = User.find();

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const router = Router();

router.get("/", checkAuthenticated, (req, res) => {
    res.render("auth/index", { name: req.user.name });
});

router.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("auth/login");
});

router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/items",
    failureRedirect: "/auth/login",
    failureFlash: true
}));

router.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("auth/register", { user: new User() });
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { email: req.body.email, password: hashedPassword };
        user.save();
        res.redirect(`auth/login`);
    } catch {
        res.redirect("/auth/register");
    }
});

router.delete("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("auth/login");
};

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/items");
    }
    next();
};

export default router;