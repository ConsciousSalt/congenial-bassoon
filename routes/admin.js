const express = require("express");
const router = express.Router();

const { check, body } = require("express-validator");

const productsContoller = require("../controllers/products");
const isAuth = require("../middleware/is-auth");

// /admin/add-product => GET
router.get("/add-product", isAuth, productsContoller.getAddProducts);
router.get(
  "/edit-product/:productId",
  isAuth,
  productsContoller.getEditProduct
);
router.get("/products", isAuth, productsContoller.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  [
    //check("imageURL").isURL().withMessage("Not correct image URL"),
    body("title").trim().isLength({ min: 3, max: 50 }),
    body("price").isFloat(),
    body("description").trim().isLength({ max: 400 }),
  ],
  productsContoller.postAddProduct
);
router.post(
  "/edit-product/:productId",
  isAuth,
  [
    //check("imageURL").isURL().withMessage("Not correct image URL"),
    body("title").trim().isLength({ min: 3, max: 50 }),
    body("price").isFloat(),
    body("description").trim().isLength({ max: 400 }),
  ],
  productsContoller.postEditProduct
);
router.post("/delete-product", isAuth, productsContoller.postDeleteProduct);

module.exports = router;
