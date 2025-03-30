<template>
  <div>
    <!-- Banner Area -->
    <section id="common_banner_one">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="common_banner_text">
              <h2>Hesabım</h2>
              <b-breadcrumb :items="breadcrumbItems" class="bg-transparent"></b-breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Profile Area -->
    <section id="profile_area" class="ptb-100">
      <div class="container">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-lg-3">
            <div class="profile_sidebar">
              <div class="profile_sidebar_user">
                <div class="user_img">
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U5ZWNlZiI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiM2Yzc1N2QiPlVzZXI8L3RleHQ+PC9zdmc+" alt="Kullanıcı">
                </div>
                <div class="user_info text-center">
                  <h4>{{ user ? user.name : 'Misafir' }}</h4>
                  <p>{{ user ? user.email : '' }}</p>
                </div>
              </div>
              <div class="profile_sidebar_menu">
                <ul>
                  <li :class="{ active: activeTab === 'dashboard' }">
                    <a @click.prevent="setActiveTab('dashboard')">
                      <i class="fas fa-tachometer-alt"></i> Kontrol Paneli
                    </a>
                  </li>
                  <li :class="{ active: activeTab === 'orders' }">
                    <a @click.prevent="setActiveTab('orders')">
                      <i class="fas fa-shopping-basket"></i> Siparişlerim
                    </a>
                  </li>
                  <li :class="{ active: activeTab === 'addresses' }">
                    <a @click.prevent="setActiveTab('addresses')">
                      <i class="fas fa-map-marker-alt"></i> Adreslerim
                    </a>
                  </li>
                  <li :class="{ active: activeTab === 'account' }">
                    <a @click.prevent="setActiveTab('account')">
                      <i class="fas fa-user-cog"></i> Hesap Bilgilerim
                    </a>
                  </li>
                  <li :class="{ active: activeTab === 'password' }">
                    <a @click.prevent="setActiveTab('password')">
                      <i class="fas fa-lock"></i> Şifre Değiştir
                    </a>
                  </li>
                  <li>
                    <a @click.prevent="logout">
                      <i class="fas fa-sign-out-alt"></i> Çıkış Yap
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="col-lg-9">
            <div class="profile_content">
              <!-- Dashboard -->
              <div v-if="activeTab === 'dashboard'" class="dashboard_content">
                <div class="welcome_message mb-4">
                  <h4>Merhaba, {{ user ? user.name : 'Misafir' }}!</h4>
                  <p>Hesabınıza hoş geldiniz. Bu sayfadan siparişlerinizi görüntüleyebilir, adreslerinizi yönetebilir ve hesap bilgilerinizi güncelleyebilirsiniz.</p>
                </div>
                <div class="row dashboard-stats">
                  <div class="col-md-4 mb-3">
                    <div class="dashboard_box">
                      <div class="dashboard_box_icon">
                        <i class="fas fa-shopping-basket"></i>
                      </div>
                      <div class="dashboard_box_text">
                        <h4>{{ orders ? orders.length : 0 }}</h4>
                        <p>Toplam Sipariş</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="dashboard_box">
                      <div class="dashboard_box_icon">
                        <i class="fas fa-truck"></i>
                      </div>
                      <div class="dashboard_box_text">
                        <h4>{{ orders ? orders.filter(o => o.status === 'pending' || o.status === 'processing').length : 0 }}</h4>
                        <p>Devam Eden Sipariş</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="dashboard_box">
                      <div class="dashboard_box_icon">
                        <i class="fas fa-heart"></i>
                      </div>
                      <div class="dashboard_box_text">
                        <h4>{{ wishlistItems.length }}</h4>
                        <p>Favori Ürün</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="recent_order mt-4">
                  <h4>Son Siparişleriniz</h4>
                  <div v-if="orders && orders.length > 0" class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Sipariş No</th>
                          <th>Tarih</th>
                          <th>Ürünler</th>
                          <th>Toplam</th>
                          <th>Durum</th>
                          <th>İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(order, index) in orders" :key="index">
                          <td><span class="order-id">#{{ order.id }}</span></td>
                          <td><span class="order-date">{{ order.date || formatDate(order.orderDate) }}</span></td>
                          <td>
                            <div class="order-products">
                              <div v-for="(item, index) in adaptOrderItems(order).slice(0, 2)" :key="index" class="order-product-item mb-2">
                                <div class="product-thumbnail">
                                  <img 
                                    :src="getProductImage(item)"
                                    :alt="item.title"
                                    class="mr-2"
                                  >
                                </div>
                                <span class="product-title">{{ item.title }} <span class="product-quantity">x {{ item.quantity }}</span></span>
                              </div>
                              <small v-if="adaptOrderItems(order).length > 2" class="text-muted">
                                + {{ adaptOrderItems(order).length - 2 }} ürün daha
                              </small>
                            </div>
                          </td>
                          <td><strong>{{ formatPrice(order.totalAmount) }} TL</strong></td>
                          <td>
                            <span :class="'status-badge ' + order.status">{{ order.statusText }}</span>
                          </td>
                          <td>
                            <button @click="viewOrderDetails(order)" class="btn btn-sm btn-outline-primary">
                              Detay
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else class="empty_data text-center py-4">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIj48Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI2MCIgZmlsbD0iI2Y1ZjVmNSIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwIDI1KSI+PHBhdGggZD0iTTYwIDI1djQ1SDB2LTQ1eiIgZmlsbD0iI2UwZTBlMCIvPjxwYXRoIGQ9Ik0zMCAwbDMwIDI1SDB6IiBmaWxsPSIjZWVlIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSI0MCIgcj0iNSIgZmlsbD0iI2NjYyIvPjxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjUiIGZpbGw9IiNjY2MiLz48cmVjdCB4PSIxNSIgeT0iNjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSI1IiBmaWxsPSIjY2NjIi8+PC9nPjwvc3ZnPg==" alt="Sipariş Bulunamadı" width="120">
                    <p class="mt-3">Henüz hiç siparişiniz bulunmuyor</p>
                  </div>
                </div>
                <div class="recent_order mt-4" v-if="latestOrder">
                  <h4>En Son Siparişiniz</h4>
                  <div class="latest-order-summary">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="order-stat">
                          <h5>Sipariş Tarihi</h5>
                          <h2>{{ formatDate(latestOrder.orderDate) }}</h2>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="order-stat">
                          <h5>Sipariş Durumu</h5>
                          <h2><span :class="'status-badge ' + getStatusClass(latestOrder.status)">{{ getStatusText(latestOrder.status) }}</span></h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Orders -->
              <div v-if="activeTab === 'orders'" class="orders_content">
                <h3>Siparişlerim</h3>
                <div v-if="orders && orders.length > 0" class="table-responsive">
                  <table class="table table-bordered">
                    <thead class="bg-light">
                      <tr>
                        <th>Sipariş No</th>
                        <th>Tarih</th>
                        <th>Ürünler</th>
                        <th>Toplam</th>
                        <th>Durum</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(order, index) in orders" :key="index">
                        <td><span class="order-id">#{{ order.id }}</span></td>
                        <td><span class="order-date">{{ order.date || formatDate(order.orderDate) }}</span></td>
                        <td>
                          <div class="order-products">
                            <div v-for="(item, index) in adaptOrderItems(order).slice(0, 2)" :key="index" class="order-product-item mb-2">
                              <div class="product-thumbnail">
                                <img 
                                  :src="getProductImage(item)"
                                  :alt="item.title"
                                  class="mr-2"
                                >
                              </div>
                              <span class="product-title">{{ item.title }} <span class="product-quantity">x {{ item.quantity }}</span></span>
                            </div>
                            <small v-if="adaptOrderItems(order).length > 2" class="text-muted">
                              + {{ adaptOrderItems(order).length - 2 }} ürün daha
                            </small>
                          </div>
                        </td>
                        <td>
                          <div class="order-price">
                            <strong>{{ formatPrice(order.totalAmount) }} TL</strong>
                            <small v-if="order.discountAmount && order.discountAmount > 0" class="text-danger d-block">
                              {{ formatPrice(order.discountAmount) }} TL indirim
                            </small>
                          </div>
                        </td>
                        <td>
                          <span :class="'status-badge ' + getStatusClass(order.status)">
                            {{ getStatusText(order.status) }}
                          </span>
                          <small v-if="order.paymentStatus && order.paymentStatus !== 'Beklemede'" class="d-block mt-1">
                            <span :class="'payment-badge ' + getPaymentStatusClass(order.paymentStatus)">
                              {{ getPaymentStatusText(order.paymentStatus) }}
                            </span>
                          </small>
                        </td>
                        <td>
                          <button @click="viewOrderDetails(order)" class="btn btn-sm btn-outline-primary mb-1 w-100">
                            Detay
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else-if="isOrdersLoading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Yükleniyor...</span>
                  </div>
                  <p class="mt-2">Siparişleriniz yükleniyor...</p>
                </div>
                <div v-else class="empty_data text-center py-4">
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIj48Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI2MCIgZmlsbD0iI2Y1ZjVmNSIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwIDI1KSI+PHBhdGggZD0iTTYwIDI1djQ1SDB2LTQ1eiIgZmlsbD0iI2UwZTBlMCIvPjxwYXRoIGQ9Ik0zMCAwbDMwIDI1SDB6IiBmaWxsPSIjZWVlIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSI0MCIgcj0iNSIgZmlsbD0iI2NjYyIvPjxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjUiIGZpbGw9IiNjY2MiLz48cmVjdCB4PSIxNSIgeT0iNjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSI1IiBmaWxsPSIjY2NjIi8+PC9nPjwvc3ZnPg==" alt="Sipariş Bulunamadı" width="120">
                  <p class="mt-3">Henüz hiç siparişiniz bulunmuyor</p>
                  <nuxt-link to="/shop" class="btn btn-primary mt-2">
                    Alışverişe Başla
                  </nuxt-link>
                </div>
              </div>

              <!-- Addresses -->
              <div v-if="activeTab === 'addresses'" class="addresses_content">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h3>Adreslerim</h3>
                  <button class="btn btn-sm btn-primary" @click="showAddressModal = true">
                    <i class="fas fa-plus mr-1"></i> Yeni Adres Ekle
                  </button>
                </div>
                
                <div v-if="userAddresses && userAddresses.length > 0" class="row">
                  <div v-for="(address, index) in userAddresses" :key="index" class="col-md-6 mb-4">
                    <div class="address_card p-3">
                      <div class="d-flex justify-content-between mb-2">
                        <h5>{{ address.title }}</h5>
                        <div class="address_actions">
                          <button class="btn btn-sm btn-link p-0 mr-2" @click="editAddress(address)">
                            <i class="fas fa-edit"></i>
                          </button>
                        </div>
                      </div>
                      <div v-if="address.isDefault" class="default_badge mb-2">
                        <small>Varsayılan Adres</small>
                      </div>
                      <p class="mb-1">{{ address.fullName }}</p>
                      <p class="mb-1">{{ address.phone }}</p>
                      <p class="mb-1">{{ address.address }}</p>
                      <p class="mb-0">{{ address.district }}/{{ address.city }} - {{ address.zipCode }}</p>
                      <div v-if="!address.isDefault" class="mt-3">
                        <button class="btn btn-sm btn-outline-secondary" @click="setDefaultAddress(address)">
                          Varsayılan Yap
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty_data text-center py-4">
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIj48Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI2MCIgZmlsbD0iI2Y1ZjVmNSIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwIDI1KSI+PHBhdGggZD0iTTYwIDI1djQ1SDB2LTQ1eiIgZmlsbD0iI2UwZTBlMCIvPjxwYXRoIGQ9Ik0zMCAwbDMwIDI1SDB6IiBmaWxsPSIjZWVlIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSI0MCIgcj0iNSIgZmlsbD0iI2NjYyIvPjxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjUiIGZpbGw9IiNjY2MiLz48cmVjdCB4PSIxNSIgeT0iNjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSI1IiBmaWxsPSIjY2NjIi8+PC9nPjwvc3ZnPg==" alt="Adres Bulunamadı" width="120">
                  <p class="mt-3">Henüz hiç adresiniz bulunmuyor</p>
                </div>
                
                <div class="addresses-info mt-3 mb-4">
                  <p class="text-info">
                    <i class="fas fa-info-circle"></i> 
                    Varsayılan adres, siparişlerinizde otomatik olarak seçilecektir.
                    Bir adresinizi varsayılan olarak ayarlamak için "Varsayılan Yap" butonunu kullanabilirsiniz.
                  </p>
                </div>
                
                <!-- Address Modal -->
                <b-modal v-model="showAddressModal" :title="editMode ? 'Adresi Düzenle' : 'Yeni Adres Ekle'" hide-footer centered>
                  <form @submit.prevent="saveAddress">
                    <div class="form-group">
                      <label for="addressTitle">Adres Başlığı</label>
                      <input type="text" id="addressTitle" v-model="currentAddress.title" class="form-control" placeholder="Örn: Ev, İş" required>
                    </div>
                    <div class="form-group">
                      <label for="fullName">Ad Soyad</label>
                      <input type="text" id="fullName" v-model="currentAddress.fullName" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label for="phone">Telefon</label>
                      <input type="tel" id="phone" v-model="currentAddress.phone" class="form-control" @input="onAddressPhoneInput($event)" required>
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="city">İl</label>
                        <input type="text" id="city" v-model="currentAddress.city" class="form-control" required>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="district">İlçe</label>
                        <input type="text" id="district" v-model="currentAddress.district" class="form-control" required>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="address">Adres</label>
                      <textarea id="address" v-model="currentAddress.address" class="form-control" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                      <label for="zipCode">Posta Kodu</label>
                      <input type="text" id="zipCode" v-model="currentAddress.zipCode" class="form-control" required>
                    </div>
                    <div class="form-check mb-3">
                      <input type="checkbox" class="form-check-input" id="defaultAddress" v-model="currentAddress.isDefault">
                      <label class="form-check-label" for="defaultAddress">Varsayılan adres olarak ayarla</label>
                    </div>
                    <div class="text-right">
                      <button type="button" class="btn btn-secondary mr-2" @click="showAddressModal = false">İptal</button>
                      <button type="submit" class="btn btn-primary">Kaydet</button>
                    </div>
                  </form>
                </b-modal>
              </div>

              <!-- Account Details -->
              <div v-if="activeTab === 'account'" class="account_content">
                <h3>Hesap Bilgilerim</h3>
                <form @submit.prevent="updateAccount" class="mt-4">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="accountName">Ad Soyad</label>
                        <input type="text" id="accountName" v-model="accountDetails.name" class="form-control" required>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="accountEmail">E-posta</label>
                        <input type="email" id="accountEmail" v-model="accountDetails.email" class="form-control" required>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="accountPhone">Telefon</label>
                        <input type="tel" id="accountPhone" v-model="accountDetails.phone" class="form-control" @input="onPhoneInput($event)">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="accountBirthday">Doğum Tarihi</label>
                        <input type="date" id="accountBirthday" v-model="accountDetails.birthday" 
                          class="form-control"
                          :min="minDate"
                          :max="maxDate"
                          @change="validateBirthday">
                        <small v-if="birthdayError" class="text-danger">
                          {{ birthdayError }}
                        </small>
                        <small class="form-text text-muted">
                          Doğum tarihiniz 1920 ile bugün arasında olmalıdır.
                        </small>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Cinsiyet</label>
                        <div>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="genderMale" v-model="accountDetails.gender" value="male">
                            <label class="form-check-label" for="genderMale">Erkek</label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="genderFemale" v-model="accountDetails.gender" value="female">
                            <label class="form-check-label" for="genderFemale">Kadın</label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="genderOther" v-model="accountDetails.gender" value="other">
                            <label class="form-check-label" for="genderOther">Belirtmek İstemiyorum</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group mt-3">
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                      <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Güncelleniyor...</span>
                      <span v-else>Bilgilerimi Güncelle</span>
                    </button>
                  </div>
                </form>
              </div>

              <!-- Change Password -->
              <div v-if="activeTab === 'password'" class="password_content">
                <h3>Şifre Değiştir</h3>
                <form @submit.prevent="changePassword" class="mt-4">
                  <div class="form-group">
                    <label for="currentPassword">Mevcut Şifre</label>
                    <input type="password" id="currentPassword" v-model="passwordForm.currentPassword" class="form-control" required>
                  </div>
                  <div class="form-group">
                    <label for="newPassword">Yeni Şifre</label>
                    <input type="password" id="newPassword" v-model="passwordForm.newPassword" class="form-control" required minlength="6">
                    <small class="form-text text-muted">Şifreniz en az 6 karakter uzunluğunda olmalıdır.</small>
                  </div>
                  <div class="form-group">
                    <label for="confirmNewPassword">Yeni Şifre Tekrarı</label>
                    <input type="password" id="confirmNewPassword" v-model="passwordForm.confirmNewPassword" class="form-control" required>
                    <div v-if="passwordsMismatch" class="text-danger mt-1">
                      Şifreler eşleşmiyor
                    </div>
                  </div>
                  <div class="form-group mt-3">
                    <button type="submit" class="btn btn-primary" :disabled="loading || passwordsMismatch">
                      <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Şifre Değiştiriliyor...</span>
                      <span v-else>Şifremi Değiştir</span>
                    </button>
                  </div>
                </form>
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
  name: 'ProfilePage',
  middleware: 'auth',
  head() {
    return {
      title: 'Hesabım',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Hesap bilgilerinizi yönetin'
        }
      ]
    };
  },
  data() {
    return {
      activeTab: 'dashboard',
      breadcrumbItems: [
        {
          text: 'Anasayfa',
          to: '/'
        },
        {
          text: 'Hesabım',
          active: true
        }
      ],
      // Kullanıcı sipariş listesi (computed property ile çakışmaması için kaldırıldı)
      addresses: [],
      
      // Adres modal
      showAddressModal: false,
      editMode: false,
      currentAddress: {
        id: null,
        title: '',
        fullName: '',
        phone: '',
        city: '',
        district: '',
        address: '',
        zipCode: '',
        isDefault: false
      },
      
      // Hesap bilgileri
      accountDetails: {
        name: '',
        email: '',
        phone: '',
        birthday: '',
        gender: 'other'
      },
      
      // Şifre değiştirme
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      selectedOrder: null,
      cancelReason: '',
      // Sayfa yükleniyor durumu
      loading: false,
      // Doğum tarihi kontrolü
      minDate: '1920-01-01',
      maxDate: new Date().toISOString().split('T')[0],
      birthdayError: ''
    };
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "user/isAuthenticated",
      user: 'user/currentUser',
      error: "user/error",
      isLoading: "user/isLoading",
      // Sipariş getters
      orders: 'order/allOrders',
      isOrdersLoading: 'order/isLoading',
      orderError: 'order/error',
      latestOrder: 'order/latestOrder',
      // Adres getters
      userAddresses: 'user/addresses',
      // Favori ürünler getters
      wishlistItems: 'products/wishlistItems'
    }),
    passwordsMismatch() {
      return this.passwordForm.newPassword && 
             this.passwordForm.confirmNewPassword && 
             this.passwordForm.newPassword !== this.passwordForm.confirmNewPassword;
    }
  },
  async mounted() {
    // URL'den tab parametresini al ve aktif tab'ı ayarla
    const tab = this.$route.query.tab;
    if (tab) {
      this.activeTab = tab;
    }
    
    // Kullanıcı bilgilerini ayarla
    if (this.user) {
      this.accountDetails = {
        name: `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim(),
        email: this.user.email || '',
        phone: this.user.phone || '',
        birthday: this.user.birthday || '',
        gender: this.user.gender || 'other'
      };
    }
    
    // Sipariş ve adres bilgilerini getir
    await this.fetchUserData();
    
    // Siparişleri yükle
    await this.fetchOrders();
  },
  methods: {
    ...mapActions({
      logout: 'user/logout',
      updateProfile: 'user/updateProfile',
      getUserOrders: 'user/getUserOrders',
      loadUserOrders: 'order/fetchUserOrders',
      // Adres actions
      getAddresses: 'user/getAddresses',
      addAddress: 'user/addAddress',
      updateUserAddress: 'user/updateAddress',
      deleteUserAddress: 'user/deleteAddress',
      setAddressAsDefault: 'user/setDefaultAddress',
      // Şifre değiştirme
      changeUserPassword: 'user/changePassword'
    }),
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    async fetchUserData() {
      try {
        // Adres bilgilerini yükle
        await this.getAddresses();
      } catch (error) {
        console.error('Kullanıcı verileri alınırken hata:', error);
        this.$toast.error('Veriler yüklenirken bir hata oluştu.');
      }
    },
    getStatusClass(status) {
      const classes = {
        'pending': 'status-pending',
        'Beklemede': 'status-pending',
        'processing': 'status-processing',
        'İşleniyor': 'status-processing',
        'shipped': 'status-shipped',
        'Kargoya Verildi': 'status-shipped',
        'delivered': 'status-delivered',
        'Teslim Edildi': 'status-delivered',
        'cancelled': 'status-cancelled',
        'İptal Edildi': 'status-cancelled'
      };
      
      return classes[status] || 'status-default';
    },
    getStatusText(status) {
      const statuses = {
        'pending': 'Beklemede',
        'Beklemede': 'Beklemede',
        'processing': 'İşleniyor',
        'İşleniyor': 'İşleniyor',
        'shipped': 'Kargoya Verildi',
        'Kargoya Verildi': 'Kargoya Verildi',
        'delivered': 'Teslim Edildi',
        'Teslim Edildi': 'Teslim Edildi',
        'cancelled': 'İptal Edildi',
        'İptal Edildi': 'İptal Edildi'
      };
      
      return statuses[status] || status;
    },
    async updateAccount() {
      if (this.birthdayError) {
        this.$toast.error('Geçersiz doğum tarihi: ' + this.birthdayError);
        return;
      }
      
      this.loading = true;
      try {
        // Ad ve soyad ayrıştırma
        let firstName = '';
        let lastName = '';
        
        if (this.accountDetails.name) {
          const nameParts = this.accountDetails.name.trim().split(' ');
          if (nameParts.length > 1) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          } else {
            firstName = nameParts[0];
            lastName = '';
          }
        }
        
        // API'ye gönderilecek veriyi hazırla
        const userData = {
          id: this.user.id,
          firstName,
          lastName,
          email: this.accountDetails.email,
          phone: this.accountDetails.phone,
          birthday: this.accountDetails.birthday || null,
          gender: this.accountDetails.gender || 'other',
          role: this.user.role || 'user'
        };
        
        // API'ye gönder
        await this.updateProfile(userData);
        
        this.$toast.success('Hesap bilgileriniz başarıyla güncellendi');
      } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        this.$toast.error('Hesap bilgileriniz güncellenirken bir hata oluştu');
      } finally {
        this.loading = false;
      }
    },
    async changePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmNewPassword) {
        this.$toast.error('Şifreler eşleşmiyor');
        return;
      }
      
      try {
        this.loading = true;
        await this.changeUserPassword({
          currentPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword
        });
        
        this.$toast.success('Şifreniz başarıyla değiştirildi');
        
        // Form'u sıfırla
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        };
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$toast.error(error.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu');
        console.error('Şifre değiştirme hatası:', error);
      }
    },
    // Adres işlemleri
    editAddress(address) {
      this.editMode = true;
      this.currentAddress = { ...address };
      this.showAddressModal = true;
    },
    
    async deleteAddress(address) {
      if (confirm('Bu adresi silmek istediğinize emin misiniz?')) {
        try {
          await this.deleteUserAddress(address.id);
          this.$toast.success('Adres başarıyla silindi');
        } catch (error) {
          this.$toast.error('Adres silinirken bir hata oluştu');
        }
      }
    },
    
    async setDefaultAddress(address) {
      try {
        console.log('Varsayılan yapılacak adres:', address);
        
        if (!address || !address.id) {
          this.$toast.error('Geçersiz adres bilgisi');
          return;
        }
        
        // Adres ID'sini doğrudan gönder, bunu ayır
        const addressId = parseInt(address.id);
        console.log(`setAddressAsDefault çağrılıyor, ID: ${addressId}`);
        
        await this.setAddressAsDefault(addressId);
        this.$toast.success('Varsayılan adres güncellendi');
        
        // Adres listesini yenile
        this.getAddresses();
      } catch (error) {
        console.error('Varsayılan adres hatası:', error.response?.data || error.message);
        this.$toast.error(error.response?.data?.message || 'Varsayılan adres ayarlanırken bir hata oluştu');
      }
    },
    
    async saveAddress() {
      try {
        this.loading = true;
        
        const addressData = {
          userId: this.user.id,
          title: this.currentAddress.title,
          fullName: this.currentAddress.fullName,
          phone: this.currentAddress.phone,
          city: this.currentAddress.city,
          district: this.currentAddress.district,
          addressDetail: this.currentAddress.address,
          zipCode: this.currentAddress.zipCode,
          isDefault: this.currentAddress.isDefault
        };
        
        console.log('Frontend adres verisi:', addressData);
        
        if (this.editMode) {
          // ID alanını ekleyelim - Bu backend için gerekli
          addressData.id = this.currentAddress.id;
          
          // Adresi güncelle
          await this.updateUserAddress({
            addressId: this.currentAddress.id,
            addressData: addressData
          });
          
          this.$toast.success('Adres başarıyla güncellendi');
        } else {
          // Yeni adres ekle
          await this.addAddress(addressData);
          
          this.$toast.success('Yeni adres başarıyla eklendi');
        }
        
        // Modal'ı kapat ve formu sıfırla
        this.showAddressModal = false;
        this.resetAddressForm();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$toast.error(error.response?.data?.message || 'İşlem sırasında bir hata oluştu');
        console.error('Adres işlemi hatası:', error);
      }
    },
    resetAddressForm() {
      this.editMode = false;
      this.currentAddress = {
        id: null,
        title: '',
        fullName: '',
        phone: '',
        city: '',
        district: '',
        address: '',
        zipCode: '',
        isDefault: false
      };
    },
    
    // Sipariş metodları
    async fetchOrders() {
      try {
        this.loading = true;
        await this.loadUserOrders();
        this.loading = false;
      } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
        this.loading = false;
      }
    },
    
    viewOrderDetails(order) {
      // Sipariş detay sayfasına yönlendir
      // ID bilgisini düzelt (format olarak sadece numara gönder)
      const orderId = typeof order.id === 'string' && order.id.startsWith('SP') 
        ? order.id.substring(2) // "SP" önekini kaldır
        : order.id;
        
      this.$router.push(`/order-success?order_id=${orderId}`);
    },
    
    cancelOrder(order) {
      this.selectedOrder = order;
      this.cancelReason = '';
      this.$bvModal.show('cancel-order-modal');
    },
    
    cancelOrderFromModal() {
      this.$bvModal.hide('order-details-modal');
      this.$bvModal.show('cancel-order-modal');
    },
    
    async confirmCancelOrder() {
      if (!this.selectedOrder) return;
      
      try {
        await this.$store.dispatch('order/updateOrderStatus', {
          orderId: this.selectedOrder.id,
          status: 'cancelled'
        });
        
        this.$toast.success('Siparişiniz başarıyla iptal edildi');
        await this.fetchOrders();
      } catch (error) {
        this.$toast.error('Sipariş iptal edilirken bir hata oluştu');
        console.error('Sipariş iptal hatası:', error);
      }
    },
    
    canCancelOrder(status) {
      // Sadece hazırlanıyor veya işleniyor durumundaki siparişler iptal edilebilir
      return ['pending', 'processing'].includes(status);
    },
    
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
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
    
    getStatusBadgeClass(status) {
      const classes = {
        'pending': 'badge-warning',
        'processing': 'badge-info',
        'shipped': 'badge-primary',
        'delivered': 'badge-success',
        'cancelled': 'badge-danger'
      };
      
      return classes[status] || 'badge-secondary';
    },
    
    getProductImage(item) {
      // Placeholder resimlerini düzelt
      const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U5ZWNlZiI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiM2Yzc1N2QiPlByb2R1Y3Q8L3RleHQ+PC9zdmc+';
      
      // URL kontrolü yap
      if (!item || !item.image) {
        // OrderItem'dan gelen ürün
        if (item && item.product && item.product.imageUrl) {
          return item.product.imageUrl;
        }
        return PLACEHOLDER_IMAGE;
      }

      // Eğer tam URL ise, doğrudan döndür
      if (typeof item.image === 'string' && item.image.startsWith('http')) {
        return item.image;
      }

      // Local dosya yolu için önce placeholder kullan
      return PLACEHOLDER_IMAGE;
    },
    
    // Order Items Data Adaptörü - API'den gelen OrderItem verilerini frontend formatına dönüştürür
    adaptOrderItems(order) {
      // API'den gelen sipariş
      if (order.orderItems && Array.isArray(order.orderItems)) {
        return order.orderItems.map(item => ({
          id: item.productId,
          title: item.product ? item.product.name : `Ürün #${item.productId}`,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product ? item.product.imageUrl : null,
          product: item.product
        }));
      }
      
      // Frontend'de oluşturulan sipariş
      return order.items || [];
    },
    formatPhoneNumber(phone) {
      // Sadece rakamları almak için telefon numarasını temizle
      const cleaned = ('' + phone).replace(/\D/g, '');
      
      // Maksimum 10 haneye kısıtla
      const digits = cleaned.substring(0, 10);
      
      // Rakam sayısına göre formatı belirle
      if (digits.length === 0) return '';
      if (digits.length <= 3) return `(${digits}`;
      if (digits.length <= 6) return `(${digits.substring(0, 3)}) ${digits.substring(3)}`;
      if (digits.length <= 8) return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)} ${digits.substring(6)}`;
      return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)} ${digits.substring(6, 8)} ${digits.substring(8, 10)}`;
    },
    
    onPhoneInput(event) {
      // Input elemanındaki değeri al
      const input = event.target.value.replace(/\D/g, '');
      
      // Formatla ve modeli güncelle
      this.accountDetails.phone = this.formatPhoneNumber(input);
    },
    
    onAddressPhoneInput(event) {
      // Input elemanındaki değeri al
      const input = event.target.value.replace(/\D/g, '');
      
      // Formatla ve modeli güncelle
      this.currentAddress.phone = this.formatPhoneNumber(input);
    },
    getPaymentStatusClass(status) {
      const classes = {
        'pending': 'payment-pending',
        'Beklemede': 'payment-pending',
        'processing': 'payment-processing',
        'İşleniyor': 'payment-processing',
        'completed': 'payment-completed',
        'Tamamlandı': 'payment-completed',
        'failed': 'payment-failed',
        'Başarısız': 'payment-failed',
        'refunded': 'payment-refunded',
        'İade Edildi': 'payment-refunded'
      };
      
      return classes[status] || 'payment-default';
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
    validateBirthday() {
      const birthday = new Date(this.accountDetails.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthday.getFullYear();
      const monthDiff = today.getMonth() - birthday.getMonth();
      const dayDiff = today.getDate() - birthday.getDate();
      
      if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && dayDiff < 0)) {
        this.birthdayError = '18 yaşından küçükler hesap açamaz';
      } else {
        this.birthdayError = '';
      }
    }
  }
};
</script>

