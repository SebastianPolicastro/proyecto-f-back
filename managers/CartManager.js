const Cart = require('../models/cart');

class CartManager {
    async getAllCarts(page = 1, limit = 10) {
        const carts = await Cart.find()
            .skip((page - 1) * limit)
            .limit(limit);
        return carts;
    }

    async getCartById(id) {
        const cart = await Cart.findById(id).populate('products.product');
        return cart;
    }

    async createCart() {
        const cart = new Cart({ products: [] });
        await cart.save();
        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (existingProductIndex >= 0) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }

    async updateProductInCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            const productInCart = cart.products.find(p => p.product.toString() === productId);
            if (!productInCart) throw new Error('Product not found in cart');

            productInCart.quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error updating product in cart: ' + error.message);
        }
    }

    async deleteProductFromCart(cartId, productId, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            const productInCart = cart.products.find(p => p.product.toString() === productId);
            if (!productInCart) throw new Error('Product not found in cart');

            if (productInCart.quantity > quantity) {
                productInCart.quantity -= quantity;
            } else {
                cart.products = cart.products.filter(p => p.product.toString() !== productId);
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error deleting product from cart: ' + error.message);
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error clearing cart: ' + error.message);
        }
    }
}

module.exports = CartManager;