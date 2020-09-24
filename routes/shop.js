const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');
const isAuth = require('../middleware/is-auth');

router.get('/products', productsController.getProductList);

//router.get('/products/:delete')

router.get('/products/:productID', productsController.getProduct);

router.get('/cart', isAuth, productsController.getCart);
router.post('/cart', isAuth, productsController.postCart);
router.post('/cart-delete-item', isAuth,productsController.postCartDeleteItem);
router.get('/orders', isAuth,productsController.getOrders);
router.get('/orders/:orderId', isAuth, productsController.getInvoce);
router.get('/checkout', isAuth, productsController.getCheckout);
router.post('/create-order', isAuth,productsController.postOrder);
router.get('/', productsController.getMainPage);

module.exports = router; 