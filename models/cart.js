const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
            //Fetch the previous cart
            fs.readFile(p, (err, fileContent)=>{
                let cart = {products: [], totalPrice: 0}
                if (!err){
                    cart = JSON.parse(fileContent);
                }; 
        
            //Analyze the cart => Find existing products
            const existingProductIndex = cart.products.findIndex(prod=>{
                return prod.id === id;
            });
            const existingProduct = cart.products[existingProductIndex];

            // Add new / increase quantity        
            let updatedProduct;
            
            if (existingProduct) {
                updatedProduct = {...existingProduct} ;
                updatedProduct.quantity += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }else{
                updatedProduct = {
                    id: id,
                    quantity: 1 
                };
                cart.products = [...cart.products, updatedProduct];
            };

            cart.totalPrice += +productPrice;
            fs.writeFile(p,  JSON.stringify(cart), err => {
                console.log(err);
            })
        });
    };

    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent)=>{
            if (err){
                return;
            };

            const cart = JSON.parse(fileContent);
            const updatedCart = {...cart};
            const product = updatedCart.products.find(prod=> prod.id === id);
            if (product) {
                const productQty = product.quantity;
                updatedCart.products = cart.products.filter(prod => prod.id !== id);  
                updatedCart.totalPrice -= +productPrice *  productQty;
                
                fs.writeFile(p,  JSON.stringify(updatedCart), err => {
                    console.log(err);
                })
            };
        });      
    };

    static getCart(callback) {
        fs.readFile(p, (err, fileContent)=>{
            const cart = JSON.parse(fileContent);
            if (err){
                callback(null);
            }else{
                callback(cart);
            }; 
        });
    };

};