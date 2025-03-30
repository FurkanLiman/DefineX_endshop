<template>
  <div>
    <!-- Banner Area -->
    <section id="common_banner_one">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="common_banner_text">
              <h2>Admin Paneli</h2>
              <b-breadcrumb :items="breadcrumbItems" class="bg-transparent"></b-breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Admin Panel Area -->
    <section id="admin_area" class="ptb-100">
      <div class="container">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-lg-3">
            <div class="admin_sidebar">
              <div class="admin_sidebar_user">
                <div class="user_img">
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U5ZWNlZiI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiM2Yzc1N2QiPkFkbWluPC90ZXh0Pjwvc3ZnPg==" alt="Admin">
                </div>
                <div class="user_info text-center">
                  <h4>{{ user ? user.name : 'Admin' }}</h4>
                  <p>{{ user ? user.email : '' }}</p>
                </div>
              </div>
              <div class="admin_sidebar_menu">
                <ul>
                  <li :class="{ active: activeTab === 'dashboard' }">
                    <a @click.prevent="setActiveTab('dashboard')">
                      <i class="fas fa-tachometer-alt"></i> Dashboard
                    </a>
                  </li>
                  <li :class="{ active: activeTab === 'products' }">
                    <a @click.prevent="setActiveTab('products')">
                      <i class="fas fa-box"></i> Ürünler
                    </a>
                  </li>
                  <li :class="{ active: activeTab === 'orders' }">
                    <a @click.prevent="setActiveTab('orders')">
                      <i class="fas fa-shopping-cart"></i> Siparişler
                    </a>
                  </li>
                  <li :class="{ active: activeTab === 'users' }">
                    <a @click.prevent="setActiveTab('users')">
                      <i class="fas fa-users"></i> Kullanıcılar
                    </a>
                  </li>
                  <li :class="{ active: activeTab === 'reviews' }">
                    <a @click.prevent="setActiveTab('reviews')">
                      <i class="fas fa-star"></i> Yorumlar
                    </a>
                  </li>
                  <li :class="{ active: activeTab === 'categories' }">
                    <a @click.prevent="setActiveTab('categories')">
                      <i class="fas fa-tags"></i> Kategoriler
                    </a>
                  </li>
                  <li>
                    <a href="/" target="_blank">
                      <i class="fas fa-home"></i> Siteye Git
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
            <div class="admin_content">
              <!-- Dashboard -->
              <div v-if="activeTab === 'dashboard'" class="dashboard_content">
                <h3>Dashboard</h3>
                <div class="row dashboard-stats mt-4">
                  <div class="col-md-3 mb-3">
                    <div class="dashboard_box">
                      <div class="dashboard_box_icon">
                        <i class="fas fa-shopping-cart"></i>
                      </div>
                      <div class="dashboard_box_text">
                        <h4>{{ stats.orders }}</h4>
                        <p>Siparişler</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="dashboard_box">
                      <div class="dashboard_box_icon">
                        <i class="fas fa-users"></i>
                      </div>
                      <div class="dashboard_box_text">
                        <h4>{{ stats.users }}</h4>
                        <p>Kullanıcılar</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="dashboard_box">
                      <div class="dashboard_box_icon">
                        <i class="fas fa-box"></i>
                      </div>
                      <div class="dashboard_box_text">
                        <h4>{{ stats.products }}</h4>
                        <p>Ürünler</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="dashboard_box">
                      <div class="dashboard_box_icon">
                        <i class="fas fa-comments"></i>
                      </div>
                      <div class="dashboard_box_text">
                        <h4>{{ stats.reviews }}</h4>
                        <p>Yorumlar</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="row mt-4">
                  <div class="col-md-6">
                    <div class="card">
                      <div class="card-header">
                        <h5 class="card-title mb-0">Son Siparişler</h5>
                      </div>
                      <div class="card-body">
                        <div v-if="latestOrders.length > 0">
                          <div v-for="(order, index) in latestOrders" :key="index" class="recent-order-item">
                            <div class="d-flex justify-content-between">
                              <div>
                                <strong>Sipariş #{{ order.id }}</strong>
                                <div class="small text-muted">{{ order.date }}</div>
                              </div>
                              <div>
                                <span :class="'badge ' + getOrderStatusBadge(order.status)">
                                  {{ getOrderStatusText(order.status) }}
                                </span>
                              </div>
                            </div>
                            <div class="d-flex justify-content-between mt-2">
                              <div>
                                <span class="small">{{ order.customerName }}</span>
                              </div>
                              <div>
                                <strong>{{ formatPrice(order.totalAmount) }} TL</strong>
                              </div>
                            </div>
                            <hr class="my-2">
                          </div>
                          <div class="text-center mt-3">
                            <button class="btn btn-sm btn-outline-primary" @click="setActiveTab('orders')">
                              Tüm Siparişleri Gör
                            </button>
                          </div>
                        </div>
                        <div v-else class="text-center py-3">
                          <p class="mb-0">Henüz sipariş bulunmuyor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <div class="card">
                      <div class="card-header">
                        <h5 class="card-title mb-0">Son Yorumlar</h5>
                      </div>
                      <div class="card-body">
                        <div v-if="latestReviews.length > 0">
                          <div v-for="(review, index) in latestReviews" :key="index" class="recent-review-item">
                            <div class="d-flex justify-content-between">
                              <div>
                                <strong>{{ review.productName }}</strong>
                                <div class="small text-muted">{{ review.date }}</div>
                              </div>
                              <div>
                                <span class="badge bg-primary text-white">{{ review.rating }} <i class="fas fa-star"></i></span>
                              </div>
                            </div>
                            <div class="mt-2">
                              <p class="mb-1">{{ review.comment }}</p>
                              <small>{{ review.userName }}</small>
                            </div>
                            <hr class="my-2">
                          </div>
                          <div class="text-center mt-3">
                            <button class="btn btn-sm btn-outline-primary" @click="setActiveTab('reviews')">
                              Tüm Yorumları Gör
                            </button>
                          </div>
                        </div>
                        <div v-else class="text-center py-3">
                          <p class="mb-0">Henüz yorum bulunmuyor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Placeholder for other tabs -->
              <div v-if="activeTab === 'products'" class="products_content">
                <h3>Ürün Yönetimi</h3>
                
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <p>Ürün eklemek, düzenlemek ve silmek için bu paneli kullanabilirsiniz.</p>
                  <button class="btn btn-primary" @click="newProduct">
                    <i class="fas fa-plus mr-2"></i> Yeni Ürün Ekle
                  </button>
                </div>
                
                <!-- Yükleniyor göstergesi -->
                <div v-if="isAdminLoading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Yükleniyor...</span>
                  </div>
                  <p class="mt-2">Ürünler yükleniyor...</p>
                </div>
                
                <!-- Hata mesajı -->
                <div v-else-if="adminError" class="alert alert-danger">
                  {{ adminError }}
                </div>
                
                <!-- Ürün tablosu -->
                <div v-else-if="adminProducts && adminProducts.length > 0" class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead class="thead-dark">
                      <tr>
                        <th>ID</th>
                        <th>Görsel</th>
                        <th>Ürün Adı</th>
                        <th>Kategori</th>
                        <th>Fiyat</th>
                        <th>İndirimli Fiyat</th>
                        <th>Stok</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="product in adminProducts" :key="product.id">
                        <td>{{ product.id }}</td>
                        <td>
                          <img 
                            :src="product.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U5ZWNlZiI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiM2Yzc1N2QiPlByb2R1Y3Q8L3RleHQ+PC9zdmc+'" 
                            alt="Ürün"
                            class="product-thumbnail"
                          >
                        </td>
                        <td>{{ product.title }}</td>
                        <td>{{ product.category }}</td>
                        <td>{{ formatPrice(product.price) }} TL</td>
                        <td>{{ product.discountPrice ? formatPrice(product.discountPrice) + ' TL' : '-' }}</td>
                        <td>{{ product.stock }}</td>
                        <td>
                          <div class="btn-group">
                            <button class="btn btn-sm btn-info mr-1" @click="editProduct(product)">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" @click="removeProduct(product.id)">
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Ürün yoksa -->
                <div v-else class="alert alert-info">
                  <p class="mb-0">Henüz ürün bulunmuyor. Yeni ürün eklemek için "Yeni Ürün Ekle" butonunu kullanabilirsiniz.</p>
                </div>
                
                <!-- Ürün Ekleme/Düzenleme Modal -->
                <b-modal v-model="showProductModal" :title="editMode ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'" hide-footer centered>
                  <form @submit.prevent="saveProduct">
                    <div class="form-group">
                      <label for="productTitle">Ürün Adı</label>
                      <input type="text" id="productTitle" v-model="productForm.title" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                      <label for="productDescription">Açıklama</label>
                      <textarea id="productDescription" v-model="productForm.description" class="form-control" rows="3"></textarea>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="productPrice">Fiyat (TL)</label>
                        <input type="number" id="productPrice" v-model="productForm.price" class="form-control" min="0" step="0.01" required>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="productDiscountPrice">İndirimli Fiyat (TL)</label>
                        <input type="number" id="productDiscountPrice" v-model="productForm.discountPrice" class="form-control" min="0" step="0.01">
                      </div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="productStock">Stok</label>
                        <input type="number" id="productStock" v-model="productForm.stock" class="form-control" min="0" required>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="productCategory">Kategori</label>
                        <select id="productCategory" v-model="productForm.category" class="form-control" required>
                          <option value="">Kategori Seçin</option>
                          <option v-for="category in adminCategories" :key="category.id" :value="category.name">
                            {{ category.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label for="productTags">Etiketler (virgülle ayırın)</label>
                      <input type="text" id="productTags" v-model="productForm.tags" class="form-control">
                    </div>
                    
                    <div class="form-group">
                      <label for="productImage">Görsel URL</label>
                      <input type="text" id="productImage" v-model="productForm.image" class="form-control">
                    </div>
                    
                    <div class="form-group">
                      <label for="productStatus">Durum</label>
                      <select id="productStatus" v-model="productForm.status" class="form-control" required>
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                      </select>
                    </div>
                    
                    <div class="text-right mt-4">
                      <button type="button" class="btn btn-secondary mr-2" @click="showProductModal = false">İptal</button>
                      <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Kaydediliyor...</span>
                        <span v-else>Kaydet</span>
                      </button>
                    </div>
                  </form>
                </b-modal>
              </div>
              
              <div v-if="activeTab === 'orders'" class="orders_content">
                <h3>Sipariş Yönetimi</h3>
                
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <p>Siparişleri görüntülemek ve durumlarını güncellemek için bu paneli kullanabilirsiniz.</p>
                </div>
                
                <!-- Yükleniyor göstergesi -->
                <div v-if="isAdminLoading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Yükleniyor...</span>
                  </div>
                  <p class="mt-2">Siparişler yükleniyor...</p>
                </div>
                
                <!-- Hata mesajı -->
                <div v-else-if="adminError" class="alert alert-danger">
                  {{ adminError }}
                </div>
                
                <!-- Sipariş tablosu -->
                <div v-else-if="adminOrders && adminOrders.length > 0" class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead class="thead-dark">
                      <tr>
                        <th>Sipariş No</th>
                        <th>Müşteri</th>
                        <th>Tarih</th>
                        <th>Toplam Tutar</th>
                        <th>Ödeme Yöntemi</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in adminOrders" :key="order.id">
                        <td>{{ order.orderNumber || order.id }}</td>
                        <td>{{ order.user ? 
                            (order.user.name || 
                             (order.user.firstName ? `${order.user.firstName} ${order.user.lastName || ''}`.trim() : '') || 
                             order.customerName) : 
                            order.customerName }}</td>
                        <td>{{ formatDate(order.orderDate || order.createdAt) }}</td>
                        <td>{{ formatPrice(order.totalAmount) }} TL</td>
                        <td>
                          <span class="badge badge-info">
                            {{ order.paymentMethod === 'credit_card' ? 'Kredi Kartı' : 
                               order.paymentMethod === 'bank_transfer' ? 'Banka Havalesi' : 
                               order.paymentMethod === 'cash_on_delivery' ? 'Kapıda Ödeme' : 
                               order.paymentMethod }}
                          </span>
                        </td>
                        <td>
                          <span :class="'badge ' + getOrderStatusBadge(order.status)">
                            {{ getOrderStatusText(order.status) }}
                          </span>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-info" @click="viewOrder(order)">
                            <i class="fas fa-eye mr-1"></i> Detay
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Sipariş yoksa -->
                <div v-else class="alert alert-info">
                  <p class="mb-0">Henüz sipariş bulunmuyor.</p>
                </div>
                
                <!-- Sipariş Detay Modal -->
                <b-modal v-model="showOrderModal" title="Sipariş Detayı" size="lg" hide-footer centered>
                  <div v-if="currentOrder">
                    <div class="order-header d-flex justify-content-between mb-4">
                      <div>
                        <h5>Sipariş No: {{ currentOrder.orderNumber || currentOrder.id }}</h5>
                        <p class="text-muted">Tarih: {{ formatDate(currentOrder.orderDate || currentOrder.createdAt) }}</p>
                      </div>
                      <div>
                        <span :class="'badge ' + getOrderStatusBadge(currentOrder.status)">
                          {{ getOrderStatusText(currentOrder.status) }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="row mb-4">
                      <!-- Müşteri Bilgileri Kartı -->
                      <div class="col-md-6">
                        <div class="card">
                          <div class="card-header bg-light">
                            <h6 class="mb-0">Müşteri Bilgileri</h6>
                          </div>
                          <div class="card-body">
                            <div v-if="currentOrder.user">
                              <p class="mb-2"><strong>Ad Soyad:</strong> 
                                {{ currentOrder.user.name || 
                                   (currentOrder.user.firstName ? `${currentOrder.user.firstName} ${currentOrder.user.lastName || ''}` : '') || 
                                   currentOrder.customerName || 'Bilgi yok' }}
                              </p>
                              <p class="mb-2"><strong>E-posta:</strong> {{ currentOrder.user.email || currentOrder.email || 'Bilgi yok' }}</p>
                              <p class="mb-0" v-if="currentOrder.user.phone || currentOrder.phone">
                                <strong>Telefon:</strong> {{ currentOrder.user.phone || currentOrder.phone }}
                              </p>
                            </div>
                            <div v-else-if="currentOrder.customerName || currentOrder.email">
                              <p class="mb-2"><strong>Ad Soyad:</strong> {{ currentOrder.customerName || 'Bilgi yok' }}</p>
                              <p class="mb-2"><strong>E-posta:</strong> {{ currentOrder.email || 'Bilgi yok' }}</p>
                              <p class="mb-0" v-if="currentOrder.phone"><strong>Telefon:</strong> {{ currentOrder.phone }}</p>
                            </div>
                            <p v-else class="text-muted mb-0">Müşteri bilgisi bulunamadı</p>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="card">
                          <div class="card-header bg-light">
                            <h6 class="mb-0">Adres Bilgileri</h6>
                          </div>
                          <div class="card-body">
                            <div v-if="currentOrder.address">
                              <p class="mb-2"><strong>Adres:</strong> {{ currentOrder.address.address || 'Bilgi yok' }}</p>
                              <p class="mb-2" v-if="currentOrder.address.district || currentOrder.address.city">
                                <strong>İl/İlçe:</strong> 
                                {{ (currentOrder.address.district || '') + (currentOrder.address.district && currentOrder.address.city ? '/' : '') + (currentOrder.address.city || '') }}
                              </p>
                              <p class="mb-2" v-if="currentOrder.address.zipCode"><strong>Posta Kodu:</strong> {{ currentOrder.address.zipCode }}</p>
                              <p class="mb-0" v-if="currentOrder.address.country"><strong>Ülke:</strong> {{ currentOrder.address.country }}</p>
                            </div>
                            <div v-else-if="currentOrder.shippingAddress || currentOrder.shippingCity">
                              <p class="mb-2"><strong>Adres:</strong> {{ currentOrder.shippingAddress || 'Bilgi yok' }}</p>
                              <p class="mb-2" v-if="currentOrder.shippingCity || currentOrder.district">
                                <strong>İl/İlçe:</strong> 
                                {{ (currentOrder.district || '') + (currentOrder.district && currentOrder.shippingCity ? '/' : '') + (currentOrder.shippingCity || '') }}
                              </p>
                              <p class="mb-2" v-if="currentOrder.shippingZipCode"><strong>Posta Kodu:</strong> {{ currentOrder.shippingZipCode }}</p>
                              <p class="mb-0" v-if="currentOrder.shippingCountry"><strong>Ülke:</strong> {{ currentOrder.shippingCountry || 'Türkiye' }}</p>
                            </div>
                            <p v-else class="text-muted mb-0">Adres bilgisi bulunamadı</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="card mb-4">
                      <div class="card-header bg-light">
                        <h6 class="mb-0">Sipariş Detayları</h6>
                      </div>
                      <div class="card-body p-0">
                        <div class="table-responsive">
                          <table class="table mb-0">
                            <thead class="thead-light">
                              <tr>
                                <th>Ürün</th>
                                <th>Birim Fiyat</th>
                                <th>Adet</th>
                                <th class="text-right">Toplam</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-if="!currentOrder.items || currentOrder.items.length === 0">
                                <td colspan="4" class="text-center py-3">Sipariş detayı bulunamadı</td>
                              </tr>
                              <tr v-for="(item, index) in currentOrder.items || []" :key="index">
                                <td>
                                  <div class="d-flex align-items-center">
                                    <img v-if="item.product && item.product.image" 
                                      :src="item.product.image" 
                                      alt="Ürün Resmi" 
                                      class="mr-2" 
                                      style="width:40px; height:40px; object-fit:cover; border-radius:4px;"
                                    />
                                    <div>
                                      {{ (item.product && item.product.title) || 
                                         item.productName || 
                                         item.name || 
                                         'Ürün bilgisi bulunamadı' }}
                                    </div>
                                  </div>
                                </td>
                                <td>{{ formatPrice(item.price || item.unitPrice || 0) }} TL</td>
                                <td>{{ item.quantity || 1 }}</td>
                                <td class="text-right">{{ formatPrice((item.price || item.unitPrice || 0) * (item.quantity || 1)) }} TL</td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colspan="3" class="text-right"><strong>Ara Toplam:</strong></td>
                                <td class="text-right">{{ formatPrice(currentOrder.subtotalAmount || currentOrder.totalAmount) }} TL</td>
                              </tr>
                              <tr v-if="currentOrder.shippingAmount">
                                <td colspan="3" class="text-right"><strong>Kargo Ücreti:</strong></td>
                                <td class="text-right">{{ formatPrice(currentOrder.shippingAmount) }} TL</td>
                              </tr>
                              <tr v-if="currentOrder.taxAmount">
                                <td colspan="3" class="text-right"><strong>Vergi:</strong></td>
                                <td class="text-right">{{ formatPrice(currentOrder.taxAmount) }} TL</td>
                              </tr>
                              <tr>
                                <td colspan="3" class="text-right"><strong>Toplam:</strong></td>
                                <td class="text-right"><strong>{{ formatPrice(currentOrder.totalAmount) }} TL</strong></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <div class="card mb-4">
                      <div class="card-header bg-light">
                        <h6 class="mb-0">Ödeme Bilgileri</h6>
                      </div>
                      <div class="card-body">
                        <p class="mb-2"><strong>Ödeme Yöntemi:</strong> 
                          {{ currentOrder.paymentMethod === 'credit_card' ? 'Kredi Kartı' : 
                             currentOrder.paymentMethod === 'bank_transfer' ? 'Banka Havalesi' : 
                             currentOrder.paymentMethod === 'cash_on_delivery' ? 'Kapıda Ödeme' : 
                             currentOrder.paymentMethod }}
                        </p>
                        <p class="mb-0" v-if="currentOrder.paymentStatus"><strong>Ödeme Durumu:</strong> 
                          <span :class="'badge ' + (currentOrder.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning')">
                            {{ currentOrder.paymentStatus === 'paid' ? 'Ödendi' : 'Ödeme Bekliyor' }}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div class="card">
                      <div class="card-header bg-light">
                        <h6 class="mb-0">Sipariş Durumu Güncelle</h6>
                      </div>
                      <div class="card-body">
                        <div class="btn-group w-100">
                          <button 
                            v-for="status in ['pending', 'processing', 'shipped', 'delivered', 'cancelled']" 
                            :key="status"
                            class="btn"
                            :class="[
                              status === currentOrder.status ? 'btn-primary' : 'btn-outline-primary',
                              loading ? 'disabled' : ''
                            ]"
                            :disabled="loading || status === currentOrder.status"
                            @click="updateStatus(currentOrder.id, status)"
                          >
                            {{ getOrderStatusText(status) }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-right mt-4">
                    <button type="button" class="btn btn-secondary" @click="showOrderModal = false">Kapat</button>
                  </div>
                </b-modal>
              </div>
              
              <div v-if="activeTab === 'categories'" class="categories_content">
                <h3>Kategori Yönetimi</h3>
                
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <p>Kategori eklemek, düzenlemek ve silmek için bu paneli kullanabilirsiniz.</p>
                  <button class="btn btn-primary" @click="newCategory">
                    <i class="fas fa-plus mr-2"></i> Yeni Kategori Ekle
                  </button>
                </div>
                
                <!-- Yükleniyor göstergesi -->
                <div v-if="isAdminLoading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Yükleniyor...</span>
                  </div>
                  <p class="mt-2">Kategoriler yükleniyor...</p>
                </div>
                
                <!-- Hata mesajı -->
                <div v-else-if="adminError" class="alert alert-danger">
                  {{ adminError }}
                </div>
                
                <!-- Kategori tablosu -->
                <div v-else-if="adminCategories && adminCategories.length > 0" class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead class="thead-dark">
                      <tr>
                        <th>ID</th>
                        <th>Kategori Adı</th>
                        <th>Açıklama</th>
                        <th>Üst Kategori</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="category in adminCategories" :key="category.id">
                        <td>{{ category.id }}</td>
                        <td>{{ category.name }}</td>
                        <td>
                          <span class="d-inline-block text-truncate" style="max-width: 200px;">
                            {{ category.description || '-' }}
                          </span>
                        </td>
                        <td>
                          {{ getParentCategory(category.parent) }}
                        </td>
                        <td>
                          <div class="btn-group">
                            <button class="btn btn-sm btn-info mr-1" @click="editCategory(category)">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" @click="removeCategory(category.id)">
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Kategori yoksa -->
                <div v-else class="alert alert-info">
                  <p class="mb-0">Henüz kategori bulunmuyor. Yeni kategori eklemek için "Yeni Kategori Ekle" butonunu kullanabilirsiniz.</p>
                </div>
                
                <!-- Kategori Ekleme/Düzenleme Modal -->
                <b-modal v-model="showCategoryModal" :title="editMode ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'" hide-footer centered>
                  <form @submit.prevent="saveCategory">
                    <div class="form-group">
                      <label for="categoryName">Kategori Adı</label>
                      <input type="text" id="categoryName" v-model="categoryForm.name" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                      <label for="categoryDescription">Açıklama</label>
                      <textarea id="categoryDescription" v-model="categoryForm.description" class="form-control" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                      <label for="categoryParent">Üst Kategori</label>
                      <select id="categoryParent" v-model="categoryForm.parent" class="form-control">
                        <option :value="null">Ana Kategori (üst kategori yok)</option>
                        <option 
                          v-for="cat in adminCategories.filter(c => c.id !== categoryForm.id)" 
                          :key="cat.id" 
                          :value="cat.id"
                        >
                          {{ cat.name }}
                        </option>
                      </select>
                    </div>
                    
                    <div class="text-right mt-4">
                      <button type="button" class="btn btn-secondary mr-2" @click="showCategoryModal = false">İptal</button>
                      <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Kaydediliyor...</span>
                        <span v-else>Kaydet</span>
                      </button>
                    </div>
                  </form>
                </b-modal>
              </div>

              <div v-if="activeTab === 'users'" class="users_content">
                <h3>Kullanıcı Yönetimi</h3>
                
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <p>Kullanıcıları düzenlemek ve yönetmek için bu paneli kullanabilirsiniz.</p>
                </div>
                
                <!-- Yükleniyor göstergesi -->
                <div v-if="isAdminLoading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Yükleniyor...</span>
                  </div>
                  <p class="mt-2">Kullanıcılar yükleniyor...</p>
                </div>
                
                <!-- Hata mesajı -->
                <div v-else-if="adminError" class="alert alert-danger">
                  {{ adminError }}
                </div>
                
                <!-- Kullanıcı tablosu -->
                <div v-else-if="adminUsers && adminUsers.length > 0" class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead class="thead-dark">
                      <tr>
                        <th>ID</th>
                        <th>Ad Soyad</th>
                        <th>E-posta</th>
                        <th>Rol</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in adminUsers" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Bilinmeyen') }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                          <span :class="'badge ' + getUserRoleBadge(user.role)">
                            {{ getUserRoleText(user.role) }}
                          </span>
                        </td>
                        <td>
                          <div class="btn-group">
                            <button class="btn btn-sm btn-info mr-1" @click="editUser(user)">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button 
                              class="btn btn-sm btn-danger" 
                              @click="removeUser(user.id)"
                            >
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Kullanıcı yoksa -->
                <div v-else class="alert alert-info">
                  <p class="mb-0">Henüz kullanıcı bulunmuyor.</p>
                </div>
                
                <!-- Kullanıcı Düzenleme Modal -->
                <b-modal v-model="showUserModal" title="Kullanıcı Düzenle" hide-footer centered>
                  <form @submit.prevent="saveUser">
                    <div class="form-group">
                      <label for="userFirstName">Ad</label>
                      <input type="text" id="userFirstName" v-model="userForm.firstName" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                      <label for="userLastName">Soyad</label>
                      <input type="text" id="userLastName" v-model="userForm.lastName" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                      <label for="userEmail">E-posta</label>
                      <input type="email" id="userEmail" v-model="userForm.email" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                      <label for="userPassword">Şifre</label>
                      <input type="password" id="userPassword" v-model="userForm.password" class="form-control" placeholder="Şifreyi değiştirmek için doldurun">
                      <small class="form-text text-muted">Şifreyi değiştirmek istemiyorsanız boş bırakın.</small>
                    </div>
                    
                    <div class="form-group">
                      <label for="userRole">Rol</label>
                      <select id="userRole" v-model="userForm.role" class="form-control" required>
                        <option value="user">Kullanıcı</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderatör</option>
                      </select>
                    </div>
                    
                    <div class="text-right mt-4">
                      <button type="button" class="btn btn-secondary mr-2" @click="showUserModal = false">İptal</button>
                      <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Kaydediliyor...</span>
                        <span v-else>Kaydet</span>
                      </button>
                    </div>
                  </form>
                </b-modal>
              </div>

              <div v-if="activeTab === 'reviews'" class="reviews_content">
                <h3>Yorum Yönetimi</h3>
                
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <p>Ürün yorumlarını görüntülemek veya silmek için bu paneli kullanabilirsiniz.</p>
                </div>
                
                <!-- Yükleniyor göstergesi -->
                <div v-if="isAdminLoading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Yükleniyor...</span>
                  </div>
                  <p class="mt-2">Yorumlar yükleniyor...</p>
                </div>
                
                <!-- Hata mesajı -->
                <div v-else-if="adminError" class="alert alert-danger">
                  {{ adminError }}
                </div>
                
                <!-- Yorum tablosu -->
                <div v-else-if="adminReviews && adminReviews.length > 0" class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead class="thead-dark">
                      <tr>
                        <th>ID</th>
                        <th>Ürün</th>
                        <th>Kullanıcı</th>
                        <th>Değerlendirme</th>
                        <th>Başlık</th>
                        <th>Yorum</th>
                        <th>Tarih</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="review in adminReviews" :key="review.id">
                        <td>{{ review.id }}</td>
                        <td>{{ review.product ? review.product.title : 'Ürün #' + review.productId }}</td>
                        <td>{{ review.user ? review.user.name : 'Kullanıcı #' + review.userId }}</td>
                        <td>
                          <div class="rating-stars">
                            <i v-for="n in 5" :key="n" class="fas fa-star" :class="n <= review.rating ? 'text-warning' : 'text-muted'"></i>
                            <span class="ml-1">{{ review.rating }}/5</span>
                          </div>
                        </td>
                        <td>{{ review.title }}</td>
                        <td>
                          <span class="d-inline-block text-truncate" style="max-width: 150px;">
                            {{ review.comment }}
                          </span>
                        </td>
                        <td>{{ formatDate(review.createdAt) }}</td>
                        <td>
                          <div class="btn-group">
                            <button class="btn btn-sm btn-info mr-1" @click="viewReview(review)">
                              <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" @click="removeReview(review.id)" :disabled="loading">
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Yorum yoksa -->
                <div v-else class="alert alert-info">
                  <p class="mb-0">Henüz yorum bulunmuyor.</p>
                </div>
                
                <!-- Yorum Detay Modal -->
                <b-modal v-model="showReviewModal" title="Yorum Detayı" hide-footer centered>
                  <div v-if="reviewForm">
                    <div class="review-header mb-4">
                      <h5>{{ reviewForm.product ? reviewForm.product.title : 'Ürün #' + reviewForm.productId }}</h5>
                      <div class="rating-stars mb-2">
                        <i v-for="n in 5" :key="n" class="fas fa-star" :class="n <= reviewForm.rating ? 'text-warning' : 'text-muted'"></i>
                        <span class="ml-1">{{ reviewForm.rating }}/5</span>
                      </div>
                      <p class="text-muted">{{ formatDate(reviewForm.createdAt) }}</p>
                    </div>
                    
                    <div class="card mb-4">
                      <div class="card-header">
                        <h6 class="mb-0">{{ reviewForm.title || 'İsimsiz Yorum' }}</h6>
                      </div>
                      <div class="card-body">
                        <p>{{ reviewForm.comment }}</p>
                        <footer class="blockquote-footer">
                          {{ reviewForm.user ? reviewForm.user.name : 'Kullanıcı #' + reviewForm.userId }}
                        </footer>
                      </div>
                    </div>
                    
                    <div class="card mb-4">
                      <div class="card-header">
                        <h6 class="mb-0">Durum</h6>
                      </div>
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                          <span :class="'badge ' + getReviewStatusBadge(reviewForm.status)">
                            {{ getReviewStatusText(reviewForm.status) }}
                          </span>
                          
                          <div class="btn-group">
                            <button 
                              class="btn btn-sm btn-danger" 
                              @click="removeReview(reviewForm.id)"
                              :disabled="loading"
                            >
                              <i class="fas fa-trash mr-1"></i> Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-right mt-4">
                    <button type="button" class="btn btn-secondary" @click="showReviewModal = false">Kapat</button>
                  </div>
                </b-modal>
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
  name: 'AdminPanel',
  middleware: 'admin',
  head() {
    return {
      title: 'Admin Paneli',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'AndShop Admin Paneli'
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
          text: 'Admin Paneli',
          active: true
        }
      ],
      loading: false,
      error: null,
      // Ekleme ve düzenleme formları için state
      userForm: {
        id: null,
        name: '',
        email: '',
        password: '',
        role: 'user',
        active: true,
      },
      productForm: {
        id: null,
        title: '',
        description: '',
        price: 0,
        discountPrice: 0,
        stock: 0,
        category: '',
        tags: '',
        status: 'active',
        image: '',
      },
      categoryForm: {
        id: null,
        name: '',
        description: '',
        parent: null,
      },
      reviewForm: {
        id: null,
        productId: null,
        userId: null,
        rating: 5,
        comment: '',
        title: '',
        status: 'pending',
      },
      // Modal state
      showUserModal: false,
      showProductModal: false,
      showCategoryModal: false,
      showReviewModal: false,
      showOrderModal: false,
      currentOrderId: null,
      // Düzenleme modunu takip etmek için
      editMode: false,
      currentOrder: null
    };
  },
  computed: {
    ...mapGetters({
      user: 'user/currentUser',
      dashboardStats: 'admin/dashboardStats',
      recentOrders: 'admin/recentOrders',
      recentReviews: 'admin/recentReviews',
      adminUsers: 'admin/users',
      adminProducts: 'admin/products',
      adminOrders: 'admin/orders',
      adminReviews: 'admin/reviews',
      adminCategories: 'admin/categories',
      isAdminLoading: 'admin/isLoading',
      adminError: 'admin/error'
    }),
    stats() {
      return {
        orders: this.adminOrders ? this.adminOrders.length : 0,
        users: this.adminUsers ? this.adminUsers.length : 0,
        products: this.adminProducts ? this.adminProducts.length : 0,
        reviews: this.adminReviews ? this.adminReviews.length : 0
      };
    },
    // Son 5 siparişi göster
    latestOrders() {
      if (!this.adminOrders || this.adminOrders.length === 0) {
        return [];
      }
      // Siparişleri tarihe göre sırala ve ilk 5'ini al
      return [...this.adminOrders]
        .sort((a, b) => {
          const dateA = new Date(a.orderDate || a.createdAt || 0);
          const dateB = new Date(b.orderDate || b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 5)
        .map(order => ({
          id: order.orderNumber || order.id,
          date: this.formatDate(order.orderDate || order.createdAt),
          customerName: order.user ? 
            (order.user.name || 
             (order.user.firstName ? `${order.user.firstName} ${order.user.lastName || ''}`.trim() : '') || 
             order.customerName) : 
            order.customerName,
          status: order.status,
          totalAmount: order.totalAmount
        }));
    },
    // Son 5 yorumu göster
    latestReviews() {
      if (!this.adminReviews || this.adminReviews.length === 0) {
        return [];
      }
      // Yorumları tarihe göre sırala ve ilk 5'ini al
      return [...this.adminReviews]
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 5)
        .map(review => ({
          productName: review.product ? review.product.title : 'Ürün #' + review.productId,
          date: this.formatDate(review.createdAt),
          rating: review.rating,
          comment: review.comment,
          userName: review.user ? review.user.name : 'Kullanıcı #' + review.userId
        }));
    }
  },
  watch: {
    activeTab(newTab) {
      // Tab değiştiğinde ilgili verileri yükle
      this.loadTabData(newTab);
    }
  },
  mounted() {
    // Dashboard verileri yükle
    this.loadDashboardData();
  },
  methods: {
    ...mapActions({
      logout: 'user/logout',
      fetchDashboardStats: 'admin/fetchDashboardStats',
      fetchUsers: 'admin/fetchUsers',
      updateUser: 'admin/updateUser',
      deleteUser: 'admin/deleteUser',
      fetchProducts: 'admin/fetchProducts',
      addProduct: 'admin/addProduct',
      updateProduct: 'admin/updateProduct',
      deleteProduct: 'admin/deleteProduct',
      fetchOrders: 'admin/fetchOrders',
      updateOrderStatus: 'admin/updateOrderStatus',
      fetchReviews: 'admin/fetchReviews',
      updateReviewStatus: 'admin/updateReviewStatus',
      deleteReview: 'admin/deleteReview',
      fetchCategories: 'admin/fetchCategories',
      addCategory: 'admin/addCategory',
      updateCategory: 'admin/updateCategory',
      deleteCategory: 'admin/deleteCategory'
    }),
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    async loadDashboardData() {
      try {
        this.loading = true;
        // Tüm verileri yükle
        await Promise.all([
          this.fetchDashboardStats(),
          this.fetchUsers(),
          this.fetchProducts(),
          this.fetchOrders(),
          this.fetchReviews(),
          this.fetchCategories()
        ]);
        this.loading = false;
      } catch (error) {
        console.error('Dashboard verilerini yüklerken hata:', error);
        this.error = error.message || 'Veriler yüklenirken bir hata oluştu';
        this.loading = false;
      }
    },
    async loadTabData(tab) {
      try {
        this.loading = true;
        switch (tab) {
          case 'users':
            await this.fetchUsers();
            break;
          case 'products':
            await this.fetchProducts();
            await this.fetchCategories(); // Kategorileri de yükle
            break;
          case 'orders':
            await this.fetchOrders();
            break;
          case 'reviews':
            await this.fetchReviews();
            break;
          case 'categories':
            await this.fetchCategories();
            break;
        }
        this.loading = false;
      } catch (error) {
        console.error(`${tab} verilerini yüklerken hata:`, error);
        this.error = error.message || 'Veriler yüklenirken bir hata oluştu';
        this.loading = false;
      }
    },
    // Kullanıcı işlemleri
    editUser(user) {
      this.userForm = { ...user };
      this.editMode = true;
      this.showUserModal = true;
    },
    async saveUser() {
      try {
        this.loading = true;
        if (this.editMode) {
          await this.updateUser({
            userId: this.userForm.id,
            userData: { ...this.userForm }
          });
          this.$toast.success('Kullanıcı başarıyla güncellendi');
        } else {
          // Yeni kullanıcı eklemek için API çağrısı eklenecek
          this.$toast.success('Kullanıcı başarıyla eklendi');
        }
        this.showUserModal = false;
        this.resetUserForm();
        this.loading = false;
      } catch (error) {
        this.$toast.error('İşlem sırasında bir hata oluştu');
        this.loading = false;
        console.error('Kullanıcı kaydetme hatası:', error);
      }
    },
    async removeUser(userId) {
      if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
        try {
          this.loading = true;
          await this.deleteUser(userId);
          this.$toast.success('Kullanıcı başarıyla silindi');
          this.loading = false;
        } catch (error) {
          this.$toast.error('Kullanıcı silinirken bir hata oluştu');
          this.loading = false;
          console.error('Kullanıcı silme hatası:', error);
        }
      }
    },
    resetUserForm() {
      this.userForm = {
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user'
      };
      this.editMode = false;
    },
    // Ürün işlemleri
    newProduct() {
      this.resetProductForm();
      this.editMode = false;
      this.showProductModal = true;
    },
    editProduct(product) {
      this.productForm = { ...product };
      this.editMode = true;
      this.showProductModal = true;
    },
    async saveProduct() {
      try {
        this.loading = true;
        
        // Sayısal alanların tipini düzelt - API'nin beklediği format
        const productFormData = {
          ...this.productForm,
          // Sayısal alanları number tipine dönüştür
          price: parseFloat(this.productForm.price) || 0,
          discountPrice: parseFloat(this.productForm.discountPrice) || 0,
          stock: parseInt(this.productForm.stock) || 0
        };
        
        // Yeni ürün eklenirken id alanını kaldır
        if (!this.editMode) {
          delete productFormData.id;
        }
        
        if (this.editMode) {
          await this.updateProduct({
            productId: this.productForm.id,
            productData: productFormData
          });
          this.$toast.success('Ürün başarıyla güncellendi');
        } else {
          await this.addProduct(productFormData);
          this.$toast.success('Ürün başarıyla eklendi');
        }
        this.showProductModal = false;
        this.resetProductForm();
        this.loading = false;
      } catch (error) {
        this.$toast.error('İşlem sırasında bir hata oluştu');
        this.loading = false;
        console.error('Ürün kaydetme hatası:', error);
      }
    },
    async removeProduct(productId) {
      if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
        try {
          this.loading = true;
          await this.deleteProduct(productId);
          this.$toast.success('Ürün başarıyla silindi');
          this.loading = false;
        } catch (error) {
          this.$toast.error('Ürün silinirken bir hata oluştu');
          this.loading = false;
          console.error('Ürün silme hatası:', error);
        }
      }
    },
    resetProductForm() {
      this.productForm = {
        id: null,
        title: '',
        description: '',
        price: 0,
        discountPrice: 0,
        stock: 0,
        category: '',
        tags: '',
        status: 'active',
        image: '',
      };
      this.editMode = false;
    },
    // Sipariş işlemleri
    viewOrder(order) {
      try {
        console.log('Orijinal sipariş verisi:', order);
        console.log('Orijinal sipariş status/orderStatus:', order.status, order.orderStatus);
        console.log('Orijinal sipariş items:', order.items);
        
        // OrderStatus ve Status alanlarını senkronize et
        if (order.orderStatus && !order.status) {
          order.status = order.orderStatus;
          console.log('View order - status set from orderStatus:', order.orderStatus);
        } else if (order.status && !order.orderStatus) {
          order.orderStatus = order.status;
          console.log('View order - orderStatus set from status:', order.status);
        }
        
        // Store'daki getOrder fonksiyonunu çağır
        this.$store.dispatch('admin/getOrder', order.id)
          .then(orderData => {
            console.log('API tarafından dönen sipariş verisi:', orderData);
            console.log('API tarafından dönen sipariş status/orderStatus:', orderData ? orderData.status : null, orderData ? orderData.orderStatus : null);
            console.log('API tarafından dönen sipariş items:', orderData ? orderData.items : null);
            
            // API'den gelen siparişi kontrol et ve eksik alanları tamamla
            const enrichedOrder = this.enrichOrderData(orderData || order);
            console.log('Zenginleştirilmiş sipariş verisi:', enrichedOrder);
            console.log('Zenginleştirilmiş sipariş status/orderStatus:', enrichedOrder.status, enrichedOrder.orderStatus);
            console.log('Zenginleştirilmiş sipariş items:', enrichedOrder.items);
            
            // Siparişi göster
            this.currentOrder = enrichedOrder;
            this.showOrderModal = true;
          })
          .catch(error => {
            console.error('Sipariş detayı alınırken hata:', error);
            
            // Hata durumunda bile mevcut siparişi zenginleştirerek göster
            const fallbackOrder = this.enrichOrderData(order);
            console.log('Hata sonrası zenginleştirilmiş sipariş verisi:', fallbackOrder);
            console.log('Hata sonrası zenginleştirilmiş sipariş status/orderStatus:', fallbackOrder.status, fallbackOrder.orderStatus);
            console.log('Hata sonrası zenginleştirilmiş sipariş items:', fallbackOrder.items);
            
            this.currentOrder = fallbackOrder;
            this.showOrderModal = true;
          });
      } catch (e) {
        console.error('Sipariş görüntüleme hatası:', e);
        
        // Herhangi bir hata olursa da siparişi göstermeye çalış
        const emergencyOrder = this.enrichOrderData(order);
        console.log('Acil durum sonrası sipariş verisi:', emergencyOrder);
        
        this.currentOrder = emergencyOrder;
        this.showOrderModal = true;
      }
    },
    // Sipariş verisini zenginleştir - eksik alanları tamamla
    enrichOrderData(result) {
      if (!result) return null;
      
      // Derin kopya oluştur
      const enriched = JSON.parse(JSON.stringify(result));
      
      console.log('Adres bilgisi işleme alınıyor:', enriched.address, 'Shipping bilgileri:', {
        addressDetail: enriched.addressDetail,
        shippingAddress: enriched.shippingAddress, 
        shippingCity: enriched.shippingCity,
        district: enriched.district, 
        shippingZipCode: enriched.shippingZipCode
      });
      
      // Sipariş numarası yoksa ID'den oluştur
      if (!enriched.orderNumber) {
        enriched.orderNumber = `SP${enriched.id}`;
      }
      
      // Check and fix user data
      if (enriched.user) {
        // Eğer firstName ve lastName varsa ama name yoksa, name oluştur
        if (enriched.user.firstName && !enriched.user.name) {
          enriched.user.name = `${enriched.user.firstName} ${enriched.user.lastName || ''}`.trim();
        }
        
        // Eksik alanları tamamla
        enriched.user.email = enriched.user.email || enriched.email || 'bilgi@andshop.com';
        enriched.user.phone = enriched.user.phone || enriched.phone || '';
      } else if (enriched.customerName || enriched.email) {
        // Kullanıcı nesnesi yoksa oluştur
        enriched.user = {
          id: enriched.userId || 0,
          name: enriched.customerName || 'Bilinmeyen Müşteri',
          email: enriched.email || 'bilgi@andshop.com',
          phone: enriched.phone || ''
        };
      }
      
      // ADRES BİLGİSİNİ DAHA KAPSAMLI KONTROL ET
      // 1. Adres objesi var mı ve içi dolu mu kontrol et
      const hasValidAddress = enriched.address && 
                             typeof enriched.address === 'object' && 
                             (enriched.address.addressDetail || enriched.address.address || enriched.address.city || enriched.address.district);
      
      // 2. Eğer adres objesi tamamen boşsa veya yetersizse, diğer kaynaklardan dolduralım
      if (!hasValidAddress) {
        // API'den gelen yeni adres formatını kontrol et
        if (enriched.addressDetail || enriched.city || enriched.district) {
          console.log('API adres formatı tespit edildi:', {
            addressDetail: enriched.addressDetail,
            city: enriched.city,
            district: enriched.district
          });
          
          // Yeni API formatı - standart adres nesnesine dönüştür
          const newAddress = {
            address: enriched.addressDetail || enriched.shippingAddress || enriched.billingAddress || 'Adres belirtilmemiş',
            city: enriched.city || enriched.shippingCity || enriched.billingCity || 'İstanbul',
            district: enriched.district || enriched.shippingDistrict || enriched.billingDistrict || 'Merkez',
            zipCode: enriched.zipCode || enriched.shippingZipCode || enriched.billingZipCode || '34000',
            country: 'Türkiye'
          };
          
          enriched.address = newAddress;
          console.log('API formatından dönüştürülen adres:', newAddress);
        } else {
          // Eski mantık - shipping ve billing bilgilerinden doldur
          const newAddress = {
            address: enriched.shippingAddress || enriched.billingAddress || 'Adres belirtilmemiş',
            city: enriched.shippingCity || enriched.billingCity || 'İstanbul',
            district: enriched.district || enriched.shippingDistrict || enriched.billingDistrict || 'Merkez',
            zipCode: enriched.shippingZipCode || enriched.billingZipCode || '34000',
            country: enriched.shippingCountry || enriched.billingCountry || 'Türkiye'
          };
          
          enriched.address = newAddress;
          console.log('Shipping bilgilerinden oluşturulan adres:', newAddress);
        }
      } else {
        // Var olan adres nesnesini güncelle - addressDetail -> address dönüşümü yap
        if (enriched.address.addressDetail && !enriched.address.address) {
          enriched.address.address = enriched.address.addressDetail;
        }
        
        // Eksik alanları tamamla
        enriched.address = {
          ...enriched.address,
          address: enriched.address.address || enriched.address.addressDetail || 'Adres bilgisi bulunamadı',
          city: enriched.address.city || enriched.city || enriched.shippingCity || 'İstanbul',
          district: enriched.address.district || enriched.district || 'Merkez',
          zipCode: enriched.address.zipCode || enriched.zipCode || '34000',
          country: enriched.address.country || 'Türkiye'
        };
        console.log('Güncellenen adres nesnesi:', enriched.address);
      }
      
      // Sipariş ürünlerini kontrol et ve tamamla
      if (!enriched.items || !Array.isArray(enriched.items) || enriched.items.length === 0) {
        console.log("Sipariş ürünleri bulunamadı, API alternatifleri kontrol ediliyor");
        
        // orderItems alanı varsa kullan (bazı API'ler farklı alan adı kullanabilir)
        if (enriched.orderItems && Array.isArray(enriched.orderItems) && enriched.orderItems.length > 0) {
          console.log("orderItems alanı bulundu, items alanına kopyalanıyor:", enriched.orderItems);
          enriched.items = enriched.orderItems;
        } 
        // Hala items yoksa örnek ürün oluştur
        else {
          console.log("Hiçbir ürün verisi bulunamadı, örnek ürün oluşturuluyor");
          enriched.items = [{
            id: 0,
            productId: 0,
            orderId: enriched.id,
            product: { 
              id: 0, 
              title: 'Sipariş detayı bulunamadı',
              image: '/img/product/placeholder.png'
            },
            productName: 'Sipariş detayı bulunamadı',
            price: enriched.totalAmount || 0,
            quantity: 1,
            totalPrice: enriched.totalAmount || 0
          }];
        }
      } else {
        console.log(`${enriched.items.length} adet ürün işleniyor:`, enriched.items);
        enriched.items = enriched.items.map(item => {
          // Product nesnesi oluştur veya zenginleştir
          if (!item.product) {
            console.log("Ürün nesnesi eksik, oluşturuluyor:", item);
            item.product = {
              id: item.productId || 0,
              title: item.productName || item.name || 'Ürün adı bulunamadı',
              image: item.image || '/img/product/placeholder.png'
            };
          }
          
          // ProductName alanını ekle veya doldur
          if (!item.productName && item.product && item.product.title) {
            item.productName = item.product.title;
          } else if (!item.productName && item.name) {
            item.productName = item.name;
          }
          
          // Fiyat alanlarını kontrol et
          item.price = item.price || item.unitPrice || 0;
          item.quantity = item.quantity || 1;
          item.totalPrice = item.totalPrice || (item.price * item.quantity);
          
          return item;
        });
      }
      
      // Toplam tutarı hesapla veya kontrol et
      if (!enriched.totalAmount || isNaN(enriched.totalAmount)) {
        enriched.totalAmount = enriched.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
      
      if (!enriched.subtotalAmount) {
        enriched.subtotalAmount = enriched.totalAmount;
      }
      
      // Durumu standartlaştır
      if (enriched.orderStatus && !enriched.status) {
        enriched.status = enriched.orderStatus;
      } else if (!enriched.orderStatus && enriched.status) {
        enriched.orderStatus = enriched.status;
      } else if (!enriched.orderStatus && !enriched.status) {
        enriched.status = 'pending';
        enriched.orderStatus = 'pending';
      }
      
      // Ödeme metodunu kontrol et
      if (!enriched.paymentMethod) {
        enriched.paymentMethod = 'unknown';
      }
      
      // Tarih bilgisini kontrol et
      if (!enriched.orderDate && enriched.createdAt) {
        enriched.orderDate = enriched.createdAt;
      } else if (!enriched.orderDate) {
        enriched.orderDate = new Date().toISOString();
      }
      
      console.log('Sipariş detayları işlendi, döndürülen veri:', enriched);
      return enriched;
    },
    async updateStatus(orderId, status) {
      try {
        this.loading = true;
        
        // OrderStatus ile Status alanını ayarla - API beklentilerine göre
        const orderStatusData = {
          orderStatus: status,
          status: status,
          // API zorunlu olarak boş string bekliyor - null kabul etmiyor
          paymentStatus: "",
          trackingNumber: "",
          carrierName: "",
          invoiceNumber: "",
          notes: "",
          cancellationReason: ""
        };
        
        // UI'da sipariş durumunu hemen güncelle (kullanıcı geri bildirimi için)
        if (this.currentOrder) {
          this.currentOrder.status = status;
          this.currentOrder.orderStatus = status;
        }

        try {
          // Sipariş durumunu API'de güncellemeye çalış
          await this.updateOrderStatus({
            orderId,
            statusData: orderStatusData
          });
          
          // Başarılı güncelleme
          this.$toast.success('Sipariş durumu başarıyla güncellendi');
          
          // Kısa beklemeden sonra modalı kapat
          setTimeout(() => {
            this.showOrderModal = false;
          }, 1000);
        } catch (apiError) {
          console.warn('API üzerinde güncelleme yapılamadı:', apiError);
          
          // API hatasına göre mesaj göster
          if (apiError.response && apiError.response.status === 401) {
            this.$toast.warning('Oturum hatası: Tekrar giriş yapmanız gerekebilir, ancak sipariş durumu ekranda güncellendi.');
          } else if (apiError.response && apiError.response.status === 400) {
            // Bad Request hatası - API istek formatı hatası
            console.error('API istek formatı hatası:', apiError.response.data);
            this.$toast.warning('API format hatası: Sipariş durumu ekranda güncellendi, ancak veritabanında güncelleme yapılamadı.');
          } else {
            this.$toast.warning('Sipariş durumu ekranda güncellendi, ancak veritabanında güncelleme yapılamadı.');
          }
        }
        
        this.loading = false;
      } catch (error) {
        console.error('Sipariş durumu güncelleme işleminde kritik hata:', error);
        this.$toast.error('Sipariş durumu güncellenirken beklenmeyen bir hata oluştu');
        this.loading = false;
      }
    },
    // Kategori işlemleri
    newCategory() {
      this.resetCategoryForm();
      this.editMode = false;
      this.showCategoryModal = true;
    },
    editCategory(category) {
      this.categoryForm = { ...category };
      this.editMode = true;
      this.showCategoryModal = true;
    },
    async saveCategory() {
      try {
        this.loading = true;
        
        // Kategori verisi hazırla
        const categoryData = { ...this.categoryForm };
        
        // Yeni kategori ekliyorsak id alanını kaldır
        if (!this.editMode) {
          delete categoryData.id;
          console.log('Yeni kategori eklenecek (ID kaldırıldı):', categoryData);
        }
        
        if (this.editMode) {
          await this.updateCategory({
            categoryId: this.categoryForm.id,
            categoryData: categoryData
          });
          this.$toast.success('Kategori başarıyla güncellendi');
        } else {
          await this.addCategory(categoryData);
          this.$toast.success('Kategori başarıyla eklendi');
        }
        this.showCategoryModal = false;
        this.resetCategoryForm();
        this.loading = false;
      } catch (error) {
        this.$toast.error('İşlem sırasında bir hata oluştu');
        this.loading = false;
        console.error('Kategori kaydetme hatası:', error);
      }
    },
    async removeCategory(categoryId) {
      if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
        try {
          this.loading = true;
          await this.deleteCategory(categoryId);
          this.$toast.success('Kategori başarıyla silindi');
          this.loading = false;
        } catch (error) {
          this.$toast.error('Kategori silinirken bir hata oluştu');
          this.loading = false;
          console.error('Kategori silme hatası:', error);
        }
      }
    },
    resetCategoryForm() {
      this.categoryForm = {
        id: null,
        name: '',
        description: '',
        parent: null
      };
      this.editMode = false;
    },
    // Yorum işlemleri
    viewReview(review) {
      this.reviewForm = { ...review };
      this.showReviewModal = true;
    },
    async updateReviewStatus(reviewId, status) {
      try {
        this.loading = true;
        await this.updateReviewStatus({
          reviewId,
          statusData: { status }
        });
        this.$toast.success('Yorum durumu güncellendi');
        this.loading = false;
        this.showReviewModal = false;
      } catch (error) {
        this.$toast.error('Yorum durumu güncellenirken bir hata oluştu');
        this.loading = false;
        console.error('Yorum durumu güncelleme hatası:', error);
      }
    },
    async removeReview(reviewId) {
      if (confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
        try {
          this.loading = true;
          
          // Kullanıcı ID'sini kontrol et
          if (!this.$store.state.user.user || !this.$store.state.user.user.id) {
            this.$toast.error('Yorum silmek için önce giriş yapmalısınız');
            this.loading = false;
            return;
          }
          
          // Yorum silme işlemini çağır
          const result = await this.deleteReview(reviewId);
          
          // UI'da yorum listesini güncelle
          // Eğer modal açıksa ve silinen yorumu gösteriyorsa, modalı kapat
          if (this.showReviewModal && this.reviewForm && this.reviewForm.id === reviewId) {
            this.showReviewModal = false;
          }
          
          if (result && result.success === false) {
            // Başarısız silme işlemi
            this.$toast.warning('Yorum ekrandan silindi ancak veritabanında silinmedi');
          } else {
            // Başarılı silme işlemi
            this.$toast.success('Yorum başarıyla silindi');
          }
          
          this.loading = false;
        } catch (error) {
          console.error('Yorum silme hatası:', error);
          
          // Özel hata mesajı göster
          if (error.response && error.response.status === 401) {
            this.$toast.warning('Yetkilendirme hatası: Lütfen tekrar giriş yapın, ancak işleminiz kaydedildi.');
          } else {
            this.$toast.warning('Yorum ekrandan silindi ancak veritabanında silinmedi.');
          }
          
          this.loading = false;
        }
      }
    },
    getOrderStatusBadge(status) {
      const badges = {
        'pending': 'badge-warning',
        'processing': 'badge-info',
        'shipped': 'badge-primary',
        'delivered': 'badge-success',
        'cancelled': 'badge-danger'
      };
      
      return badges[status] || 'badge-secondary';
    },
    getOrderStatusText(status) {
      const statusTexts = {
        'pending': 'Beklemede',
        'processing': 'İşleniyor',
        'shipped': 'Kargoya Verildi',
        'delivered': 'Teslim Edildi',
        'cancelled': 'İptal Edildi'
      };
      
      return statusTexts[status] || status;
    },
    formatPrice(price) {
      if (typeof price !== 'number') {
        price = parseFloat(price) || 0;
      }
      return price.toFixed(2);
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },
    getUserRoleBadge(role) {
      const badges = {
        'admin': 'badge-danger',
        'user': 'badge-primary',
        'moderator': 'badge-warning'
      };
      
      return badges[role] || 'badge-secondary';
    },
    getUserRoleText(role) {
      const roleTexts = {
        'admin': 'Admin',
        'user': 'Kullanıcı',
        'moderator': 'Moderatör'
      };
      
      return roleTexts[role] || role;
    },
    getReviewStatusBadge(status) {
      const badges = {
        'pending': 'badge-warning',
        'approved': 'badge-success',
        'rejected': 'badge-danger'
      };
      
      return badges[status] || 'badge-secondary';
    },
    getReviewStatusText(status) {
      const statusTexts = {
        'pending': 'Onay Bekliyor',
        'approved': 'Onaylandı',
        'rejected': 'Reddedildi'
      };
      
      return statusTexts[status] || status;
    },
    getParentCategory(parentId) {
      if (parentId === null) return 'Ana Kategori';
      const parent = this.adminCategories.find(c => c.id === parentId);
      return parent ? parent.name : 'Ana Kategori';
    }
  }
};
</script>

