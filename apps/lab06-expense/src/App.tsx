import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { list, add, settings } from 'ionicons/icons'; // 1. เพิ่ม import icon 'add'

// Import หน้าต่างๆ
import Tab1 from './pages/Tab1';
import AddExpense from './pages/AddExpense'; // 2. Import หน้า AddExpense
import Tab3 from './pages/Tab3';
import EditExpense from './pages/EditExpense';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* ... (CSS imports อื่นๆ ปล่อยไว้เหมือนเดิม) ... */
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* ... (Theme imports อื่นๆ ปล่อยไว้เหมือนเดิม) ... */

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/edit/:id">
            <EditExpense />
          </Route>
          
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          
          {/* 3. เปลี่ยน Route ของ Tab 2 ให้ไปเรียก AddExpense */}
          <Route exact path="/tab2">
            <AddExpense />
          </Route>
          
          <Route path="/tab3">
            <Tab3 />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={list} /> {/* เปลี่ยน icon เป็น list ก็ได้ถ้าชอบ */}
            <IonLabel>รายการ</IonLabel>
          </IonTabButton>

          {/* 4. เปลี่ยนปุ่ม Tab 2 ให้สื่อความหมาย */}
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={add} />
            <IonLabel>เพิ่มข้อมูล</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon aria-hidden="true" icon={settings} /> {/* เปลี่ยน icon เป็น settings ก็ได้ */}
            <IonLabel>อื่นๆ</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;