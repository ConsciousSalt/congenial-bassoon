const Product = require('../models/product');
const Cart = require('../models/cart');
const { response } = require('express');

exports.getAddProducts = (req, res, next)=>{
   res.render('admin/add-product', {
        pageTitle: 'Add product', 
        path: '/admin/add-product', 
        formsCSS: true, 
        productCSS: true, 
        activeAddProduct:true
    });
};

exports.getEditProduct = (req, res, next)=>{
    const productId = req.params.productId;
    Product.findByPk(productId)
        .then(product => {
            if (!product){
                return res.redirect('/');
            }
    
            res.render('admin/edit-product', {
                pageTitle: 'Edit product', 
                path: '/admin/products', 
                formsCSS: true, 
                productCSS: true, 
                activeAddProduct:true,
                product: product
            });
        })
        .catch(err=> console.log(err));
 };

exports.getProducts = (req, res, next)=>{
     //Product.findAll()
     req.user.getProducts()
        .then(products=>{
                res.render('admin/products', {
                products, 
                pageTitle: "Admin products", 
                path: '/admin/products', 
                hasProducts: products.length >0, 
                activeShop: true,
                formsCSS: true, 
                productCSS: true
        });
    })
    .catch(err=> console.log(err));
 };

exports.postAddProduct = (req, res, next)=> {
    const title         = req.body.title;
    const imageURL      = req.body.imageURL;
    const description   = req.body.description;
    const price         = req.body.price;

    // Product.create({
    req.user.createProduct({
            title: title,
            price: price,
            imageURL: imageURL,
            description: description
        })
    .then(response=>{
        res.redirect('../products');
    })
    .catch(err=>{
        console.log(err)
    });
};

exports.postEditProduct = (req, res) => {
    const productId = req.params.productId;
    const title         = req.body.title;
    const imageURL      = req.body.imageURL;
    const description   = req.body.description;
    const price         = req.body.price;

    Product.findByPk(productId)
        .then(product => {
            product.title       = title;    
            product.imageURL    = imageURL;
            product.description = description;
            product.price       = price;

            return product.save();
        })
        .then(savingResult => {
            res.redirect('../products'); 
        })
        .catch(err=>console.log(err));
}

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
        .then(product=>{
            return product.destroy();
        })
        .then(delResult=>{
            res.redirect('../products');
        })
        .catch(err=>{console.log(err)});
}

exports.getMainPage = (req, res)=>{
   Product.findAll()
    .then((products)=>{
        res.render('shop/index', {
            products, 
            pageTitle: "Shop", 
            path: '/', 
            hasProducts: products.length >0, 
            activeShop: true,
            formsCSS: true, 
            productCSS: true
        })
    });
};

exports.getCart = (req, res)=>{
    req.user.getCart()
        .then(cart=>{
            return cart.getProducts();   
        })
        .then(products=>{
            res.render('shop/cart', {
                pageTitle: "Your cart", 
                path: '/cart',
                products: products
            });            
        })
        .catch(err=>{
            console.log(err);
        });
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         for (product of products) {
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if (cartProductData) {
    //                 cartProducts.push({productData: product, quantity: cartProductData.quantity});
    //             };
    //         }
    //         res.render('shop/cart', {
    //             pageTitle: "Your cart", 
    //             path: '/cart',
    //             products: cartProducts
    //         });
    //     });
    // })
 };

exports.postCart = (req, res, next)=>{
    const productId = req.body.productId;
    Product.findById(productId, (product => {
        Cart.addProduct(productId, product.price);
        res.redirect('/cart');
    }));
}

exports.postCartDeleteItem = (req, res) => {
    const prodId = req.body.productId; 
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res)=>{
    res.render('shop/orders', {
        pageTitle: "Orders", 
        path: '/orders'
    });
 };
 
exports.getProductList = (req, res)=>{
    Product.findAll()
    .then(products=>{
        res.render('shop/product-list', {
            products, 
            pageTitle: "Products", 
            path: '/products', 
            hasProducts: products.length >0, 
            activeShop: true,
            formsCSS: true, 
            productCSS: true
        })
    });
 };

exports.getProduct = (req, res, next) => {
    const productId = req.params.productID;
    Product.findByPk(productId)
        .then((product) => {
            if (!product){
                return res.redirect('/');
            }
    
            res.render('shop/product-detail', {
                pageTitle: 'Product detail',
                path: '/products',
                product: product
            });
        })
        .catch(err=> console.log(err));
}
