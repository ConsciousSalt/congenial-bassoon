const Product = require('../models/product');


//const Cart = require('../models/cart');
// const Order = require('../models/order');

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
    Product.findById(productId)
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
     Product.fetchAll()
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

    const product = new Product(title, price, description, imageURL);

    // Product.create({
    product.save()
    .then(response=>{
        res.redirect('/admin/products');
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

    const product = new Product(
                                title, 
                                price, 
                                description, 
                                imageURL, 
                                productId);
    product.save()
        .then(savingResult => {
            res.redirect('/admin/products'); 
        })
        .catch(err=>console.log(err));
}

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.productId;
    Product.deleteById(productId)
        .then(delResult=>{
            res.redirect('/admin/products');
        })
        .catch(err=>{console.log(err)});
}

exports.getMainPage = (req, res)=>{
   Product.fetchAll()
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

// exports.getCart = (req, res)=>{
//     req.user.getCart()
//         .then(cart=>{
//             return cart.getProducts();   
//         })
//         .then(products=>{
//             console.log('cart prods', products);
            
//             res.render('shop/cart', {
//                 pageTitle: "Your cart", 
//                 path: '/cart',
//                 products: products
//             });            
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     // Cart.getCart(cart => {
//     //     Product.fetchAll(products => {
//     //         const cartProducts = [];
//     //         for (product of products) {
//     //             const cartProductData = cart.products.find(prod => prod.id === product.id);
//     //             if (cartProductData) {
//     //                 cartProducts.push({productData: product, quantity: cartProductData.quantity});
//     //             };
//     //         }
//     //         res.render('shop/cart', {
//     //             pageTitle: "Your cart", 
//     //             path: '/cart',
//     //             products: cartProducts
//     //         });
//     //     });
//     // })
//  };

// exports.postCart = (req, res, next)=>{
//     const productId = req.body.productId;
//     let fetchedCart;
//     let newQuantity = 1;

//     req.user.getCart()
//         .then(cart=>{
//             console.log('fetching cart');
//             fetchedCart = cart;
//             return cart.getProducts({where:{id: productId}});
//         })
//         .then(products => {
//             let product;
//             if (products.length > 0){
//                 product = products[0];    
//             }
            
//             if (product){
//                 const oldQuantity = product.cartItem.quantity;
//                 console.log('old qauntity', product.cartItem.quantity);
//                 newQuantity = oldQuantity + 1;
//                 return product;
//             }
//             return Product.findByPk(productId);
//         })
//         .then(product=>{
//             return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
//         })
//         .then(cart=>{
//             res.redirect('/cart');        
//         })
//         .catch(err=>console.log(err));


//     // Product.findById(productId, (product => {
//     //     Cart.addProduct(productId, product.price);
//     //     res.redirect('/cart');
//     // }));
// }

// exports.postCartDeleteItem = (req, res) => {
//     const prodId = req.body.productId; 
//     req.user.getCart()
//     .then(cart=>{
//         return cart.getProducts({where: {id: prodId}});
//     })
//     .then(products => {
//         const product = products[0];
//         return product.cartItem.destroy();
//     })
//     .then(result=>{
//         res.redirect('/cart');
//     })
//     .catch(err => {
//         console.log(err);
//     });

// };

// exports.getOrders = (req, res)=>{
//     req.user.getOrders({include: ['products']})
//     .then(orders => {
//         res.render('shop/orders', {
//             pageTitle: "Orders", 
//             path: '/orders',
//             orders: orders
//         });
//     })
//     .catch(err=>{console.log(err)})
//  };
 
exports.getProductList = (req, res)=>{
    Product.fetchAll()
    .then(products=>{
        console.log(products);

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
    Product.findById(productId)
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

// exports.postOrder = (req, res, next) => {
//     let fetchedCart;
//     req.user
//         .getCart()
//         .then(cart=>{
//             fetchedCart = cart;
//             return cart.getProducts();                                
//         })
//         .then(products => {
//             return req.user
//                 .createOrder()        
//                 .then(order=>{
//                     return order.addProducts(
//                         products.map(product=>{
//                             product.orderItem = {quantity: product.cartItem.quantity};
//                             return product;
//                         })
//                 );
//         })
//     })
//         .then(result => {
//             return fetchedCart.setProducts(null);
//         })
//         .then(result=>{

//             res.redirect("/orders")  
//         })
//         .catch(err=>{console.log(err)});    
// };