<style scoped>
.profile_sidebar {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.05);
  overflow: hidden;
}

.profile_sidebar_user {
  background: linear-gradient(135deg, #f79837, #f15a29);
  padding: 20px;
  color: #fff;
}

.user_img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  border: 3px solid #fff;
}

.user_img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile_sidebar_menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile_sidebar_menu ul li {
  border-bottom: 1px solid #f0f0f0;
}

.profile_sidebar_menu ul li:last-child {
  border-bottom: none;
}

.profile_sidebar_menu ul li a {
  display: block;
  padding: 15px 20px;
  color: #333;
  transition: all 0.3s;
  cursor: pointer;
}

.profile_sidebar_menu ul li a i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.profile_sidebar_menu ul li.active a,
.profile_sidebar_menu ul li a:hover {
  background-color: #f9f9f9;
  color: #f79837;
}

.profile_content {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.05);
  padding: 30px;
}

.dashboard-stats {
  margin: 0 -10px; /* Offset padding that will be applied to columns */
}

.dashboard-stats .col-md-4 {
  padding-left: 10px;
  padding-right: 10px;
}

.dashboard_box {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  height: 100%;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid #eaeaea;
}

.dashboard_box:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.08);
}

.dashboard_box_icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f79837, #f15a29);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0; /* Prevent the icon from shrinking */
}

