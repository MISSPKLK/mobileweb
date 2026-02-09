<template>
  <ion-page>
    <ion-content class="ion-padding login-background">
      <ion-grid class="ion-height-100">
        <ion-row class="ion-justify-content-center ion-align-items-center ion-height-100">
          <ion-col size="12" size-md="8" size-lg="6" size-xl="4">
            
            <div class="ion-text-center ion-margin-bottom">
              <ion-icon :icon="personCircleOutline" style="font-size: 80px; color: var(--ion-color-primary);"></ion-icon>
              <h1 class="login-title">Welcome Back</h1>
              <p class="login-subtitle">Sign in to continue</p>
            </div>

            <ion-card class="login-card">
              <ion-card-content>
                
                <ion-input
                  class="ion-margin-bottom"
                  label="Email"
                  label-placement="floating"
                  fill="outline"
                  shape="round"
                  type="email"
                  v-model="email"
                  placeholder="name@example.com"
                ></ion-input>

                <ion-input
                  class="ion-margin-bottom"
                  label="Password"
                  label-placement="floating"
                  fill="outline"
                  shape="round"
                  type="password"
                  v-model="password"
                ></ion-input>

                <ion-button expand="block" shape="round" class="ion-margin-top" @click="handleLoginEmail">
                  Sign In
                </ion-button>

                <div class="divider">
                  <span>OR CONTINUE WITH</span>
                </div>

                <ion-button expand="block" shape="round" color="light" class="social-btn ion-margin-bottom" @click="handleLoginGoogle">
                  <ion-icon slot="start" :icon="logoGoogle" color="danger"></ion-icon>
                  Google
                </ion-button>

                <ion-item lines="none" class="phone-input-item ion-margin-bottom">
                   <ion-input
                    label="Phone Number"
                    label-placement="floating"
                    fill="outline"
                    shape="round"
                    type="tel"
                    v-model="phoneNumber"
                    placeholder="+66..."
                  ></ion-input>
                </ion-item>
                
                <ion-button expand="block" shape="round" color="success" class="social-btn" @click="handleLoginPhone">
                  <ion-icon slot="start" :icon="call"></ion-icon>
                  Phone OTP
                </ion-button>

                <div id="recaptcha-container"></div>

              </ion-card-content>
            </ion-card>

          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, 
  IonInput, IonButton, IonIcon, IonItem 
} from '@ionic/vue';
import { logoGoogle, call, personCircleOutline } from 'ionicons/icons';
import { authService } from '../auth/auth-service';

const router = useRouter();
const email = ref('');
const password = ref('');
const phoneNumber = ref('');

// Logic เดิมเป๊ะๆ
const handleLoginEmail = async () => {
  try {
    await authService.loginWithEmailPassword({ email: email.value, password: password.value });
    router.replace('/tabs/tab1');
  } catch (error: any) {
    alert('Login Failed: ' + error.message);
  }
};

const handleLoginGoogle = async () => {
  try {
    await authService.loginWithGoogle();
    router.replace('/tabs/tab1');
  } catch (error: any) {
    alert('Google Login Failed: ' + error.message);
  }
};

const handleLoginPhone = async () => {
  try {
    const { verificationId } = await authService.startPhoneLogin({ phoneNumberE164: phoneNumber.value });
    const code = prompt('Enter OTP Code sent to your phone:');
    if (code) {
      await authService.confirmPhoneCode({ verificationId, verificationCode: code });
      router.replace('/tabs/tab1');
    }
  } catch (error: any) {
    alert('Phone Login Failed: ' + error.message);
  }
};
</script>

<style scoped>
/* พื้นหลังแบบไล่เฉดสีอ่อนๆ */
.login-background {
  --background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.ion-height-100 {
  height: 100%;
}

.login-title {
  font-weight: 700;
  color: var(--ion-color-dark);
  margin-bottom: 5px;
}

.login-subtitle {
  color: var(--ion-color-medium);
  margin-top: 0;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* เงาฟุ้งๆ */
}

/* เส้นแบ่งสวยๆ */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 10px;
  color: #888;
  font-size: 0.8rem;
  font-weight: 500;
}

/* ปรับปุ่ม Google ให้ดูดี */
.social-btn {
  --box-shadow: none;
  font-weight: 600;
}
</style>