import axios from 'axios';

const API_URL = 'https://fakestoreapi.com';

export const cartService = {
    // Sepeti getir
    getCart() {
        return axios.get(`${API_URL}/carts/1`);
    },

    // Sepete ürün ekle
    addToCart(payload) {
        if (!payload || !payload.product) {
            return Promise.reject(new Error('Geçersiz ürün verisi'));
        }

        const { product, qty } = payload;
        
        return axios.post(`${API_URL}/carts`, {
            userId: 1,
            date: new Date(),
            products: [{
                productId: product.id,
                quantity: qty || 1,
                price: product.price,
                title: product.title,
                image: product.image,
                selectedSize: product.selectedSize,
                selectedColor: product.selectedColor,
                isSale: product.isSale,
                discount: product.discount
            }]
        });
    },

    // Sepetten ürün çıkar
    removeFromCart(productId) {
        if (!productId) {
            return Promise.reject(new Error('Geçersiz ürün ID'));
        }
        return axios.delete(`${API_URL}/carts/${productId}`);
    },

    // Sepetteki ürün miktarını güncelle
    updateCartItem(productId, quantity) {
        if (!productId || !quantity) {
            return Promise.reject(new Error('Geçersiz ürün verisi'));
        }
        return axios.put(`${API_URL}/carts/${productId}`, {
            quantity: quantity
        });
    },

    // Sepeti temizle
    clearCart() {
        return axios.delete(`${API_URL}/carts/1`);
    }
}; 