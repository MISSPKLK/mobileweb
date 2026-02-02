// src/pages/AddExpense.tsx
import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton,
  IonItem, useIonRouter, IonList
} from '@ionic/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // ตรวจสอบ path ว่าไฟล์ firebase.ts อยู่ที่ src/firebase.ts

const AddExpense: React.FC = () => {
  const router = useIonRouter();

  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<number | string>('');
  const [type, setType] = useState<string>('expense');
  const [category, setCategory] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const saveExpense = async () => {
    alert("Button Clicked!"); 
    // ตรวจสอบค่าว่างเบื้องต้น
    if (!title || !amount) {
      alert("กรุณากรอกชื่อรายการและจำนวนเงิน");
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        note: note,
        createdAt: new Date()
      });
      console.log("Saved successfully!");
      
      // เคลียร์ค่า
      setTitle('');
      setAmount('');
      setNote('');
      
      // กลับไปหน้าแรก (Tab 1 - ซึ่งเดี๋ยวเราจะทำเป็นหน้ารายการ)
      router.push('/tab1', 'back');
      
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("เกิดข้อผิดพลาดในการบันทึก: " + e);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>เพิ่มรายการ</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput
              label="ชื่อรายการ"
              labelPlacement="floating"
              placeholder="เช่น ค่าข้าว, ค่ารถ"
              value={title}
              onIonInput={(e) => setTitle(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="จำนวนเงิน"
              labelPlacement="floating"
              type="number"
              value={amount}
              onIonInput={(e) => setAmount(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonSelect
              label="ประเภท"
              labelPlacement="floating"
              value={type}
              onIonChange={(e) => setType(e.detail.value)}
            >
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput
              label="หมวดหมู่"
              labelPlacement="floating"
              placeholder="เช่น อาหาร, เดินทาง"
              value={category}
              onIonInput={(e) => setCategory(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="หมายเหตุ"
              labelPlacement="floating"
              value={note}
              onIonInput={(e) => setNote(e.detail.value!)}
            />
          </IonItem>
        </IonList>

        <IonButton expand="block" className="ion-margin-top" onClick={saveExpense}>
          บันทึกข้อมูล
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddExpense;