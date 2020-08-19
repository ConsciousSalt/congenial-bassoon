const path          = require('path');

const express       = require('express');
const bodyParser    = require('body-parser');

const sequelize = require('./utils/database');

const Product   = require("./models/product");
const User      = require("./models/user");
const Cart      = require("./models/cart");
const CartItem  = require("./models/cart-item");
const Order     = require("./models/order");
const OrderItem = require("./models/order-item");    
const app           = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

//Routes
const adminRoutes   = require('./routes/admin');
const shopRoutes    = require('./routes/shop');
const errorsController = require('./controllers/errors');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    })
    .catch(err=>{console.log(err)});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.getPageNotFound);

Product.belongsTo(User, {constrains: true, onDelete: 'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User); //optional

Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

sequelize.sync(/* {force: true} */)
    .then(result => {
        return User.findByPk(1);
        
    })
    .then(user => {
        if(!user){
            return User.create({
                name: "Mileena",
                email: 'kitanabitch@shang.com'    
            });
        }
        return Promise.resolve(user);
    })
    .then(user => {
        
        return user.createCart();
    })
    .then(cart => {
        
        app.listen(3000);
    })
    .catch(err=> console.log(err));