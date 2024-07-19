const userData = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

const isAuth = (req, res, next) => {
    try {
        if (req.user) {
            next();
        } else {
            res.redirect('/loginPage');
        }
    } catch (error) {
        console.log(error);
    }
}

const local = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            let user = await userData.findOne({ email: email });
            if (!user) {
                console.log("User Not Found..");
                return done(null, false);
            } else if (user.password !== password) {
                console.log("Password Incorrect...");
                return done(null, false);
            } else {
                return done(null, user);
            }
        } catch (error) {
            console.log(error);
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const userfind = await userData.findById(id);
            done(null, userfind);
        } catch (error) {
            done(error, false);
        }
    });
}

module.exports = { isAuth, local };
