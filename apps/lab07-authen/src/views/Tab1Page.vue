<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1 - Profile</ion-title>
        <ion-buttons slot="end">
           <ion-button color="danger" @click="handleLogout">
            Logout
            <ion-icon slot="end" :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      
      <div v-if="user" class="ion-text-center">
        <ion-avatar style="margin: 0 auto; width: 100px; height: 100px;">
          <img :src="user.photoUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'" />
        </ion-avatar>

        <h2 class="ion-margin-top">{{ user.displayName || 'No Name' }}</h2>
        <p class="ion-text-muted">{{ user.email }}</p>
        
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>User ID (UID)</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            {{ user.uid }}
          </ion-card-content>
        </ion-card>

        <ion-card v-if="user.phoneNumber">
          <ion-card-header>
            <ion-card-subtitle>Phone Number</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            {{ user.phoneNumber }}
          </ion-card-content>
        </ion-card>

      </div>

      <div v-else class="ion-text-center ion-margin-top">
        <ion-spinner></ion-spinner>
        <p>Loading user data...</p>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonIcon, IonAvatar, IonCard, IonCardHeader, 
  IonCardSubtitle, IonCardContent, IonButtons, IonSpinner 
} from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import { authService } from '../auth/auth-service'; // เรียกใช้ Service
import { AuthUser } from '../auth/auth-interface'; // เรียกใช้ Type

const router = useRouter();
const user = ref<AuthUser | null>(null);

// ดึงข้อมูล User เมื่อหน้าโหลดเสร็จ
onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

// ฟังก์ชัน Logout
const handleLogout = async () => {
  await authService.logout();
  router.replace('/login'); // เด้งกลับไปหน้า Login
};
</script>