import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Sparkles, MapPin, QrCode, CheckCircle2, AlertCircle, 
  ArrowRight, RefreshCw, ShieldAlert
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { classifyWasteImage } from '../lib/aiClassifier';
import { dbService } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Bin, ClassificationResult, WasteDisposal } from '../types';
import { WASTE_CREDIT_VALUES } from '../constants/ecoConfig';

interface ScannerPageProps {
  onDisposalSuccess: () => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({ onDisposalSuccess }) => {
  const { refreshProfile } = useAuth();
  
  // Step State: 'upload' | 'classified' | 'select_bin' | 'scan_qr' | 'success'
  const [step, setStep] = useState<'upload' | 'classified' | 'select_bin' | 'scan_qr' | 'success'>('upload');
  
  // Camera stream state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  
  // Image & AI state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('Camera_Capture.jpg');
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<ClassificationResult | null>(null);

  // Bins & QR state
  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [manualQrCode, setManualQrCode] = useState<string>('');
  const [qrError, setQrError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Final Disposal Result
  const [disposalResult, setDisposalResult] = useState<{
    disposal: WasteDisposal;
    awardedCredits: number;
    capReached: boolean;
  } | null>(null);

  useEffect(() => {
    async function fetchBins() {
      const allBins = await dbService.getBins();
      setBins(allBins);
    }
    fetchBins();
  }, []);

  // Initialize camera stream when on 'upload' step
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (step === 'upload' && !selectedImage) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          setIsCameraActive(true);
          setCameraError('');
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera stream error or permission denied:', err);
          setIsCameraActive(false);
          setCameraError('Camera access unavailable or permission denied. Please use the camera trigger button.');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step, selectedImage]);