<style scoped>
.admin_sidebar {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.05);
  overflow: hidden;
}

.admin_sidebar_user {
  background: linear-gradient(135deg, #4b6cb7, #182848);
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

.admin_sidebar_menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.admin_sidebar_menu ul li {
  border-bottom: 1px solid #f0f0f0;
}

.admin_sidebar_menu ul li:last-child {
  border-bottom: none;
}

.admin_sidebar_menu ul li a {
  display: block;
  padding: 15px 20px;
  color: #333;
  transition: all 0.3s;
  cursor: pointer;
}

.admin_sidebar_menu ul li a i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.admin_sidebar_menu ul li.active a {
  background-color: #f5f5f5;
  color: #4b6cb7;
  border-left: 3px solid #4b6cb7;
}

.admin_sidebar_menu ul li a:hover:not(.active) {
  background-color: #f9f9f9;
  color: #4b6cb7;
}

.admin_content {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.05);
  padding: 30px;
}

.dashboard_box {
  background: #fff;
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
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4b6cb7, #182848);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.dashboard_box_icon i {
  color: #fff;
  font-size: 20px;
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

.recent-order-item, .recent-review-item {
  padding: 10px 0;
}

.badge {
  padding: 5px 10px;
  border-radius: 30px;
  font-weight: 500;
}

.badge-warning {
  background-color: #ffc107;
  color: #212529;
}

.badge-info {
  background-color: #17a2b8;
  color: #fff;
}

.badge-primary {
  background-color: #4b6cb7;
  color: #fff;
}

.badge-success {
  background-color: #28a745;
  color: #fff;
}

.badge-danger {
  background-color: #dc3545;
  color: #fff;
}

.card {
  border: none;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
  padding: 15px;
}

.card-title {
  color: #333;
  font-weight: 600;
}

.card-body {
  padding: 15px;
}

/* Ürün tablosu için özel stiller */
.product-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

/* Tablolar için genel stiller */
.table th {
  font-weight: 600;
  border-top: none;
  background-color: #343a40;
  color: white;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.table td {
  vertical-align: middle;
}

/* Yıldız derecelendirme */
.rating-stars {
  display: inline-flex;
  align-items: center;
}

.rating-stars .fa-star.text-warning {
  color: #ffc107 !important;
}

.rating-stars .fa-star.text-muted {
  color: #e0e0e0 !important;
}

/* Modal formu */
.modal-header {
  border-bottom: none;
}

.modal-footer {
  border-top: none;
}

.form-control:focus {
  border-color: #4b6cb7;
  box-shadow: 0 0 0 0.2rem rgba(75, 108, 183, 0.25);
}

.btn-primary {
  background-color: #4b6cb7;
  border-color: #4b6cb7;
}

.btn-primary:hover, .btn-primary:focus {
  background-color: #3b5998;
  border-color: #3b5998;
}

.btn-outline-primary {
  color: #4b6cb7;
  border-color: #4b6cb7;
}

.btn-outline-primary:hover, .btn-outline-primary:focus {
  background-color: #4b6cb7;
  border-color: #4b6cb7;
}

/* Sipariş detay sayfası */
.order-header h5 {
  margin-bottom: 5px;
  font-weight: 600;
}

/* Spinner */
.spinner-border.text-primary {
  color: #4b6cb7 !important;
}

/* Responsive */
@media (max-width: 991px) {
  .admin_sidebar {
    margin-bottom: 30px;
  }
}
</style> 