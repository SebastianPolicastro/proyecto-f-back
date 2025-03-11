const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const EventEmitter = require('events');
const methodOverride = require('method-override');
const session = require('express-session');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const viewRoutes = require('./routes/views.router');

// Importar CartManager
const CartManager = require('./managers/CartManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const eventEmitter = new EventEmitter();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1); // Salir del proceso si no se puede conectar a MongoDB
  });

const hbs = engine({
  layoutsDir: __dirname + '/views/layouts',
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    eq: (a, b) => a == b
  }
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Middleware to set cartId for all views
app.use(async (req, res, next) => {
  try {
    if (!req.session.cartId) {
      const newCart = await new CartManager().createCart();
      req.session.cartId = newCart._id.toString();
    }
    res.locals.cartId = req.session.cartId;
    next();
  } catch (error) {
    console.error('Error setting cartId:', error);
    next(error);
  }
});

app.use(express.static(__dirname + '/public'));

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', viewRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal server error');
});

module.exports = { app, server, eventEmitter };