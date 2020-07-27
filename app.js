const path          = require('path');

const express       = require('express');
const bodyParser    = require('body-parser');

const sequelize = require('./utils/database');

const app           = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

//Routes
const adminRoutes   = require('./routes/admin');
const shopRoutes    = require('./routes/shop');
const errorsController = require('./controllers/errors');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.getPageNotFound);

sequelize.sync()
    .then(result => {
        console.log(result)
        app.listen(3000);
    })
    .catch(err=> console.log(err));