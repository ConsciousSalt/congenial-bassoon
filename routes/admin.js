const express = require('express');
const router = express.Router();

const productsContoller = require('../controllers/products');

// /admin/add-product => GET
router.get('/add-product', productsContoller.getAddProducts);
router.get('/edit-product/:productId', productsContoller.getEditProduct);
router.get('/products', productsContoller.getProducts);

// /admin/add-product => POST
router.post('/add-product', productsContoller.postAddProduct);
router.post('/edit-product/:productId', productsContoller.postEditProduct);
router.post('/delete-product', productsContoller.postDeleteProduct);


module.exports  = router;