const express = require("express");
const router = express.Router();

const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/login", authController.postLogin);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email is forbidden!");
        // }
        // return true;
        User.findOne({ email: value })
        .then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email exists already. Please pick a different one"
            );
          }
        })
      }),
    body(
      "password",
      "Please enter a password with only numbers and text at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password have to match confirm password");
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