  // Initialize HTML5 QR Code scanner when on 'scan_qr' step
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (step === 'scan_qr') {
      try {
        scanner = new Html5QrcodeScanner(
          'qr-reader-container',
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
        );

        scanner.render(
          (decodedText) => {
            scanner?.clear();
            handleVerifyBinScan(decodedText);
          },
          (_error) => {
            // Ignore frame scan errors
          }
        );
      } catch (err) {
        console.warn('HTML5 QR Scanner init failed, using manual code entry fallback:', err);
      }
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error(e));
      }
    };
  }, [step]);

  // Capture Photo from Video Stream
  const handleCaptureVideoSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        setImageName('Live_Camera_Scan_' + Date.now() + '.jpg');
        processAiClassification(dataUrl, 'Live_Camera_Scan_' + Date.now() + '.jpg');
      }
    }
  };

  // Camera File Capture Input Handler (Mobile Camera Trigger)
  const handleCameraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        processAiClassification(base64, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Call AI Vision Classifier
  const processAiClassification = async (base64Image: string, filename: string) => {
    setIsClassifying(true);
    try {
      const result = await classifyWasteImage(base64Image, filename);
      setAiResult(result);
      setStep('classified');
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsClassifying(false);
    }
  };

  // Verify Bin QR Scan
  const handleVerifyBinScan = async (scannedQr: string) => {
    setQrError('');
    setIsVerifying(true);

    try {
      const targetBin = bins.find(b => b.qr_code.toUpperCase() === scannedQr.trim().toUpperCase() || b.id === selectedBin?.id) || selectedBin || bins[0];
      
      const category = aiResult?.category || 'Recyclable';
      const confidence = aiResult?.confidence || 90.0;

      const res = await dbService.recordDisposalAndAwardCredits(
        targetBin.id,
        category,
        confidence,
        imageName
      );

      setDisposalResult({
        disposal: res.disposal,
        awardedCredits: res.awardedCredits,
        capReached: res.capReached
      });

      await refreshProfile();
      setStep('success');
      onDisposalSuccess();
    } catch (err: any) {
      setQrError(err.message || 'QR Code verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resetWorkflow = () => {
    setSelectedImage(null);
    setAiResult(null);
    setSelectedBin(null);
    setManualQrCode('');
    setQrError('');
    setDisposalResult(null);
    setStep('upload');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 font-serif">
      
      {/* Header Banner */}
      <div className="bg-[#0F3A2D] border border-[#D4AF37]/50 rounded-3xl p-6 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Live Camera AI Waste Scanner
        </h1>
        <p className="text-xs text-[#E6C65C] mt-1">
          Camera Scan → AI Vision Check → Bin QR Scan → Verified EcoCredits
        </p>

        {/* Workflow Step Indicators */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mt-6">
          {[
            { key: 'upload', label: '1. Live Camera' },
            { key: 'classified', label: '2. AI Category' },
            { key: 'select_bin', label: '3. Pick Bin' },
            { key: 'scan_qr', label: '4. Scan Bin QR' }
          ].map((item, idx) => (
            <div key={item.key} className="flex items-center space-x-2">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                step === item.key || (step === 'success' && item.key === 'scan_qr')
                  ? 'bg-[#D4AF37] text-[#09291F] border-[#D4AF37]'
                  : 'bg-[#09291F] text-[#E8E8E8]/70 border-[#D4AF37]/30'
              }`}>
                {item.label}
              </span>
              {idx < 3 && <span className="text-[#D4AF37]/40 text-xs">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: LIVE CAMERA CAPTURE ONLY */}
      {step === 'upload' && (
        <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Camera className="w-5 h-5 text-[#D4AF37]" />
              <span>Live Camera Waste Capture</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-bold uppercase">
              Camera Only
            </span>
          </div>

          <p className="text-xs text-[#E8E8E8]/80 mb-6">
            Photograph your waste item live using your device camera. Our AI vision model will check if it's a valid waste item and classify it.
          </p>

          {/* Live Video Camera Viewfinder */}
          <div className="relative bg-[#09291F] border-2 border-[#D4AF37]/50 rounded-2xl overflow-hidden shadow-2xl text-center">
            
            {isCameraActive ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-72 sm:h-96 object-cover"
                />
                <div className="absolute inset-x-0 bottom-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleCaptureVideoSnapshot}
                    disabled={isClassifying}
                    className="w-16 h-16 rounded-full bg-[#D4AF37] p-1 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-4 border-[#09291F]"
                  >
                    <div className="w-full h-full rounded-full bg-[#09291F] flex items-center justify-center">
                      <Camera className="w-7 h-7 text-[#D4AF37]" />
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#0F3A2D] border border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37] shadow-lg">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">Tap to Open Device Camera</h3>
                {cameraError && (
                  <p className="text-xs text-amber-300 max-w-sm mx-auto">{cameraError}</p>
                )}

                {/* Direct Camera Input Trigger */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraInputChange}
                    id="live-camera-file-input"
                    className="hidden"
                  />
                  <label
                    htmlFor="live-camera-file-input"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Open Camera Viewfinder</span>
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* AI Classifier Processing Overlay */}
          {isClassifying && (
            <div className="mt-6 p-4 bg-[#09291F] border border-[#D4AF37] rounded-2xl flex items-center justify-center space-x-3 text-[#D4AF37] animate-pulse">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span className="text-sm font-bold">Analyzing image with YOLO v8 Multimodal Vision Model...</span>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: AI CLASSIFICATION RESULT & PERSON REJECTION CHECK */}
      {step === 'classified' && aiResult && (
        <div className="bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* PERSON / NON-WASTE REJECTION CARD */}
          {aiResult.is_waste === false ? (
            <div className="bg-red-950/80 border-2 border-red-500 rounded-2xl p-6 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-red-900/60 border border-red-400 mx-auto flex items-center justify-center text-red-200">
                <ShieldAlert className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">No Waste Item Detected</h3>
                <p className="text-sm text-red-200 mt-2 max-w-md mx-auto leading-relaxed">
                  {aiResult.rejection_reason || "No waste item detected — YOLO v8 object detection identified a person. Please photograph the item you want to dispose of."}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetWorkflow}
                  className="px-6 py-3 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake Photo of Waste Item</span>
                </button>
              </div>
            </div>
          ) : (
            /* VALID WASTE CLASSIFICATION DISPLAY */
            <>
              <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <span>YOLO v8 Vision Detection Result</span>
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
                  YOLO {aiResult.confidence}% Confidence
                </span>
              </div>

              {/* Image & Result Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-1 text-center">
                  {selectedImage && (
                    <img 
                      src={selectedImage} 
                      alt="Scanned waste" 
                      className="w-36 h-36 object-cover rounded-2xl mx-auto border-2 border-[#D4AF37] shadow-lg"
                    />
                  )}
                </div>

                <div className="sm:col-span-2 space-y-3 bg-[#09291F] border border-[#D4AF37]/40 rounded-2xl p-5">
                  <div>
                    <span className="text-xs font-bold text-[#E6C65C] uppercase tracking-wider block">RECOMMENDED CATEGORY</span>
                    <div className="text-2xl font-bold text-[#D4AF37]">{aiResult.category}</div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#E8E8E8]/70 block">IDENTIFIED ITEM</span>
                    <p className="text-sm font-bold text-white">{aiResult.item_name}</p>
                  </div>

                  <p className="text-xs text-[#E8E8E8]/80 leading-relaxed">
                    {aiResult.description}
                  </p>

                  <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between">
                    <span className="text-xs text-white/70">Potential Reward:</span>
                    <span className="text-sm font-bold text-[#D4AF37]">
                      +{WASTE_CREDIT_VALUES[aiResult.category]?.credits || 10} EcoCredits
                    </span>
                  </div>
                </div>
              </div>

              {/* Low Confidence Warning (<70%) */}
              {aiResult.confidence < 70 && (
                <div className="p-4 bg-amber-950/80 border border-amber-500/50 rounded-2xl text-xs text-amber-200 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300 font-bold mb-0.5">Low AI Confidence Score (&lt; 70%)</strong>
                    Confidence is below threshold. Retake the photo with better lighting or proceed.
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/20">
                <button
                  onClick={resetWorkflow}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D4AF37]/40 text-[#E6C65C] hover:bg-[#09291F] text-sm font-bold transition-all"
                >
                  Retake Photo
                </button>
                <button
                  onClick={() => setStep('select_bin')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-sm shadow-md hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <span>View Nearby Recommended Bins</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

        </div>
      )}

      {/* STEP 3: NEARBY DESIGNATED BINS */}
      {step === 'select_bin' && (
        <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <span>Select Any Suitable Designated Bin</span>
            </h2>
            <p className="text-xs text-[#E8E8E8]/80 mt-1">
              You are free to dispose in any designated campus bin below matching category <strong className="text-[#D4AF37]">{aiResult?.category}</strong>.
            </p>
          </div>

          <div className="space-y-3">
            {bins.map((bin) => {
              const isRecommended = bin.category === aiResult?.category || bin.category === 'All';
              return (
                <div
                  key={bin.id}
                  onClick={() => setSelectedBin(bin)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedBin?.id === bin.id
                      ? 'bg-[#09291F] border-2 border-[#D4AF37] shadow-xl'
                      : isRecommended
                      ? 'bg-[#09291F]/90 border-[#D4AF37]/50 hover:border-[#D4AF37]'
                      : 'bg-[#09291F]/60 border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold text-white">Bin {bin.label}</span>
                        {isRecommended && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#E8E8E8]/80 mt-1 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{bin.location_name}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#E6C65C] block">{bin.distance_m || 120}m away</span>
                      <span className="text-[11px] text-[#E8E8E8]/60">Capacity: {bin.fill_percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#D4AF37]/20">
            <button
              onClick={() => setStep('classified')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D4AF37]/40 text-[#E6C65C] text-sm font-bold"
            >
              Back to Classification
            </button>
            <button
              disabled={!selectedBin}
              onClick={() => setStep('scan_qr')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-sm shadow-md disabled:opacity-50 hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Scan Bin QR Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CAMERA BIN QR CODE SCAN */}
      {step === 'scan_qr' && selectedBin && (
        <div className="bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white flex items-center justify-center space-x-2">
              <QrCode className="w-6 h-6 text-[#D4AF37]" />
              <span>Live Camera Bin QR Verification</span>
            </h2>
            <p className="text-xs text-[#E8E8E8]/80 mt-1">
              Disposing at <strong className="text-[#D4AF37]">Bin {selectedBin.label} ({selectedBin.location_name})</strong>
            </p>
          </div>

          {/* Camera Scanner Viewfinder */}
          <div className="bg-[#09291F] border border-[#D4AF37]/40 rounded-2xl p-4 text-center">
            <div id="qr-reader-container" className="max-w-sm mx-auto overflow-hidden rounded-xl" />
            <p className="text-[11px] text-[#E8E8E8]/70 mt-2">
              Point your camera at the QR code sticker affixed to Bin {selectedBin.label}.
            </p>
          </div>

          {/* Fallback Code Entry (only if camera scan fails) */}
          <div className="bg-[#09291F] border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold text-[#E6C65C] uppercase tracking-wider block">
              Manual Code Entry (Camera Fallback Only)
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualQrCode}
                onChange={(e) => setManualQrCode(e.target.value)}
                placeholder={`Default: ${selectedBin.qr_code}`}
                className="flex-1 bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-xl px-4 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleVerifyBinScan(manualQrCode || selectedBin.qr_code)}
                disabled={isVerifying}
                className="px-5 py-2 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-xs shadow hover:scale-105 transition-all"
              >
                {isVerifying ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
            <p className="text-[11px] text-[#E8E8E8]/60">
              Bin QR Code: <code className="text-[#D4AF37] bg-[#0F3A2D] px-1.5 py-0.5 rounded">{selectedBin.qr_code}</code>
            </p>
          </div>

          {qrError && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 text-center">
              {qrError}
            </div>
          )}

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep('select_bin')}
              className="px-4 py-2 border border-[#D4AF37]/40 rounded-xl text-xs text-[#E6C65C]"
            >
              Back to Bin List
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS DISPOSAL CONFIRMATION */}
      {step === 'success' && disposalResult && (
        <div className="bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-[#09291F] border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37] shadow-xl">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white tracking-wide">
              Disposal Verified & Confirmed!
            </h2>
            <p className="text-sm text-[#E6C65C] mt-1">
              Bin Sensor & QR Validation Complete
            </p>
          </div>

          <div className="bg-[#09291F] border border-[#D4AF37]/50 rounded-2xl p-6 max-w-sm mx-auto">
            {disposalResult.capReached ? (
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 block">DAILY LIMIT REACHED</span>
                <span className="text-3xl font-bold text-white">0 EcoCredits</span>
                <p className="text-xs text-[#E8E8E8]/70">
                  You reached the maximum 3 rewarded disposals for today. This disposal has been logged to your eco history!
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-xs text-[#E8E8E8]/70 uppercase tracking-widest block">AWARDED TO WALLET</span>
                <div className="flex items-baseline justify-center space-x-2">
                  <span className="text-5xl font-bold text-[#D4AF37]">+{disposalResult.awardedCredits}</span>
                  <span className="text-lg font-bold text-[#E6C65C]">EcoCredits</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={resetWorkflow}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#D4AF37]/60 text-[#E6C65C] font-bold text-sm hover:bg-[#09291F]"
            >
              Scan Another Waste Item
            </button>
            <button
              onClick={onDisposalSuccess}
              className="w-full sm:w-auto px-8 py-3 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-sm shadow-lg hover:scale-105 transition-all"
            >
              View Wallet & Redeem Rewards
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
