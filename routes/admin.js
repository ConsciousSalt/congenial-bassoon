const express = require('express');
const router = express.Router();

const productsContoller = require('../controllers/products');
const isAuth = require('../middleware/is-auth');

// /admin/add-product => GET
router.get('/add-product', isAuth, productsContoller.getAddProducts);
router.get('/edit-product/:productId', isAuth, productsContoller.getEditProduct);
router.get('/products', isAuth, productsContoller.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, productsContoller.postAddProduct);
router.post('/edit-product/:productId', isAuth, productsContoller.postEditProduct);
router.post('/delete-product', isAuth, productsContoller.postDeleteProduct);


module.exports  = router;