const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const { page, limit, sort, ...filters } = req.query;
        const sortOptions = sort ? { price: sort } : {};
        const products = await productManager.getAllProducts(Number(page), Number(limit), filters, sortOptions);
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.title || !req.body.price) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }
        const product = await productManager.addProduct(req.body);
        res.json(product);
    } catch (error) {
        console.error('Error al añadir producto:', error);
        res.status(500).json({ error: 'Error al añadir producto' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!req.body.title && !req.body.price) {
            return res.status(400).json({ error: 'No hay datos para actualizar' });
        }
        const product = await productManager.updateProduct(req.params.id, req.body);
        res.json(product);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

module.exports = router;