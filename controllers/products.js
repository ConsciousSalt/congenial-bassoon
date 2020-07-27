const Product = require('../models/product');
const Cart = require('../models/cart');

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
        .then(([products]) => {
            console.log(products);
            const product = products[0];
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
     Product.fetchAll((products)=>{
        res.render('admin/products', {
            products, 
            pageTitle: "Admin products", 
            path: '/admin/products', 
            hasProducts: products.length >0, 
            activeShop: true,
            formsCSS: true, 
            productCSS: true
        });
   });

 };

exports.postAddProduct = (req, res, next)=> {
    const title         = req.body.title;
    const imageURL      = req.body.imageURL;
    const description   = req.body.description;
    const price         = req.body.price;

    const product = new Product(null, title, imageURL, description, price);
    product
    .save()
        .then(()=>{res.redirect('/')})
        .catch(err=>console.log(err));
};

exports.postEditProduct = (req, res) => {
    const productId = req.params.productId;
    const title         = req.body.title;
    const imageURL      = req.body.imageURL;
    const description   = req.body.description;
    const price         = req.body.price;

    const product = new Product(productId, title, imageURL, description, price);
    product.save();
    res.redirect('../products'); 
}

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect('../products');
}

exports.getMainPage = (req, res)=>{
   Product.fetchAll()
    .then(([products, fieldData])=>{
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
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, quantity: cartProductData.quantity});
                };
            }
            res.render('shop/cart', {
                pageTitle: "Your cart", 
                path: '/cart',
                products: cartProducts
            });
        });
    })
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
    Product.fetchAll()
    .then(([products, fieldData])=>{
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
        .then(([products]) => {
            console.log(products);
            const product = products[0];
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
