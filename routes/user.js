const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../midddleware.js"); // ✅ correct spelling

// 📝 Signup Form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// 🧾 Signup Logic
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to WonderLust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// 🔐 Login Form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// 🚪 Login Logic
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    (req, res) => {
        req.flash("success", "Welcome back to WonderLust!");

        const redirectUrl = res.locals.redirectUrl || "/listings";
        delete req.session.redirectUrl; // clear old url

        res.redirect(redirectUrl);
    }
);

// 🚪 Logout Route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You have logged out successfully!");
        res.redirect("/listings");
    });
});

module.exports = router;
