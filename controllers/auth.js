const verifiedMail = require("../data/sendgrid-verified-mail");

const { validationResult } = require("express-validator");
const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const SENDGRID_API_KEY = require("../data/sendgrid")();
const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API_KEY,
    },
  })
);

const errorHandler = require("../utils/globalHandlers").errorHandler;

exports.getLogin = (req, res, next) => {
  let flashMessage = req.flash("error");
  if (flashMessage.length > 0) {
    flashMessage = flashMessage[0];
  } else {
    flashMessage = null;
  }

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: flashMessage,
    userInput:{
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let flashMessage = req.flash("error");
  if (flashMessage.length > 0) {
    flashMessage = flashMessage[0];
  } else {
    flashMessage = null;
  }

  res.render("auth/signup", {
    pageTitle: "Signupn",
    path: "/signup",
    errorMessage: flashMessage,
    userInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      userInput: {
        email: req.body.email,
        password: req.body.password
      },
      validationErrors: errors.array()
    });
  };
  return User.findOne({ email: req.body.email })
  .then(user => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    return req.session.save((err) => {
      res.redirect("/");
    });
  })
  .catch(err=>{
    errorHandler(err, next);
;  })

};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      userInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array() 
    });
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
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: verifiedMail,
        subject: "Submit succeded",
        html: "<h1>You succesfully signed Up!</h1>",
      });
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let flashMessage = req.flash("error");
  if (flashMessage.length > 0) {
    flashMessage = flashMessage[0];
  } else {
    flashMessage = null;
  }

  res.render("auth/reset", {
    pageTitle: "Reset password",
    path: "/reset",
    errorMessage: flashMessage,
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let flashMessage = req.flash("error");
      if (flashMessage.length > 0) {
        flashMessage = flashMessage[0];
      } else {
        flashMessage = null;
      }

      res.render("auth/new-password", {
        pageTitle: "Create new password",
        path: "/new-password",
        errorMessage: flashMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No such email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return transporter.sendMail({
          to: req.body.email,
          from: verifiedMail,
          subject: "Password reset",
          html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
        `,
        });
      })
      .catch((err) => {
        errorHandler(err, next);
      });
  });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};
