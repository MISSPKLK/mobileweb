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
import { list, add, settings } from 'ionicons/icons';

// Import หน้าต่างๆ
import Tab1 from './pages/Tab1';
import AddExpense from './pages/AddExpense';
import Tab3 from './pages/Tab3';
import EditExpense from './pages/EditExpense';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          
          <Route exact path="/tab2">
            <AddExpense />
          </Route>
          
          <Route exact path="/tab3">
            <Tab3 />
          </Route>

          <Route path="/edit/:id">
            <EditExpense />
          </Route>
          
          {/* ย้าย Redirect ไว้ท้ายสุด */}
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={list} />
            <IonLabel>รายการ</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={add} />
            <IonLabel>เพิ่มข้อมูล</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon aria-hidden="true" icon={settings} />
            <IonLabel>อื่นๆ</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;