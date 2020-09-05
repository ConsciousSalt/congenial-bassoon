const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        product: {type: Object, required: true},
        quantity: {type: Schema.Types.Number, required: true}
    }],
    user: {
        email: {
            type: Schema.Types.String,
            required: true             
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true            
        }       
    }
});

module.exports = mongoose.model('Order', orderSchema);