<template>
  <div class="product_reviews">
    <div class="review_header">
      <h3>Müşteri Yorumları ({{ totalReviews }})</h3>
      <div class="review_summary">
        <div class="rating_summary">
          <div class="average_rating">
            <h4>{{ averageRating }}</h4>
            <div class="stars">
              <star-rating
                :increment="0.1"
                :rating="Number(averageRating)"
                :read-only="true"
                :show-rating="false"
                :star-size="18"
                active-color="#f79837"
                inactive-color="#e0e0e0"
              ></star-rating>
            </div>
            <p>{{ totalReviews }} değerlendirme</p>
          </div>
          <div class="rating_distribution">
            <div v-for="n in 5" :key="n" class="rating_bar">
              <span class="rating_label">{{ 6-n }}</span>
              <div class="progress">
                <div
                  class="progress-bar"
                  :style="{
                    width: getRatingPercentage(6-n) + '%',
                    backgroundColor: '#f79837'
                  }"
                ></div>
              </div>
              <span class="rating_count">{{ getRatingCount(6-n) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="review_list mt-4">
      <div v-if="reviews.length === 0" class="no_reviews text-center py-4">
        <p>Bu ürün için henüz yorum yapılmamış.</p>
      </div>
      
      <div v-else class="reviews">
        <div v-for="(review, index) in reviews" :key="index" class="review_item">
          <div class="review_header">
            <div class="reviewer_info">
              <h5>{{ review.title || 'Değerlendirme' }}</h5>
              <div class="review_meta">
                <span class="reviewer_name">{{ review.userName }}</span>
                <span class="review_date">{{ formatDate(review.createdAt) }}</span>
              </div>
              <div class="reviewer_rating">
                <star-rating
                  :increment="1"
                  :rating="Number(review.rating)"
                  :read-only="true"
                  :show-rating="false"
                  :star-size="16"
                  active-color="#f79837"
                  inactive-color="#e0e0e0"
                ></star-rating>
              </div>
            </div>
          </div>
          <div class="review_content">
            <p>{{ review.comment }}</p>
          </div>
          <div v-if="isOwner(review.userId)" class="review_actions">
            <button @click="editReview(review)" class="btn btn-sm btn-outline-secondary mr-2">
              <i class="fas fa-edit"></i> Düzenle
            </button>
            <button @click="deleteReview(review.id)" class="btn btn-sm btn-outline-danger">
              <i class="fas fa-trash-alt"></i> Sil
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="review_form_wrapper mt-4">
      <div v-if="!isAuthenticated" class="login_to_review text-center py-3">
        <p>Yorum yapabilmek için <nuxt-link to="/login">giriş yapın</nuxt-link></p>
      </div>

      <div v-else-if="alreadyReviewed && !editingReview" class="already_reviewed py-3">
        <p class="text-info">
          <i class="fas fa-info-circle"></i> Bu ürünü zaten değerlendirdiniz.
          <button @click="editUserReview()" class="btn btn-link p-0 ml-2">Yorumunuzu düzenleyin</button>
        </p>
      </div>

      <div v-else>
        <h4 class="mb-3">{{ editingReview ? 'Yorumunuzu Düzenleyin' : 'Değerlendirme Yazın' }}</h4>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label>Puanınız</label>
            <div class="rating_input">
              <star-rating
                :increment="1"
                v-model="reviewForm.rating"
                :show-rating="false"
                :star-size="24"
                active-color="#f79837"
                inactive-color="#e0e0e0"
              ></star-rating>
            </div>
          </div>
          <div class="form-group">
            <label for="reviewTitle">Başlık</label>
            <input
              type="text"
              id="reviewTitle"
              v-model="reviewForm.title"
              class="form-control"
              placeholder="Değerlendirmeniz için başlık girin"
            >
          </div>
          <div class="form-group">
            <label for="reviewComment">Yorumunuz</label>
            <textarea
              id="reviewComment"
              v-model="reviewForm.comment"
              class="form-control"
              rows="4"
              placeholder="Ürün hakkında deneyiminizi paylaşın"
              required
            ></textarea>
          </div>
          <div class="form-group text-right">
            <button v-if="editingReview" type="button" @click="cancelEdit" class="btn btn-secondary mr-2">
              İptal
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting">
                <i class="fas fa-spinner fa-spin mr-2"></i>Gönderiliyor...
              </span>
              <span v-else>
                {{ editingReview ? 'Güncelle' : 'Gönder' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating';
import { mapGetters } from 'vuex';

export default {
  name: 'ReviewSection',
  components: {
    StarRating
  },
  props: {
    productId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      reviews: [],
      reviewForm: {
        id: null,
        productId: this.productId,
        rating: 5,
        title: '',
        comment: ''
      },
      editingReview: false,
      isSubmitting: false,
      error: null
    };
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated',
      user: 'user/currentUser'
    }),
    
    totalReviews() {
      return this.reviews.length;
    },
    
    averageRating() {
      if (this.reviews.length === 0) return 0;
      const total = this.reviews.reduce((sum, review) => sum + Number(review.rating), 0);
      return Number((total / this.reviews.length).toFixed(1));
    },
    
    alreadyReviewed() {
      return this.user && this.reviews.some(review => review.userId === this.user.id);
    },
    
    userReview() {
      if (!this.user) return null;
      return this.reviews.find(review => review.userId === this.user.id);
    }
  },
  async mounted() {
    this.loadReviews();
  },
  methods: {
    async loadReviews() {
      try {
        if (!this.productId) {
          console.warn('Geçerli bir ürün ID\'si yok');
          this.reviews = [];
          return;
        }
        
        const response = await this.$axios.$get(`/api/reviews/product/${this.productId}`);
        this.reviews = response;
      } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
        this.error = 'Yorumlar yüklenemedi.';
        this.reviews = [];
      }
    },
    
    async submitReview() {
      if (!this.reviewForm.comment) {
        this.$toast.error('Lütfen yorumunuzu yazın.');
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        if (this.editingReview) {
          // Yorum güncelleme
          await this.$axios.$put(`/api/reviews/${this.reviewForm.id}`, {
            id: this.reviewForm.id,
            userId: this.user.id,
            rating: this.reviewForm.rating,
            title: this.reviewForm.title,
            comment: this.reviewForm.comment
          });
          
          this.$toast.success('Yorumunuz güncellendi.');
          
          // Emit event to notify parent component that reviews have changed
          this.$emit('reviews-updated');
        } else {
          // Yeni yorum
          await this.$axios.$post('/api/reviews', {
            productId: this.productId,
            userId: this.user.id,
            rating: this.reviewForm.rating,
            title: this.reviewForm.title,
            comment: this.reviewForm.comment
          });
          
          this.$toast.success('Yorumunuz başarıyla eklendi.');
          
          // Emit event to notify parent component that reviews have changed
          this.$emit('reviews-updated');
        }
        
        // Review form'u temizle, listele ve editleme modunu kapat
        this.resetForm();
        this.editingReview = false;
        this.loadReviews();
      } catch (error) {
        console.error('Yorum gönderirken hata oluştu:', error);
        this.$toast.error('Yorum gönderilirken bir hata oluştu.');
      } finally {
        this.isSubmitting = false;
      }
    },
    
    editReview(review) {
      this.editingReview = true;
      this.reviewForm = {
        id: review.id,
        productId: review.productId,
        rating: review.rating,
        title: review.title || '',
        comment: review.comment
      };
    },
    
    editUserReview() {
      if (this.userReview) {
        this.editReview(this.userReview);
      }
    },
    
    async deleteReview(reviewId) {
      if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
        return;
      }
      
      try {
        await this.$axios.$delete(`/api/reviews/${reviewId}?userId=${this.user.id}`);
        
        this.$toast.success('Yorumunuz silindi.');
        
        // Emit event to notify parent component that reviews have changed
        this.$emit('reviews-updated');
        
        // Yorumları yeniden yükle
        await this.loadReviews();
      } catch (error) {
        console.error('Yorum silinirken hata:', error);
        this.$toast.error('Yorumunuz silinirken bir hata oluştu.');
      }
    },
    
    cancelEdit() {
      this.editingReview = false;
      this.resetForm();
    },
    
    resetForm() {
      this.editingReview = false;
      this.reviewForm = {
        id: null,
        productId: this.productId,
        rating: 5,
        title: '',
        comment: ''
      };
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    },
    
    isOwner(userId) {
      return this.user && this.user.id === userId;
    },
    
    getRatingCount(rating) {
      return this.reviews.filter(review => review.rating === rating).length;
    },
    
    getRatingPercentage(rating) {
      if (this.totalReviews === 0) return 0;
      return (this.getRatingCount(rating) / this.totalReviews) * 100;
    }
  }
};
</script>

