const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');

router.get('/products', productsController.getProductList);

//router.get('/products/:delete')

router.get('/products/:productID', productsController.getProduct);

router.get('/cart', productsController.getCart);
router.post('/cart', productsController.postCart);
router.post('/cart-delete-item', productsController.postCartDeleteItem);
router.get('/orders', productsController.getOrders);
router.post('/create-order', productsController.postOrder);
router.get('/', productsController.getMainPage);

module.exports = router; 