import React, { useState, useRef } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButton, IonSpinner, IonCard, IonCardContent, 
  IonIcon, IonButtons
} from '@ionic/react';
import { 
  imageOutline, colorWand, scanOutline, 
  cloudUploadOutline, sparkles 
} from 'ionicons/icons';
import { PhotoService } from '../core/photo.service'; 
import { GeminiVisionService } from '../core/gemini.service';
import { Base64Image, ImageAnalysisResult } from '../core/ai.interface';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [img, setImg] = useState<Base64Image | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!img) return;
    setLoading(true);
    try {
      const res = await GeminiVisionService.analyze(img);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImg(null);
    setPreviewUrl('');
    setResult(null);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="custom-toolbar">
          <IonTitle className="app-title">
            Gemini Vision <span className="highlight">AI</span>
          </IonTitle>
          {img && (
            <IonButtons slot="end">
            
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="modern-bg">
        <div className="content-container">

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const b64 = await PhotoService.fromFile(file);
                setImg(b64);
                setPreviewUrl(URL.createObjectURL(file));
                setResult(null);
              }
            }}
          />

          {/* ── Image Preview Area ── */}
          <div className={`preview-card ${img ? 'active' : ''}`}>
            {previewUrl ? (
              <div className="image-wrapper">
                <img src={previewUrl} alt="Preview" className="uploaded-image" />
                {!result && !loading && (
                  <div className="overlay-actions">
                    <IonButton
                      fill="clear"
                      className="btn-overlay-change"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      เปลี่ยนรูป
                    </IonButton>
                  </div>
                )}
              </div>
            ) : (
              <div className="placeholder-state">
                <div className="icon-circle">
                  <IonIcon icon={cloudUploadOutline} />
                </div>
                <h3>อัปโหลดรูปภาพ</h3>
                <p>ถ่ายภาพหรือเลือกจากเครื่องเพื่อวิเคราะห์</p>

                <div className="button-group-center">
                  <IonButton
                    className="btn-outline-ocean"
                    fill="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <IonIcon slot="start" icon={imageOutline} />
                    เลือกไฟล์
                  </IonButton>
                  <IonButton
                    className="btn-outline-ocean"
                    fill="outline"
                    onClick={async () => {
                      try {
                        const b64 = await PhotoService.fromCamera();
                        setImg(b64);
                        setPreviewUrl(`data:${b64.mimeType};base64,${b64.base64}`);
                        setResult(null);
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                  >
                    <IonIcon slot="start" icon={scanOutline} />
                    ถ่ายภาพ
                  </IonButton>
                </div>
              </div>
            )}
          </div>

          {/* ── Analyze Button ── */}
          {img && !result && (
            <div className="fade-up">
              <IonButton
                expand="block"
                className="btn-analyze"
                disabled={loading}
                onClick={handleAnalyze}
              >
                {loading ? (
                  <>กำลังวิเคราะห์...<IonSpinner name="dots" /></>
                ) : (
                  <>
                    <IonIcon slot="start" icon={colorWand} />
                    วิเคราะห์ภาพ
                  </>
                )}
              </IonButton>
            </div>
          )}

          {/* ── Result Card ── */}
          {result && (
            <div className="result-section fade-up">
              <IonCard className="luxury-card">
                <IonCardContent>
                  <div className="result-header">
                    <IonIcon icon={sparkles} className="magic-icon" />
                    <h2>ผลลัพธ์การวิเคราะห์</h2>
                  </div>

                  <div className="info-group">
                    <label>คำบรรยาย</label>
                    <p className="caption-text">"{result.caption}"</p>
                  </div>

                  <div className="info-group">
                    <label>Tags</label>
                    <div className="tags-cloud">
                      {result.tags.map((tag, i) => (
                        <span key={i} className="luxury-tag">#{tag}</span>
                      ))}
                    </div>
                  </div>

                  {result.objects && result.objects.length > 0 && (
                    <div className="info-group">
                      <label>วัตถุที่พบ</label>
                      <div className="objects-grid">
                        {result.objects.map((obj, i) => (
                          <div key={i} className="object-item">
                            <span className="obj-name">{obj.name}</span>
                            {obj.confidence && (
                              <span className="obj-score">
                                {(obj.confidence * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </IonCardContent>
              </IonCard>

              <IonButton
                fill="clear"
                expand="block"
                className="btn-try-another"
                onClick={reset}
              >
                ลองรูปอื่น
              </IonButton>
            </div>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;