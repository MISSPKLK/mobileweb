import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import LoginPage from '../views/LoginPage.vue'; // 1. เพิ่มบรรทัดนี้
import { authService } from '../auth/auth-service'; // 2. เพิ่มบรรทัดนี้

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/login', // 3. เพิ่ม Route สำหรับหน้า Login
    component: LoginPage,
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('../views/Tab1Page.vue'),
        meta: { requiresAuth: true } // 4. แปะป้ายว่าหน้านี้ต้องล็อกอิน
      },
      {
        path: 'tab2',
        component: () => import('../views/Tab2Page.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tab3',
        component: () => import('../views/Tab3Page.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 5. เพิ่ม Logic ตรวจคนเข้าเมือง (ตามใบงานหน้า 11)
router.beforeEach(async (to, from, next) => {
  const user = await authService.getCurrentUser();

  // ถ้าล็อกอินอยู่แล้ว แต่อยากเข้าหน้า Login -> ถีบไป Tab1
  if (to.path === "/login" && user) {
    next("/tabs/tab1");
    return;
  }

  // ถ้าจะเข้าหน้าที่ต้องล็อกอิน (requiresAuth) แต่ไม่มี User -> ถีบไป Login
  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    next("/login");
    return;
  }

  next();
});

export default router