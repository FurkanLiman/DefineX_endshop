<template>
  <div>
    <!-- Banner Area -->
    <section id="common_banner_one">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="common_banner_text">
              <h2>Sipariş Tamamlandı</h2>
              <b-breadcrumb :items="breadcrumbItems" class="bg-transparent"></b-breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Order Success Area -->
    <section id="order_success_area" class="ptb-100">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <div class="order_success_content text-center">
              <div class="order_success_icon mb-4">
                <i class="fas fa-check-circle fa-5x text-success"></i>
              </div>
              <h2 class="mb-3">Siparişiniz Başarıyla Oluşturuldu!</h2>
              <p class="mb-4">Sipariş numaranız: <strong>{{ orderId }}</strong></p>
              
              <div v-if="order" class="order_details bg-light p-4 text-left mb-4">
                <h4 class="mb-3">Sipariş Detayları</h4>
                <div class="row">
                  <div class="col-md-6">
                    <p><strong>Sipariş No:</strong> #{{ order.id }}</p>
                    <p><strong>Sipariş Tarihi:</strong> {{ formatDate(order.orderDate) }}</p>
                    <p><strong>Ödeme Yöntemi:</strong> {{ getPaymentMethodText(order.paymentMethod) }}</p>
                    <p><strong>Ödeme Durumu:</strong> <span :class="'badge ' + getPaymentStatusClass(order.paymentStatus)">{{ getPaymentStatusText(order.paymentStatus) }}</span></p>
                    <p><strong>Sipariş Durumu:</strong> <span :class="'badge ' + getStatusClass(order.status)">{{ getStatusText(order.status) }}</span></p>
                    <p v-if="order.trackingNumber"><strong>Takip Numarası:</strong> {{ order.trackingNumber }}</p>
                  </div>
                  <div class="col-md-6">
                    <p><strong>Ara Toplam:</strong> {{ formatPrice(calculateSubtotal()) }} TL</p>
                    <p v-if="order.discountAmount && order.discountAmount > 0">
                      <strong>İndirim:</strong> <span class="text-danger">-{{ formatPrice(order.discountAmount) }} TL</span>
                    </p>
                    <p v-if="order.shippingCost && order.shippingCost > 0">
                      <strong>Kargo Ücreti:</strong> {{ formatPrice(order.shippingCost) }} TL
                    </p>
                    <p><strong>Toplam Tutar:</strong> <span class="text-primary font-weight-bold">{{ formatPrice(order.totalAmount) }} TL</span></p>
                    <p v-if="order.couponCode"><strong>Kullanılan Kupon:</strong> {{ order.couponCode }}</p>
                  </div>
                </div>
                
                <h5 class="mt-4 mb-3">Teslimat Bilgileri</h5>
                <div class="row">
                  <div class="col-md-6">
                    <p v-if="order.user"><strong>Sipariş Veren:</strong> {{ order.user.firstName }} {{ order.user.lastName }}</p>
                    <p v-if="order.address"><strong>Telefon:</strong> {{ formatPhoneNumber(order.address.phone) }}</p>
                    <p v-else-if="order.user"><strong>Telefon:</strong> {{ formatPhoneNumber(order.user.phone) }}</p>
                  </div>
                  <div class="col-md-6">
                    <p v-if="order.address"><strong>Adres:</strong> {{ order.address.address }}</p>
                    <p v-if="order.address"><strong>İlçe/İl:</strong> {{ order.address.district }}/{{ order.address.city }}</p>
                    <p v-if="order.address"><strong>Posta Kodu:</strong> {{ order.address.zipCode }}</p>
                    <p v-if="order.address"><strong>Ülke:</strong> {{ order.address.country }}</p>
                  </div>
                </div>
                
                <h5 class="mt-4 mb-3">Ürünler</h5>
                <div class="table-responsive">
                  <table class="table table-bordered">
                    <thead class="bg-light">
                      <tr>
                        <th>Ürün</th>
                        <th>Adet</th>
                        <th>Fiyat</th>
                        <th>Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in orderItems" :key="index">
                        <td>
                          <div class="d-flex align-items-center">
                            <img 
                              :src="getProductImage(item)"
                              :alt="item.product ? item.product.title : 'Ürün'"
                              style="width: 50px; height: 50px; object-fit: cover;"
                              class="mr-2"
                            >
                            <div>
                              <div>{{ item.product ? item.product.title : 'Ürün' }}</div>
                              <small v-if="item.size" class="text-muted">Beden: {{ item.size }}</small>
                              <small v-if="item.color" class="text-muted d-block">Renk: {{ item.color }}</small>
                            </div>
                          </div>
                        </td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ formatPrice(item.price) }} TL</td>
                        <td>{{ formatPrice(item.price * item.quantity) }} TL</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div v-else class="alert alert-warning">
                Sipariş detayları yüklenirken bir sorun oluştu.
              </div>
              
              <div class="action_buttons mt-4">
                <nuxt-link to="/profile?tab=orders" class="theme-btn-one btn-black-overlay btn_md mr-3">
                  Siparişlerim
                </nuxt-link>
                <nuxt-link to="/" class="theme-btn-one bg-gold btn_md">
                  Alışverişe Devam Et
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'OrderSuccess',
  middleware: 'auth',
  
  data() {
    return {
      breadcrumbItems: [
        { text: 'Anasayfa', to: '/' },
        { text: 'Ödeme', to: '/checkout' },
        { text: 'Sipariş Tamamlandı', active: true }
      ],
      orderId: null,
      isLoading: false
    };
  },
  
  computed: {
    ...mapGetters({
      order: 'order/currentOrder',
      isOrderLoading: 'order/isLoading',
      orderError: 'order/error'
    }),
    
    orderItems() {
      // API'den gelen order.orderItems yapısını kontrol et
      if (!this.order) return [];
      
      // OrderItems doğrudan bir dizi ise
      if (Array.isArray(this.order.orderItems)) {
        return this.order.orderItems;
      } 
      // OrderItems bir nesne içinde $values olarak geliyorsa (JSON.NET formatı)
      else if (this.order.orderItems && this.order.orderItems.$values) {
        return this.order.orderItems.$values;
      }
      
      console.log('Order data:', JSON.stringify(this.order, null, 2));
      return [];
    }
  },
  
  async mounted() {
    this.orderId = this.$route.query.order_id;
    
    if (this.orderId) {
      try {
        this.isLoading = true;
        await this.getOrderById(this.orderId);
      } catch (error) {
        console.error('Sipariş yüklenirken hata:', error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  
  methods: {
    ...mapActions({
      getOrderById: 'order/getOrderById'
    }),
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },
    
    formatPrice(price) {
      if (typeof price !== 'number') {
        price = parseFloat(price) || 0;
      }
      return price.toFixed(2);
    },
    
    getPaymentMethodText(method) {
      const methods = {
        'credit_card': 'Kredi Kartı',
        'paypal': 'PayPal',
        'cash_on_delivery': 'Kapıda Ödeme',
        'bank_transfer': 'Banka Havalesi'
      };
      
      return methods[method] || method;
    },
    
    getStatusText(status) {
      const statuses = {
        'pending': 'Hazırlanıyor',
        'Beklemede': 'Hazırlanıyor',
        'processing': 'İşleniyor',
        'shipped': 'Kargoya Verildi',
        'delivered': 'Teslim Edildi',
        'cancelled': 'İptal Edildi',
        'İptal Edildi': 'İptal Edildi'
      };
      
      return statuses[status] || status;
    },
    
    getProductImage(item) {
      console.log('Item for image:', JSON.stringify(item, null, 2));
      
      // Product objesini kontrol et
      if (item.product) {
        // Product objesi içinde görsel varsa
        if (item.product.imageUrl) {
          return item.product.imageUrl;
        } else if (item.product.image) {
          return item.product.image;
        }
      }
      
      // OrderItem içinde doğrudan görsel varsa
      if (item.image) {
        if (typeof item.image === 'string' && item.image.startsWith('http')) {
          return item.image;
        }
        
        try {
          return require(`@/assets/img/${item.image}`);
        } catch (e) {
          // Öntanımlı görsel
          return '/img/product-placeholder.png';
        }
      }
      
      // Hiçbir görsel bulunamadı
      return '/img/product-placeholder.png';
    },
    
    formatPhoneNumber(phone) {
      if (!phone) return '';
      
      // Telefon numarasını temizle (sadece rakamları al)
      const cleaned = ('' + phone).replace(/\D/g, '');
      
      // Türk telefon formatı: (5XX) XXX XX XX
      if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}`;
      }
      
      return phone;
    },
    
    getStatusClass(status) {
      const classes = {
        'pending': 'badge-warning',
        'Beklemede': 'badge-warning',
        'processing': 'badge-info',
        'İşleniyor': 'badge-info',
        'shipped': 'badge-primary',
        'Kargoya Verildi': 'badge-primary',
        'delivered': 'badge-success',
        'Teslim Edildi': 'badge-success',
        'cancelled': 'badge-danger',
        'İptal Edildi': 'badge-danger'
      };
      
      return classes[status] || 'badge-secondary';
    },
    
    getPaymentStatusClass(status) {
      const classes = {
        'pending': 'badge-warning',
        'Beklemede': 'badge-warning',
        'processing': 'badge-info',
        'İşleniyor': 'badge-info',
        'completed': 'badge-success',
        'Tamamlandı': 'badge-success',
        'failed': 'badge-danger',
        'Başarısız': 'badge-danger',
        'refunded': 'badge-secondary',
        'İade Edildi': 'badge-secondary'
      };
      
      return classes[status] || 'badge-secondary';
    },
    
    getPaymentStatusText(status) {
      const statuses = {
        'pending': 'Beklemede',
        'Beklemede': 'Beklemede',
        'processing': 'İşleniyor',
        'İşleniyor': 'İşleniyor',
        'completed': 'Tamamlandı',
        'Tamamlandı': 'Tamamlandı',
        'failed': 'Başarısız',
        'Başarısız': 'Başarısız',
        'refunded': 'İade Edildi',
        'İade Edildi': 'İade Edildi'
      };
      
      return statuses[status] || status;
    },
    
    calculateSubtotal() {
      if (!this.order || !this.orderItems || this.orderItems.length === 0) return 0;
      
      // Ürünlerin toplam tutarını hesapla (indirim ve kargo ücreti olmadan)
      let subtotal = 0;
      this.orderItems.forEach(item => {
        subtotal += (item.price * item.quantity);
      });
      
      return subtotal;
    }
  }
};
</script>

<style scoped>
.order_success_icon {
  color: #28a745;
}

.order_details {
  border-radius: 8px;
}

.action_buttons {
  margin-top: 30px;
}
</style> 