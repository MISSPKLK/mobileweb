import React, { useEffect, useMemo, useState } from "react";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonFooter, IonCard, IonCardContent, IonText 
} from "@ionic/react";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { HapticsService } from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

export const HomePage: React.FC = () => {
  const [state, setState] = useState<WorkoutState | null>(null);

  // เตรียม Services
  const motion = useMemo(() => new MotionService(), []);
  const tts = useMemo(() => new TtsService(), []);
  const haptic = useMemo(() => new HapticsService(), []);
  
  // โยน TTS กับ Haptics เข้า Engine
  const engine = useMemo(() => new ArmWorkoutEngine(tts, haptic), [tts, haptic]);

useEffect(() => {
  // รับฟังก์ชัน unsubscribe มา แล้วเซ็ตค่า state
  const unsubscribe = engine.onChange((newState) => {
    setState(newState);
  });
  
  // คืนค่าฟังก์ชันคลีนอัปแบบ void (ไม่ return boolean)
  return () => {
    unsubscribe();
  };
}, [engine]);

  const start = async () => {
    await tts.speak("เริ่มกายบริหารแขน ยกขึ้นจนสุดแล้วลดลง");
    engine.start();
    await motion.start((s) => engine.process(s));
  };

  const stop = async () => {
    await motion.stop();
    engine.stop();
  };

  // คำนวณเปอร์เซ็นต์ความถูกต้อง
  const percentOk = state?.stats.repsTotal 
    ? Math.round((state.stats.repsOk / state.stats.repsTotal) * 100) 
    : 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Lab09 Arm Exercise</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <IonText color={state?.status === "RUNNING" ? "success" : "medium"}>
            <h2>{state?.status === "RUNNING" ? "กำลังจับการเคลื่อนไหว..." : "พร้อมใช้งาน"}</h2>
          </IonText>
          <h1 style={{ fontSize: "5rem", margin: "10px 0" }}>{state?.repDisplay ?? 0}</h1>
          <IonText color={state?.stats.lastMessage === "OK" ? "success" : "danger"}>
            <h3>{state?.stats.lastMessage ?? "รอเริ่ม..."}</h3>
          </IonText>
        </div>

        <IonCard>
          <IonCardContent>
            <h3>📊 สถิติการกายบริหาร</h3>
            <p>คะแนน: <strong>{state?.stats.score ?? 0}</strong></p>
            <p>รอบทั้งหมด: {state?.stats.repsTotal ?? 0}</p>
            <p>รอบที่ถูก: {state?.stats.repsOk ?? 0} (ความแม่นยำ {percentOk}%)</p>
            <p>รอบที่ผิด: {state?.stats.repsBad ?? 0}</p>
            <p>ความเร็วเฉลี่ย (Tempo): {state?.stats.avgRepMs ?? 0} ms</p>
          </IonCardContent>
        </IonCard>

        <div style={{ marginTop: "30px" }}>
          <IonButton expand="block" size="large" onClick={start} disabled={state?.status === "RUNNING"}>
            Start
          </IonButton>
          <IonButton expand="block" size="large" color="danger" onClick={stop} disabled={state?.status !== "RUNNING"} style={{ marginTop: "15px" }}>
            Stop
          </IonButton>
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar style={{ textAlign: "center" }}>
          <IonText color="medium">
            <small>673380502-0 นางสาวภัทธิญาภรณ์ แก่นจันทร์</small> 
          </IonText>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};