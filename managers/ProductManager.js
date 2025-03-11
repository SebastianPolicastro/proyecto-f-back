const Product = require('../models/product');

class ProductManager {
    async getAllProducts(page = 1, limit = 10, filters = {}, sort = {}) {
        try {
            const query = {};
            if (filters.title) query.title = { $regex: filters.title, $options: 'i' };
            if (filters.category) query.category = filters.category;
            if (filters.status !== undefined) query.status = filters.status;
            if (filters.minPrice) query.price = { $gte: filters.minPrice };
            if (filters.maxPrice) {
                query.price = query.price || {};
                query.price.$lte = filters.maxPrice;
            }

            const sortOptions = {};
            if (sort.price) sortOptions.price = sort.price === 'asc' ? 1 : -1;

            const products = await Product.find(query)
                .sort(sortOptions)
                .skip((page - 1) * limit)
                .limit(limit);
            return products;
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) throw new Error('Product not found');
            return product;
        } catch (error) {
            throw new Error('Error fetching product by ID: ' + error.message);
        }
    }

    async addProduct(productData) {
        try {
            if (!productData.title || !productData.price || !productData.category) {
                throw new Error('Missing required product data');
            }
            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            throw new Error('Error adding product: ' + error.message);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!product) throw new Error('Product not found');
            return product;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            await Product.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }
}

module.exports = ProductManager;