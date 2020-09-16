const { validationResult } = require("express-validator");

const errorHandler = require('../utils/globalHandlers').errorHandler;

const Product = require("../models/product");
const Order = require("../models/order");

const { response } = require("express");

exports.getAddProducts = (req, res, next) => {

  res.render("admin/add-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    errorMessage: '',
    userInput:{
      title: '',
      imageURL: '',
      price: '',
      description: ''      
    },
    validationErrors: []
  });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit product",
        path: "/admin/products",
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        product: product,
        errorMessage: '',
        userInput:{
          title: '',
          imageURL: '',
          price: '',
          description: ''      
        },
        validationErrors: []
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin products",
        path: "/admin/products",
        hasProducts: products.length > 0,
        activeShop: true,
        formsCSS: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add product",
      path: "/admin/add-product",
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      errorMessage: errors.array()[0].msg,
      userInput: {
        title: req.body.title,
        imageURL: req.body.imageURL,
        price: req.body.price,
        description: req.body.description
      },
      validationErrors: errors.array()
    });
  }

  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageURL: req.body.imageURL,
    userId: req.user,
  });

  // Product.create({
  product
    .save()
    .then((response) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res) => {
  const errors = validationResult(req);

  
  if (!errors.isEmpty()) {
    
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/admin/edit-product",
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: req.body.title,
        imageURL: req.body.imageURL,
        price: req.body.price,
        description: req.body.description,
        _id:req.body.productId 
      },
      validationErrors: errors.array()
    });
  }

  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      product.title = req.body.title;
      product.price = req.body.price;
      product.imageURL = req.body.imageURL;
      product.description = req.body.description;

      return product.save().then((savingResult) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then((delResult) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.getMainPage = (req, res) => {
  Product.find().then((products) => {
    res.render("shop/index", {
      products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      formsCSS: true,
      productCSS: true,
    });
  });
};

exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((product) => {
        return {
          _id: product.productId._id,
          title: product.productId.title,
          quantity: product.quantity,
        };
      });

      res.render("shop/cart", {
        pageTitle: "Your cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    });
};

exports.postCartDeleteItem = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.getProductList = (req, res) => {
  Product.find().then((products) => {
    res.render("shop/product-list", {
      products,
      pageTitle: "Products",
      path: "/products",
      hasProducts: products.length > 0,
      activeShop: true,
      formsCSS: true,
      productCSS: true,
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productID;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("shop/product-detail", {
        pageTitle: "Product detail",
        path: "/products",
        product: product,
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((product) => {
        return {
          product: { ...product.productId._doc },
          quantity: product.quantity,
        };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products: products,
      });

      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};
