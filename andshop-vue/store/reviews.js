export const state = () => ({
  reviews: [],
  productReviews: {},
  loading: false,
  error: null
})

export const mutations = {
  SET_REVIEWS(state, reviews) {
    state.reviews = reviews
  },
  SET_PRODUCT_REVIEWS(state, { productId, reviews }) {
    state.productReviews = {
      ...state.productReviews,
      [productId]: reviews
    }
  },
  ADD_REVIEW(state, review) {
    state.reviews.push(review)
    
    // Ürüne ait yorumları da güncelle
    if (state.productReviews[review.productId]) {
      state.productReviews[review.productId].push(review)
    }
  },
  UPDATE_REVIEW(state, updatedReview) {
    // Tüm yorumları güncelle
    const index = state.reviews.findIndex(r => r.id === updatedReview.id)
    if (index !== -1) {
      state.reviews.splice(index, 1, updatedReview)
    }
    
    // Ürüne ait yorumları da güncelle
    if (state.productReviews[updatedReview.productId]) {
      const prodIndex = state.productReviews[updatedReview.productId].findIndex(r => r.id === updatedReview.id)
      if (prodIndex !== -1) {
        state.productReviews[updatedReview.productId].splice(prodIndex, 1, updatedReview)
      }
    }
  },
  REMOVE_REVIEW(state, { reviewId, productId }) {
    // Tüm yorumlardan kaldır
    state.reviews = state.reviews.filter(r => r.id !== reviewId)
    
    // Ürüne ait yorumlardan kaldır
    if (state.productReviews[productId]) {
      state.productReviews[productId] = state.productReviews[productId].filter(r => r.id !== reviewId)
    }
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchReviews({ commit }) {
    try {
      commit('SET_LOADING', true)
      const reviews = await this.$axios.$get('/api/reviews')
      commit('SET_REVIEWS', reviews)
      commit('SET_ERROR', null)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      commit('SET_ERROR', error.message || 'Yorumlar yüklenirken bir hata oluştu')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async fetchProductReviews({ commit, state }, productId) {
    try {
      commit('SET_LOADING', true)
      
      // Zaten bu ürüne ait yorumlar yüklendiyse tekrar yükleme
      if (state.productReviews[productId]) {
        commit('SET_LOADING', false)
        return state.productReviews[productId]
      }
      
      const reviews = await this.$axios.$get(`/api/reviews/product/${productId}`)
      commit('SET_PRODUCT_REVIEWS', { productId, reviews })
      commit('SET_ERROR', null)
      return reviews
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error)
      commit('SET_ERROR', error.message || 'Ürün yorumları yüklenirken bir hata oluştu')
      return []
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async addReview({ commit }, reviewData) {
    try {
      commit('SET_LOADING', true)
      const newReview = await this.$axios.$post('/api/reviews', reviewData)
      commit('ADD_REVIEW', newReview)
      commit('SET_ERROR', null)
      return newReview
    } catch (error) {
      console.error('Error adding review:', error)
      commit('SET_ERROR', error.message || 'Yorum eklenirken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateReview({ commit }, { reviewId, reviewData }) {
    try {
      commit('SET_LOADING', true)
      const updatedReview = await this.$axios.$put(`/api/reviews/${reviewId}`, reviewData)
      commit('UPDATE_REVIEW', updatedReview)
      commit('SET_ERROR', null)
      return updatedReview
    } catch (error) {
      console.error(`Error updating review ${reviewId}:`, error)
      commit('SET_ERROR', error.message || 'Yorum güncellenirken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async deleteReview({ commit }, { reviewId, productId, userId }) {
    try {
      commit('SET_LOADING', true)
      await this.$axios.$delete(`/api/reviews/${reviewId}?userId=${userId}`)
      commit('REMOVE_REVIEW', { reviewId, productId })
      commit('SET_ERROR', null)
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error)
      commit('SET_ERROR', error.message || 'Yorum silinirken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export const getters = {
  getReviews: state => state.reviews,
  getProductReviews: state => productId => state.productReviews[productId] || [],
  isLoading: state => state.loading,
  getError: state => state.error
} 