const express = require("express");
const path = require("path");
const { urlencoded } = require("express");
const router = require("./routers/router");
const DataBase = require("./config/database");
const passport = require("passport");
const session = require("express-session");
const { local } = require("./middleware/middleware");
// const flash = require("connect-flash");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "/public")));


app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
local(passport)
// app.use(flash());
app.use(router);

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  } else {
    DataBase();
    console.log("Server Connected http://localhost:5000");
  }
});
