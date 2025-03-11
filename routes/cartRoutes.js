const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

router.get('/', async (req, res) => {
    try {
        const { page, limit } = req.query;
        const carts = await cartManager.getAllCarts(Number(page), Number(limit));
        res.json(carts);
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ error: 'Error al obtener carritos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.id);
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ error: 'Error al obtener carrito' });
    }
});

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.json(cart);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ error: 'Error al crear carrito' });
    }
});

router.post('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(cart);
    } catch (error) {
        console.error('Error al añadir producto al carrito:', error);
        res.status(500).json({ error: 'Error al añadir producto al carrito' });
    }
});

router.put('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.updateProductInCart(cartId, productId, quantity);
        res.json(cart);
    } catch (error) {
        console.error('Error al actualizar producto en carrito:', error);
        res.status(500).json({ error: 'Error al actualizar producto en carrito' });
    }
});

router.delete('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.deleteProductFromCart(cartId, productId, quantity);
        res.json(cart);
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

router.post('/:cartId/clear', async (req, res) => {
    try {
        const { cartId } = req.params;
        const cart = await cartManager.clearCart(cartId);
        res.json(cart);
    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        res.status(500).json({ error: 'Error al vaciar carrito' });
    }
});

module.exports = router;