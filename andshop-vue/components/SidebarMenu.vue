<template>
  <div class="sidebar-menu">
    <div class="sidebar-menu-header">
      <h3>Kategoriler</h3>
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <ul class="menu-list">
      <li>
        <nuxt-link to="/shop">
          Tüm Ürünler
        </nuxt-link>
      </li>
      <li v-for="(category, index) in storeCategories" :key="index">
        <nuxt-link :to="`/shop?category=${encodeURIComponent(category)}`">
          {{ category }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SidebarMenu',
  computed: {
    ...mapGetters({
      storeCategories: 'products/getCategories'
    })
  },
  methods: {
    ...mapActions({
      fetchCategories: 'products/fetchCategories'
    })
  },
  mounted() {
    // Kategorileri yükle
    this.fetchCategories();
  }
}
</script>

<style scoped>
.sidebar-menu {
  background-color: #fff;
  width: 100%;
  padding: 20px;
}

.sidebar-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.sidebar-menu-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  margin-bottom: 10px;
}

.menu-list li a {
  display: block;
  padding: 8px 0;
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.menu-list li a:hover {
  color: #f79837;
}
</style> 