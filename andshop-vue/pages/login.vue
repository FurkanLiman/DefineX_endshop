<template>
  <div>
    <!-- Banner Area -->
    <section id="common_banner_one">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="common_banner_text">
              <h2>Giriş Yap</h2>
              <b-breadcrumb :items="breadcrumbItems" class="bg-transparent"></b-breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Login Form Area -->
    <section id="login_form_area" class="ptb-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="login_form_container">
              <div class="login_form_title text-center">
                <h3>Hesabınıza Giriş Yapın</h3>
                <p>Henüz üye değil misiniz? <nuxt-link to="/register">Kayıt Olun</nuxt-link></p>
              </div>
              
              <!-- Hata mesajı gösterimi -->
              <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ error }}
                <button type="button" class="close" @click="clearError">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              
              <!-- Form -->
              <form @submit.prevent="onSubmit">
                <div class="form-group">
                  <label for="email">E-posta Adresi</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="email" 
                    class="form-control" 
                    placeholder="E-posta adresiniz"
                    required>
                </div>
                
                <div class="form-group">
                  <label for="password">Şifre</label>
                  <div class="password-field">
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      id="password" 
                      v-model="password" 
                      class="form-control" 
                      placeholder="Şifreniz"
                      required>
                    <span 
                      class="password-toggle" 
                      @click="showPassword = !showPassword">
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </span>
                  </div>
                </div>
                
                <div class="form-check mb-3">
                  <input type="checkbox" class="form-check-input" id="remember_me" v-model="rememberMe">
                  <label class="form-check-label" for="remember_me">Beni Hatırla</label>
                  <a href="#" class="float-right forgot-password">Şifremi Unuttum</a>
                </div>
                
                <div class="login_submit_btn text-center">
                  <button 
                    type="submit" 
                    class="theme-btn-one btn-black-overlay btn_md"
                    :disabled="loading">
                    <span v-if="loading">
                      <i class="fas fa-spinner fa-spin mr-2"></i>Giriş Yapılıyor...
                    </span>
                    <span v-else>Giriş Yap</span>
                  </button>
                </div>
                
                <div class="social_login_opt text-center mt-4">
                  <p class="separator">veya</p>
                  <div class="social_login_btns">
                    <button type="button" class="google-btn">
                      <i class="fab fa-google"></i> Google ile Giriş Yap
                    </button>
                    <button type="button" class="facebook-btn mt-2">
                      <i class="fab fa-facebook-f"></i> Facebook ile Giriş Yap
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'LoginPage',
  head() {
    return {
      title: 'Giriş Yap',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Hesabınıza giriş yapın'
        }
      ]
    };
  },
  middleware: 'auth',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      breadcrumbItems: [
        {
          text: 'Anasayfa',
          to: '/'
        },
        {
          text: 'Giriş Yap',
          active: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      loading: 'user/isLoading',
      error: 'user/error',
      isAuthenticated: 'user/isAuthenticated'
    })
  },
  methods: {
    ...mapActions({
      login: 'user/login'
    }),
    ...mapMutations({
      clearError: 'user/CLEAR_ERROR'
    }),
    async onSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      
      try {
        await this.login({
          email: this.email,
          password: this.password
        });
        
        this.$toast.success('Giriş başarılı, yönlendiriliyorsunuz...');
        
        // Ana sayfaya yönlendir
        setTimeout(() => {
          this.$router.push('/');
        }, 500);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Giriş yapılırken bir hata oluştu';
        this.$toast.error(errorMessage);
      } finally {
        this.isSubmitting = false;
      }
    },
    validateForm() {
      // Formun doğrulanması için gerekli işlemler burada yapılabilir
      return true; // Varsayılan olarak form doğru kabul edilir
    }
  }
};
</script>

<style scoped>
.login_form_container {
  background: #fff;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
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

.forgot-password {
  color: #f79837;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  color: #6c757d;
  margin: 20px 0;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dee2e6;
  margin: 0 10px;
}

.social_login_btns button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  transition: all 0.3s ease;
}

.social_login_btns i {
  margin-right: 10px;
}

.google-btn {
  background-color: #fff;
  color: #757575;
  border: 1px solid #ddd !important;
}

.google-btn:hover {
  background-color: #f1f1f1;
}

.facebook-btn {
  background-color: #3b5998;
  color: white;
}

.facebook-btn:hover {
  background-color: #344e86;
}
</style>