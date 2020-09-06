const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let flashMessage = req.flash('error');
  if (flashMessage.length > 0 ){
    flashMessage = flashMessage[0];    
  } else {
    flashMessage = null;
  };

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: flashMessage
  });
};

exports.getSignup = (req, res, next) => {
  let flashMessage = req.flash('error');
  if (flashMessage.length > 0 ){
    flashMessage = flashMessage[0];    
  } else {
    flashMessage = null;
  };

  res.render("auth/signup", {
    pageTitle: "Signupn",
    path: "/signup",
    errorMessage: flashMessage
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Ivalid email or password');
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          
          req.flash('error', 'Ivalid email or password');
          res.redirect("/login");
        })
        .catch((err) => {
          return res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'Email exists already');
        return res.redirect("/signup");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          return res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
