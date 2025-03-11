const express = require('express');
const Product = require('../models/product');
const Cart = require('../models/cart');
const router = express.Router();

router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query, status } = req.query;
    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
    };

    const filter = {};
    if (query) {
        filter.$or = [
            { title: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') }
        ];
    }

    if (status === 'true' || status === 'false') {
        filter.status = status === 'true';
    }

    try {
        const products = await Product.paginate(filter, options);
        res.render('products', {
            products: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}&status=${status}` : null,
            nextLink: products.hasNextPage ? `/?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}&status=${status}` : null,
            cartId: res.locals.cartId
        });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort, query, status } = req.query;
    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
    };

    const filter = {};
    if (query) {
        filter.$or = [
            { title: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') }
        ];
    }

    if (status === 'true' || status === 'false') {
        filter.status = status === 'true';
    }

    try {
        const products = await Product.paginate(filter, options);
        res.render('products', {
            products: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}&status=${status}` : null,
            nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}&status=${status}` : null,
            cartId: res.locals.cartId
        });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('product', { product, cartId: res.locals.cartId });
    } catch (error) {
        res.status(500).send('Error al cargar el producto');
    }
});

router.post('/carts/:cartId/products', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart.findById(req.params.cartId);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += parseInt(quantity, 10);
        } else {
            cart.products.push({ product: productId, quantity: parseInt(quantity, 10) });
        }
        await cart.save();
        res.redirect('back');
    } catch (error) {
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

router.get('/carts/:id', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).populate('products.product');
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send('Error al cargar el carrito');
    }
});

module.exports = router;