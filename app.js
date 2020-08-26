const path          = require('path');

const express       = require('express');
const bodyParser    = require('body-parser');
   
const app           = express();

const mongoConnect  = require('./utils/database').mongoConnect;
const User          = require('./models/user');
app.set('view engine', 'ejs');
app.set('views', 'views');

//Routes
const adminRoutes   = require('./routes/admin');
const shopRoutes    = require('./routes/shop');
const errorsController = require('./controllers/errors');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findUserById("5f4642ab6e96b8b03e167bbd")
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err=>{
        console.log(err);
    })
});

 app.use('/admin', adminRoutes);
 app.use(shopRoutes);

 app.use(errorsController.getPageNotFound);

mongoConnect(()=> {
    app.listen(3000);
});