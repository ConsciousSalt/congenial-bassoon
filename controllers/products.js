const fs = require("fs");
const path = require("path");

const fileHelper = require("../utils/file");

const PDFDocument = require("pdfkit");

const { validationResult } = require("express-validator");

const errorHandler = require("../utils/globalHandlers").errorHandler;

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 1;

const { response } = require("express");

exports.getAddProducts = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    errorMessage: "",
    userInput: {
      title: "",
      // imageURL: '',
      price: "",
      description: "",
    },
    validationErrors: [],
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
        errorMessage: "",
        userInput: {
          title: "",
          // imageURL: '',
          price: "",
          description: "",
        },
        validationErrors: [],
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.getProducts = (req, res, next) => {
  const page = Number(req.query.page || 1);
  let totaItems;

  Product.find()
    .countDocuments()
    .then((numProds) => {
      totaItems = numProds;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin products",
        path: "/admin/products",
        hasProducts: products.length > 0,
        activeShop: true,
        formsCSS: true,
        productCSS: true,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totaItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totaItems / ITEMS_PER_PAGE)
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  const image = req.file; /* req.body.imageURL */

  if (!image) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add product",
      path: "/admin/add-product",
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      errorMessage: "attached file is not an image ",
      userInput: {
        title: req.body.title,
        // imageURL: req.body.imageURL,
        price: req.body.price,
        description: req.body.description,
      },
      validationErrors: errors.array(),
    });
  }

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
        // imageURL: imageURL,
        price: req.body.price,
        description: req.body.description,
      },
      validationErrors: errors.array(),
    });
  }

  const imageURL = image.path;

  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageURL: imageURL,
    userId: req.user,
  });

  // Product.create({
  product
    .save()
    .then((response) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.postEditProduct = (req, res, next) => {
  const errors = validationResult(req);
  const image = req.file;

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
        price: req.body.price,
        description: req.body.description,
        _id: req.body.productId,
      },
      validationErrors: errors.array(),
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
      if (image) {
        fileHelper.deleteFile(product.imageURL);
        product.imageURL = image.path;
      }
      // product.imageURL = req.body.imageURL;
      product.description = req.body.description;

      return product.save().then((savingResult) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found!"));
      }
      fileHelper.deleteFile(product.imageURL);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then((delResult) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.getMainPage = (req, res, next) => {
  const page = Number(req.query.page || 1);
  let totaItems;

  Product.find()
    .countDocuments()
    .then((numProds) => {
      totaItems = numProds;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
        formsCSS: true,
        productCSS: true,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totaItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totaItems / ITEMS_PER_PAGE)
      });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

exports.getCart = (req, res, next) => {
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

exports.postCartDeleteItem = (req, res, next) => {
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

exports.getOrders = (req, res, next) => {
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

exports.getInvoce = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found!"));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Not authorized!"));
      }
      const invoceName = "invoce-" + orderId + ".pdf";
      const invocePath = path.join("data", "invoces", invoceName);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "'inline'; filename=\"" + invoceName + '"',
      });

      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invocePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoce", {
        underline: true,
      });

      pdfDoc.text("-----***-----");
      let totalSum = 0;
      order.products.forEach((prod) => {
        const prodSum = prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              "  - " +
              prod.quantity +
              " x $" +
              prod.product.price +
              " : $" +
              prodSum
          );
        totalSum += prodSum;
      });
      pdfDoc.text(" ");
      pdfDoc.text("Total price: $" + totalSum);
      pdfDoc.end();

      // console.log('invocePath', invocePath,  'invoceName', invoceName);
      // fs.readFile(invocePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }

      //   res.set({
      //     'Content-Type': 'application/pdf',
      //     'Content-Disposition': '\'inline\'; filename="'+invoceName+'"',
      //   });
      //   res.send(data);

      // });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getProductList = (req, res, next) => {
  const page = Number(req.query.page || 1);
  let totaItems;

  Product.find()
    .countDocuments()
    .then((numProds) => {
      totaItems = numProds;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        products,
        pageTitle: "Products",
        path: "/products",
        hasProducts: products.length > 0,
        activeShop: true,
        formsCSS: true,
        productCSS: true,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totaItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totaItems / ITEMS_PER_PAGE)
      });
    })
    .catch((err) => {
      errorHandler(err, next);
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
