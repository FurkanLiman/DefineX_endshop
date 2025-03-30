<template>
  <div>
    <!-- Banner Area -->
    <section id="common_banner_one">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="common_banner_text">
              <h2>Kayıt Ol</h2>
              <b-breadcrumb :items="breadcrumbItems" class="bg-transparent"></b-breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Register Form Area -->
    <section id="register_form_area" class="ptb-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="register_form_container">
              <div class="register_form_title text-center">
                <h3>Yeni Hesap Oluştur</h3>
                <p>Zaten üye misiniz? <nuxt-link to="/login">Giriş Yapın</nuxt-link></p>
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
                  <label for="name">Adınız Soyadınız</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="name" 
                    class="form-control" 
                    placeholder="Adınız ve soyadınız"
                    required>
                </div>
                
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
                  <label for="phone">Telefon Numarası</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="phone" 
                    class="form-control" 
                    placeholder="(5xx) xxx xx xx"
                    @input="formatPhoneNumber"
                    required>
                </div>
                
                <div class="form-group">
                  <label for="birthday">Doğum Tarihi</label>
                  <input 
                    type="date" 
                    id="birthday" 
                    v-model="birthday" 
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
                
                <div class="form-group">
                  <label>Cinsiyet</label>
                  <div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" id="genderMale" v-model="gender" value="male">
                      <label class="form-check-label" for="genderMale">Erkek</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" id="genderFemale" v-model="gender" value="female">
                      <label class="form-check-label" for="genderFemale">Kadın</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" id="genderOther" v-model="gender" value="other">
                      <label class="form-check-label" for="genderOther">Belirtmek İstemiyorum</label>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="password">Şifre</label>
                  <div class="password-field">
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      id="password" 
                      v-model="password" 
                      class="form-control" 
                      placeholder="Şifreniz (en az 6 karakter)"
                      required
                      minlength="6">
                    <span 
                      class="password-toggle" 
                      @click="showPassword = !showPassword">
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </span>
                  </div>
                  <small class="form-text text-muted">
                    Şifreniz en az 6 karakter uzunluğunda olmalıdır.
                  </small>
                </div>
                
                <div class="form-group">
                  <label for="confirmPassword">Şifre Tekrarı</label>
                  <div class="password-field">
                    <input 
                      :type="showConfirmPassword ? 'text' : 'password'" 
                      id="confirmPassword" 
                      v-model="confirmPassword" 
                      class="form-control" 
                      placeholder="Şifrenizi tekrar girin"
                      required>
                    <span 
                      class="password-toggle" 
                      @click="showConfirmPassword = !showConfirmPassword">
                      <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </span>
                  </div>
                  <div v-if="passwordsMismatch" class="text-danger mt-1">
                    Şifreler eşleşmiyor
                  </div>
                </div>
                
                <div class="form-check mb-3">
                  <input 
                    type="checkbox" 
                    class="form-check-input" 
                    id="terms" 
                    v-model="agreeTerms"
                    required>
                  <label class="form-check-label" for="terms">
                    <span class="terms-text">
                      <nuxt-link to="/terms">Kullanım Koşulları</nuxt-link> ve 
                      <nuxt-link to="/privacy">Gizlilik Politikası</nuxt-link>'nı 
                      okudum ve kabul ediyorum.
                    </span>
                  </label>
                </div>
                
                <div class="register_submit_btn text-center">
                  <button 
                    type="submit" 
                    class="theme-btn-one btn-black-overlay btn_md"
                    :disabled="loading || passwordsMismatch || !agreeTerms">
                    <span v-if="loading">
                      <i class="fas fa-spinner fa-spin mr-2"></i>Kayıt Yapılıyor...
                    </span>
                    <span v-else>Kayıt Ol</span>
                  </button>
                </div>
                
                <div class="social_login_opt text-center mt-4">
                  <p class="separator">veya</p>
                  <div class="social_login_btns">
                    <button type="button" class="google-btn">
                      <i class="fab fa-google"></i> Google ile Kayıt Ol
                    </button>
                    <button type="button" class="facebook-btn mt-2">
                      <i class="fab fa-facebook-f"></i> Facebook ile Kayıt Ol
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
  name: 'RegisterPage',
  head() {
    return {
      title: 'Kayıt Ol',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Yeni hesap oluşturun'
        }
      ]
    };
  },
  middleware: 'auth',
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      showPassword: false,
      showConfirmPassword: false,
      birthday: '',
      gender: 'other',
      breadcrumbItems: [
        {
          text: 'Anasayfa',
          to: '/'
        },
        {
          text: 'Kayıt Ol',
          active: true
        }
      ],
      minDate: '1920-01-01',
      maxDate: new Date().toISOString().split('T')[0],
      birthdayError: ''
    };
  },
  computed: {
    ...mapGetters({
      loading: 'user/isLoading',
      error: 'user/error',
      isAuthenticated: 'user/isAuthenticated'
    }),
    passwordsMismatch() {
      return this.password && this.confirmPassword && this.password !== this.confirmPassword;
    }
  },
  methods: {
    ...mapActions({
      register: 'user/register'
    }),
    ...mapMutations({
      clearError: 'user/CLEAR_ERROR'
    }),
    async onSubmit() {
      // Şifrelerin eşleşip eşleşmediğini kontrol et
      if (this.password !== this.confirmPassword) {
        this.$toast.error('Şifreler eşleşmiyor');
        return;
      }
      
      // Doğum tarihi kontrolü
      if (this.birthdayError) {
        this.$toast.error('Doğum tarihi hatası: ' + this.birthdayError);
        return;
      }
      
      try {
        // Ad soyad ayrımı
        const nameParts = this.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const userData = {
          firstName,
          lastName,
          email: this.email,
          phone: this.phone,
          password: this.password,
          birthday: this.birthday || null,
          gender: this.gender
        };
        
        await this.register(userData);
        
        // Başarılı kayıt, yönlendirme yap
        this.$toast.success('Hesabınız başarıyla oluşturuldu!');
        
        // Varsa yönlendirme adresi kullan, yoksa ana sayfaya git
        const redirectPath = this.$route.query.redirect || '/';
        this.$router.push(redirectPath);
      } catch (error) {
        console.error('Kayıt hatası:', error);
        this.$toast.error(error.message || 'Kayıt işlemi sırasında bir hata oluştu');
      }
    },
    formatPhoneNumber(event) {
      // Telefon numarası formatını düzenleme işlemi
      let value = event.target.value;
      
      // Sadece rakamları al
      const numbers = value.replace(/\D/g, '');
      
      // Formatı uygula
      if (numbers.length <= 3) {
        this.phone = numbers.length ? `(${numbers}` : '';
      } else if (numbers.length <= 6) {
        this.phone = `(${numbers.substring(0, 3)}) ${numbers.substring(3)}`;
      } else if (numbers.length <= 8) {
        this.phone = `(${numbers.substring(0, 3)}) ${numbers.substring(3, 6)} ${numbers.substring(6)}`;
      } else {
        this.phone = `(${numbers.substring(0, 3)}) ${numbers.substring(3, 6)} ${numbers.substring(6, 8)} ${numbers.substring(8, 10)}`;
      }
    },
    validateBirthday() {
      const selectedDate = new Date(this.birthday);
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      
      if (age < 18) {
        this.birthdayError = '18 yaşından küçükler kayıt olamaz';
      } else {
        this.birthdayError = '';
      }
    }
  }
};
</script>

<style scoped>
.register_form_container {
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

.terms-text {
  font-size: 14px;
}

.terms-text a {
  color: #f79837;
  text-decoration: none;
}

.terms-text a:hover {
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