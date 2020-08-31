const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true    
    },
    description: {
        type: String,
        require: false
    },
    imageURL: {
        type: String,
        require: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
// const getDb = require('../utils/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class Product {
//     constructor(title, price, description, imageURL, id, userId) {
//         this.title          = title;
//         this.price          = price;
//         this.description    = description;
//         this.imageURL       = imageURL;
//         this._id            = id ? new ObjectId(id):null;
//         this.userId         = userId;
//     };

//     save() {
//         const db = getDb();
//         let dbOperation;
//         if (this._id){
//             dbOperation = db
//                             .collection('products')
//                             .updateOne({_id: this._id}, {$set: this});
//         }else{
//             dbOperation = db.collection('products').insertOne(this)   
//         }
        
//         return dbOperation.then(result=>{
//             console.log(result);    
//         })
//         .catch(err => {
//             console.log(err);
//         });
//     };



//     static fetchAll() {
//         const db = getDb();
//         return db
//             .collection('products')
//             .find()
//             .toArray()
//             .then(products => {
//                 console.log(products);
//                 return products;
//             })
//             .catch(
//                 err=> {
//                     console.log(err)
//                 });
//     }

//     static findById(productId) {
//         console.log('productId', productId);
//         const db = getDb();
//         return db.collection('products')
//             .find({_id: new ObjectId(productId)})
//             .next()
//             .then(product => {
//                 console.log(product);
//                 return product;        
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     static deleteById(productId) {
//         const db = getDb();
//         return db
//             .collection('products')
//             .deleteOne({_id: new ObjectId(productId)})
//             .then(result=>{
//                 console.log('Deleted');
//             })
//             .catch(err=>{
//                 console.log(err);
//             });
//     }
// }

// module.exports = Product;