const MONGO_URI =
  "mongodb+srv://Alex:dylvwUvtBXOuxtz1@clustera.hvojq.mongodb.net/shop?retryWrites=true&w=majority";

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

const sessionStore = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});

const User = require("./models/user");
app.set("view engine", "ejs");
app.set("views", "views");

//Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorsController = require("./controllers/errors");

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

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.getPageNotFound);

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Mileena",
          email: "killKitana@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
