import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton,
  IonItem, IonList, useIonRouter, IonAlert, IonIcon
} from '@ionic/react';
import { trash } from 'ionicons/icons'; // เพิ่ม icon ถังขยะ
import { useParams } from 'react-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // เพิ่ม deleteDoc
import { db } from '../firebase';

const EditExpense: React.FC = () => {
  const router = useIonRouter();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  
  // State สำหรับควบคุมการเปิด/ปิด Alert ยืนยันการลบ
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      const docRef = doc(db, "expenses", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setAmount(data.amount);
        setType(data.type);
        setCategory(data.category);
        setNote(data.note);
      } else {
        alert("ไม่พบข้อมูล!");
        router.goBack();
      }
    };
    fetchExpense();
  }, [id]);

  const updateExpense = async () => {
    try {
      const docRef = doc(db, "expenses", id);
      await updateDoc(docRef, {
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        note: note
      });
      console.log("Updated successfully!");
      router.goBack();
    } catch (e) {
      console.error("Error updating: ", e);
    }
  };

  // ฟังก์ชันลบข้อมูล
  const deleteExpense = async () => {
    try {
      const docRef = doc(db, "expenses", id);
      await deleteDoc(docRef); // คำสั่งลบจาก Firestore
      
      console.log("Deleted successfully!");
      router.goBack(); // ลบเสร็จกลับไปหน้าแรก
    } catch (e) {
      console.error("Error deleting: ", e);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>แก้ไขรายการ</IonTitle>
          
          {/* เพิ่มปุ่มลบที่มุมขวาบน (Option 1) */}
          <IonButtons slot="end">
            <IonButton color="danger" onClick={() => setShowDeleteAlert(true)}>
              <IonIcon slot="icon-only" icon={trash} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput label="ชื่อรายการ" labelPlacement="floating" value={title} onIonInput={e => setTitle(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonInput label="จำนวนเงิน" labelPlacement="floating" type="number" value={amount} onIonInput={e => setAmount(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonSelect label="ประเภท" labelPlacement="floating" value={type} onIonChange={e => setType(e.detail.value)}>
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonInput label="หมวดหมู่" labelPlacement="floating" value={category} onIonInput={e => setCategory(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonTextarea label="หมายเหตุ" labelPlacement="floating" value={note} onIonInput={e => setNote(e.detail.value!)} />
          </IonItem>
        </IonList>

        <IonButton expand="block" className="ion-margin-top" onClick={updateExpense}>
          อัปเดตข้อมูล
        </IonButton>

        {/* ปุ่มลบด้านล่าง (Option 2) - เลือกใช้ตำแหน่งใดตำแหน่งหนึ่งหรือทั้งคู่ก็ได้ */}
        <IonButton expand="block" color="danger" className="ion-margin-top" onClick={() => setShowDeleteAlert(true)}>
          ลบข้อมูล
        </IonButton>

        {/* ส่วน Alert ยืนยันการลบ */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="ยืนยันการลบ"
          message="คุณต้องการลบรายการนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้"
          buttons={[
            {
              text: 'ยกเลิก',
              role: 'cancel',
              handler: () => {
                console.log('Cancel delete');
              },
            },
            {
              text: 'ลบข้อมูล',
              role: 'confirm',
              handler: () => {
                deleteExpense(); // เรียกฟังก์ชันลบเมื่อกดยืนยัน
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditExpense;