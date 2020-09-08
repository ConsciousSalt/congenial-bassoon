const MONGO_URI = require('./data/mongodb');

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const app = express();

const sessionStore = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

const User = require("./models/user");
const errorsController = require("./controllers/errors");


//Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  // User.findById("5f49065946c65b3450592429")
  if (!req.session.user){
    return next();
  }

  User.findById(req.session.user._id)  
  .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next)=>{
      res.locals.isAuthenticated = req.session.isLoggedIn;
      res.locals.csrfToken = req.csrfToken();
      next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.getPageNotFound);

mongoose
  .connect(MONGO_URI)
  .then((result) => {    
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