.dashboard_box_icon i {
  color: #fff;
  font-size: 24px;
}

.dashboard_box_text {
  flex-grow: 1;
}

.dashboard_box_text h4 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}

.dashboard_box_text p {
  margin: 5px 0 0;
  color: #666;
  font-size: 14px;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-pending {
  background-color: #ffc107;
  color: #212529;
}

.status-processing {
  background-color: #17a2b8;
  color: #fff;
}

.status-shipped {
  background-color: #007bff;
  color: #fff;
}

.status-delivered {
  background-color: #28a745;
  color: #fff;
}

.status-cancelled {
  background-color: #dc3545;
  color: #fff;
}

.status-default {
  background-color: #6c757d;
  color: #fff;
}

.payment-badge {
  display: inline-block;
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
}

.payment-pending {
  background-color: #ffeeba;
  color: #856404;
}

.payment-processing {
  background-color: #bee5eb;
  color: #0c5460;
}

.payment-completed {
  background-color: #c3e6cb;
  color: #155724;
}

.payment-failed {
  background-color: #f5c6cb;
  color: #721c24;
}

.payment-refunded {
  background-color: #e2e3e5;
  color: #383d41;
}

.payment-default {
  background-color: #e2e3e5;
  color: #383d41;
}

.order-price small {
  font-size: 0.7rem;
}

.empty_data {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 30px;
}

.empty_data p {
  color: #777;
  margin-bottom: 0;
}

.address_card {
  background: #f9f9f9;
  border-radius: 8px;
  height: 100%;
  transition: all 0.3s;
  position: relative;
}

.address_card:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.default_badge {
  display: inline-block;
  background-color: #e7f7ee;
  color: #28a745;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 30px;
}

.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
}

/* Orders Tab Styles */
.order-stat {
  padding: 15px;
  border-left: 4px solid #f79837;
  background-color: #f9f9f9;
  border-radius: 0 4px 4px 0;
  margin-bottom: 15px;
}

.order-stat h5 {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.order-stat h2 {
  color: #333;
  font-size: 24px;
  margin: 0;
}

.latest-order-summary {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1px solid #eee;
}

.order-id {
  font-weight: 600;
  color: #333;
}

.order-products {
  max-width: 300px;
}

.order-product-item {
  display: flex;
  align-items: center;
}

.product-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
  border: 1px solid #eee;
  flex-shrink: 0;
}

.product-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

.product-quantity {
  color: #777;
  font-weight: normal;
}

.order-date {
  color: #666;
  font-weight: 500;
}
</style> 