import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonNote, IonGrid, IonRow, IonCol, IonCard, IonCardContent
} from '@ionic/react';
import { collection, onSnapshot, query, orderBy, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';

// สร้าง Interface สำหรับกำหนด Type ของข้อมูล (Optional แต่แนะนำสำหรับ TypeScript)
interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  note: string;
  createdAt: any;
}

const Tab1: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // useEffect จะทำงานเมื่อหน้าจอโหลดขึ้นมา
  useEffect(() => {
    // 1. สร้าง Query เพื่อดึงข้อมูลจาก collection "expenses" และเรียงตามเวลาที่สร้าง
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

    // 2. ใช้ onSnapshot เพื่อดึงข้อมูลแบบ Realtime (ข้อมูลเปลี่ยน หน้าจอเปลี่ยนตามทันที)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedExpenses: Expense[] = [];
      let tempIncome = 0;
      let tempExpense = 0;

      snapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        
        // คำนวณยอดรวมทันทีที่วนลูป
        if (data.type === 'income') {
          tempIncome += Number(data.amount);
        } else {
          tempExpense += Number(data.amount);
        }

        loadedExpenses.push({
          id: doc.id, // เก็บ ID ของเอกสารไว้ด้วย (จำเป็นสำหรับขั้นตอนแก้ไข/ลบ)
          title: data.title,
          amount: data.amount,
          type: data.type,
          category: data.category,
          note: data.note,
          createdAt: data.createdAt
        });
      });

      // อัปเดต State เพื่อให้หน้าจอแสดงผล
      setExpenses(loadedExpenses);
      setTotalIncome(tempIncome);
      setTotalExpense(tempExpense);
    });

    // คืนค่าฟังก์ชัน unsubscribe เพื่อหยุดการดึงข้อมูลเมื่อเปลี่ยนหน้า (ป้องกัน Memory Leak)
    return () => unsubscribe();
  }, []);

  // ฟังก์ชันจัดรูปแบบเงิน (ให้มีลูกน้ำคั่น)
  const formatMoney = (amount: number) => {
    return amount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>รายการรายรับ-รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {/* ส่วนแสดงยอดรวม */}
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonLabel color="success">
                    <h3>รายรับรวม</h3>
                    <h1>{formatMoney(totalIncome)}</h1>
                  </IonLabel>
                </IonCol>
                <IonCol className="ion-text-center" style={{ borderLeft: '1px solid #ddd' }}>
                  <IonLabel color="danger">
                    <h3>รายจ่ายรวม</h3>
                    <h1>{formatMoney(totalExpense)}</h1>
                  </IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="ion-text-center">
                   <IonLabel>
                    <h3>คงเหลือ</h3>
                    <h1 style={{ color: (totalIncome - totalExpense) >= 0 ? 'green' : 'red' }}>
                      {formatMoney(totalIncome - totalExpense)}
                    </h1>
                   </IonLabel>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* รายการข้อมูล (List) */}
        <IonList>
          {expenses.map((expense) => (
            <IonItem key={expense.id} button detail routerLink={`/edit/${expense.id}`}> {/* ใส่ button detail รอไว้สำหรับคลิกไปหน้าแก้ไข */}
              <IonLabel>
                <h2>{expense.title}</h2>
                <p>{expense.category} {expense.note && `- ${expense.note}`}</p>
                {/* แปลง timestamp เป็นวันที่อ่านง่าย */}
                {expense.createdAt?.seconds && (
                  <p style={{ fontSize: '0.8em', color: '#888' }}>
                    {new Date(expense.createdAt.seconds * 1000).toLocaleDateString('th-TH')}
                  </p>
                )}
              </IonLabel>
              
              <IonNote slot="end" color={expense.type === 'income' ? 'success' : 'danger'}>
                {expense.type === 'income' ? '+' : '-'} {expense.amount.toLocaleString()}
              </IonNote>
            </IonItem>
          ))}
        </IonList>
        
        {/* กรณีไม่มีข้อมูล */}
        {expenses.length === 0 && (
            <div className="ion-text-center ion-padding" style={{ color: '#888', marginTop: '20px' }}>
                <p>ยังไม่มีรายการบันทึก</p>
            </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Tab1;