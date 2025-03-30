<template>
  <!-- No changes to template section -->
</template>

<script>
export default {
  // No changes to component options
};
</script>

<style>
  /* No changes to style section */
</style>

<script>
export default {
  methods: {
    async placeOrder() {
      if (!this.validateOrder()) {
        return;
      }
      
      this.isPlacingOrder = true;
      this.orderError = null;
      
      try {
        // Seçilen adresi al
        const selectedAddress = this.selectedAddress;
        
        // Sepet toplamı
        const cartTotal = this.cartTotalPrice;
        
        // İndirim kontrolü
        const discountAmount = this.couponDiscount || 0;
        
        // Kargo ücreti (sepet tutarına göre değişebilir)
        const shippingCost = this.getShippingCost(cartTotal);
        
        // Toplam tutar hesapla
        const totalAmount = cartTotal + shippingCost - discountAmount;
        
        // Sipariş nesnesi oluştur - API'nin beklediği formatta
        const orderData = {
          // Adres bilgileri
          fullName: selectedAddress.fullName,
          addressLine: selectedAddress.address,
          city: selectedAddress.city,
          district: selectedAddress.district,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country || 'TR',
          phone: selectedAddress.phone,
          email: selectedAddress.email,
          
          // Shipping alanları (eski model değiştirilemediği için iki seti de gönderiyoruz)
          shippingFullName: selectedAddress.fullName,
          shippingAddress: selectedAddress.address,
          shippingCity: selectedAddress.city,
          shippingDistrict: selectedAddress.district,
          shippingZipCode: selectedAddress.zipCode,
          shippingCountry: selectedAddress.country || 'TR',
          shippingPhone: selectedAddress.phone,
          shippingEmail: selectedAddress.email,
          
          // Ödeme bilgileri
          paymentMethod: this.paymentMethod,
          
          // Tutar bilgileri
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          shippingCost: parseFloat(shippingCost.toFixed(2)),
          
          // Sipariş notları
          notes: this.orderNotes || '',
          
          // Uygulanan kupon
          couponCode: this.couponCode || null,
          
          // Sipariş ürünleri - API'nin beklediği formatta
          orderItems: this.cartItems.map(item => ({
            productId: item.productId || item.id,
            quantity: item.qty || item.quantity || 1,
            price: parseFloat(item.price) || 0,
            size: item.size || null,
            color: item.color || null
          }))
        };
        
        console.log('Placing order:', orderData);
        
        // Redux store aracılığıyla sipariş oluştur
        const order = await this.$store.dispatch('order/createOrder', orderData);
        
        if (order && order.id) {
          // Başarılı sipariş durumunda sepeti temizle
          this.$store.dispatch('cart/clearCart');
          
          // Sipariş özetine yönlendir
          this.$router.push({ 
            path: '/order-success', 
            query: { 
              orderId: order.id,
              status: 'success'
            } 
          });
        } else {
          this.orderError = 'Sipariş oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.';
        }
      } catch (error) {
        console.error('Sipariş hatası:', error);
        this.orderError = error.message || 'Sipariş işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.';
      } finally {
        this.isPlacingOrder = false;
      }
    },
  },
};
</script> 