<style scoped>
.product_reviews {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

.review_header {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.review_summary {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-top: 20px;
}

.rating_summary {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.average_rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 30px;
  border-right: 1px solid #eee;
  margin-right: 30px;
  min-width: 150px;
}

.average_rating h4 {
  font-size: 36px;
  margin: 0;
  color: #333;
}

.average_rating p {
  color: #666;
  margin-top: 5px;
}

.rating_distribution {
  flex: 1;
}

.rating_bar {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.rating_label {
  min-width: 25px;
  text-align: center;
}

.progress {
  flex: 1;
  height: 10px;
  margin: 0 10px;
  border-radius: 5px;
  background-color: #f0f0f0;
}

.rating_count {
  min-width: 30px;
  text-align: right;
  color: #666;
}

.review_item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.review_item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.reviewer_info {
  margin-bottom: 10px;
}

.reviewer_info h5 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.review_meta {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.reviewer_name {
  font-weight: 500;
}

.review_date {
  margin-left: 10px;
  color: #999;
}

.review_content {
  color: #555;
  line-height: 1.6;
}

.review_actions {
  margin-top: 10px;
  display: flex;
}

.rating_input {
  margin-bottom: 15px;
}

.no_reviews {
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 20px;
  color: #666;
}

.login_to_review, .already_reviewed {
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 15px;
}

.login_to_review a {
  color: #f79837;
  text-decoration: none;
  font-weight: 500;
}

.login_to_review a:hover {
  text-decoration: underline;
}

@media (max-width: 767px) {
  .average_rating {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 15px;
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .review_summary {
    flex-direction: column;
  }
  
  .rating_distribution {
    width: 100%;
  }
}
</style> 